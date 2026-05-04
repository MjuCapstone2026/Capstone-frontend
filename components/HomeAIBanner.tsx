import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcAi from '@/assets/icons/ic_ai.svg';

type Props = {
  onPress: () => void;
};

export function HomeAIBanner({ onPress }: Props) {
  const { colors, scheme } = useTheme();

  const contentColor = scheme === 'dark' ? colors.textTitle : colors.cardBg;
  const buttonBg = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: colors.primary },
        Elevation[scheme][2],
      ]}
    >
      <View style={styles.header}>
        <IcAi width={24} height={24} color={contentColor} />
        <Text style={[styles.title, { color: contentColor }]}>AI 여행 플래너</Text>
      </View>

      <Text style={[styles.body, { color: contentColor }]}>
        AI와 함께 완벽한 여행 계획을 세워보세요. 실시간으로 일정을 관리하고 맞춤 추천을 받으세요.
      </Text>

      <Pressable
        onPress={onPress}
        style={[styles.button, { backgroundColor: buttonBg }, Elevation[scheme][2]]}
      >
        {({ pressed }) => (
          <>
            <Text style={[styles.buttonText, { color: colors.primary }]}>여행 계획 시작하기</Text>
            {pressed && (
              <View style={[StyleSheet.absoluteFill, styles.buttonOverlay, { backgroundColor: colors.pressOverlay }]} />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: BorderRadius.lg,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...Typography['heading-lg'],
  },
  body: {
    ...Typography['body-md'],
  },
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  buttonText: {
    ...Typography['body-lg'],
  },
  buttonOverlay: {
    borderRadius: BorderRadius.md,
  },
});
