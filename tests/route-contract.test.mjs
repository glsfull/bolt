import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routesSource = readFileSync('frontend/mobile/src/navigation/routes.ts', 'utf8');
const themeSource = readFileSync('frontend/mobile/src/theme/index.ts', 'utf8');
const screenStatesSource = readFileSync('frontend/mobile/src/navigation/screenStates.ts', 'utf8');
const backendPlanSource = readFileSync('backend/supabase/migrations/001_production_schema_plan.sql', 'utf8');

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
