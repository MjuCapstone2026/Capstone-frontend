import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import { BookedByBadge } from '@/components/ui/BookedByBadge';
import IcRentalCar from '@/assets/icons/ic_rental_car.svg';

type ReservationStatus = 'active' | 'cancelled';

type Props = {
  vendor: string;
  carModel: string;
  pickupDateTime: string;
  pickupLocation: string;
  dropoffDateTime: string;
  dropoffLocation: string;
  price: string;
  bookedBy: 'ai' | 'user';
  reservationNumber: string;
  reservationDate: string;
  status: ReservationStatus;
};

export function ReservationCard({
  vendor,
  carModel,
  pickupDateTime,
  pickupLocation,
  dropoffDateTime,
  dropoffLocation,
  price,
  bookedBy,
  reservationNumber,
  reservationDate,
  status,
}: Props) {
  const { colors, scheme } = useTheme();

  const isCancelled = status === 'cancelled';
  const headerContentColor = scheme === 'light' ? colors.cardBg : colors.textTitle;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.divider },
        Elevation[scheme][1],
      ]}
    >
      <View style={[styles.header, { backgroundColor: colors.carRentalHeader }]}>
        <IcRentalCar width={16} height={16} color={headerContentColor} />
        <Text style={[styles.headerLabel, { color: headerContentColor }]}>렌트카</Text>
        <View style={styles.spacer} />
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isCancelled ? colors.danger : colors.success },
            ]}
          />
          <Text style={[styles.statusText, { color: headerContentColor }]}>
            {isCancelled ? '취소' : '예약'}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.carName, { color: colors.textTitle }]}>
          {vendor} · {carModel}
        </Text>

        <View style={styles.routeSection}>
          <Text style={[styles.routeText, { color: colors.textCaption }]}>
            {pickupDateTime}  [{pickupLocation}]
          </Text>
          <Text style={[styles.arrowText, { color: colors.textCaption }]}>↓</Text>
          <Text style={[styles.routeText, { color: colors.textCaption }]}>
            {dropoffDateTime}  [{dropoffLocation}]
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              { color: isCancelled ? colors.danger : colors.primary },
              isCancelled && styles.strikethrough,
            ]}
          >
            {price}
          </Text>
          <BookedByBadge bookedBy={bookedBy} />
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: colors.textCaption }]}>
            예약번호: {reservationNumber}
          </Text>
          <Text style={[styles.infoText, { color: colors.textCaption }]}>
            예약일 {reservationDate}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  headerLabel: {
    ...Typography['caption'],
    fontFamily: 'Pretendard-Bold',
  },
  spacer: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography['caption'],
    fontFamily: 'Pretendard-Bold',
  },
  body: {
    padding: 16,
    gap: 8,
  },
  carName: {
    ...Typography['body-lg'],
  },
  routeSection: {
    gap: 4,
  },
  routeText: {
    ...Typography['caption'],
  },
  arrowText: {
    ...Typography['caption'],
    paddingLeft: 2,
  },
  divider: {
    height: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...Typography['heading-sm'],
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    ...Typography['label'],
  },
});
