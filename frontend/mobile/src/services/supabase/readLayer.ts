import * as demoData from '../../features/demoData';
import { isSupabaseConfigured } from '../../lib/env';

import { supabase } from './client';

type SupabaseRead<T> = PromiseLike<{ data: T | null; error: unknown }>;

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

export async function getAnalysisResult(_analysisId: string) {
  return readOrFallback(supabase?.from('analysis_markers').select('*').order('category') ?? null, demoData.analysisMarkers);
}
