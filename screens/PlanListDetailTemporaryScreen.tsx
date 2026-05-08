import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

type Props = {
  id: string;
};

export function PlanListDetailTemporaryScreen({ id }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>여행 일정 상세</Text>
      <Text style={[styles.description, { color: colors.textCaption }]}>
        상세 화면은 추후 구현 예정입니다.
      </Text>
      <Text style={[styles.idText, { color: colors.textCaption }]}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    ...Typography['heading-md'],
  },
  description: {
    ...Typography['body-md'],
    textAlign: 'center',
  },
  idText: {
    ...Typography['caption'],
    textAlign: 'center',
  },
});
