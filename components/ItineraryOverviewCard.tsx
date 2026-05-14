import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type DayTab = {
  label: string;
  date: string;
  dayOfWeek: string;
};

type Props = {
  title: string;
  days: DayTab[];
  activeDay: number;
  onDayPress: (index: number) => void;
  completedCount: number;
  totalCount: number;
};

export function ItineraryOverviewCard({
  title,
  days,
  activeDay,
  onDayPress,
  completedCount,
  totalCount,
}: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const bgColor = scheme === 'dark' ? colors.primary : colors.primaryLight;
  const contentColor = scheme === 'dark' ? colors.textTitle : colors.cardBg;
  const inactiveTabBg = scheme === 'dark' ? colors.primaryActive : colors.primary;
  const progressPct = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={[styles.card, { backgroundColor: bgColor, paddingTop: 24 + insets.top }, Elevation[scheme][1]]}>
      <Text style={[styles.title, { color: contentColor }]}>
        {title}
      </Text>

      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
            setShowLeftFade(contentOffset.x > 0);
            setShowRightFade(contentOffset.x + layoutMeasurement.width < contentSize.width - 1);
          }}
        >
          {days.map((day, index) => {
            const isActive = index === activeDay;
            const tabBg = isActive ? colors.cardBg : inactiveTabBg;
            const textColor = isActive ? colors.textTitle : colors.textDisabled;
            return (
              <Pressable
                key={index}
                onPress={() => onDayPress(index)}
                style={[styles.tab, { backgroundColor: tabBg }]}
              >
                {({ pressed }) => (
                  <>
                    <Text style={[styles.tabLabel, { color: textColor }]}>{day.label}</Text>
                    <Text style={[styles.tabDate, { color: textColor }]}>
                      {day.date} ({day.dayOfWeek})
                    </Text>
                    {pressed && (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          styles.tabOverlay,
                          { backgroundColor: colors.pressOverlay },
                        ]}
                      />
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
        {showLeftFade && (
          <LinearGradient
            colors={[bgColor, bgColor + '00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fadeLeft}
            pointerEvents="none"
          />
        )}
        {showRightFade && (
          <LinearGradient
            colors={[bgColor + '00', bgColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fadeRight}
            pointerEvents="none"
          />
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: contentColor }]}>진행 상황</Text>
          <Text style={[styles.progressLabel, { color: contentColor }]}>
            {completedCount} / {totalCount}
          </Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPct * 100}%` as unknown as number, backgroundColor: contentColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    ...Typography['heading-lg'],
    paddingHorizontal: 16,
  },
  tabContainer: {
    position: 'relative',
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 28,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  tab: {
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  tabLabel: {
    ...Typography['body-md'],
  },
  tabDate: {
    ...Typography['caption'],
  },
  tabOverlay: {
    borderRadius: BorderRadius.md,
  },
  progressSection: {
    gap: 6,
    paddingHorizontal: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...Typography['body-md'],
  },
  progressBg: {
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
