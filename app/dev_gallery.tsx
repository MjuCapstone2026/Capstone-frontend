import { ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

const ENTRIES = [
  { href: '/red_dev1', label: 'Red — Components 1' },
  { href: '/red_dev2', label: 'Red — Components 2 (SafeArea)' },
  { href: '/blue_dev1', label: 'Blue — Components 1' },
  { href: '/yellow_dev1', label: 'Yellow — Components 1' },
] as const;

export default function DevGallery() {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>Dev Gallery</Text>
      {ENTRIES.map(({ href, label }) => (
        <Link key={href} href={href} asChild>
          <Pressable style={[styles.button, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}>
            {({ pressed }) => (
              <Text style={[styles.buttonText, { color: colors.textTitle, opacity: pressed ? 0.6 : 1 }]}>
                {label}
              </Text>
            )}
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    ...Typography['heading-lg'],
    marginBottom: 8,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    ...Typography['body-md'],
    fontWeight: '600',
  },
});
