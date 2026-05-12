import { ScrollView, StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';
import {
  getItineraries,
  getItinerary,
  updateItinerary,
  updateDayPlans,
  updateItemStatus,
  getItineraryLogs,
  updateItineraryStatus,
} from '@/api/itineraries';
import { QuickMenu } from '@/components/QuickMenu';
import { RecentChatSection } from '@/components/RecentChatSection';
import { RecentTravelSection } from '@/components/RecentTravelSection';
import { RenameChatModal } from '@/components/RenameChatModal';
import { ReservationCard } from '@/components/ReservationCard';
import { NavigationDrawer } from '@/components/ui/NavigationDrawer';
import { OverflowMenu } from '@/components/ui/OverflowMenu';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

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

function LogBox({ log }: { log: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.logBox, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}>
      <Text style={[styles.logText, { color: colors.textTitle }]} selectable>
        {log || '—'}
      </Text>
    </View>
  );
}

function TogglePair<T extends string>({ options, value, onChange }: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.toggleRow}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[
            styles.toggleButton,
            { backgroundColor: value === opt ? colors.primary : colors.cardBg, borderColor: colors.primary },
          ]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.toggleText, { color: value === opt ? colors.cardBg : colors.primary }]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const SAMPLE_CHATS = [
  { id: 1, title: '제주도 3박 4일 여행 계획', aiSummary: '렌트카 포함 일정 생성 완료', updatedAt: '방금 전' },
  { id: 2, title: '부산 당일치기', aiSummary: '해운대 → 광안리 → 국제시장 코스 추천', updatedAt: '어제' },
];

const SAMPLE_TRAVELS = [
  { id: 1, title: '제주도 3박 4일', dateRange: '2025.06.10 ~ 2025.06.13', status: 'upcoming' as const },
  { id: 2, title: '부산 당일치기', dateRange: '2025.04.20', status: 'completed' as const },
];

export default function YellowDev1Screen() {
  const { colors } = useTheme();
  const { authRequest } = useApi();

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [overflowMenuVisible, setOverflowMenuVisible] = useState(false);

  const [itineraryId, setItineraryId] = useState('');
  const [itemDate, setItemDate] = useState('2026-05-01');
  const [itemIndex, setItemIndex] = useState('0');
  const [itemStatus, setItemStatus] = useState<'todo' | 'done'>('done');
  const [itineraryStatus, setItineraryStatus] = useState<'draft' | 'completed'>('completed');
  const [log1, setLog1] = useState('');
  const [log2, setLog2] = useState('');
  const [log3, setLog3] = useState('');
  const [log4, setLog4] = useState('');
  const [log5, setLog5] = useState('');
  const [log6, setLog6] = useState('');
  const [log7, setLog7] = useState('');

  const call = async (fn: () => Promise<unknown>, setLog: (s: string) => void) => {
    setLog('로딩 중...');
    try {
      const data = await fn();
      setLog(JSON.stringify(data, null, 2));
    } catch (e) {
      setLog(`❌ ${String(e)}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>

      <Section title="QuickMenu">
        <QuickMenu
          onChatPress={() => {}}
          onPlanPress={() => {}}
        />
      </Section>

      <Section title="RecentChatSection">
        <RecentChatSection
          chats={SAMPLE_CHATS}
          onChatPress={() => {}}
          onMorePress={() => {}}
        />
      </Section>

      <Section title="RecentTravelSection">
        <RecentTravelSection
          travels={SAMPLE_TRAVELS}
          onTravelPress={() => {}}
          onMorePress={() => {}}
        />
      </Section>

      <Section title="RenameChatModal">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setRenameModalVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>RenameChatModal 열기</Text>
        </Pressable>
        <RenameChatModal
          visible={renameModalVisible}
          initialName="제주도 3박 4일 여행 계획"
          onSave={() => setRenameModalVisible(false)}
          onCancel={() => setRenameModalVisible(false)}
        />
      </Section>

      <Section title="ReservationCard — 렌트카 (확정)">
        <ReservationCard
          type="car"
          vendor="롯데렌터카"
          carModel="쏘나타 (준중형)"
          pickupDateTime="2025.06.10 (화) 10:00"
          pickupLocation="제주국제공항"
          dropoffDateTime="2025.06.13 (금) 18:00"
          dropoffLocation="제주국제공항"
          price="₩ 210,000"
          bookedBy="ai"
          reservationNumber="RC-20250610-001"
          reservationDate="2025.05.20"
          status="confirmed"
        />
      </Section>

      <Section title="ReservationCard — 렌트카 (취소)">
        <ReservationCard
          type="car"
          vendor="제주렌트카"
          carModel="아반떼 (소형)"
          pickupDateTime="2025.04.20 (일) 09:00"
          pickupLocation="제주국제공항"
          dropoffDateTime="2025.04.20 (일) 20:00"
          dropoffLocation="제주국제공항"
          price="₩ 85,000"
          bookedBy="user"
          reservationNumber="RC-20250420-002"
          reservationDate="2025.03.15"
          status="cancelled"
        />
      </Section>

      <Section title="ReservationCard — 항공편 (확정)">
        <ReservationCard
          type="flight"
          departureCode="ICN"
          arrivalCode="NRT"
          flightNumber="KE721"
          duration="2시간 30분"
          departureTime="09:00"
          arrivalTime="11:30"
          date="2026년 5월 1일"
          airline="Korean Air"
          price="₩ 320,000"
          bookedBy="user"
          reservationNumber="KE12345678"
          reservationDate="2026.04.03"
          status="confirmed"
        />
      </Section>

      <Section title="ReservationCard — 숙소 (변경)">
        <ReservationCard
          type="lodging"
          hotelName="신주쿠 그랜드호텔"
          checkInDate="2026.05.01"
          checkOutDate="2026.05.03"
          roomType="디럭스 더블"
          guests={2}
          price="₩ 240,000"
          bookedBy="ai"
          reservationNumber="HT98765432"
          reservationDate="2026.04.03"
          status="changed"
        />
      </Section>

      <Section title="NavigationDrawer">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setDrawerVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>NavigationDrawer 열기</Text>
        </Pressable>
        <NavigationDrawer
          visible={drawerVisible}
          chats={[
            { id: 1, title: '제주도 3박 4일 여행 계획' },
            { id: 2, title: '부산 당일치기' },
            { id: 3, title: '강릉 1박 2일 카페 투어' },
            { id: 4, title: '경주 역사 여행' },
          ]}
          activeChatId={1}
          onClose={() => setDrawerVisible(false)}
          onNewChat={() => setDrawerVisible(false)}
          onChatPress={() => setDrawerVisible(false)}
          onChatRename={() => setDrawerVisible(false)}
          onChatEditInfo={() => setDrawerVisible(false)}
          onChatViewPlan={() => setDrawerVisible(false)}
          onChatDelete={() => setDrawerVisible(false)}
        />
      </Section>

      <Section title="OverflowMenu">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setOverflowMenuVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>OverflowMenu 열기</Text>
        </Pressable>
        <OverflowMenu
          visible={overflowMenuVisible}
          position={{ top: 120, right: 16 }}
          onClose={() => setOverflowMenuVisible(false)}
          onRename={() => setOverflowMenuVisible(false)}
          onEditInfo={() => setOverflowMenuVisible(false)}
          onViewPlan={() => setOverflowMenuVisible(false)}
          onDelete={() => setOverflowMenuVisible(false)}
        />
      </Section>

      <Section title="PrimaryButton">
        <PrimaryButton label="채팅방 생성하기" onPress={() => {}} />
        <PrimaryButton label="수정하기 (비활성)" onPress={() => {}} disabled />
      </Section>

      {/* ── Itineraries API 테스트 ── */}

      <Section title="[API] 공통 입력">
        <Text style={[styles.label, { color: colors.textTitle }]}>itineraryId (UUID)</Text>
        <TextInput
          style={[styles.apiInput, { borderColor: colors.divider, color: colors.textTitle, backgroundColor: colors.cardBg }]}
          value={itineraryId}
          onChangeText={setItineraryId}
          placeholder="예: aaa-111"
          placeholderTextColor={colors.textDisabled}
          autoCapitalize="none"
        />
      </Section>

      <Section title="[API 1] GET /itineraries">
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest(getItineraries), setLog1)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>getItineraries 호출</Text>
        </Pressable>
        <LogBox log={log1} />
      </Section>

      <Section title="[API 2] GET /itineraries/{itineraryId}">
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) => getItinerary(token, itineraryId)), setLog2)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>getItinerary 호출</Text>
        </Pressable>
        <LogBox log={log2} />
      </Section>

      <Section title="[API 3] PATCH /itineraries/{itineraryId}">
        <Text style={[styles.hint, { color: colors.textDisabled }]}>테스트값: adultCount=2, childCount=0, childAges=[]</Text>
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) =>
            updateItinerary(token, itineraryId, { adultCount: 2, childCount: 0, childAges: [] })), setLog3)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>updateItinerary 호출</Text>
        </Pressable>
        <LogBox log={log3} />
      </Section>

      <Section title="[API 4] PATCH /itineraries/{itineraryId}/day-plans">
        <Text style={[styles.hint, { color: colors.textDisabled }]}>테스트값: 2026-05-01 / 테스트 일정 09:00~11:00</Text>
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) =>
            updateDayPlans(token, itineraryId, {
              dayPlans: {
                '2026-05-01': [
                  { plan_name: '테스트 일정', time: '09:00 ~ 11:00', place: '테스트 장소', note: '테스트 메모' },
                ],
              },
            })), setLog4)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>updateDayPlans 호출</Text>
        </Pressable>
        <LogBox log={log4} />
      </Section>

      <Section title="[API 5] PATCH /itineraries/{itineraryId}/items/status">
        <View style={styles.twoCol}>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: colors.textTitle }]}>date</Text>
            <TextInput
              style={[styles.apiInput, { borderColor: colors.divider, color: colors.textTitle, backgroundColor: colors.cardBg }]}
              value={itemDate}
              onChangeText={setItemDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textDisabled}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: colors.textTitle }]}>index</Text>
            <TextInput
              style={[styles.apiInput, { borderColor: colors.divider, color: colors.textTitle, backgroundColor: colors.cardBg }]}
              value={itemIndex}
              onChangeText={setItemIndex}
              keyboardType="numeric"
              placeholderTextColor={colors.textDisabled}
            />
          </View>
        </View>
        <Text style={[styles.label, { color: colors.textTitle }]}>status</Text>
        <TogglePair options={['todo', 'done'] as const} value={itemStatus} onChange={setItemStatus} />
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) =>
            updateItemStatus(token, itineraryId, { date: itemDate, index: Number(itemIndex), status: itemStatus })), setLog5)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>updateItemStatus 호출</Text>
        </Pressable>
        <LogBox log={log5} />
      </Section>

      <Section title="[API 6] GET /itineraries/{itineraryId}/logs">
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) => getItineraryLogs(token, itineraryId)), setLog6)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>getItineraryLogs 호출</Text>
        </Pressable>
        <LogBox log={log6} />
      </Section>

      <Section title="[API 7] PATCH /itineraries/{itineraryId}/status">
        <Text style={[styles.label, { color: colors.textTitle }]}>status</Text>
        <TogglePair options={['draft', 'completed'] as const} value={itineraryStatus} onChange={setItineraryStatus} />
        <Pressable style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => call(() => authRequest((token) =>
            updateItineraryStatus(token, itineraryId, { status: itineraryStatus })), setLog7)}>
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>updateItineraryStatus 호출</Text>
        </Pressable>
        <LogBox log={log7} />
      </Section>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
  openButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  openButtonText: {
    ...Typography['body-md'],
    fontWeight: '600',
  },
  logBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 48,
  },
  logText: {
    ...Typography['body-sm'],
    fontFamily: 'monospace',
  },
  apiInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...Typography['body-md'],
  },
  label: {
    ...Typography['body-sm'],
  },
  hint: {
    ...Typography['body-sm'],
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleText: {
    ...Typography['body-sm'],
    fontWeight: '600',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
});
