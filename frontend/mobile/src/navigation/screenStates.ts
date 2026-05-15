export type ScreenStateDefinition = {
  screenId: string;
  source: string;
  states: Array<{
    id: string;
    label: string;
    acceptance: string;
  }>;
};

export const screenStateInventory: ScreenStateDefinition[] = [
  {
    screenId: 'upload',
    source: 'project/src/components/dashboard/UploadPanel.tsx',
    states: [
      { id: 'empty', label: 'Пустое состояние', acceptance: 'Нет выбранного файла, показаны формат и первичное действие.' },
      { id: 'fileSelected', label: 'Выбранный файл', acceptance: 'Показаны имя файла, тип анализа и действие запуска.' },
      { id: 'processing', label: 'Обработка', acceptance: 'Показан прогресс загрузки, OCR и AI-нормализации.' },
      { id: 'error', label: 'Ошибка', acceptance: 'Показана причина сбоя и повторная попытка.' },
    ],
  },
  {
    screenId: 'camera',
    source: 'project/src/components/dashboard/CameraScanner.tsx',
    states: [
      { id: 'camera', label: 'Камера', acceptance: 'Открыт live-preview и кнопка снимка.' },
      { id: 'cameraPicker', label: 'Выбор из камер', acceptance: 'Доступен выбор камеры или галереи.' },
      { id: 'ocrProcessing', label: 'OCR-обработка', acceptance: 'Показан этап распознавания и извлечения показателей.' },
      { id: 'permissionError', label: 'Ошибка доступа', acceptance: 'Показано объяснение и переход в настройки разрешений.' },
    ],
  },
  {
    screenId: 'report',
    source: 'project/src/pages/DoctorReport.tsx',
    states: [
      { id: 'preview', label: 'Предпросмотр', acceptance: 'Показаны профиль, анализы, риски и disclaimer.' },
      { id: 'pdfGenerating', label: 'Генерация PDF', acceptance: 'Показан статус создания PDF-отчета.' },
      { id: 'pdfReady', label: 'Готовый PDF', acceptance: 'Показана short-lived ссылка на приватный PDF.' },
    ],
  },
  {
    screenId: 'encyclopedia',
    source: 'project/src/pages/Encyclopedia.tsx',
    states: [
      { id: 'list', label: 'Список', acceptance: 'Показан каталог показателей по группам.' },
      { id: 'search', label: 'Поиск', acceptance: 'Показаны результаты фильтрации по названию.' },
      { id: 'markerCard', label: 'Карточка показателя', acceptance: 'Показаны норма, отклонения и пояснение.' },
    ],
  },
  {
    screenId: 'profile',
    source: 'project/src/pages/HealthProfile.tsx',
    states: [
      { id: 'filled', label: 'Заполненный профиль', acceptance: 'Показаны параметры здоровья и расчет ИМТ.' },
      { id: 'empty', label: 'Пустой профиль', acceptance: 'Показаны поля первичного заполнения.' },
    ],
  },
  {
    screenId: 'programs',
    source: 'project/src/pages/HealthPrograms.tsx',
    states: [
      { id: 'list', label: 'Список программ', acceptance: 'Показаны доступные программы здоровья.' },
      { id: 'programCard', label: 'Карточка программы', acceptance: 'Показаны цель, шаги, длительность и CTA.' },
      { id: 'activeProgram', label: 'Активная программа', acceptance: 'Показаны прогресс, задачи и следующий шаг.' },
    ],
  },
  {
    screenId: 'admin',
    source: 'project/src/pages/AdminPanel.tsx',
    states: [
      { id: 'aiOcrSettings', label: 'Настройки AI/OCR', acceptance: 'Показаны провайдеры, модели и серверные ключи без значений.' },
      { id: 'limits', label: 'Лимиты', acceptance: 'Показаны тарифные и пользовательские ограничения.' },
      { id: 'disabledFeatures', label: 'Выключенные функции', acceptance: 'Показаны feature flags и причины отключения.' },
    ],
  },
  {
    screenId: 'auth',
    source: 'project/src/components/AuthModal.tsx',
    states: [
      { id: 'entry', label: 'Входная точка', acceptance: 'Показаны варианты входа и регистрации.' },
      { id: 'login', label: 'Логин', acceptance: 'Показана форма email/password.' },
      { id: 'loginError', label: 'Ошибка входа', acceptance: 'Показана ошибка валидации или Supabase Auth.' },
      { id: 'recovery', label: 'Восстановление доступа', acceptance: 'Показана отправка письма восстановления.' },
    ],
  },
];
