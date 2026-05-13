import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Elevation, Typography } from '@/constants/theme';
import { ChatMessageActionResult, DoneItinerary } from '@/api/chatMessages';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

type Props = {
  result: ChatMessageActionResult;
};

function formatCurrency(value: number, currency = 'KRW') {
  if (currency === 'KRW') return `${Math.round(value).toLocaleString('ko-KR')}원`;
  return `${value.toLocaleString()} ${currency}`;
}

function getTitle(result: ChatMessageActionResult) {
  if (result.type === 'itinerary') return '일정 결과';
  if (result.type === 'change') return '기본 정보 변경';
  if (result.type === 'reservation') return '예약 결과';
  return '예약 취소';
}

function getSummary(result: ChatMessageActionResult) {
  if (result.type === 'itinerary') {
    const dayCount = Object.keys(result.data.dayPlans).length;
    return `${result.data.startDate} ~ ${result.data.endDate} · ${dayCount}일 일정`;
  }
  if (result.type === 'change') {
    return `${result.data.startDate} ~ ${result.data.endDate} · 예산 ${formatCurrency(result.data.budget)}`;
  }
  if (result.type === 'reservation') {
    return `${result.data.type} · ${result.data.status} · ${formatCurrency(result.data.totalPrice, result.data.currency)}`;
  }
  return `${result.data.status} · ${result.data.cancelledAt}`;
}

function ItineraryDetail({ itinerary }: { itinerary: DoneItinerary }) {
  const { colors } = useTheme();
  const entries = Object.entries(itinerary.dayPlans);

  return (
    <View style={styles.detail}>
      {entries.map(([date, plans], dayIndex) => (
        <View
          key={date}
          style={[
            styles.daySection,
            { borderBottomColor: colors.divider },
            dayIndex === entries.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <Text style={[styles.dayTitle, { color: colors.textTitle }]}>{date}</Text>
          {plans.length === 0 ? (
            <Text style={[styles.metaText, { color: colors.textCaption }]}>일정 없음</Text>
          ) : (
            plans.map((plan, index) => (
              <View key={`${date}-${plan.index ?? index}`} style={styles.planRow}>
                <View style={styles.planMainRow}>
                  <Text
                    style={[styles.planMain, { color: colors.textTitle }]}
                  >
                    {plan.time} · {plan.plan_name}
                  </Text>
                  {plan.cost ? (
                    <Text style={[styles.costText, { color: colors.primary }]}>
                      {formatCurrency(plan.cost.amount_krw ?? plan.cost.amount)}
                    </Text>
                  ) : null}
                </View>
                <Text style={[styles.metaText, { color: colors.textCaption }]}>{plan.place}</Text>
                {plan.note ? (
                  <Text style={[styles.metaText, { color: colors.textCaption }]}>{plan.note}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      ))}
    </View>
  );
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.keyValueRow}>
      <Text style={[styles.keyText, { color: colors.textCaption }]}>{label}</Text>
      <Text style={[styles.valueText, { color: colors.textTitle }]}>{value}</Text>
    </View>
  );
}

function ResultDetail({ result }: { result: ChatMessageActionResult }) {
  if (result.type === 'itinerary') {
    return <ItineraryDetail itinerary={result.data} />;
  }

  if (result.type === 'change') {
    return (
      <View style={styles.detail}>
        <KeyValueRow label="기간" value={`${result.data.startDate} ~ ${result.data.endDate}`} />
        <KeyValueRow label="총 일수" value={`${result.data.totalDays}일`} />
        <KeyValueRow label="예산" value={formatCurrency(result.data.budget)} />
        <KeyValueRow label="인원" value={`성인 ${result.data.adultCount}명 · 아동 ${result.data.childCount}명`} />
      </View>
    );
  }

  if (result.type === 'reservation') {
    return (
      <View style={styles.detail}>
        <KeyValueRow label="유형" value={result.data.type} />
        <KeyValueRow label="상태" value={result.data.status} />
        <KeyValueRow label="금액" value={formatCurrency(result.data.totalPrice, result.data.currency)} />
        <KeyValueRow label="예약 시간" value={result.data.reservedAt} />
      </View>
    );
  }

  return (
    <View style={styles.detail}>
      <KeyValueRow label="예약 ID" value={result.data.reservationId} />
      <KeyValueRow label="상태" value={result.data.status} />
      <KeyValueRow label="취소 시간" value={result.data.cancelledAt} />
    </View>
  );
}

export function ChatActionResultCard({ result }: Props) {
  const { colors, scheme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBg, borderColor: colors.divider },
          Elevation[scheme][1],
        ]}
      >
        <Pressable style={styles.header} onPress={() => setExpanded((value) => !value)}>
          {({ pressed }) => (
            <>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.textTitle }]}>{getTitle(result)}</Text>
                <Text style={[styles.summary, { color: colors.textCaption }]} numberOfLines={1}>
                  {getSummary(result)}
                </Text>
              </View>
              <View style={[styles.chevron, expanded && styles.chevronExpanded]}>
                <IcChevronDown width={18} height={18} color={expanded ? colors.textTitle : colors.textCaption} />
              </View>
              {pressed && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />}
            </>
          )}
        </Pressable>

        {expanded && (
          <View style={{ borderTopColor: colors.divider, borderTopWidth: 1 }}>
            <ResultDetail result={result} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    marginTop: -8,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography['heading-sm'],
  },
  summary: {
    ...Typography['caption'],
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  detail: {
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  daySection: {
    borderBottomWidth: 1,
    gap: 8,
    paddingBottom: 10,
  },
  dayTitle: {
    ...Typography['heading-sm'],
  },
  planRow: {
    gap: 2,
  },
  planMainRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
  },
  planMain: {
    ...Typography['body-md'],
    flex: 1,
    minWidth: 0,
  },
  costText: {
    ...Typography['caption'],
    flexShrink: 0,
  },
  metaText: {
    ...Typography['caption'],
  },
  keyValueRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  keyText: {
    ...Typography['caption'],
  },
  valueText: {
    ...Typography['body-sm'],
    flex: 1,
    textAlign: 'right',
  },
});
