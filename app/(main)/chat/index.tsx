import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { NewChatScreen } from '@/screens/NewChatScreen';
import { ChatRoomScreen } from '@/screens/ChatRoomScreen';

export default function ChatRoute() {
  const { chatId, mode } = useLocalSearchParams<{ chatId?: string; mode?: 'new' }>();
  const isNew = mode === 'new';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isNew || chatId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [isNew, chatId]);

  if (isNew) return <NewChatScreen />;
  if (chatId) return <ChatRoomScreen chatId={String(chatId)} />;
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <NewChatScreen />;
}
