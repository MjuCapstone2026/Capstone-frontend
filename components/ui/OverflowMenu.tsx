import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcRename from '@/assets/icons/ic_rename.svg';
import IcEditInfo from '@/assets/icons/ic_edit_info.svg';
import IcViewPlan from '@/assets/icons/ic_view_plan.svg';
import IcDelete from '@/assets/icons/ic_delete.svg';

type IconComponent = React.ComponentType<{ width: number; height: number; color: string }>;

type MenuItem = {
  label: string;
  icon: IconComponent;
  isDanger: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  position: { top: number; right: number };
  onClose: () => void;
  onRename: () => void;
  onEditInfo: () => void;
  onViewPlan: () => void;
  onDelete: () => void;
};

export function OverflowMenu({
  visible,
  position,
  onClose,
  onRename,
  onEditInfo,
  onViewPlan,
  onDelete,
}: Props) {
  const { colors, scheme } = useTheme();

  const menuItems: MenuItem[] = [
    { label: '채팅방 이름 변경', icon: IcRename, isDanger: false, onPress: onRename },
    { label: '기본 정보 수정', icon: IcEditInfo, isDanger: false, onPress: onEditInfo },
    { label: '일정 보기', icon: IcViewPlan, isDanger: false, onPress: onViewPlan },
    { label: '삭제', icon: IcDelete, isDanger: true, onPress: onDelete },
  ];

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View
          style={[
            styles.menu,
            {
              top: position.top,
              right: position.right,
              backgroundColor: colors.cardBg,
            },
            Elevation[scheme][4],
          ]}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const textColor = item.isDanger ? colors.danger : colors.textTitle;
            return (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                )}
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    item.onPress();
                  }}
                >
                  {({ pressed }) => (
                    <>
                      <Icon width={16} height={16} color={textColor} />
                      <Text style={[styles.menuText, { color: textColor }]}>{item.label}</Text>
                      {pressed && (
                        <View
                          style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]}
                        />
                      )}
                    </>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: 160,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  menuText: {
    ...Typography['caption'],
  },
});
