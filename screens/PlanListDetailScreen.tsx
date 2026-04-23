import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = { id: string };

export function PlanListDetailScreen({ id }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text>PlanListDetailScreen — {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
