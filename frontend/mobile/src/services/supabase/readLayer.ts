import * as demoData from '../../features/demoData';
import { isSupabaseConfigured } from '../../lib/env';

import { supabase } from './client';

type SupabaseRead<T> = PromiseLike<{ data: T | null; error: unknown }>;
type UploadableAnalysisFile = { fileName: string; mimeType: string; byteSize: number; blob?: Blob };

async function readOrFallback<T>(query: SupabaseRead<T> | null, fallback: T): Promise<T> {
  if (!isSupabaseConfigured || !query) {
    return fallback;
  }

  const { data, error } = await Promise.resolve(query);
  return error || !data ? fallback : data;
}

export async function getProfileSummary() {
  return readOrFallback(supabase?.from('user_profiles').select('*').limit(1).maybeSingle() ?? null, demoData.profileSummary);
}

export async function getAnalysisHistory() {
  return readOrFallback(supabase?.from('analyses').select('*').order('created_at', { ascending: false }).limit(10) ?? null, demoData.analysisHistory);
}

export async function getHealthPrograms() {
  return readOrFallback(supabase?.from('health_programs').select('*').order('created_at', { ascending: false }) ?? null, demoData.healthPrograms);
}

export async function getLatestWarnings() {
  return readOrFallback(supabase?.from('analysis_warnings').select('*').order('created_at', { ascending: false }).limit(5) ?? null, demoData.latestWarnings);
}

export async function getAnalysisProcessingJob(analysisId: string) {
  return readOrFallback(
    supabase?.from('analysis_jobs').select('*').eq('analysis_id', analysisId).order('created_at', { ascending: false }).limit(1).maybeSingle() ?? null,
    demoData.analysisProcessingJob,
  );
}

export async function getAnalysisResult(analysisId: string) {
  return readOrFallback(
    supabase?.from('analysis_markers').select('*').eq('analysis_id', analysisId).order('category') ?? null,
    demoData.analysisMarkers,
  );
}

export async function uploadAnalysisFile(file: { fileName: string; mimeType: string; byteSize: number }) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      analysis: { id: demoData.analysisProcessingJob.analysis_id },
      job: demoData.analysisProcessingJob,
      upload: { signed_url: '', path: '' },
    };
  }

  const { data, error } = await supabase.functions.invoke('upload-analysis-file', {
    body: file,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadBinaryToSignedUrl(signedUrl: string, file: UploadableAnalysisFile) {
  if (!isSupabaseConfigured || !signedUrl || !file.blob) {
    return;
  }

  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.mimeType },
    body: file.blob,
  });

  if (!response.ok) {
    throw new Error(`Signed upload failed with status ${response.status}`);
  }
}

export async function runOcrForJob(jobId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { job_id: jobId, analysis_id: demoData.analysisProcessingJob.analysis_id, status: 'ai_processing' };
  }

  const { data, error } = await supabase.functions.invoke('run-ocr', {
    body: { job_id: jobId },
  });

  if (error) {
    throw error;
  }

  return data;
}
