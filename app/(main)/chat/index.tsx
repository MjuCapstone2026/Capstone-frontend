import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NewChatScreen } from '@/screens/NewChatScreen';
import { queryKeys } from '@/constants/queryKeys';
import { useTheme } from '@/hooks/useTheme';

export default function ChatRoute() {
  const { mode } = useLocalSearchParams<{ mode?: 'new' }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const data = queryClient.getQueryData<{ rooms: { roomId: string }[] }>(queryKeys.chatRooms.all);
  const recentRoomId = mode === 'new' ? undefined : data?.rooms[0]?.roomId;
  const [checkingRecentRoom, setCheckingRecentRoom] = useState(!!recentRoomId);

  useEffect(() => {
    if (mode === 'new') {
      setCheckingRecentRoom(false);
      return;
    }

    if (recentRoomId) {
      router.replace({ pathname: '/chat/[chatId]', params: { chatId: recentRoomId } });
      return;
    }

    setCheckingRecentRoom(false);
  }, [mode, recentRoomId, router]);

  if (checkingRecentRoom) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.pageBg }]}>
        <ActivityIndicator size="small" color={colors.textCaption} />
      </View>
    );
  }

  return <NewChatScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
