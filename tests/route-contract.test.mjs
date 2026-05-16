import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routesSource = readFileSync('frontend/mobile/src/navigation/routes.ts', 'utf8');
const themeSource = readFileSync('frontend/mobile/src/theme/index.ts', 'utf8');
const screenStatesSource = readFileSync('frontend/mobile/src/navigation/screenStates.ts', 'utf8');
const backendPlanSource = readFileSync('backend/supabase/migrations/001_production_schema_plan.sql', 'utf8');
const productionMigrationsSource = readFileSync('backend/supabase/migrations/202605160001_stage4_core_schema.sql', 'utf8');
const homeRouteSource = readFileSync('frontend/mobile/app/(tabs)/index.tsx', 'utf8');
const historyRouteSource = readFileSync('frontend/mobile/app/(tabs)/history.tsx', 'utf8');
const aiRouteSource = readFileSync('frontend/mobile/app/(tabs)/ai.tsx', 'utf8');
const programsRouteSource = readFileSync('frontend/mobile/app/(tabs)/programs.tsx', 'utf8');
const profileRouteSource = readFileSync('frontend/mobile/app/(tabs)/profile.tsx', 'utf8');
const demoDataSource = readFileSync('frontend/mobile/src/features/demoData.ts', 'utf8');
const supabaseReadSource = readFileSync('frontend/mobile/src/services/supabase/readLayer.ts', 'utf8');
const uploadRouteSource = readFileSync('frontend/mobile/app/analysis/upload.tsx', 'utf8');
const cameraRouteSource = readFileSync('frontend/mobile/app/analysis/camera.tsx', 'utf8');
const resultRouteSource = readFileSync('frontend/mobile/app/analysis/result/[id].tsx', 'utf8');
const resultScreenSource = readFileSync('frontend/mobile/src/features/analyses/AnalysisResultScreen.tsx', 'utf8');
const uploadScreenSource = readFileSync('frontend/mobile/src/features/analyses/UploadAnalysisScreen.tsx', 'utf8');
const uploadFunctionSource = readFileSync('backend/supabase/functions/upload-analysis-file/index.ts', 'utf8');
const runOcrFunctionSource = readFileSync('backend/supabase/functions/run-ocr/index.ts', 'utf8');
const interpretFunctionSource = readFileSync('backend/supabase/functions/interpret-analysis/index.ts', 'utf8');
const cameraScreenSource = readFileSync('frontend/mobile/src/features/analyses/CameraAnalysisScreen.tsx', 'utf8');
const risksRouteSource = readFileSync('frontend/mobile/app/risks/index.tsx', 'utf8');
const reportRouteSource = readFileSync('frontend/mobile/app/report/index.tsx', 'utf8');
const medicationsRouteSource = readFileSync('frontend/mobile/app/medications/index.tsx', 'utf8');
const encyclopediaRouteSource = readFileSync('frontend/mobile/app/encyclopedia/index.tsx', 'utf8');
const markerDetailRouteSource = readFileSync('frontend/mobile/app/encyclopedia/[markerId].tsx', 'utf8');
const authRouteSource = readFileSync('frontend/mobile/app/auth/index.tsx', 'utf8');
const adminRouteSource = readFileSync('frontend/mobile/app/admin/index.tsx', 'utf8');
const programDetailRouteSource = readFileSync('frontend/mobile/app/programs/[programId].tsx', 'utf8');
const activeProgramRouteSource = readFileSync('frontend/mobile/app/programs/active/index.tsx', 'utf8');
const risksScreenSource = readFileSync('frontend/mobile/src/features/risks/RisksScreen.tsx', 'utf8');
const reportScreenSource = readFileSync('frontend/mobile/src/features/report/DoctorReportScreen.tsx', 'utf8');
const medicationsScreenSource = readFileSync('frontend/mobile/src/features/medications/MedicationsScreen.tsx', 'utf8');
const encyclopediaScreenSource = readFileSync('frontend/mobile/src/features/encyclopedia/EncyclopediaScreen.tsx', 'utf8');
const authScreenSource = readFileSync('frontend/mobile/src/features/auth/AuthScreen.tsx', 'utf8');
const adminScreenSource = readFileSync('frontend/mobile/src/features/admin/AdminScreen.tsx', 'utf8');
const implementationPlanSource = readFileSync('docs/Реализация.md', 'utf8');

const requiredRouteIds = [
  'home',
  'auth',
  'upload',
  'camera',
  'results',
  'history',
  'symptoms',
  'meds',
  'risks',
  'report',
  'encyclopedia',
  'profile',
  'programs',
  'programDetail',
  'activeProgram',
  'admin',
];

for (const id of requiredRouteIds) {
  assert.match(routesSource, new RegExp(`id: '${id}'`), `missing route id ${id}`);
}

for (const path of [
  '/app',
  '/auth',
  '/app/analysis/upload',
  '/app/analysis/camera',
  '/app/analysis/result/:id',
  '/app/history',
  '/app/ai',
  '/app/medications',
  '/app/risks',
  '/app/report',
  '/app/encyclopedia',
  '/app/encyclopedia/:markerId',
  '/app/profile',
  '/app/programs',
  '/app/programs/:programId',
  '/app/programs/active',
  '/admin',
]) {
  assert.match(routesSource, new RegExp(path.replace(/[/:]/g, '\\$&')), `missing route path ${path}`);
}

for (const tab of ['Главная', 'Анализы', 'ИИ', 'Программы', 'Профиль']) {
  assert.match(routesSource, new RegExp(`label: '${tab}'`), `missing bottom tab ${tab}`);
}

for (const token of ['#10b981', '#059669', '#f9fafb', '#111827']) {
  assert.match(themeSource, new RegExp(token), `missing theme token ${token}`);
}

assert.match(routesSource, /requiresMedicalDisclaimer: true/, 'medical disclaimer routes are not marked');

const requiredScreenStateGroups = {
  upload: ['empty', 'fileSelected', 'processing', 'error'],
  camera: ['camera', 'cameraPicker', 'ocrProcessing', 'permissionError'],
  report: ['preview', 'pdfGenerating', 'pdfReady'],
  encyclopedia: ['list', 'search', 'markerCard'],
  profile: ['filled', 'empty'],
  programs: ['list', 'programCard', 'activeProgram'],
  admin: ['aiOcrSettings', 'limits', 'disabledFeatures'],
  auth: ['entry', 'login', 'loginError', 'recovery'],
};

for (const [group, states] of Object.entries(requiredScreenStateGroups)) {
  assert.match(screenStatesSource, new RegExp(`screenId: '${group}'`), `missing state group ${group}`);

  for (const state of states) {
    assert.match(screenStatesSource, new RegExp(`id: '${state}'`), `missing ${group} state ${state}`);
  }
}

for (const folder of [
  'storage.buckets',
  'admin_audit_log',
  'analysis_jobs',
  'doctor_report_jobs',
  'app_feature_flags',
  'ocr_provider_settings',
]) {
  assert.match(backendPlanSource, new RegExp(folder), `missing backend schema marker ${folder}`);
}

for (const tableName of [
  'profiles',
  'health_profiles',
  'analysis_files',
  'analyses',
  'analysis_markers',
  'analysis_jobs',
  'doctor_reports',
  'risk_assessments',
  'medications',
  'health_programs',
  'admin_settings',
  'audit_log',
]) {
  assert.match(
    productionMigrationsSource,
    new RegExp(`create table if not exists public\\.${tableName}\\b`, 'i'),
    `missing applied migration table ${tableName}`,
  );
  assert.match(
    productionMigrationsSource,
    new RegExp(`alter table public\\.${tableName} enable row level security`, 'i'),
    `missing RLS enablement for ${tableName}`,
  );
}

for (const storageToken of [
  "'analysis-files'",
  "'doctor-reports'",
  'storage.buckets',
  'storage.objects',
  'createSignedUploadUrl',
  'createSignedUrl',
]) {
  assert.match(productionMigrationsSource, new RegExp(storageToken), `missing storage contract ${storageToken}`);
}

for (const auditToken of ['audit_table_changes', 'audit_log', 'tg_audit_analyses', 'tg_audit_admin_settings']) {
  assert.match(productionMigrationsSource, new RegExp(auditToken), `missing audit trail token ${auditToken}`);
}

for (const indexToken of [
  'analysis_jobs_user_status_idx',
  'analysis_markers_analysis_status_idx',
  'risk_assessments_user_level_idx',
  'medications_user_active_idx',
]) {
  assert.match(productionMigrationsSource, new RegExp(indexToken), `missing index ${indexToken}`);
}

assert.match(homeRouteSource, /HomeScreen/, 'home tab should render the stage 2 screen implementation');
assert.match(historyRouteSource, /HistoryScreen/, 'history tab should render the stage 2 screen implementation');
assert.match(aiRouteSource, /AiScreen/, 'ai tab should render the stage 2 screen implementation');
assert.match(programsRouteSource, /ProgramsScreen/, 'programs tab should render the stage 2 screen implementation');
assert.match(profileRouteSource, /ProfileScreen/, 'profile tab should render the stage 2 screen implementation');

for (const demoEntity of ['dashboardSummary', 'analysisHistory', 'symptomTags', 'healthPrograms', 'profileSummary']) {
  assert.match(demoDataSource, new RegExp(`export const ${demoEntity}`), `missing demo data ${demoEntity}`);
}

for (const demoEntity of ['analysisMarkers', 'latestWarnings', 'riskAssessments', 'doctorReportPreview']) {
  assert.match(demoDataSource, new RegExp(`export const ${demoEntity}`), `missing stage 3 demo data ${demoEntity}`);
}

for (const status of ['low', 'normal', 'high', 'critical']) {
  assert.match(demoDataSource, new RegExp(`status: '${status}'`), `missing marker status ${status}`);
  assert.match(resultScreenSource, new RegExp(`${status}`), `result screen does not render status ${status}`);
}

for (const readExport of ['getProfileSummary', 'getAnalysisHistory', 'getHealthPrograms', 'getLatestWarnings', 'getAnalysisResult']) {
  assert.match(supabaseReadSource, new RegExp(`export async function ${readExport}`), `missing Supabase read-layer function ${readExport}`);
}

assert.match(supabaseReadSource, /isSupabaseConfigured/, 'read layer should guard Supabase usage by env configuration');
assert.match(supabaseReadSource, /demoData/, 'read layer should keep demo fixtures as fallback');

for (const [source, component] of [
  [uploadRouteSource, 'UploadAnalysisScreen'],
  [cameraRouteSource, 'CameraAnalysisScreen'],
  [resultRouteSource, 'AnalysisResultScreen'],
  [risksRouteSource, 'RisksScreen'],
  [reportRouteSource, 'DoctorReportScreen'],
  [medicationsRouteSource, 'MedicationsScreen'],
  [encyclopediaRouteSource, 'EncyclopediaScreen'],
  [markerDetailRouteSource, 'MarkerDetailScreen'],
  [authRouteSource, 'AuthScreen'],
  [adminRouteSource, 'AdminScreen'],
  [programDetailRouteSource, 'ProgramDetailScreen'],
  [activeProgramRouteSource, 'ActiveProgramScreen'],
]) {
  assert.doesNotMatch(source, /ScreenPlaceholder/, `${component} route still uses placeholder`);
  assert.match(source, new RegExp(component), `${component} route is not wired`);
}

for (const token of ['analysis_jobs', 'uploaded', 'ocr_processing', 'ai_processing', 'completed']) {
  assert.match(uploadScreenSource + cameraScreenSource, new RegExp(token), `missing backend job contract token ${token}`);
}

for (const token of ['pickAnalysisFile', 'uploadBinaryToSignedUrl', 'runOcrForJob', 'signed_url', 'job.id']) {
  assert.match(uploadScreenSource + supabaseReadSource, new RegExp(token), `upload flow missing ${token}`);
}

for (const token of ['getAnalysisProcessingJob', 'getAnalysisResult', 'setInterval', 'error_message', 'analysis_markers']) {
  assert.match(resultScreenSource, new RegExp(token), `result screen missing live job/marker token ${token}`);
}

for (const token of ['validateUploadRequest', 'createSignedUploadUrl', 'analysis_files', 'analysis_jobs']) {
  assert.match(uploadFunctionSource, new RegExp(token), `upload-analysis-file missing ${token}`);
}

for (const token of ['deterministicOcr', 'ocr_attempts', 'ocr_confidence', 'failed', 'ai_processing']) {
  assert.match(runOcrFunctionSource, new RegExp(token), `run-ocr missing ${token}`);
}

for (const token of ['normalizeOcrMarkers', 'analysis_markers', 'rawText', 'completed', 'failed']) {
  assert.match(interpretFunctionSource, new RegExp(token), `interpret-analysis missing ${token}`);
}

assert.match(risksScreenSource, /medicalDisclaimer/, 'risk screen should show medical disclaimer');
assert.match(reportScreenSource, /medicalDisclaimer/, 'doctor report screen should include medical disclaimer');

for (const token of ['morning', 'afternoon', 'evening', 'adherence', 'reminder']) {
  assert.match(medicationsScreenSource, new RegExp(token), `missing medication schedule token ${token}`);
}

for (const token of ['analysisMarkers', 'search', 'markerCard', 'reference']) {
  assert.match(encyclopediaScreenSource, new RegExp(token), `missing encyclopedia token ${token}`);
}

for (const token of ['loginError', 'recovery', 'Supabase Auth', 'email']) {
  assert.match(authScreenSource, new RegExp(token), `missing auth state token ${token}`);
}

for (const token of ['aiOcrSettings', 'limits', 'disabledFeatures', 'audit_log']) {
  assert.match(adminScreenSource, new RegExp(token), `missing admin state token ${token}`);
}

assert.match(implementationPlanSource, /## 13\. Что сделано на этапе 3/, 'implementation plan should document completed stage 3');
assert.match(implementationPlanSource, /## 15\. Что сделано на этапе 5/, 'implementation plan should document completed stage 5');
assert.match(implementationPlanSource, /## 16\. Рекомендуемые следующие шаги после issue 28/, 'implementation plan should document recommended next steps after issue 28');

for (const nextStep of [
  'Expo web',
  'применяемые Supabase migrations',
  'RLS-политики',
  'Edge Functions',
  'private Storage',
  'placeholder-экраны',
  'визуальную регрессию',
]) {
  assert.match(implementationPlanSource, new RegExp(nextStep), `missing recommended next step ${nextStep}`);
}

assert.match(
  implementationPlanSource,
  /остается 8 крупных задач/,
  'implementation plan should state remaining project task count after issue 28',
);
