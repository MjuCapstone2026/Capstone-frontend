import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { ReservationStatusFilter } from '@/components/ReservationStatusFilter';
import { ReservationTypeTab } from '@/components/ReservationTypeTab';
import { TravelListTabBar } from '@/components/TravelListTabBar';
import { TravelPlanCard } from '@/components/TravelPlanCard';
import { TypeMessageWindow } from '@/components/TypeMessageWindow';
import { ReservationStatusBadge } from '@/components/ui/ReservationStatusBadge';
import { ScheduleStatusBadge } from '@/components/ui/ScheduleStatusBadge';
import { StatusToggle } from '@/components/ui/StatusToggle';
import { TripInfoBottomSheet } from '@/components/ui/TripInfoBottomSheet';

const API_TEST_RESULTS = [
  {
    name: 'api/chatMessages.ts',
    status: 'PASS',
    detail: 'Strict TypeScript check passed for chat message API and SSE stream types.',
  },
  {
    name: 'api/chatRooms.ts',
    status: 'PASS',
    detail: 'Strict TypeScript check passed for chat room list, detail, create, delete, and rename APIs.',
  },
  {
    name: 'Project checks',
    status: 'BLOCKED',
    detail: 'Full tsc is blocked by app/dev_gallery.tsx route typing. Expo lint is blocked by .expo/cache/eslint mkdir EPERM.',
  },
] as const;

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

export default function BlueDev1Screen() {
  const { colors } = useTheme();
  const [statusFilterSelected, setStatusFilterSelected] = useState<'all' | 'confirmed' | 'changed' | 'cancelled'>('all');
  const [typeTabSelected, setTypeTabSelected] = useState<'all' | 'flight' | 'accommodation'>('all');
  const [travelListTab, setTravelListTab] = useState<'itinerary' | 'reservation'>('itinerary');
  const [travelPlanStatus, setTravelPlanStatus] = useState<'upcoming' | 'completed'>('upcoming');
  const [toggleStatus, setToggleStatus] = useState<'draft' | 'completed'>('draft');
  const [tripSheetVisible, setTripSheetVisible] = useState(false);
  const [tripSheetMode, setTripSheetMode] = useState<'create' | 'edit'>('create');

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Section title='API Test Results'>
        <View style={[styles.resultPanel, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}>
          {API_TEST_RESULTS.map((result) => {
            const isPass = result.status === 'PASS';
            const statusColor = isPass ? colors.success : colors.warning;
            const statusBg = isPass ? colors.successBg : colors.warningBg;

            return (
              <View key={result.name} style={[styles.resultRow, { borderBottomColor: colors.divider }]}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.resultName, { color: colors.textTitle }]}>{result.name}</Text>
                  <Text style={[styles.resultStatus, { backgroundColor: statusBg, color: statusColor }]}>
                    {result.status}
                  </Text>
                </View>
                <Text style={[styles.resultDetail, { color: colors.textSub }]}>{result.detail}</Text>
              </View>
            );
          })}
        </View>
      </Section>

      <Section title='TripInfoBottomSheet'>
        <View style={{ gap: 8, flexDirection: 'row' }}>
          <StatusToggle
            status='draft'
            onToggle={() => {
              setTripSheetMode('create');
              setTripSheetVisible(true);
            }}
          />
          <StatusToggle
            status='completed'
            onToggle={() => {
              setTripSheetMode('edit');
              setTripSheetVisible(true);
            }}
          />
        </View>
        <TripInfoBottomSheet
          visible={tripSheetVisible}
          mode={tripSheetMode}
          onSubmit={(info) => {
            console.log('submitted:', info);
            setTripSheetVisible(false);
          }}
          onClose={() => setTripSheetVisible(false)}
        />
      </Section>

      <Section title='StatusToggle'>
        <StatusToggle
          status={toggleStatus}
          onToggle={() => setToggleStatus((status) => (status === 'draft' ? 'completed' : 'draft'))}
        />
      </Section>

      <Section title='ReservationStatusBadge'>
        <View style={styles.badgePreviewBg}>
          <ReservationStatusBadge status='confirmed' />
          <ReservationStatusBadge status='changed' />
          <ReservationStatusBadge status='cancelled' />
        </View>
      </Section>

      <Section title='ScheduleStatusBadge'>
        <View style={styles.badgePreviewBg}>
          <ScheduleStatusBadge status='draft' />
          <ScheduleStatusBadge status='completed' />
        </View>
      </Section>

      <Section title='TypeMessageWindow'>
        <TypeMessageWindow onSend={(message) => console.log('sent:', message)} />
      </Section>

      <Section title='TravelPlanCard'>
        <TravelPlanCard
          title='Jeju 3 nights 4 days trip'
          startDate='2026.04.10'
          destination='Jeju'
          duration='3 nights 4 days'
          status={travelPlanStatus}
          onPress={() => {}}
          onStatusToggle={() => setTravelPlanStatus((status) => (status === 'upcoming' ? 'completed' : 'upcoming'))}
        />
      </Section>

      <Section title='TravelListTabBar'>
        <TravelListTabBar tab={travelListTab} onTabChange={setTravelListTab} />
      </Section>

      <Section title='ReservationStatusFilter'>
        <ReservationStatusFilter selected={statusFilterSelected} onSelect={setStatusFilterSelected} />
      </Section>

      <Section title='ReservationTypeTab'>
        <ReservationTypeTab selected={typeTabSelected} onSelect={setTypeTabSelected} />
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
  resultPanel: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resultRow: {
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  resultName: {
    ...Typography['body-md'],
    flex: 1,
    fontWeight: '600',
  },
  resultStatus: {
    ...Typography['label'],
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  resultDetail: {
    ...Typography['caption'],
  },
  badgePreviewBg: {
    backgroundColor: '#4A4A4A',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
});
