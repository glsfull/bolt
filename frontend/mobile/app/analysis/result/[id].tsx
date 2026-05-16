import { useLocalSearchParams } from 'expo-router';

import { AnalysisResultScreen } from '../../../src/features/analyses/AnalysisResultScreen';

export default function AnalysisResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AnalysisResultScreen analysisId={id} />;
}
