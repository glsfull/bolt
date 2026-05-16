import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

import { deterministicOcr } from '../_shared/analysisPipeline.mjs';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': '*',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const payload = await request.json().catch(() => ({}));
  const jobId = payload.job_id ?? payload.jobId;

  const { data: job, error: jobError } = await supabase.from('analysis_jobs').select('*').eq('id', jobId).single();
  if (jobError || !job) {
    return json({ error: jobError?.message ?? 'Job not found' }, 404);
  }

  const attempts = Number(job.metadata?.ocr_attempts ?? 0) + 1;
  await supabase.from('analysis_jobs').update({
    status: 'ocr_processing',
    metadata: { ...job.metadata, ocr_attempts: attempts },
  }).eq('id', job.id);
  await supabase.from('analyses').update({ status: 'ocr_processing' }).eq('id', job.analysis_id);

  try {
    const ocr = deterministicOcr({ metadata: { ...job.metadata, forceOcrError: payload.force_ocr_error } });
    await supabase.from('analysis_jobs').update({
      status: 'ai_processing',
      error_message: null,
      metadata: { ...job.metadata, ocr_attempts: attempts, ocr_raw: ocr.rawText, ocr_confidence: ocr.confidence, ocr_provider: ocr.provider },
    }).eq('id', job.id);
    await supabase.from('analyses').update({ status: 'ai_processing', raw_text: ocr.rawText }).eq('id', job.analysis_id);
    return json({ job_id: job.id, analysis_id: job.analysis_id, status: 'ai_processing', ocr });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OCR failed';
    await supabase.from('analysis_jobs').update({
      status: 'failed',
      error_message: message,
      metadata: { ...job.metadata, ocr_attempts: attempts, ocr_error: message },
    }).eq('id', job.id);
    await supabase.from('analyses').update({ status: 'failed' }).eq('id', job.analysis_id);
    return json({ error: message }, 502);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
