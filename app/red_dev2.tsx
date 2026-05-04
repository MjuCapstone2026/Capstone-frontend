import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '@/hooks/useTheme';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import { Typography } from '@/constants/theme';
import { ChatHeader } from '@/components/ChatHeader';
import { Header } from '@/components/ui/Header';
import { ItineraryOverviewCard2BeforeEdit } from '@/components/ItineraryOverviewCard2BeforeEdit';
import { ItineraryOverviewCard2Editing } from '@/components/ItineraryOverviewCard2Editing';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { PlanDetailItem } from '@/components/PlanDetailItem';
import { PlanDetailEditItem, ScheduleItem } from '@/components/PlanDetailEditItem';

const SCREEN_HORIZONTAL_PADDING = 20;

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

const INITIAL_ITEMS: ScheduleItem[] = [
  {
    type: 'reservation',
    id: 'r1',
    startTime: '08:00',
    endTime: '09:30',
    title: '도쿄행 항공권',
    reservationType: 'flight',
    detail: {
      airline: '대한항공',
      flight_no: 'KE721',
      departure: { airport: 'ICN' },
      arrival: { airport: 'NRT' },
    },
    totalPrice: 320000,
    currency: 'KRW',
    bookingUrl: 'https://github.com/MjuCapstone2026/Capstone-frontend/issues',
  },
  {
    type: 'reservation',
    id: 'r2',
    startTime: '13:00',
    endTime: '13:30',
    title: '호텔 체크인',
    reservationType: 'hotel',
    detail: {
      hotel_name: '롯데호텔 도쿄',
      room_type: '디럭스 더블',
      guests: 2,
    },
    totalPrice: 480000,
    currency: 'KRW',
    bookingUrl: 'https://github.com/MjuCapstone2026/Capstone-frontend/issues',
  },
  {
    type: 'reservation',
    id: 'r3',
    startTime: '14:00',
    endTime: '14:30',
    title: '렌트카 픽업',
    reservationType: 'rental_car',
    detail: {
      company: 'Hertz',
      car_model: 'Toyota Camry',
      pickup: { location: 'NRT T1' },
    },
    totalPrice: 210000,
    currency: 'KRW',
  },
  {
    type: 'editable',
    id: 'e1',
    startTime: '15:00',
    endTime: '15:30',
    title: '점심 식사',
    memo: '타코야끼',
    location: '도쿄 어딘가',
    price: 15000,
  },
  {
    type: 'editable',
    id: 'e2',
    startTime: '17:00',
    endTime: '18:00',
    title: '신사 가기',
    location: '도쿄 어딘가',
  },
];

export default function RedDev2Screen() {
  return (
    <SafeAreaProvider>
      <RedDev2Content />
    </SafeAreaProvider>
  );
}

function RedDev2Content() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(1);
  const [changeLogDate, setChangeLogDate] = useState<string | undefined>(undefined);
  const [editingDay, setEditingDay] = useState(1);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(INITIAL_ITEMS);

  const handleSave = (updated: ScheduleItem) => {
    setScheduleItems((prev) =>
      prev
        .map((i) => (i.id === updated.id ? updated : i))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  };

  const handleDelete = (id: string) => {
    setScheduleItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <View style={styles.keyboardAvoid}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: colors.pageBg,
            paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 20,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
          <Section title='Header'>
            <Header />
          </Section>
          <Section title='ItineraryOverviewCard2BeforeEdit'>
            <ItineraryOverviewCard2BeforeEdit
              title="제주도 3박 4일"
              date="2026-05-10"
              location="제주도"
              dayCount={7}
              selectedDay={selectedDay}
              onDayPress={setSelectedDay}
              onBack={() => { }}
              onEdit={() => { }}
              changeLogs={['2026-05-09', '2026-05-02', '2026-04-27', '2026-04-26']}
              changeLogDate={changeLogDate}
              onChangeLogPress={setChangeLogDate}
            />
          </Section>
          <Section title='ItineraryOverviewCard2Editing'>
            <ItineraryOverviewCard2Editing
              title="제주도 3박 4일"
              date="2026-05-10"
              location="제주도"
              dayCount={7}
              selectedDay={editingDay}
              onDayPress={setEditingDay}
              onBack={() => { }}
              onCancel={() => { }}
              onComplete={() => { }}
            />
          </Section>
          <Section title='PlanDetailEditItem'>
            {scheduleItems.map((item) => (
              <PlanDetailEditItem
                key={item.id}
                item={item}
                onSave={handleSave}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </Section>
          <Section title='PlanDetailItem'>
            <PlanDetailItem
              title="도쿄행 항공권"
              startTime="08:00"
              endTime="09:30"
              reservationType="flight"
              detail={{
                airline: '대한항공',
                flight_no: 'KE721',
                departure: { airport: 'ICN' },
                arrival: { airport: 'NRT' },
              }}
              totalPrice={320000}
              currency="KRW"
              bookingUrl="https://github.com/MjuCapstone2026/Capstone-frontend/issues"
              defaultOpen
            />
            <PlanDetailItem
              title="점심 식사"
              startTime="12:00"
              endTime="12:30"
              memo="타코야끼"
              location="도쿄 어딘가"
              price={15000}
            />
            <PlanDetailItem
              title="호텔 체크인"
              startTime="15:00"
              endTime="15:30"
              reservationType="hotel"
              detail={{
                hotel_name: '롯데호텔 도쿄',
                room_type: '디럭스 더블',
                guests: 2,
              }}
              totalPrice={480000}
              currency="KRW"
              showConnector={false}
            />
          </Section>
          <Section title='ChatHeader'>
            <ChatHeader variant="default" onDrawerOpen={() => { }} />
            <ChatHeader
              variant="active"
              title="제주도 3박 4일"
              onDrawerOpen={() => { }}
              onOverflowOpen={() => { }}
            />
          </Section>
      </KeyboardAwareScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
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
    paddingHorizontal: 10,
  },
  sectionContent: {
    gap: 8,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
});
