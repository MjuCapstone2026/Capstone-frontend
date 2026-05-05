import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import { BookedByBadge } from '@/components/ui/BookedByBadge';
import IcRentalCar from '@/assets/icons/ic_rental_car.svg';
import IcAirplane from '@/assets/icons/ic_airplane.svg';
import IcLodging from '@/assets/icons/ic_lodging.svg';

type ReservationStatus = 'confirmed' | 'changed' | 'cancelled';

type CommonProps = {
  price: string;
  bookedBy: 'ai' | 'user';
  reservationNumber: string;
  reservationDate: string;
  status: ReservationStatus;
};

type CarProps = CommonProps & {
  type: 'car';
  vendor: string;
  carModel: string;
  pickupDateTime: string;
  pickupLocation: string;
  dropoffDateTime: string;
  dropoffLocation: string;
};

type FlightProps = CommonProps & {
  type: 'flight';
  departureCode: string;
  arrivalCode: string;
  flightNumber: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  airline: string;
};

type LodgingProps = CommonProps & {
  type: 'lodging';
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  guests: number;
};

type Props = CarProps | FlightProps | LodgingProps;

const TYPE_CONFIG = {
  car:     { label: '렌트카', headerColorKey: 'carRentalHeader' as const },
  flight:  { label: '항공편', headerColorKey: 'flightHeader' as const },
  lodging: { label: '숙소',   headerColorKey: 'accommodationHeader' as const },
};

const STATUS_CONFIG: Record<ReservationStatus, { label: string; colorKey: 'success' | 'warning' | 'danger' }> = {
  confirmed: { label: '확정', colorKey: 'success' },
  changed:   { label: '변경', colorKey: 'warning' },
  cancelled: { label: '취소', colorKey: 'danger' },
};

function TypeIcon({ type, color }: { type: Props['type']; color: string }) {
  if (type === 'car')    return <IcRentalCar width={16} height={16} color={color} />;
  if (type === 'flight') return <IcAirplane  width={16} height={16} color={color} />;
  return                        <IcLodging   width={16} height={16} color={color} />;
}

function CardBody({
  props,
  titleColor,
  captionColor,
}: {
  props: Props;
  titleColor: string;
  captionColor: string;
}) {
  if (props.type === 'car') {
    return (
      <>
        <Text style={[styles.title, { color: titleColor }]}>
          {props.vendor} · {props.carModel}
        </Text>
        <View style={styles.routeSection}>
          <Text style={[styles.caption, { color: captionColor }]}>
            {props.pickupDateTime}  [{props.pickupLocation}]
          </Text>
          <Text style={[styles.caption, { color: captionColor, paddingLeft: 2 }]}>↓</Text>
          <Text style={[styles.caption, { color: captionColor }]}>
            {props.dropoffDateTime}  [{props.dropoffLocation}]
          </Text>
        </View>
      </>
    );
  }

  if (props.type === 'flight') {
    return (
      <>
        <View style={styles.flightRoute}>
          <Text style={[styles.airportCode, { color: titleColor }]}>{props.departureCode}</Text>
          <View style={styles.flightMiddle}>
            <Text style={[styles.label, { color: captionColor }]}>
              ─{props.flightNumber}─ ▶ ─{props.duration}─
            </Text>
          </View>
          <Text style={[styles.airportCode, { color: titleColor }]}>{props.arrivalCode}</Text>
        </View>
        <View style={styles.flightTimes}>
          <Text style={[styles.caption, { color: captionColor }]}>{props.departureTime}</Text>
          <Text style={[styles.caption, { color: captionColor }]}>{props.arrivalTime}</Text>
        </View>
        <Text style={[styles.caption, { color: captionColor }]}>
          {props.date} · {props.airline}
        </Text>
      </>
    );
  }

  return (
    <>
      <Text style={[styles.title, { color: titleColor }]}>{props.hotelName}</Text>
      <Text style={[styles.caption, { color: captionColor }]}>
        {props.checkInDate} 체크인 → {props.checkOutDate} 체크아웃
      </Text>
      <Text style={[styles.caption, { color: captionColor }]}>
        {props.roomType} · {props.guests}명
      </Text>
    </>
  );
}

export function ReservationCard(props: Props) {
  const { colors, scheme } = useTheme();

  const isCancelled = props.status === 'cancelled';
  const headerContentColor = scheme === 'light' ? colors.cardBg : colors.textTitle;
  const { label: typeLabel, headerColorKey } = TYPE_CONFIG[props.type];
  const { label: statusLabel, colorKey: statusColorKey } = STATUS_CONFIG[props.status];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.divider },
        Elevation[scheme][1],
      ]}
    >
      <View style={[styles.header, { backgroundColor: colors[headerColorKey] }]}>
        <TypeIcon type={props.type} color={headerContentColor} />
        <Text style={[styles.headerLabel, { color: headerContentColor }]}>{typeLabel}</Text>
        <View style={styles.spacer} />
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: colors[statusColorKey] }]} />
          <Text style={[styles.headerLabel, { color: headerContentColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <CardBody props={props} titleColor={colors.textTitle} captionColor={colors.textCaption} />

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              { color: isCancelled ? colors.danger : colors.primary },
              isCancelled && styles.strikethrough,
            ]}
          >
            {props.price}
          </Text>
          <BookedByBadge bookedBy={props.bookedBy} />
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: colors.textCaption }]}>
            예약번호: {props.reservationNumber}
          </Text>
          <Text style={[styles.infoText, { color: colors.textCaption }]}>
            예약일 {props.reservationDate}
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
  body: {
    padding: 16,
    gap: 8,
  },
  title: {
    ...Typography['body-lg'],
  },
  routeSection: {
    gap: 4,
  },
  caption: {
    ...Typography['caption'],
  },
  label: {
    ...Typography['label'],
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  airportCode: {
    ...Typography['heading-xl'],
  },
  flightMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  flightTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
