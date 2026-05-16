import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

import { normalizeOcrMarkers } from '../_shared/analysisPipeline.mjs';

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

  try {
    const rawText = String(job.metadata?.ocr_raw ?? payload.raw_text ?? '');
    const markers = normalizeOcrMarkers(rawText, { forceAiError: payload.force_ai_error }).map((marker) => ({
      ...marker,
      analysis_id: job.analysis_id,
      user_id: job.user_id,
    }));

    if (markers.length === 0) {
      throw new Error('No markers were recognized from OCR text');
    }

    await supabase.from('analysis_markers').delete().eq('analysis_id', job.analysis_id);
    const { data: savedMarkers, error: markerError } = await supabase.from('analysis_markers').insert(markers).select('*');
    if (markerError) {
      throw new Error(markerError.message);
    }

    const abnormalCount = markers.filter((marker) => marker.status !== 'normal').length;
    await supabase.from('analysis_jobs').update({
      status: 'completed',
      error_message: null,
      metadata: { ...job.metadata, ai_marker_count: markers.length },
    }).eq('id', job.id);
    await supabase.from('analyses').update({
      status: 'completed',
      abnormal_count: abnormalCount,
      summary: { marker_count: markers.length, abnormal_count: abnormalCount },
      health_score: Math.max(1, 100 - abnormalCount * 12),
    }).eq('id', job.analysis_id);

    return json({ job_id: job.id, analysis_id: job.analysis_id, status: 'completed', markers: savedMarkers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI normalization failed';
    await supabase.from('analysis_jobs').update({
      status: 'failed',
      error_message: message,
      metadata: { ...job.metadata, ai_error: message },
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
