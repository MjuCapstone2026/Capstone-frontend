import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcPin from '@/assets/icons/ic_pin.svg';
import IcPrice from '@/assets/icons/ic_price.svg';
import IcExternalLink from '@/assets/icons/ic_external_link.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';
import IcAirplane from '@/assets/icons/ic_airplane.svg';
import IcLodging from '@/assets/icons/ic_lodging.svg';

// 시간 형식, 시작/종료 순서, 일정 겹침 검증은 이 컴포넌트에서 하지 않는다.
// 시간 두 필드를 연속 수정해야 유효해지는 중간 상태가 있으므로,
// 전체 scheduleItems를 가진 화면의 완료/저장 단계에서 검증한다.

type BaseItem = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
};

type EditableItem = BaseItem & {
  type: 'editable';
  memo?: string;
  location?: string;
  price?: number;
};

type FlightReservationDetail = {
  airline?: string;
  flight_no?: string;
  departure?: {
    airport?: string;
  };
  arrival?: {
    airport?: string;
  };
};

type HotelReservationDetail = {
  hotel_name?: string;
  room_type?: string;
  guests?: number;
};

type RentalCarReservationDetail = {
  company?: string;
  car_model?: string;
  pickup?: {
    location?: string;
  };
};

type ReservationKind = 'flight' | 'hotel' | 'rental_car';
type ReservationDetail = FlightReservationDetail | HotelReservationDetail | RentalCarReservationDetail;
type ReservationIcon = React.FC<{ width: number; height: number; color: string }>;

type ReservationItem = BaseItem & {
  type: 'reservation';
  reservationType?: ReservationKind;
  detail?: ReservationDetail;
  totalPrice?: number;
  currency?: string;
  bookingUrl?: string;
};

export type ScheduleItem = EditableItem | ReservationItem;

type Props = {
  item: ScheduleItem;
  onSave: (updated: ScheduleItem) => void;
  onDelete: () => void;
};

type EditState = {
  startTime: string;
  endTime: string;
  title: string;
  memo: string;
  location: string;
  price: string; // raw digits only (e.g. "15000")
};

function initEdit(item: ScheduleItem): EditState {
  return {
    startTime: item.startTime,
    endTime: item.endTime,
    title: item.title,
    memo: item.type === 'editable' ? (item.memo ?? '') : '',
    location: item.type === 'editable' ? (item.location ?? '') : '',
    price: item.type === 'editable' && item.price !== undefined ? String(item.price) : '',
  };
}

// 천 단위 콤마 포맷
function formatKRW(raw: string): string {
  if (!raw) return '';
  const num = Number(raw.replace(/[^0-9]/g, ''));
  return isNaN(num) ? '' : num.toLocaleString('ko-KR');
}

function formatPrice(price?: number, currency?: string): string | undefined {
  if (price === undefined) return undefined;
  const formatted = price.toLocaleString('ko-KR');
  return currency === 'KRW' || !currency ? `${formatted} 원` : `${formatted} ${currency}`;
}

function isFlightDetail(detail?: ReservationDetail): detail is FlightReservationDetail {
  return !!detail && ('airline' in detail || 'flight_no' in detail || 'departure' in detail || 'arrival' in detail);
}

function isHotelDetail(detail?: ReservationDetail): detail is HotelReservationDetail {
  return !!detail && ('hotel_name' in detail || 'room_type' in detail || 'guests' in detail);
}

function isRentalCarDetail(detail?: ReservationDetail): detail is RentalCarReservationDetail {
  return !!detail && ('company' in detail || 'car_model' in detail || 'pickup' in detail);
}

function getReservationKind(item: ReservationItem): ReservationKind | undefined {
  if (item.reservationType) return item.reservationType;
  if (isFlightDetail(item.detail)) return 'flight';
  if (isHotelDetail(item.detail)) return 'hotel';
  if (isRentalCarDetail(item.detail)) return 'rental_car';
  return undefined;
}

function getReservationSummary(item: ReservationItem): string | undefined {
  const { detail } = item;
  const reservationKind = getReservationKind(item);

  if (reservationKind === 'flight') {
    const flight = isFlightDetail(detail) ? detail : undefined;
    return [flight?.airline, flight?.flight_no].filter(Boolean).join(' ');
  }

  if (reservationKind === 'hotel') {
    const hotel = isHotelDetail(detail) ? detail : undefined;
    return hotel?.hotel_name;
  }

  if (reservationKind === 'rental_car') {
    const rentalCar = isRentalCarDetail(detail) ? detail : undefined;
    return [rentalCar?.company, rentalCar?.car_model].filter(Boolean).join(' · ');
  }

  return undefined;
}

function getReservationLocation(item: ReservationItem): string | undefined {
  const { detail } = item;
  const reservationKind = getReservationKind(item);

  if (reservationKind === 'flight' && isFlightDetail(detail)) {
    return [detail.departure?.airport, detail.arrival?.airport].filter(Boolean).join(' → ');
  }

  if (reservationKind === 'hotel' && isHotelDetail(detail)) {
    return [
      detail.room_type,
      detail.guests ? `투숙객 ${detail.guests}명` : undefined,
    ].filter(Boolean).join(' · ');
  }

  if (reservationKind === 'rental_car' && isRentalCarDetail(detail)) {
    return detail.pickup?.location;
  }

  return undefined;
}

function getReservationIcon(item: ReservationItem): ReservationIcon {
  const reservationKind = getReservationKind(item);

  if (reservationKind === 'flight') return IcAirplane;
  if (reservationKind === 'hotel') return IcLodging;
  return IcPin;
}

export function PlanDetailEditItem({ item, onSave, onDelete }: Props) {
  const { colors, scheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState<EditState>(() => initEdit(item));

  const chevronRotation = useSharedValue(0);
  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  useEffect(() => {
    setEdit(initEdit(item));
  }, [item.id]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    chevronRotation.value = withTiming(next ? 180 : 0, { duration: 200 });
  };

  const saveEdit = (next: EditState) => {
    if (item.type !== 'editable' || !next.title.trim()) return;

    onSave({
      type: 'editable',
      id: item.id,
      startTime: next.startTime,
      endTime: next.endTime,
      title: next.title,
      memo: next.memo || undefined,
      location: next.location || undefined,
      price: next.price ? Number(next.price) : undefined,
    });
  };

  const updateEdit = (patch: Partial<EditState>) => {
    const next = { ...edit, ...patch };
    setEdit(next);
    saveEdit(next);
  };

  const handleBlur = () => {
    if (item.type !== 'editable') return;

    if (!edit.title.trim()) {
      Toast.show({ type: 'error', text1: '일정명을 입력해주세요.' });
      setEdit((e) => ({ ...e, title: item.title }));
      return;
    }

    saveEdit(edit);
  };

  const chevronColor = isOpen ? colors.textTitle : colors.textCaption;
  const isEditable = isOpen && item.type === 'editable';

  const formattedPrice = formatKRW(edit.price);
  const displayStartTime = item.type === 'editable' ? edit.startTime : item.startTime;
  const displayEndTime = item.type === 'editable' ? edit.endTime : item.endTime;
  const displayTitle = item.type === 'editable' ? edit.title : item.title;
  const reservationSummary = item.type === 'reservation' ? getReservationSummary(item) : undefined;
  const reservationLocation = item.type === 'reservation' ? getReservationLocation(item) : undefined;
  const ReservationLocationIcon = item.type === 'reservation' ? getReservationIcon(item) : IcPin;
  const reservationPrice = item.type === 'reservation'
    ? formatPrice(item.totalPrice, item.currency)
    : undefined;

  // 시간 badge — 항상 TextInput으로 렌더링해 editable 전환 시 badge 크기 고정
  const renderTimeBadge = (value: string, displayValue: string, onChange: (v: string) => void) => (
    <View style={[styles.timeBadge, { backgroundColor: colors.secondarySurface, borderColor: colors.divider }]}>
      <TextInput
        style={[styles.timeInput, { color: colors.primary }]}
        value={isEditable ? value : displayValue}
        editable={isEditable}
        onChangeText={onChange}
        onBlur={isEditable ? handleBlur : undefined}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        underlineColorAndroid="transparent"
        textAlign="center"
        textAlignVertical="center"
        caretHidden={!isEditable}
        selectTextOnFocus={false}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.divider },
        isOpen ? Elevation[scheme][2] : Elevation[scheme][1],
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.timeSection}>
          {renderTimeBadge(edit.startTime, displayStartTime, (v) => updateEdit({ startTime: v }))}
          <Text style={[styles.timeSeparator, { color: colors.primary }]}>~</Text>
          {renderTimeBadge(edit.endTime, displayEndTime, (v) => updateEdit({ endTime: v }))}
        </View>

        <View style={styles.titleWrapper}>
          {isEditable ? (
            <TextInput
              style={[styles.titleInput, { color: colors.textTitle, borderBottomColor: colors.divider }]}
              value={edit.title}
              onChangeText={(v) => updateEdit({ title: v })}
              onBlur={handleBlur}
              underlineColorAndroid="transparent"
            />
          ) : (
            <Text style={[styles.titleText, { color: colors.textTitle }]} numberOfLines={1}>
              {displayTitle}
            </Text>
          )}
        </View>

        <Pressable onPress={handleToggle} hitSlop={8}>
          <Animated.View style={animatedChevron}>
            <IcChevronDown width={20} height={20} color={chevronColor} />
          </Animated.View>
        </Pressable>
      </View>

      {isOpen && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}

      {isOpen && (
        <View style={styles.expanded}>
          {item.type === 'reservation' ? (
            <>
              {reservationSummary ? (
                <Text style={[styles.reservationSubtitle, { color: colors.textTitle }]}>
                  {reservationSummary}
                </Text>
              ) : null}
              {reservationLocation ? (
                <View style={styles.iconRow}>
                  <ReservationLocationIcon width={16} height={16} color={colors.textCaption} />
                  <Text style={[styles.detailText, { color: colors.textCaption }]}>{reservationLocation}</Text>
                </View>
              ) : null}
              {reservationPrice ? (
                <View style={styles.iconRow}>
                  <IcPrice width={16} height={16} color={colors.textCaption} />
                  <Text style={[styles.detailText, { color: colors.textCaption }]}>
                    {reservationPrice}
                  </Text>
                </View>
              ) : null}
              {item.bookingUrl ? (
                <Pressable onPress={() => Linking.openURL(item.bookingUrl!)}>
                  {({ pressed }) => (
                    <>
                      <View style={styles.iconRow}>
                        <IcExternalLink width={16} height={16} color={colors.primary} />
                        <Text style={[styles.linkText, { color: colors.primary }]}>예약 확인하기</Text>
                      </View>
                      {pressed && (
                        <View
                          style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.xs },
                          ]}
                        />
                      )}
                    </>
                  )}
                </Pressable>
              ) : null}
            </>
          ) : (
            <>
              <TextInput
                style={[styles.memoInput, { color: colors.textTitle, borderBottomColor: colors.divider }]}
                value={edit.memo}
                onChangeText={(v) => updateEdit({ memo: v })}
                onBlur={handleBlur}
                placeholder="메모"
                placeholderTextColor={colors.textDisabled}
                multiline
                underlineColorAndroid="transparent"
              />
              <View style={styles.iconRow}>
                <View style={styles.editIconAligner}>
                  <IcPin width={16} height={16} color={colors.textCaption} />
                </View>
                <TextInput
                  style={[styles.locationInput, { color: colors.textCaption, borderBottomColor: colors.divider }]}
                  value={edit.location}
                  onChangeText={(v) => updateEdit({ location: v })}
                  onBlur={handleBlur}
                  placeholder="위치"
                  placeholderTextColor={colors.textDisabled}
                  underlineColorAndroid="transparent"
                />
              </View>

              {/* 가격 — ghost + absoluteFill으로 텍스트 너비 hug, 포맷: "15,000 원" */}
              <View style={styles.iconRow}>
                <View style={styles.editIconAligner}>
                  <IcPrice width={16} height={16} color={colors.textCaption} />
                </View>
                <View style={[styles.priceInputSizer, { borderBottomColor: colors.divider }]}>
                  {/* ghost Text가 sizer 너비를 포맷된 텍스트 너비로 고정 */}
                  <Text style={styles.priceGhost}>{formattedPrice || '가격'}</Text>
                  <TextInput
                    style={[styles.priceInputOverlay, StyleSheet.absoluteFill, { color: colors.textCaption }]}
                    value={formattedPrice}
                    onChangeText={(v) => {
                      const raw = v.replace(/[^0-9]/g, '');
                      updateEdit({ price: raw });
                    }}
                    onBlur={handleBlur}
                    keyboardType="number-pad"
                    placeholder="가격"
                    placeholderTextColor={colors.textDisabled}
                    underlineColorAndroid="transparent"
                    textAlignVertical="center"
                  />
                </View>
                {formattedPrice ? (
                  <Text style={[styles.priceSuffix, { color: colors.textCaption }]}> 원</Text>
                ) : null}
              </View>

              <Pressable onPress={onDelete} style={styles.deleteRow}>
                {({ pressed }) => (
                  <>
                    <Text style={[styles.deleteText, { color: colors.danger }]}>삭제</Text>
                    {pressed && (
                      <View
                        style={[
                          StyleSheet.absoluteFill,
                          { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.xs },
                        ]}
                      />
                    )}
                  </>
                )}
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const IOS_UNDERLINE_GAP = Platform.OS === 'ios' ? 4 : 0;

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBadge: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timeSeparator: {
    ...Typography['caption'],
  },
  // 항상 TextInput으로 렌더링 → editable 전환 시 badge 크기 불변
  timeInput: {
    // lineHeight 제외: iOS TextInput에서 lineHeight 적용 시 텍스트가 하단으로 쏠림
    fontFamily: Typography['caption'].fontFamily,
    fontSize: Typography['caption'].fontSize,
    fontWeight: Typography['caption'].fontWeight,
    letterSpacing: Typography['caption'].letterSpacing,
    padding: 0,
    minWidth: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  titleWrapper: {
    flex: 1,
  },
  titleText: {
    ...Typography['heading-md'],
  },
  titleInput: {
    ...Typography['heading-md'],
    padding: 0,
    paddingBottom: IOS_UNDERLINE_GAP,
    borderBottomWidth: 1,
    alignSelf: 'flex-start',
    minWidth: 80,
  },
  divider: {
    height: 1,
  },
  expanded: {
    gap: 8,
    paddingLeft: 12,
  },
  reservationSubtitle: {
    ...Typography['heading-md'],
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editIconAligner: {
    transform: [{ translateY: IOS_UNDERLINE_GAP }],
  },
  detailText: {
    ...Typography['body-md'],
    flex: 1,
  },
  locationInput: {
    ...Typography['body-md'],
    flexShrink: 1,
    minWidth: 80,
    padding: 0,
    paddingBottom: IOS_UNDERLINE_GAP,
    borderBottomWidth: 1,
  },
  linkText: {
    ...Typography['body-md'],
  },
  memoInput: {
    ...Typography['heading-md'],
    padding: 0,
    paddingBottom: IOS_UNDERLINE_GAP,
    borderBottomWidth: 1,
    alignSelf: 'flex-start',
    minWidth: 80,
  },
  priceInputSizer: {
    borderBottomWidth: 1,
    minWidth: 10,
  },
  priceGhost: {
    ...Typography['body-md'],
    opacity: 0,
    padding: 0,
    paddingBottom: IOS_UNDERLINE_GAP,
  },
  priceInputOverlay: {
    ...Typography['body-md'],
    padding: 0,
    paddingBottom: IOS_UNDERLINE_GAP,
  },
  priceSuffix: {
    ...Typography['body-md'],
    transform: [{ translateY: IOS_UNDERLINE_GAP }],
  },
  deleteRow: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  deleteText: {
    ...Typography['body-lg'],
  },
});
