import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { NewChatScreen } from '@/screens/NewChatScreen';
import { ChatRoomScreen } from '@/screens/ChatRoomScreen';

export default function ChatRoute() {
  const { chatId, new: isNew } = useLocalSearchParams<{ chatId?: string; new?: string }>();
  const [recentChatId, setRecentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { authRequest } = useApi(); // TODO: 활성화

  useEffect(() => {
    if (isNew || chatId) {
      setIsLoading(false);
      return;
    }
    // TODO: API 연결 후 아래 주석 해제
    // authRequest(getChatList).then(res => {
    //   setRecentChatId(res.data[0]?.id ?? null);
    //   setIsLoading(false);
    // });
    setIsLoading(false); // 임시
  }, [isNew, chatId]);

  if (isNew === 'true') return <NewChatScreen />;
  if (chatId) return <ChatRoomScreen chatId={chatId} />;
  if (isLoading) return <View style={{ flex: 1 }}><ActivityIndicator /></View>;
  if (recentChatId) return <ChatRoomScreen chatId={recentChatId} />;
  return <NewChatScreen />;
}
