import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = { chatId: string };

export function ChatRoomScreen({ chatId }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text>ChatRoomScreen — {chatId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
