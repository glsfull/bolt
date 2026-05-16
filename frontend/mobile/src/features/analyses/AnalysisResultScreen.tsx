import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import type { MarkerStatus } from '../demoData';
import { analysisMarkers as demoAnalysisMarkers, analysisProcessingJob } from '../demoData';
import { getAnalysisProcessingJob, getAnalysisResult } from '../../services/supabase/readLayer';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';
import { colors, radius, spacing } from '../../theme';

const statusTone: Record<MarkerStatus, 'emerald' | 'amber' | 'red' | 'blue'> = {
  low: 'blue',
  normal: 'emerald',
  high: 'amber',
  critical: 'red',
};

const statusLabel: Record<MarkerStatus, string> = {
  low: 'Ниже нормы',
  normal: 'В норме',
  high: 'Выше нормы',
  critical: 'Критично',
};

const jobStatusLabel: Record<string, string> = {
  uploaded: 'Файл загружен',
  ocr_processing: 'OCR распознает файл',
  ai_processing: 'ИИ нормализует показатели',
  completed: 'Расшифровка готова',
  failed: 'Ошибка обработки',
};

export function AnalysisResultScreen({ analysisId = 'cbc-2026-05-13' }: { analysisId?: string }) {
  const [job, setJob] = useState(analysisProcessingJob);
  const [markers, setMarkers] = useState(demoAnalysisMarkers);

  useEffect(() => {
    let mounted = true;

    async function refresh() {
      const [nextJob, nextMarkers] = await Promise.all([
        getAnalysisProcessingJob(analysisId),
        getAnalysisResult(analysisId),
      ]);
      if (mounted) {
        setJob(nextJob);
        setMarkers(nextMarkers.map((marker: any) => ({
          id: marker.id,
          name: marker.name,
          category: marker.category,
          value: Number(marker.value ?? 0),
          unit: marker.unit ?? '',
          min: Number(marker.ref_min ?? marker.min ?? 0),
          max: Number(marker.ref_max ?? marker.max ?? 0),
          status: marker.status,
          interpretation: marker.interpretation ?? '',
          recommendation: marker.recommendation ?? '',
        })));
      }
    }

    refresh();
    const timer = setInterval(refresh, 5000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [analysisId]);

  const categories = [...new Set(markers.map((marker) => marker.category))];

  return (
    <ScreenShell>
      <View>
        <Eyebrow>analysis/result/[id]</Eyebrow>
        <Title>Расшифровка анализа</Title>
      </View>
      <SectionCard>
        <Eyebrow>analysis_jobs</Eyebrow>
        <Title>{jobStatusLabel[job.status] ?? job.status}</Title>
        <Body>Текущий статус: {job.status}</Body>
        {job.error_message ? <Body>{job.error_message}</Body> : null}
        <Body>Источник результата: analysis_markers</Body>
      </SectionCard>
      {categories.map((category) => (
        <SectionCard key={category}>
          <Eyebrow>{category}</Eyebrow>
          <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
            {markers
              .filter((marker) => marker.category === category)
              .map((marker) => {
                const total = marker.max === 0 ? marker.value : marker.max * 1.35;
                const indicator = Math.max(4, Math.min(96, (marker.value / total) * 100));

                return (
                  <View key={marker.id} style={{ borderTopColor: colors.gray[100], borderTopWidth: 1, gap: spacing[2], paddingTop: spacing[3] }}>
                    <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.gray[900], fontSize: 15, fontWeight: '800' }}>{marker.name}</Text>
                        <Body>{marker.value} {marker.unit} · референс {marker.min}-{marker.max}</Body>
                      </View>
                      <Badge tone={statusTone[marker.status]}>{statusLabel[marker.status]}</Badge>
                    </View>
                    <View style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, height: 10, overflow: 'hidden' }}>
                      <View style={{ backgroundColor: colors.blue[100], height: 10, left: 0, position: 'absolute', width: `${(marker.min / total) * 100}%` }} />
                      <View style={{ backgroundColor: colors.emerald[100], height: 10, left: `${(marker.min / total) * 100}%`, position: 'absolute', width: `${((marker.max - marker.min) / total) * 100}%` }} />
                      <View style={{ backgroundColor: colors.gray[900], height: 10, left: `${indicator}%`, position: 'absolute', width: 3 }} />
                    </View>
                    <Body>{marker.interpretation}</Body>
                    {marker.recommendation ? <Body>{marker.recommendation}</Body> : null}
                  </View>
                );
              })}
          </View>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
