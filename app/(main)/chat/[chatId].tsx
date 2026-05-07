import { useLocalSearchParams } from 'expo-router';
import { ChatRoomScreen } from '@/screens/ChatRoomScreen';

export default function ChatRoomRoute() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  return <ChatRoomScreen chatId={String(chatId)} />;
}
