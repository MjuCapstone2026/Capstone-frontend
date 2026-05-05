import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcSearch from '@/assets/icons/ic_search.svg';
import IcPlan from '@/assets/icons/ic_plan.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

// ── Types ──────────────────────────────────────────────────
type Mode = 'create' | 'edit';

const AGE_OPTIONS = [
  '영아 (0~2세)',
  '유아 (3~6세)',
  '어린이 (7~12세)',
  '청소년 (13~17세)',
] as const;
type AgeOption = (typeof AGE_OPTIONS)[number];

export type TripInfo = {
  destination: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  childAges: AgeOption[];
  budget: number;
};

type Props = {
  visible: boolean;
  mode: Mode;
  initialValues?: Partial<TripInfo>;
  onSubmit: (info: TripInfo) => void;
  onClose: () => void;
};

// ── Helpers ────────────────────────────────────────────────
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}

// ── Calendar ───────────────────────────────────────────────
type CalendarProps = {
  startDate: Date | null;
  endDate: Date | null;
  month: Date;
  onDayPress: (day: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

function Calendar({ startDate, endDate, month, onDayPress, onPrevMonth, onNextMonth }: CalendarProps) {
  const { colors } = useTheme();

  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const monthLabel = `${year}년 ${mon + 1}월`;

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, mon, i + 1));
  const cells: (Date | null)[] = [...blanks, ...days];

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <View style={styles.calendar}>
      {/* Month navigation */}
      <View style={styles.calendarHeader}>
        <Pressable onPress={onPrevMonth} style={styles.calendarNavBtn}>
          {({ pressed }) => (
            <>
              <View style={styles.chevronLeft}>
                <IcChevronDown width={18} height={18} color={colors.textCaption} />
              </View>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.full }]} />
              )}
            </>
          )}
        </Pressable>
        <Text style={[styles.calendarMonthLabel, { color: colors.textTitle }]}>{monthLabel}</Text>
        <Pressable onPress={onNextMonth} style={styles.calendarNavBtn}>
          {({ pressed }) => (
            <>
              <View style={styles.chevronRight}>
                <IcChevronDown width={18} height={18} color={colors.textCaption} />
              </View>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.full }]} />
              )}
            </>
          )}
        </Pressable>
      </View>

      {/* Day-of-week header */}
      <View style={styles.calendarRow}>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <Text key={d} style={[styles.calendarDayHeader, { color: colors.textCaption }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.calendarRow}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={styles.calendarCell} />;

            const isStart = startDate !== null && isSameDay(day, startDate);
            const isEnd = endDate !== null && isSameDay(day, endDate);
            const inRange = startDate !== null && endDate !== null && isBetween(day, startDate, endDate);
            const isSelected = isStart || isEnd;

            return (
              <Pressable
                key={di}
                onPress={() => onDayPress(day)}
                style={[
                  styles.calendarCell,
                  inRange && { backgroundColor: colors.primaryTint },
                ]}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.calendarDayInner,
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        { color: isSelected ? colors.pageBg : colors.textTitle },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                    {pressed && (
                      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ── Stepper ────────────────────────────────────────────────
type StepperRowProps = {
  label: string;
  value: number;
  min?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  hasBorderTop?: boolean;
};

function StepperRow({ label, value, min = 0, onDecrement, onIncrement, hasBorderTop }: StepperRowProps) {
  const { colors, scheme } = useTheme();
  const canDecrement = value > min;

  return (
    <View
      style={[
        styles.stepperRow,
        hasBorderTop && { borderTopWidth: 1, borderTopColor: colors.divider },
      ]}
    >
      <Text style={[styles.stepperLabel, { color: colors.textTitle }]}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={onDecrement}
          disabled={!canDecrement}
          style={[styles.stepperBtn, { borderColor: colors.divider }, Elevation[scheme][1]]}
        >
          {({ pressed }) => (
            <>
              <Text style={[styles.stepperBtnText, { color: canDecrement ? colors.textTitle : colors.textDisabled }]}>
                −
              </Text>
              {pressed && canDecrement && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.full }]} />
              )}
            </>
          )}
        </Pressable>
        <Text style={[styles.stepperValue, { color: colors.textTitle }]}>{value}</Text>
        <Pressable
          onPress={onIncrement}
          style={[styles.stepperBtn, { borderColor: colors.divider }, Elevation[scheme][1]]}
        >
          {({ pressed }) => (
            <>
              <Text style={[styles.stepperBtnText, { color: colors.textTitle }]}>+</Text>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.full }]} />
              )}
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ── Main Component ─────────────────────────────────────────
export function TripInfoBottomSheet({ visible, mode, initialValues, onSubmit, onClose }: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [destination, setDestination] = useState(initialValues?.destination ?? '');
  const [startDate, setStartDate] = useState<Date | null>(initialValues?.startDate ?? null);
  const [endDate, setEndDate] = useState<Date | null>(initialValues?.endDate ?? null);
  const [adults, setAdults] = useState(initialValues?.adults ?? 1);
  const [children, setChildren] = useState(initialValues?.children ?? 0);
  const [childAges, setChildAges] = useState<(AgeOption | '')[]>(initialValues?.childAges ?? []);
  const [budget, setBudget] = useState(initialValues?.budget?.toString() ?? '');

  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [activeAgeDropdown, setActiveAgeDropdown] = useState<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(initialValues?.startDate ?? new Date());

  // Validation
  const allChildAgesFilled = children === 0 || (childAges.length === children && childAges.every(a => a !== ''));
  const isValid =
    destination.trim() !== '' &&
    startDate !== null &&
    endDate !== null &&
    adults >= 1 &&
    allChildAgesFilled &&
    Number(budget) > 0;

  // Calendar
  const handleDayPress = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isSameDay(day, startDate)) {
      setStartDate(null);
    } else if (day < startDate) {
      setStartDate(day);
      setEndDate(null);
    } else {
      setEndDate(day);
      setCalendarExpanded(false);
    }
  };

  // Children count with age array sync
  const updateChildren = (count: number) => {
    const next = Math.max(0, count);
    setChildren(next);
    setChildAges(prev => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill('')] as (AgeOption | '')[];
      }
      return prev.slice(0, next);
    });
    if (next === 0) setActiveAgeDropdown(null);
  };

  const handleSubmit = () => {
    if (!isValid || !startDate || !endDate) return;
    onSubmit({
      destination: destination.trim(),
      startDate,
      endDate,
      adults,
      children,
      childAges: childAges as AgeOption[],
      budget: Number(budget),
    });
  };

  const inputElevation = Elevation[scheme][4];
  const dateLabel =
    startDate && endDate
      ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} ~ 종료일 선택`
        : null;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.scrim, { backgroundColor: colors.scrimModal }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          <View style={[styles.sheet, { backgroundColor: colors.pageBg }]}>
            <Text style={[styles.sheetTitle, { color: colors.textTitle }]}>
              여행 정보를 입력해주세요
            </Text>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ── Destination ── */}
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.cardBg, borderColor: colors.divider },
                  inputElevation,
                ]}
              >
                <View style={styles.fieldContent}>
                  <Text style={[styles.fieldLabel, { color: colors.textCaption }]}>여행지</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.textTitle }]}
                    placeholder="여행지를 입력해주세요"
                    placeholderTextColor={colors.textDisabled}
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
                <IcSearch
                  width={20}
                  height={20}
                  color={destination ? colors.textTitle : colors.textCaption}
                />
              </View>

              {/* ── Date ── */}
              <Pressable
                onPress={() => {
                  setCalendarExpanded(v => !v);
                  setPeopleExpanded(false);
                  setActiveAgeDropdown(null);
                }}
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.cardBg, borderColor: colors.divider },
                  inputElevation,
                ]}
              >
                {({ pressed }) => (
                  <>
                    <View style={styles.fieldContent}>
                      <Text style={[styles.fieldLabel, { color: colors.textCaption }]}>여행 날짜</Text>
                      <Text
                        style={[
                          styles.fieldValue,
                          { color: dateLabel ? colors.textTitle : colors.textDisabled },
                        ]}
                      >
                        {dateLabel ?? '날짜를 선택해주세요'}
                      </Text>
                    </View>
                    <IcPlan
                      width={20}
                      height={20}
                      color={startDate ? colors.textTitle : colors.textCaption}
                    />
                    {pressed && (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.lg },
                        ]}
                      />
                    )}
                  </>
                )}
              </Pressable>

              {calendarExpanded && (
                <Calendar
                  startDate={startDate}
                  endDate={endDate}
                  month={calendarMonth}
                  onDayPress={handleDayPress}
                  onPrevMonth={() =>
                    setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                  }
                  onNextMonth={() =>
                    setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                  }
                />
              )}

              {/* ── People ── */}
              <Pressable
                onPress={() => {
                  setPeopleExpanded(v => !v);
                  setCalendarExpanded(false);
                  setActiveAgeDropdown(null);
                }}
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.cardBg, borderColor: colors.divider },
                  inputElevation,
                ]}
              >
                {({ pressed }) => (
                  <>
                    <View style={styles.fieldContent}>
                      <Text style={[styles.fieldLabel, { color: colors.textCaption }]}>인원</Text>
                      <Text style={[styles.fieldValue, { color: colors.textTitle }]}>
                        성인 {adults}명{children > 0 ? `, 아동 ${children}명` : ''}
                      </Text>
                    </View>
                    <View style={{ transform: [{ rotate: peopleExpanded ? '180deg' : '0deg' }] }}>
                      <IcChevronDown width={20} height={20} color={colors.textCaption} />
                    </View>
                    {pressed && (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.lg },
                        ]}
                      />
                    )}
                  </>
                )}
              </Pressable>

              {peopleExpanded && (
                <View
                  style={[
                    styles.expandedPanel,
                    { backgroundColor: colors.cardBg, borderColor: colors.divider },
                    inputElevation,
                  ]}
                >
                  <StepperRow
                    label="성인"
                    value={adults}
                    min={1}
                    onDecrement={() => setAdults(a => Math.max(1, a - 1))}
                    onIncrement={() => setAdults(a => a + 1)}
                  />
                  <StepperRow
                    label="아동"
                    value={children}
                    min={0}
                    onDecrement={() => updateChildren(children - 1)}
                    onIncrement={() => updateChildren(children + 1)}
                    hasBorderTop
                  />

                  {childAges.map((age, idx) => (
                    <View key={idx}>
                      <Pressable
                        onPress={() =>
                          setActiveAgeDropdown(activeAgeDropdown === idx ? null : idx)
                        }
                        style={[styles.ageRow, { borderTopColor: colors.divider }]}
                      >
                        {({ pressed }) => (
                          <>
                            <Text style={[styles.stepperLabel, { color: colors.textTitle }]}>
                              아동 {idx + 1} 나이
                            </Text>
                            <View style={styles.ageValueRow}>
                              <Text
                                style={[
                                  styles.ageValue,
                                  { color: age ? colors.textTitle : colors.textDisabled },
                                ]}
                              >
                                {age || '선택해주세요'}
                              </Text>
                              <View
                                style={{
                                  transform: [{ rotate: activeAgeDropdown === idx ? '180deg' : '0deg' }],
                                }}
                              >
                                <IcChevronDown width={16} height={16} color={colors.textCaption} />
                              </View>
                            </View>
                            {pressed && (
                              <View
                                style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]}
                              />
                            )}
                          </>
                        )}
                      </Pressable>

                      {activeAgeDropdown === idx && (
                        <View
                          style={[styles.ageDropdown, { borderTopColor: colors.divider, backgroundColor: colors.pageBg }]}
                        >
                          {AGE_OPTIONS.map(option => (
                            <Pressable
                              key={option}
                              onPress={() => {
                                const next = [...childAges];
                                next[idx] = option;
                                setChildAges(next);
                                setActiveAgeDropdown(null);
                              }}
                              style={styles.ageOption}
                            >
                              {({ pressed }) => (
                                <>
                                  <Text
                                    style={[
                                      styles.ageOptionText,
                                      { color: age === option ? colors.primary : colors.textTitle },
                                    ]}
                                  >
                                    {option}
                                  </Text>
                                  {pressed && (
                                    <View
                                      style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]}
                                    />
                                  )}
                                </>
                              )}
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* ── Budget ── */}
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.cardBg, borderColor: colors.divider },
                  inputElevation,
                ]}
              >
                <View style={styles.fieldContent}>
                  <Text style={[styles.fieldLabel, { color: colors.textCaption }]}>예산</Text>
                  <View style={styles.budgetRow}>
                    <TextInput
                      style={[styles.budgetInput, { color: colors.textTitle }]}
                      placeholder="0"
                      placeholderTextColor={colors.textDisabled}
                      value={budget}
                      onChangeText={v => setBudget(v.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                    />
                    <Text style={[styles.budgetUnit, { color: colors.textCaption }]}>원</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* ── Footer ── */}
            <View
              style={[
                styles.footer,
                { borderTopColor: colors.divider, paddingBottom: insets.bottom + 16 },
              ]}
            >
              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                style={[
                  styles.primaryButton,
                  { backgroundColor: isValid ? colors.primary : colors.secondarySurface },
                  isValid && Elevation[scheme][2],
                ]}
              >
                {({ pressed }) => (
                  <>
                    <Text
                      style={[
                        styles.primaryButtonText,
                        { color: isValid ? colors.pageBg : colors.textDisabled },
                      ]}
                    >
                      {mode === 'create' ? '여행 시작하기' : '수정 완료'}
                    </Text>
                    {pressed && isValid && (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.lg },
                        ]}
                      />
                    )}
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lgModal,
    borderTopRightRadius: BorderRadius.lgModal,
    maxHeight: '90%',
  },
  sheetTitle: {
    ...Typography['heading-xl'],
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  // ── Input row ──
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 12,
    overflow: 'hidden',
  },
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    ...Typography['heading-sm'],
  },
  fieldValue: {
    ...Typography['heading-sm'],
  },
  fieldInput: {
    ...Typography['heading-sm'],
    lineHeight: undefined,
    padding: 0,
    margin: 0,
  },
  // ── Calendar ──
  calendar: {
    gap: 2,
    paddingVertical: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarNavBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chevronLeft: {
    transform: [{ rotate: '90deg' }],
  },
  chevronRight: {
    transform: [{ rotate: '-90deg' }],
  },
  calendarMonthLabel: {
    ...Typography['heading-sm'],
  },
  calendarRow: {
    flexDirection: 'row',
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    ...Typography['caption'],
    paddingVertical: 6,
  },
  calendarCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  calendarDayInner: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  calendarDayText: {
    ...Typography['body-md'],
  },
  // ── Expanded panel ──
  expandedPanel: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // ── Stepper ──
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stepperLabel: {
    ...Typography['heading-sm'],
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stepperBtnText: {
    ...Typography['heading-sm'],
  },
  stepperValue: {
    ...Typography['heading-sm'],
    minWidth: 24,
    textAlign: 'center',
  },
  // ── Age ──
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  ageValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ageValue: {
    ...Typography['body-md'],
  },
  ageDropdown: {
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  ageOption: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    overflow: 'hidden',
  },
  ageOptionText: {
    ...Typography['body-md'],
  },
  // ── Budget ──
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetInput: {
    ...Typography['heading-sm'],
    lineHeight: undefined,
    padding: 0,
    margin: 0,
    minWidth: 40,
  },
  budgetUnit: {
    ...Typography['heading-sm'],
  },
  // ── Footer ──
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  primaryButton: {
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryButtonText: {
    ...Typography['heading-sm'],
  },
});
