export type AppRouteId =
  | 'home'
  | 'auth'
  | 'upload'
  | 'camera'
  | 'results'
  | 'history'
  | 'symptoms'
  | 'meds'
  | 'risks'
  | 'report'
  | 'encyclopedia'
  | 'profile'
  | 'programs'
  | 'programDetail'
  | 'activeProgram'
  | 'admin';

export type RouteDefinition = {
  id: AppRouteId;
  label: string;
  path: string;
  prototypeTab: string;
  sourceScreen: string;
  referenceArtifact?: string;
  requiresMedicalDisclaimer?: boolean;
};

export const routeMap: RouteDefinition[] = [
  {
    id: 'home',
    label: 'Обзор здоровья',
    path: '/app',
    prototypeTab: 'home',
    sourceScreen: 'project/src/pages/HealthHome.tsx',
    referenceArtifact: 'project/screenshot_01_home.html',
  },
  {
    id: 'auth',
    label: 'Авторизация',
    path: '/auth',
    prototypeTab: 'auth',
    sourceScreen: 'project/src/components/AuthModal.tsx',
  },
  {
    id: 'upload',
    label: 'Загрузка анализа',
    path: '/app/analysis/upload',
    prototypeTab: 'upload',
    sourceScreen: 'project/src/components/dashboard/UploadPanel.tsx',
  },
  {
    id: 'camera',
    label: 'Сканер камеры',
    path: '/app/analysis/camera',
    prototypeTab: 'camera',
    sourceScreen: 'project/src/components/dashboard/CameraScanner.tsx',
  },
  {
    id: 'results',
    label: 'Расшифровка анализа',
    path: '/app/analysis/result/:id',
    prototypeTab: 'results',
    sourceScreen: 'project/src/components/dashboard/AnalysisMarkerCard.tsx',
    referenceArtifact: 'project/screenshot_02_analysis.html',
  },
  {
    id: 'history',
    label: 'История и динамика',
    path: '/app/history',
    prototypeTab: 'history',
    sourceScreen: 'project/src/pages/AnalysisHistory.tsx',
    referenceArtifact: 'project/screenshot_06_history.html',
  },
  {
    id: 'symptoms',
    label: 'ИИ-диагностика',
    path: '/app/ai',
    prototypeTab: 'symptoms',
    sourceScreen: 'project/src/components/dashboard/SymptomChecker.tsx',
    referenceArtifact: 'project/screenshot_03_ai.html',
    requiresMedicalDisclaimer: true,
  },
  {
    id: 'meds',
    label: 'Расписание лекарств',
    path: '/app/medications',
    prototypeTab: 'meds',
    sourceScreen: 'project/src/components/dashboard/MedicationSchedule.tsx',
    referenceArtifact: 'project/screenshot_04_medications.html',
  },
  {
    id: 'risks',
    label: 'Оценка рисков',
    path: '/app/risks',
    prototypeTab: 'risks',
    sourceScreen: 'project/src/pages/RiskAssessment.tsx',
    referenceArtifact: 'project/screenshot_05_risks.html',
    requiresMedicalDisclaimer: true,
  },
  {
    id: 'report',
    label: 'Отчёт для врача',
    path: '/app/report',
    prototypeTab: 'report',
    sourceScreen: 'project/src/pages/DoctorReport.tsx',
    requiresMedicalDisclaimer: true,
  },
  {
    id: 'encyclopedia',
    label: 'Справочник',
    path: '/app/encyclopedia',
    prototypeTab: 'encyclopedia',
    sourceScreen: 'project/src/pages/Encyclopedia.tsx',
  },
  {
    id: 'encyclopedia',
    label: 'Карточка показателя',
    path: '/app/encyclopedia/:markerId',
    prototypeTab: 'encyclopediaMarker',
    sourceScreen: 'project/src/pages/Encyclopedia.tsx',
  },
  {
    id: 'profile',
    label: 'Профиль здоровья',
    path: '/app/profile',
    prototypeTab: 'profile',
    sourceScreen: 'project/src/pages/HealthProfile.tsx',
  },
  {
    id: 'programs',
    label: 'Программы здоровья',
    path: '/app/programs',
    prototypeTab: 'programs',
    sourceScreen: 'project/src/pages/HealthPrograms.tsx',
  },
  {
    id: 'programDetail',
    label: 'Карточка программы',
    path: '/app/programs/:programId',
    prototypeTab: 'programDetail',
    sourceScreen: 'project/src/pages/HealthPrograms.tsx',
  },
  {
    id: 'activeProgram',
    label: 'Активная программа',
    path: '/app/programs/active',
    prototypeTab: 'activeProgram',
    sourceScreen: 'project/src/pages/HealthPrograms.tsx',
  },
  {
    id: 'admin',
    label: 'Панель администратора',
    path: '/admin',
    prototypeTab: 'admin',
    sourceScreen: 'project/src/pages/AdminPanel.tsx',
  },
];

export const bottomTabs = [
  { id: 'home', label: 'Главная', segment: 'index' },
  { id: 'analyses', label: 'Анализы', segment: 'history' },
  { id: 'ai', label: 'ИИ', segment: 'ai' },
  { id: 'programs', label: 'Программы', segment: 'programs' },
  { id: 'profile', label: 'Профиль', segment: 'profile' },
] as const;

export const medicalDisclaimer =
  'Информация носит справочный характер и не является диагнозом. Для постановки диагноза и лечения обратитесь к врачу.';
