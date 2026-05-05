import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { ReservationStatusFilter } from '@/components/ReservationStatusFilter';
import { ReservationTypeTab } from '@/components/ReservationTypeTab';
import { TravelListTabBar } from '@/components/TravelListTabBar';
import { TravelPlanCard } from '@/components/TravelPlanCard';
import { TypeMessageWindow } from '@/components/TypeMessageWindow';

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
  const [typeTabSelected, setTypeTabSelected] = useState<'all' | 'flight' | 'accommodation' | 'car-rental'>('all');
  const [travelListTab, setTravelListTab] = useState<'itinerary' | 'reservation'>('itinerary');
  const [travelPlanStatus, setTravelPlanStatus] = useState<'upcoming' | 'completed'>('upcoming');

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Section title='TypeMessageWindow'>
        <TypeMessageWindow onSend={(message) => console.log('sent:', message)} />
      </Section>
      <Section title='TravelPlanCard'>
        <TravelPlanCard
          title="제주도 3박 4일 여행"
          startDate="2026.04.10"
          destination="제주도"
          duration="3박 4일"
          status={travelPlanStatus}
          onPress={() => {}}
          onStatusToggle={() => setTravelPlanStatus(s => s === 'upcoming' ? 'completed' : 'upcoming')}
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
});
