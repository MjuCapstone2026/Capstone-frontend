import { useLocalSearchParams } from 'expo-router';
import { ChangeLogDetailScreen } from '@/screens/ChangeLogDetailScreen';

export default function ChangeLogDetailRoute() {
  const { id, logId } = useLocalSearchParams<{ id: string; logId: string }>();

  return <ChangeLogDetailScreen itineraryId={String(id)} logId={String(logId)} />;
}
