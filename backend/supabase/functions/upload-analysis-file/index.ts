import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

import { ANALYSIS_BUCKET, storagePathForAnalysisFile, validateUploadRequest } from '../_shared/analysisPipeline.mjs';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: request.headers.get('Authorization') ?? '' } } },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return json({ error: 'Authentication required' }, 401);
  }

  const validation = validateUploadRequest(await request.json().catch(() => null));
  if (!validation.ok) {
    return json({ error: validation.error }, validation.status);
  }

  const analysisInsert = {
    user_id: userData.user.id,
    type: 'uploaded',
    type_label: 'Загруженный анализ',
    status: 'uploaded',
  };
  const { data: analysis, error: analysisError } = await supabase.from('analyses').insert(analysisInsert).select('*').single();
  if (analysisError) {
    return json({ error: analysisError.message }, 500);
  }

  const storagePath = storagePathForAnalysisFile({
    userId: userData.user.id,
    analysisId: analysis.id,
    fileName: validation.fileName,
  });

  const expiresIn = 900;
  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(ANALYSIS_BUCKET)
    .createSignedUploadUrl(storagePath);
  if (signedUploadError) {
    return json({ error: signedUploadError.message }, 500);
  }

  const { data: analysisFile, error: fileError } = await supabase.from('analysis_files').insert({
    user_id: userData.user.id,
    bucket_id: ANALYSIS_BUCKET,
    storage_path: storagePath,
    original_file_name: validation.fileName,
    mime_type: validation.mimeType,
    byte_size: validation.byteSize,
    signed_upload_url_created_at: new Date().toISOString(),
    signed_url_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
  }).select('*').single();
  if (fileError) {
    return json({ error: fileError.message }, 500);
  }

  await supabase.from('analyses').update({ analysis_file_id: analysisFile.id }).eq('id', analysis.id);
  const { data: job, error: jobError } = await supabase.from('analysis_jobs').insert({
    user_id: userData.user.id,
    analysis_file_id: analysisFile.id,
    analysis_id: analysis.id,
    status: 'uploaded',
    metadata: { original_file_name: validation.fileName, mime_type: validation.mimeType, byte_size: validation.byteSize },
  }).select('*').single();
  if (jobError) {
    return json({ error: jobError.message }, 500);
  }

  return json({
    analysis,
    analysis_file: analysisFile,
    job,
    upload: {
      bucket: ANALYSIS_BUCKET,
      path: storagePath,
      signed_url: signedUpload.signedUrl,
      token: signedUpload.token,
      expires_in: expiresIn,
    },
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
