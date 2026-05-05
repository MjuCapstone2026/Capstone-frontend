import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { ReservationStatusFilter } from '@/components/ReservationStatusFilter';
import { ReservationTypeTab } from '@/components/ReservationTypeTab';

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

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
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
