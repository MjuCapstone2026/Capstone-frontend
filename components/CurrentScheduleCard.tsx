import React from 'react';
import { StyleSheet, View, Text, Pressable, Linking } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcNavigation from '@/assets/icons/ic_navigation.svg';
import IcClock from '@/assets/icons/ic_clock.svg';
import IcPin from '@/assets/icons/ic_pin.svg';

type Props = {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  label?: string;
};

export function CurrentScheduleCard({ title, startTime, endTime, location, label = '현재 일정' }: Props) {
  const { colors, scheme } = useTheme();

  const surfaceColor = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  const openNavigation = () => {
    const encoded = encodeURIComponent(location);
    const kakaoUrl = `kakaomap://search?q=${encoded}`;
    const googleUrl = `https://maps.google.com/search/?q=${encoded}`;
    Linking.canOpenURL(kakaoUrl).then(supported => {
      Linking.openURL(supported ? kakaoUrl : googleUrl);
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }, Elevation[scheme][2]]}>
      <View style={styles.label}>
        <IcNavigation width={16} height={16} color={surfaceColor} />
        <Text style={[styles.labelText, { color: surfaceColor }]}>{label}</Text>
      </View>

      <Text style={[styles.title, { color: surfaceColor }]}>
        {title}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <IcClock width={14} height={14} color={surfaceColor} />
          <Text style={[styles.metaText, { color: surfaceColor }]}>
            {startTime} ~ {endTime}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <IcPin width={14} height={14} color={surfaceColor} />
          <Text style={[styles.metaText, { color: surfaceColor }]}>
            {location}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={openNavigation}
        android_ripple={{ color: colors.pressOverlay, borderless: false }}
        style={[styles.button, { backgroundColor: surfaceColor }, Elevation[scheme][2]]}
      >
        {({ pressed }) => (
          <>
            <Text style={[styles.buttonText, { color: colors.primary }]}>길 안내 시작</Text>
            {pressed && (
              <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    gap: 8,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    ...Typography['body-md'],
  },
  title: {
    ...Typography['heading-md'],
  },
  meta: {
    gap: 4,
  },
  metaRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    ...Typography['body-md'],
    flex: 1,
    flexShrink: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    ...Typography['body-lg'],
  },
  buttonOverlay: {
    borderRadius: BorderRadius.md,
  },
});
