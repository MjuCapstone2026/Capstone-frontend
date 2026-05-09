import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcBack from '@/assets/icons/ic_back.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

type Props = {
  title: string;
  date: string;
  location: string;
  dayCount: number;
  selectedDay: number;
  onDayPress: (day: number) => void;
  onBack: () => void;
  onEdit?: () => void;
  changeLogs?: { logId: string; date: string }[];
  onChangeLogPress?: (logId: string) => void;
  changeLogDate?: string;
  hidden?: boolean;
};

export function ItineraryOverviewCard2BeforeEdit({
  title,
  date,
  location,
  dayCount,
  selectedDay,
  onDayPress,
  onBack,
  onEdit,
  changeLogs = [],
  onChangeLogPress,
  changeLogDate,
  hidden = false,
}: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [showLogTopFade, setShowLogTopFade] = useState(false);
  const [showLogBottomFade, setShowLogBottomFade] = useState(true);
  const [showDayLeftFade, setShowDayLeftFade] = useState(false);
  const [showDayRightFade, setShowDayRightFade] = useState(true);
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const hiddenAnim = useRef(new Animated.Value(hidden ? 1 : 0)).current;
  const dayScrollRef = useRef<ScrollView>(null);
  const logScrollRef = useRef<ScrollView>(null);
  const dayScrollXRef = useRef(0);
  const logScrollYRef = useRef(0);

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(chevronAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsExpanded(v => !v);
    setShowDayLeftFade(dayScrollXRef.current > 0);
    setShowDayRightFade(true);
    setShowLogTopFade(logScrollYRef.current > 0);
    setShowLogBottomFade(true);
  };

  useEffect(() => {
    if (!isExpanded && dayScrollXRef.current > 0) {
      const t = setTimeout(() => {
        dayScrollRef.current?.scrollTo({ x: dayScrollXRef.current, animated: false });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && logScrollYRef.current > 0) {
      const t = setTimeout(() => {
        logScrollRef.current?.scrollTo({ y: logScrollYRef.current, animated: false });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const showEdit = !!onEdit && !isExpanded && !changeLogDate;
  const activeTabText = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  useEffect(() => {
    Animated.timing(hiddenAnim, {
      toValue: hidden ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [hidden, hiddenAnim]);

  const headerAnimatedStyle = {
    marginBottom: hiddenAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -measuredHeight],
    }),
    opacity: hiddenAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: hiddenAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -measuredHeight],
        }),
      },
    ],
  };

  return (
    <Animated.View
      pointerEvents={hidden ? 'none' : 'auto'}
      onLayout={({ nativeEvent }) => {
        const nextHeight = nativeEvent.layout.height;
        if (nextHeight > 0 && Math.abs(nextHeight - measuredHeight) > 1) {
          setMeasuredHeight(nextHeight);
        }
      }}
      style={[
        styles.container,
        headerAnimatedStyle,
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
        <Pressable
          onPress={() => {
            if (isExpanded) {
              logScrollYRef.current = 0;
              toggleExpanded();
            } else {
              onBack();
            }
          }}
          style={styles.textButton}
          hitSlop={8}
        >
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
        {showEdit && (
          <Pressable onPress={onEdit} style={styles.textButton} hitSlop={8}>
            {({ pressed }) => (
              <>
                <Text style={[styles.buttonText, { color: colors.primary }]}>편집</Text>
                {pressed && (
                  <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Title row */}
      <Pressable onPress={toggleExpanded} style={styles.titleRow} hitSlop={4}>
        {({ pressed }) => (
          <>
            <Text style={[styles.title, { color: colors.textTitle, flex: 1 }]} numberOfLines={1}>
              {title}
            </Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
              <IcChevronDown
                width={20}
                height={20}
                color={pressed || isExpanded ? colors.textTitle : colors.textCaption}
              />
            </Animated.View>
          </>
        )}
      </Pressable>

      {/* Date / location */}
      <Text style={[styles.subtitle, { color: colors.textCaption }]}>
        {date} • {location}
      </Text>
      {changeLogDate ? (
        <Text style={[styles.changeLogNotice, { color: colors.warning }]}>
          {changeLogDate} 변경 이력 조회 중
        </Text>
      ) : null}

      {/* Collapsed: Day tabs / Expanded: change log list */}
      {isExpanded ? (
        <View style={styles.changeLogSection}>
          <Text style={[styles.changeLogHeader, { color: colors.textTitle }]}>변경 이력</Text>
          {changeLogs.length === 0 ? (
            <Text style={[styles.changeLogEmpty, { color: colors.textCaption }]}>변경 이력이 없습니다.</Text>
          ) : (
            <View style={styles.changeLogScrollWrapper}>
              <ScrollView
                ref={logScrollRef}
                style={styles.changeLogScroll}
                contentContainerStyle={styles.changeLogScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                scrollEventThrottle={16}
                onScroll={({ nativeEvent }) => {
                  const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
                  logScrollYRef.current = contentOffset.y;
                  setShowLogTopFade(contentOffset.y > 0);
                  setShowLogBottomFade(contentOffset.y + layoutMeasurement.height < contentSize.height - 1);
                }}
              >
                {changeLogs.map(({ logId, date: logDate }) => {
                  return (
                    <Pressable
                      key={logId}
                      onPress={() => {
                        onChangeLogPress?.(logId);
                      }}
                      style={[
                        styles.changeLogItem,
                        { backgroundColor: colors.secondarySurface },
                      ]}
                    >
                      {({ pressed }) => (
                        <>
                          <Text style={[styles.changeLogDate, { color: colors.textCaption }]}>
                            {logDate}
                          </Text>
                          {pressed && (
                            <View style={[StyleSheet.absoluteFill, styles.changeLogOverlay, { backgroundColor: colors.pressOverlay }]} />
                          )}
                        </>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
              {showLogTopFade && (
                <LinearGradient
                  colors={[colors.cardBg, colors.cardBg + '00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.changeLogFadeTop}
                  pointerEvents="none"
                />
              )}
              {showLogBottomFade && (
                <LinearGradient
                  colors={[colors.cardBg + '00', colors.cardBg]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.changeLogFadeBottom}
                  pointerEvents="none"
                />
              )}
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={[styles.sectionDivider, { backgroundColor: colors.divider }]} />
        <View style={styles.tabScrollWrapper}>
          <ScrollView
            ref={dayScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabRow}
            scrollEventThrottle={16}
            onScroll={({ nativeEvent }) => {
              const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
              dayScrollXRef.current = contentOffset.x;
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
        </>
      )}
    </Animated.View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 12,
  },
  title: {
    ...Typography['heading-xl'],
  },
  subtitle: {
    ...Typography['body-lg'],
    paddingHorizontal: 16,
  },
  changeLogNotice: {
    ...Typography['heading-sm'],
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  sectionDivider: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 16,
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
  tabScrollWrapper: {
    position: 'relative',
    paddingVertical: 8,
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
  changeLogSection: {
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  changeLogScrollWrapper: {
    position: 'relative',
  },
  changeLogScroll: {
    maxHeight: 124,
  },
  changeLogScrollContent: {
    gap: 10,
  },
  changeLogFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  changeLogFadeBottom: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? -1 : 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 21 : 20,
  },
  changeLogEmpty: {
    ...Typography['body-lg'],
    textAlign: 'center',
    marginBottom: 11,
  },
  changeLogHeader: {
    ...Typography['body-lg'],
  },
  changeLogItem: {
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  changeLogDate: {
    ...Typography['body-lg'],
  },
  changeLogOverlay: {
    borderRadius: BorderRadius.md,
  },
});
