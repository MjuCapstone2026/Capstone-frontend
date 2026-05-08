import { useLocalSearchParams } from 'expo-router';
import { PlanListDetailTemporaryScreen } from '@/screens/PlanListDetailTemporaryScreen';

export default function PlanListDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: 추후 실제 PlanListDetailScreen 구현으로 교체 예정.
  return <PlanListDetailTemporaryScreen id={String(id)} />;
}
