import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type Status = 'draft' | 'completed';

type Props = {
  status: Status;
  onToggle: () => void;
};

export function StatusToggle({ status, onToggle }: Props) {
  const { colors, scheme } = useTheme();

  const isDraft = status === 'draft';
  const bgColor = isDraft ? colors.warningBg : colors.successBg;
  const textColor = isDraft ? colors.warning : colors.success;
  const label = isDraft ? '예정' : '완료';
  const circleColor = scheme === 'light' ? colors.cardBg : colors.textTitle;

  const circle = (
    <View style={[styles.circle, { backgroundColor: circleColor }, Elevation[scheme][2]]} />
  );

  return (
    <Pressable
      onPress={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: colors.divider },
      ]}
    >
      {({ pressed }) => (
        <>
          {!isDraft && circle}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          {isDraft && circle}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
  },
  label: {
    ...Typography['caption'],
    fontFamily: 'Pretendard-Bold',
  },
});
