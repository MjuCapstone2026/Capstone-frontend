import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcBack from '@/assets/icons/ic_back.svg';

type Props = {
  title: string;
  date: string;
  location: string;
  dayCount: number;
  selectedDay: number;
  onDayPress: (day: number) => void;
  onBack: () => void;
  onCancel: () => void;
  onComplete: () => void;
};

export function ItineraryOverviewCard2Editing({
  title,
  date,
  location,
  dayCount,
  selectedDay,
  onDayPress,
  onBack,
  onCancel,
  onComplete,
}: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showDayLeftFade, setShowDayLeftFade] = useState(false);
  const [showDayRightFade, setShowDayRightFade] = useState(true);

  const activeTabText = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: 6 + insets.top,
          backgroundColor: colors.cardBg,
          borderBottomColor: colors.divider,
        },
        Elevation[scheme][2],
      ]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.textButton} hitSlop={8}>
          {({ pressed }) => (
            <>
              <IcBack width={20} height={20} color={colors.primary} />
              <Text style={[styles.buttonText, { color: colors.primary }]}>뒤로가기</Text>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>
        <View style={styles.actionButtons}>
          <Pressable onPress={onCancel} style={styles.textButton} hitSlop={8}>
            {({ pressed }) => (
              <>
                <Text style={[styles.buttonText, { color: colors.danger }]}>취소</Text>
                {pressed && (
                  <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>
          <Pressable onPress={onComplete} style={styles.textButton} hitSlop={8}>
            {({ pressed }) => (
              <>
                <Text style={[styles.buttonText, { color: colors.primary }]}>완료</Text>
                {pressed && (
                  <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textTitle }]} numberOfLines={1}>
        {title}
      </Text>

      {/* Date / location */}
      <Text style={[styles.subtitle, { color: colors.textCaption }]}>
        {date} • {location}
      </Text>

      {/* Day tabs */}
      <View style={[styles.sectionDivider, { backgroundColor: colors.divider }]} />
      <View style={styles.tabScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
            setShowDayLeftFade(contentOffset.x > 0);
            setShowDayRightFade(contentOffset.x + layoutMeasurement.width < contentSize.width - 1);
          }}
        >
          {Array.from({ length: dayCount }, (_, i) => i + 1).map(day => {
            const isActive = day === selectedDay;
            return (
              <Pressable
                key={day}
                onPress={() => onDayPress(day)}
                style={[
                  styles.tab,
                  { backgroundColor: isActive ? colors.primary : colors.secondarySurface },
                ]}
              >
                {({ pressed }) => (
                  <>
                    <Text style={[styles.tabText, { color: isActive ? activeTabText : colors.textDisabled }]}>
                      Day {day}
                    </Text>
                    {pressed && (
                      <View style={[StyleSheet.absoluteFill, styles.tabOverlay, { backgroundColor: colors.pressOverlay }]} />
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
        {showDayLeftFade && (
          <LinearGradient
            colors={[colors.cardBg, colors.cardBg + '00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tabFadeLeft}
            pointerEvents="none"
          />
        )}
        {showDayRightFade && (
          <LinearGradient
            colors={[colors.cardBg + '00', colors.cardBg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tabFadeRight}
            pointerEvents="none"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  buttonText: {
    ...Typography['body-lg'],
  },
  buttonOverlay: {
    borderRadius: BorderRadius.sm,
  },
  title: {
    ...Typography['heading-xl'],
    paddingHorizontal: 16,
    marginTop: 12,
  },
  subtitle: {
    ...Typography['body-lg'],
    paddingHorizontal: 16,
  },
  sectionDivider: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabScrollWrapper: {
    position: 'relative',
    paddingVertical: 8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  tab: {
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  tabText: {
    ...Typography['body-lg'],
  },
  tabOverlay: {
    borderRadius: BorderRadius.md,
  },
  tabFadeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 28,
  },
  tabFadeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 28,
  },
});
