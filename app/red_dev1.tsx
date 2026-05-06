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
import { useApi } from '@/hooks/useApi';
import { getReservations, createReservation, updateReservation, deleteReservation } from '@/api/reservations';
import Toast from 'react-native-toast-message';
import { getErrorMessage } from '@/utils/getErrorMessage';

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
  const { authRequest } = useApi();
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

      <Section title='Reservations API'>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]} onPress={async () => {
          try {
            // type: 'flight' | 'accommodation' / status: 'confirmed' | 'changed' | 'cancelled' 로 변경 가능
            const data = await authRequest((token) => getReservations(token, { status: 'cancelled' }));
            console.log('[GET] reservations:', data);
          } catch (e) {
            console.error('[GET] reservations error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>GET /reservations</Text>
        </Pressable>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]} onPress={async () => {
          try {
            // itineraryId: 본인 일정 ID로 교체
            const data = await authRequest((token) => createReservation(token, {
              itineraryId: '1bd530c9-15ac-436c-860a-dea361266ef8',
              type: 'flight',
              bookedBy: 'ai',
              bookingUrl: 'https://booking.example.com/flight/123',
              externalRefId: 'KE12345678',
              detail: {
                airline: '대한항공',
                flight_no: 'KE123',
                departure: { airport: 'ICN', datetime: '2026-05-01T09:00:00' },
                arrival: { airport: 'NRT', datetime: '2026-05-01T11:30:00' },
                seat_class: 'economy',
                passengers: [{ name: '홍길동', passport: 'M12345678' }],
              },
              totalPrice: 320000,
              currency: 'KRW',
              reservedAt: '2026-04-03T21:20:00+09:00',
            }));
            console.log('[POST] createReservation (flight):', data);
          } catch (e) {
            console.error('[POST] createReservation (flight) error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>POST /reservations (flight)</Text>
        </Pressable>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]} onPress={async () => {
          try {
            // itineraryId: 본인 일정 ID로 교체
            const data = await authRequest((token) => createReservation(token, {
              itineraryId: '1bd530c9-15ac-436c-860a-dea361266ef8',
              type: 'accommodation',
              bookedBy: 'user',
              externalRefId: 'LOTTE-20260501',
              detail: {
                hotel_name: '롯데호텔 도쿄',
                room_type: '디럭스 더블',
                check_in: '2026-05-01',
                check_out: '2026-05-03',
                guests: 2,
              },
              totalPrice: 180000,
              currency: 'KRW',
              reservedAt: '2026-04-03T21:20:00+09:00',
            }));
            console.log('[POST] createReservation (accommodation):', data);
          } catch (e) {
            console.error('[POST] createReservation (accommodation) error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>POST /reservations (accommodation)</Text>
        </Pressable>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]} onPress={async () => {
          try {
            // reservationId: GET으로 조회한 본인 예약 ID로 교체
            const data = await authRequest((token) => updateReservation(token, '886f8962-bdbb-438a-9d8b-40200cd1666b', {
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
            }));
            console.log('[PATCH] updateReservation (cancelled):', data);
          } catch (e) {
            console.error('[PATCH] updateReservation (cancelled) error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>PATCH /reservations/:id (cancelled)</Text>
        </Pressable>
        <Pressable style={[styles.devLink, { backgroundColor: colors.primary }]} onPress={async () => {
          try {
            // reservationId: GET으로 조회한 본인 예약 ID로 교체
            const data = await authRequest((token) => updateReservation(token, '886f8962-bdbb-438a-9d8b-40200cd1666b', {
              status: 'changed',
              detail: {
                airline: '아시아나',
                flight_no: 'OZ108',
                departure: { airport: 'ICN', datetime: '2026-05-02T09:00:00' },
                arrival: { airport: 'NRT', datetime: '2026-05-02T11:30:00' },
                seat_class: 'economy',
                passengers: [{ name: '홍길동', passport: 'M12345678' }],
              },
              totalPrice: 290000,
              currency: 'KRW',
              reservedAt: '2026-04-10T10:00:00+09:00',
            }));
            console.log('[PATCH] updateReservation (changed):', data);
          } catch (e) {
            console.error('[PATCH] updateReservation (changed) error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>PATCH /reservations/:id (changed)</Text>
        </Pressable>
        <Pressable style={[styles.devLink, { backgroundColor: colors.danger }]} onPress={async () => {
          try {
            // reservationId: GET으로 조회한 본인 예약 ID로 교체
            const data = await authRequest((token) => deleteReservation(token, 'cdb640e7-c673-4fc9-8545-0e2d3149da26'));
            console.log('[DELETE] deleteReservation:', data);
          } catch (e) {
            console.error('[DELETE] deleteReservation error:', e);
            Toast.show({ type: 'error', text1: getErrorMessage(e) });
          }
        }}>
          <Text style={[styles.devLinkText, { color: colors.textTitle }]}>DELETE /reservations/:id</Text>
        </Pressable>
      </Section>

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
