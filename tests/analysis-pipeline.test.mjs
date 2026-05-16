import assert from 'node:assert/strict';

import {
  deterministicOcr,
  MAX_ANALYSIS_FILE_BYTES,
  normalizeOcrMarkers,
  storagePathForAnalysisFile,
  validateUploadRequest,
} from '../backend/supabase/functions/_shared/analysisPipeline.mjs';

const validUpload = validateUploadRequest({
  fileName: 'blood test.pdf',
  mimeType: 'application/pdf',
  byteSize: 42_000,
});
assert.equal(validUpload.ok, true);

assert.deepEqual(
  validateUploadRequest({ fileName: 'script.exe', mimeType: 'application/x-msdownload', byteSize: 100 }),
  { ok: false, status: 415, error: 'Unsupported analysis file MIME type: application/x-msdownload' },
);

assert.equal(validateUploadRequest({ fileName: 'huge.pdf', mimeType: 'application/pdf', byteSize: MAX_ANALYSIS_FILE_BYTES + 1 }).status, 413);
assert.equal(storagePathForAnalysisFile({ userId: 'user-1', analysisId: 'analysis-1', fileName: 'blood test.pdf' }), 'user-1/analysis-1/blood_test.pdf');

assert.throws(() => deterministicOcr({ metadata: { forceOcrError: true } }), /OCR provider failed/);

const ocr = deterministicOcr({ metadata: {} });
assert.equal(ocr.provider, 'deterministic-v1');
assert.equal(ocr.confidence, 0.91);
assert.match(ocr.rawText, /Гемоглобин 98/);

assert.throws(() => normalizeOcrMarkers(ocr.rawText, { forceAiError: true }), /AI normalization failed/);

const markers = normalizeOcrMarkers(ocr.rawText);
assert.equal(markers.length, 4);
assert.deepEqual(
  markers.map((marker) => [marker.code, marker.value, marker.unit, marker.status, marker.category]),
  [
    ['hgb', 98, 'г/л', 'low', 'Общий анализ крови'],
    ['plt', 245, '10^9/л', 'normal', 'Общий анализ крови'],
    ['chol', 6.4, 'ммоль/л', 'high', 'Биохимия'],
    ['crp', 31, 'мг/л', 'critical', 'Воспаление'],
  ],
);
