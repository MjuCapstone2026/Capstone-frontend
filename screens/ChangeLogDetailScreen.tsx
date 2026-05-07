import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  itineraryId: string;
  logId: string;
};

export function ChangeLogDetailScreen({ itineraryId, logId }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text>ChangeLogDetailScreen {itineraryId} {logId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
