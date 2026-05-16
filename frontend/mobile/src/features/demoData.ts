export const dashboardSummary = {
  userName: 'Анна',
  healthIndex: 65,
  status: 'Требует внимания',
  nextMedication: 'Омега-3 через 30 минут',
  alerts: ['Гемоглобин ниже нормы', 'Холестерин выше нормы', 'Витамин D требует контроля', 'Повторить ОАК через 2 недели'],
};

export const analysisHistory = [
  { id: 'cbc-2026-05-13', title: 'Общий анализ крови', date: '13 мая 2026', deviations: 4, status: 'attention' },
  { id: 'bio-2026-04-28', title: 'Биохимия крови', date: '28 апреля 2026', deviations: 2, status: 'stable' },
  { id: 'vit-2026-04-11', title: 'Витамины и минералы', date: '11 апреля 2026', deviations: 1, status: 'stable' },
];

export const analysisProcessingJob = {
  id: 'job-demo-cbc',
  analysis_id: 'cbc-2026-05-13',
  status: 'completed',
  error_message: null,
  metadata: {
    ocr_provider: 'deterministic-v1',
    ocr_confidence: 0.91,
    ai_marker_count: 4,
  },
};

export const symptomTags = ['Слабость', 'Головная боль', 'Температура', 'Боль в горле', 'Тошнота'];

export const healthPrograms = [
  { id: 'iron', title: 'Восстановление железа', progress: 42, duration: '8 недель' },
  { id: 'heart', title: 'Контроль холестерина', progress: 18, duration: '12 недель' },
  { id: 'vitamin-d', title: 'Витамин D', progress: 65, duration: '6 недель' },
];

export const profileSummary = {
  age: 34,
  bmi: 22.8,
  bloodType: 'A+',
  chronic: ['Анемия в анамнезе'],
  allergies: ['Пенициллин'],
};

export type MarkerStatus = 'low' | 'normal' | 'high' | 'critical';

export type AnalysisMarker = {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: MarkerStatus;
  interpretation: string;
  recommendation?: string;
};

export const analysisMarkers: AnalysisMarker[] = [
  {
    id: 'hgb',
    name: 'Гемоглобин',
    category: 'Общий анализ крови',
    value: 98,
    unit: 'г/л',
    min: 120,
    max: 160,
    status: 'low',
    interpretation: 'Снижен, возможна анемия и недостаточный перенос кислорода тканям.',
    recommendation: 'Проверить ферритин и железо, обсудить результат с терапевтом.',
  },
  {
    id: 'plt',
    name: 'Тромбоциты',
    category: 'Общий анализ крови',
    value: 245,
    unit: '10^9/л',
    min: 150,
    max: 400,
    status: 'normal',
    interpretation: 'Показатель находится в референсном диапазоне.',
  },
  {
    id: 'chol',
    name: 'Холестерин общий',
    category: 'Биохимия',
    value: 6.4,
    unit: 'ммоль/л',
    min: 3,
    max: 5.2,
    status: 'high',
    interpretation: 'Повышен, может увеличивать сердечно-сосудистые риски.',
    recommendation: 'Повторить липидограмму и обсудить питание с врачом.',
  },
  {
    id: 'crp',
    name: 'C-реактивный белок',
    category: 'Воспаление',
    value: 31,
    unit: 'мг/л',
    min: 0,
    max: 5,
    status: 'critical',
    interpretation: 'Резко повышен, требует очной медицинской оценки причины воспаления.',
    recommendation: 'Не откладывать консультацию врача, особенно при температуре или боли.',
  },
];

export const latestWarnings = [
  { id: 'warn-hgb', title: 'Гемоглобин ниже нормы', severity: 'medium' },
  { id: 'warn-crp', title: 'CRP в критической зоне', severity: 'high' },
  { id: 'warn-chol', title: 'Холестерин выше цели', severity: 'medium' },
];

export const riskAssessments = [
  { id: 'cardio', title: 'Сердечно-сосудистый риск', level: 'Повышенный', score: 68 },
  { id: 'anemia', title: 'Риск анемии', level: 'Высокий', score: 82 },
  { id: 'inflammation', title: 'Воспалительный процесс', level: 'Требует внимания', score: 76 },
];

export const doctorReportPreview = {
  patient: 'Анна, 34 года',
  period: 'апрель-май 2026',
  sections: ['Профиль здоровья', 'Последние анализы', 'Отклонения', 'Риски', 'Рекомендации для врача'],
  pdfStatus: 'PDF создается backend-функцией generate-doctor-report и выдается через short-lived signed URL.',
};
