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
