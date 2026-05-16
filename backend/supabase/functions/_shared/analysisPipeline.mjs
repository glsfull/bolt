export const ANALYSIS_BUCKET = 'analysis-files';
export const MAX_ANALYSIS_FILE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_ANALYSIS_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export function validateUploadRequest(input) {
  const fileName = String(input?.fileName ?? input?.filename ?? '').trim();
  const mimeType = String(input?.mimeType ?? input?.mime_type ?? '').trim().toLowerCase();
  const byteSize = Number(input?.byteSize ?? input?.byte_size ?? 0);

  if (!fileName) {
    return { ok: false, status: 400, error: 'fileName is required' };
  }

  if (!SUPPORTED_ANALYSIS_MIME_TYPES.has(mimeType)) {
    return { ok: false, status: 415, error: `Unsupported analysis file MIME type: ${mimeType || 'empty'}` };
  }

  if (!Number.isFinite(byteSize) || byteSize <= 0) {
    return { ok: false, status: 400, error: 'byteSize must be a positive number' };
  }

  if (byteSize > MAX_ANALYSIS_FILE_BYTES) {
    return { ok: false, status: 413, error: `Analysis file exceeds ${MAX_ANALYSIS_FILE_BYTES} bytes` };
  }

  return { ok: true, fileName, mimeType, byteSize };
}

export function storagePathForAnalysisFile({ userId, analysisId, fileName }) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'analysis-file';
  return `${userId}/${analysisId}/${safeName}`;
}

export function deterministicOcr(file) {
  if (file?.metadata?.forceOcrError) {
    throw new Error('Deterministic OCR provider failed');
  }

  return {
    provider: 'deterministic-v1',
    confidence: 0.91,
    rawText: [
      'Гемоглобин 98 г/л референс 120-160',
      'Тромбоциты 245 10^9/л референс 150-400',
      'Холестерин общий 6.4 ммоль/л референс 3.0-5.2',
      'C-реактивный белок 31 мг/л референс 0-5',
    ].join('\n'),
  };
}

const MARKER_RULES = [
  {
    code: 'hgb',
    name: 'Гемоглобин',
    category: 'Общий анализ крови',
    unit: 'г/л',
    refMin: 120,
    refMax: 160,
    pattern: /Гемоглобин\s+([\d.,]+)/iu,
    lowText: 'Снижен, возможна анемия и недостаточный перенос кислорода тканям.',
    highText: 'Повышен, требуется оценка причин сгущения крови или гипоксии.',
  },
  {
    code: 'plt',
    name: 'Тромбоциты',
    category: 'Общий анализ крови',
    unit: '10^9/л',
    refMin: 150,
    refMax: 400,
    pattern: /Тромбоциты\s+([\d.,]+)/iu,
  },
  {
    code: 'chol',
    name: 'Холестерин общий',
    category: 'Биохимия',
    unit: 'ммоль/л',
    refMin: 3,
    refMax: 5.2,
    pattern: /Холестерин общий\s+([\d.,]+)/iu,
    highText: 'Повышен, может увеличивать сердечно-сосудистые риски.',
  },
  {
    code: 'crp',
    name: 'C-реактивный белок',
    category: 'Воспаление',
    unit: 'мг/л',
    refMin: 0,
    refMax: 5,
    pattern: /C-реактивный белок\s+([\d.,]+)/iu,
    highText: 'Резко повышен, требует очной медицинской оценки причины воспаления.',
  },
];

export function normalizeOcrMarkers(rawText, options = {}) {
  if (options.forceAiError) {
    throw new Error('Deterministic AI normalization failed');
  }

  return MARKER_RULES.map((rule) => {
    const match = rawText.match(rule.pattern);
    if (!match) {
      return null;
    }

    const value = Number(match[1].replace(',', '.'));
    const status = value < rule.refMin ? 'low' : value > rule.refMax * 2 ? 'critical' : value > rule.refMax ? 'high' : 'normal';
    const interpretation =
      status === 'low' ? rule.lowText ?? 'Показатель ниже референсного диапазона.'
        : status === 'high' || status === 'critical' ? rule.highText ?? 'Показатель выше референсного диапазона.'
          : 'Показатель находится в референсном диапазоне.';

    return {
      code: rule.code,
      name: rule.name,
      value,
      value_text: match[1],
      unit: rule.unit,
      ref_min: rule.refMin,
      ref_max: rule.refMax,
      status,
      category: rule.category,
      interpretation,
      recommendation: status === 'normal' ? '' : 'Обсудить результат с врачом и сопоставить с симптомами.',
    };
  }).filter(Boolean);
}
