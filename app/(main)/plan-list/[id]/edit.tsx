import { useLocalSearchParams } from 'expo-router';
import { PlanListDetailEditScreen } from '@/screens/PlanListDetailEditScreen';

export default function PlanListDetailEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlanListDetailEditScreen id={String(id)} />;
}
