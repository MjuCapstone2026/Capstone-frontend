import { useLocalSearchParams } from 'expo-router';
import { PlanListDetailScreen } from '@/screens/PlanListDetailScreen';

export default function PlanListDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlanListDetailScreen id={String(id)} />;
}
