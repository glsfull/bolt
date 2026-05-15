import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routesSource = readFileSync('frontend/mobile/src/navigation/routes.ts', 'utf8');
const themeSource = readFileSync('frontend/mobile/src/theme/index.ts', 'utf8');

const requiredRouteIds = [
  'home',
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
  'admin',
];

for (const id of requiredRouteIds) {
  assert.match(routesSource, new RegExp(`id: '${id}'`), `missing route id ${id}`);
}

for (const path of [
  '/app',
  '/app/analysis/upload',
  '/app/analysis/camera',
  '/app/analysis/result/:id',
  '/app/history',
  '/app/ai',
  '/app/medications',
  '/app/risks',
  '/app/report',
  '/app/encyclopedia',
  '/app/profile',
  '/app/programs',
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
