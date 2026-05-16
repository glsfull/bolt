import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { runOcrForJob, uploadAnalysisFile, uploadBinaryToSignedUrl } from '../../services/supabase/readLayer';
import { colors, radius, spacing } from '../../theme';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const backendJobContract = ['upload-analysis-file', 'analysis_jobs', 'uploaded', 'ocr_processing', 'ai_processing', 'completed'];
type PickedAnalysisFile = { fileName: string; mimeType: string; byteSize: number; blob?: Blob };

async function pickAnalysisFile(): Promise<PickedAnalysisFile | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/jpeg,image/png,image/heic,image/heif';
    input.onchange = () => {
      const file = input.files?.[0];
      resolve(file ? { fileName: file.name, mimeType: file.type || 'application/octet-stream', byteSize: file.size, blob: file } : null);
    };
    input.click();
  });
}

export function UploadAnalysisScreen() {
  const [file, setFile] = useState<PickedAnalysisFile | null>(null);
  const [status, setStatus] = useState('empty');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisId, setAnalysisId] = useState('');

  async function handlePickAndUpload() {
    setErrorMessage('');
    const selectedFile = await pickAnalysisFile();
    if (!selectedFile) {
      setStatus('error');
      setErrorMessage('Выбор файла доступен в Expo Web. Для iOS/Android нужен модуль document picker.');
      return;
    }

    setFile(selectedFile);
    setStatus('fileSelected');

    try {
      setStatus('processing');
      const uploadSession = await uploadAnalysisFile(selectedFile);
      await uploadBinaryToSignedUrl(uploadSession.upload.signed_url, selectedFile);
      await runOcrForJob(uploadSession.job.id);
      setAnalysisId(uploadSession.analysis.id);
      setStatus('ai_processing');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить файл');
    }
  }

  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>Загрузка анализа</Eyebrow>
        <Title>PDF, JPG, PNG или HEIC</Title>
        <Body>Файл сохраняется в приватном Supabase Storage bucket, затем создается запись analysis_jobs со статусом uploaded.</Body>
        <Pressable
          onPress={handlePickAndUpload}
          style={{ alignItems: 'center', backgroundColor: colors.emerald[600], borderRadius: radius.badge, marginTop: spacing[4], padding: spacing[3] }}
        >
          <Text style={{ color: colors.white, fontSize: 14, fontWeight: '900' }}>{status === 'processing' ? 'Загрузка...' : 'Выбрать файл'}</Text>
        </Pressable>
        {file ? <Body>{file.fileName} · {Math.round(file.byteSize / 1024)} КБ</Body> : null}
        {analysisId ? <Body>analysis_id: {analysisId}</Body> : null}
        {errorMessage ? <Body>{errorMessage}</Body> : null}
      </SectionCard>
      <SectionCard>
        <Title>Backend job contract</Title>
        <View style={{ gap: spacing[2], marginTop: spacing[3] }}>
          {backendJobContract.map((step, index) => (
            <View key={step} style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Text style={{ backgroundColor: colors.emerald[50], borderRadius: radius.badge, color: colors.emerald[800], fontWeight: '900', paddingHorizontal: spacing[2] }}>{index + 1}</Text>
              <Body>{step}</Body>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
