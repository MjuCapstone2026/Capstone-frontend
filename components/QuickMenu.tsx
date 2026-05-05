import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcChat from '@/assets/icons/ic_chat.svg';
import IcPlan from '@/assets/icons/ic_plan.svg';

type Props = {
  onChatPress: () => void;
  onPlanPress: () => void;
};

export function QuickMenu({ onChatPress, onPlanPress }: Props) {
  const { colors, scheme } = useTheme();
  const iconColor = scheme === 'light' ? colors.cardBg : colors.textTitle;

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }, Elevation[scheme][2]]}
        onPress={onChatPress}
      >
        {({ pressed }) => (
          <>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <IcChat width={24} height={24} color={iconColor} />
            </View>
            <Text style={[styles.label, { color: colors.textTitle }]}>AI와 채팅</Text>
            {pressed && (
              <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
            )}
          </>
        )}
      </Pressable>

      <Pressable
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }, Elevation[scheme][2]]}
        onPress={onPlanPress}
      >
        {({ pressed }) => (
          <>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <IcPlan width={24} height={24} color={iconColor} />
            </View>
            <Text style={[styles.label, { color: colors.textTitle }]}>일정 보기</Text>
            {pressed && (
              <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography['caption'],
  },
  overlay: {
    borderRadius: BorderRadius.lg,
  },
});
