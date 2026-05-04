import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatSendButton } from '@/components/ChatSendButton';
import { CurrentScheduleCard } from '@/components/CurrentScheduleCard';
import { DayScheduleItem } from '@/components/DayScheduleItem';
import { Alert } from '@/components/ui/Alert';
import { AlertMessages } from '@/constants/alerts';
import { BookedByBadge } from '@/components/ui/BookedByBadge';
import { CheckButton } from '@/components/ui/CheckButton';
import { HomeAIBanner } from '@/components/HomeAIBanner';
import { ItineraryOverviewCard } from '@/components/ItineraryOverviewCard';
import { NewTravelGenerateButton } from '@/components/NewTravelGenerateButton';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { borderBottomColor: colors.divider, color: colors.textTitle }]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function RedDev1Screen() {
  const { colors } = useTheme();
  const [checkButtonChecked, setCheckButtonChecked] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [schedule1Status, setSchedule1Status] = useState<'upcoming' | 'completed'>('upcoming');
  const [schedule2Status, setSchedule2Status] = useState<'upcoming' | 'completed'>('completed');
  const [alertChatDeleteVisible, setAlertChatDeleteVisible] = useState(false);
  const [alertDeleteAccountVisible, setAlertDeleteAccountVisible] = useState(false);
  const [alertLogoutVisible, setAlertLogoutVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Link href="/red_dev2" asChild>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]}>
          <Text style={[styles.devLinkText, { color: colors.cardBg }]}>→ Red Dev2 (SafeArea)</Text>
        </Pressable>
      </Link>

      <Section title='ItineraryOverviewCard'>
        <ItineraryOverviewCard
          title="제주도 3일 여행"
          days={[
            { label: '1일차', date: '4월 10일', dayOfWeek: '목' },
            { label: '2일차', date: '4월 11일', dayOfWeek: '금' },
            { label: '3일차', date: '4월 12일', dayOfWeek: '토' },
            { label: '4일차', date: '4월 13일', dayOfWeek: '일' },
            { label: '5일차', date: '4월 14일', dayOfWeek: '월' },
          ]}
          activeDay={activeDay}
          onDayPress={setActiveDay}
          completedCount={2}
          totalCount={6}
        />
      </Section>
      <Section title='NewTravelGenerateButton'>
        <NewTravelGenerateButton onPress={() => { }} />
      </Section>
      <Section title='HomeAIBanner'>
        <HomeAIBanner onPress={() => { }} />
      </Section>
      <Section title='ChatBubble'>
        <ChatBubble variant="ai" message="입력하신 정보를 확인했어요. 여행 계획에 더 참고해야 할 만한 사항이 있나요? 없다면 바로 일정을 생성할게요." timestamp="10:30" />
        <ChatBubble variant="user" message="없어. 일정 생성해줘" timestamp="10:30" />
      </Section>
      <Section title='ChatSendButton'>
        <ChatSendButton onPress={() => { }} />
        <ChatSendButton disabled onPress={() => { }} />
      </Section>
      <Section title='CurrentScheduleCard'>
        <CurrentScheduleCard
          title="명지대학교 자연캠퍼스"
          startTime="12:30"
          endTime="14:00"
          location="경기도 용인시 처인구 명지로 116"
          lat={37.2219}
          lng={127.1888}
        />
      </Section>
      <Section title='DayScheduleItem'>
        <DayScheduleItem
          title="경복궁 관람"
          startTime="10:00"
          endTime="12:00"
          location="서울특별시 종로구 사직로 161"
          memo="무료 입장 가능, 한복 착용 시 입장 무료"
          status={schedule1Status}
          onToggle={() => setSchedule1Status(s => s === 'upcoming' ? 'completed' : 'upcoming')}
        />
        <DayScheduleItem
          title="광화문 광장"
          startTime="13:00"
          endTime="14:30"
          location="서울특별시 종로구 세종대로 172"
          status={schedule2Status}
          onToggle={() => setSchedule2Status(s => s === 'upcoming' ? 'completed' : 'upcoming')}
        />
      </Section>
      <Section title='CheckButton'>
        <CheckButton checked={false} onToggle={() => { }} />
        <CheckButton checked={checkButtonChecked} onToggle={() => setCheckButtonChecked(v => !v)} />
      </Section>
      <Section title='BookedByBadge'>
        <BookedByBadge bookedBy="ai" />
        <BookedByBadge bookedBy="user" />
      </Section>
      <Section title='Alert'>
        <Pressable style={[styles.devLink, { backgroundColor: colors.danger }]} onPress={() => setAlertChatDeleteVisible(true)}>
          <Text style={[styles.devLinkText, { color: colors.cardBg }]}>채팅 삭제 Alert 열기</Text>
        </Pressable>
        <Alert
          visible={alertChatDeleteVisible}
          {...AlertMessages.deleteChat}
          onConfirm={() => setAlertChatDeleteVisible(false)}
          onCancel={() => setAlertChatDeleteVisible(false)}
        />
        <Pressable style={[styles.devLink, { backgroundColor: colors.danger }]} onPress={() => setAlertDeleteAccountVisible(true)}>
          <Text style={[styles.devLinkText, { color: colors.cardBg }]}>회원 탈퇴 Alert 열기</Text>
        </Pressable>
        <Alert
          visible={alertDeleteAccountVisible}
          {...AlertMessages.deleteAccount}
          onConfirm={() => setAlertDeleteAccountVisible(false)}
          onCancel={() => setAlertDeleteAccountVisible(false)}
        />
        <Pressable style={[styles.devLink, { backgroundColor: colors.danger }]} onPress={() => setAlertLogoutVisible(true)}>
          <Text style={[styles.devLinkText, { color: colors.cardBg }]}>로그아웃 Alert 열기</Text>
        </Pressable>
        <Alert
          visible={alertLogoutVisible}
          {...AlertMessages.logout}
          onConfirm={() => setAlertLogoutVisible(false)}
          onCancel={() => setAlertLogoutVisible(false)}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography['heading-sm'],
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  sectionContent: {
    gap: 8,
  },
  devLink: {
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  devLinkText: {
    ...Typography['body-md'],
    fontWeight: '600',
  },
});
