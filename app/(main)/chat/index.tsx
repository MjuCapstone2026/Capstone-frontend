import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { NewChatScreen } from '@/screens/NewChatScreen';
import { queryKeys } from '@/constants/queryKeys';

export default function ChatRoute() {
  const { mode } = useLocalSearchParams<{ mode?: 'new' }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mode === 'new') return;

    const data = queryClient.getQueryData<{ rooms: { roomId: string }[] }>(queryKeys.chatRooms.all);
    const recentRoomId = data?.rooms[0]?.roomId;

    if (recentRoomId) {
      router.replace({ pathname: '/chat/[chatId]', params: { chatId: recentRoomId } });
    }
  }, []);

  return <NewChatScreen />;
}
