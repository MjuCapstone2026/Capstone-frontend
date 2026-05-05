import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { ReservationStatusFilter } from '@/components/ReservationStatusFilter';

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

function ReservationStatusFilterDemo() {
  const [selected, setSelected] = useState<'all' | 'confirmed' | 'changed' | 'cancelled'>('all');
  return <ReservationStatusFilter selected={selected} onSelect={setSelected} />;
}

export default function BlueDev1Screen() {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Section title='ReservationStatusFilter'>
        <ReservationStatusFilterDemo />
      </Section>
      <Section title='각 컴포넌트 이름'>
        {/* 여기에 컴포넌트 추가 */}
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
