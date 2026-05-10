import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Alert } from '@/components/ui/Alert';
import { Typography, BorderRadius } from '@/constants/theme';
import { AlertMessages } from '@/constants/alerts';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import IcNotification from '@/assets/icons/ic_notification.svg';
import IcPrivacy from '@/assets/icons/ic_privacy.svg';
import IcLogout from '@/assets/icons/ic_logout.svg';
import IcUserRemove from '@/assets/icons/ic_user_remove.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

const formatJoinDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 가입`;
};

export function SettingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();

  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoutConfirm = async () => {
    if (isSigningOut) return;
    setLogoutAlertVisible(false);
    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;
    setDeleteAlertVisible(false);
    try {
      setIsDeleting(true);
      await user?.delete();
    } finally {
      setIsDeleting(false);
    }
  };

  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const joinDate = formatJoinDate(user?.createdAt);

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.pageBg }]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.textTitle }]}>설정</Text>

        {/* 프로필 */}
        <Text style={[styles.sectionLabel, { color: colors.textSub }]}>프로필</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}>
          <Text style={[styles.menuText, { color: colors.textTitle }]}>{email}</Text>
          <Text style={[styles.captionText, { color: colors.textCaption }]}>{joinDate}</Text>
        </View>

        {/* 알림 */}
        <Text style={[styles.sectionLabel, { color: colors.textSub }]}>알림</Text>
        <Pressable
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.menuRow}>
                <IcNotification width={20} height={20} color={colors.textCaption} />
                <Text style={[styles.menuText, { color: colors.textTitle }]}>알림 설정</Text>
                <View style={styles.chevronRight}>
                  <IcChevronDown width={20} height={20} color={colors.textCaption} />
                </View>
              </View>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, styles.cardOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>

        {/* 개인정보 */}
        <Text style={[styles.sectionLabel, { color: colors.textSub }]}>개인정보</Text>
        <Pressable
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.menuRow}>
                <IcPrivacy width={20} height={20} color={colors.textCaption} />
                <Text style={[styles.menuText, { color: colors.textTitle }]}>개인정보 처리방침</Text>
                <View style={styles.chevronRight}>
                  <IcChevronDown width={20} height={20} color={colors.textCaption} />
                </View>
              </View>
              {pressed && (
                <View style={[StyleSheet.absoluteFill, styles.cardOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>

        {/* 로그아웃 */}
        <Pressable
          onPress={() => setLogoutAlertVisible(true)}
          disabled={isSigningOut}
          style={[
            styles.card,
            { backgroundColor: colors.dangerBg, borderColor: colors.danger },
          ]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.logoutRow}>
                <IcLogout width={20} height={20} color={colors.danger} />
                {isSigningOut ? (
                  <ActivityIndicator color={colors.danger} />
                ) : (
                  <Text style={[styles.logoutText, { color: colors.danger }]}>로그아웃</Text>
                )}
              </View>
              {pressed && !isSigningOut && (
                <View style={[StyleSheet.absoluteFill, styles.cardOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>

        {/* 계정 */}
        <Text style={[styles.sectionLabel, { color: colors.textSub }]}>계정</Text>
        <Pressable
          onPress={() => setDeleteAlertVisible(true)}
          disabled={isDeleting}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.menuRow}>
                <IcUserRemove width={20} height={20} color={colors.danger} />
                {isDeleting ? (
                  <ActivityIndicator color={colors.danger} style={styles.menuLoader} />
                ) : (
                  <Text style={[styles.menuText, { color: colors.danger }]}>회원탈퇴</Text>
                )}
                <View style={styles.chevronRight}>
                  <IcChevronDown width={20} height={20} color={colors.textCaption} />
                </View>
              </View>
              {pressed && !isDeleting && (
                <View style={[StyleSheet.absoluteFill, styles.cardOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>

        <Text style={[styles.versionText, { color: colors.textCaption }]}>버전 v1.0.0</Text>
      </ScrollView>

      <Alert
        visible={logoutAlertVisible}
        {...AlertMessages.logout}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutAlertVisible(false)}
      />

      <Alert
        visible={deleteAlertVisible}
        {...AlertMessages.deleteAccount}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteAlertVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 72,
    gap: 8,
  },
  pageTitle: {
    ...Typography['heading-lg'],
    marginBottom: 8,
  },
  sectionLabel: {
    ...Typography['body-md'],
    marginTop: 8,
    marginBottom: 2,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  cardOverlay: {
    borderRadius: BorderRadius.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  menuText: {
    ...Typography['body-lg'],
    flex: 1,
  },
  logoutText: {
    ...Typography['body-lg'],
  },
  captionText: {
    ...Typography['caption'],
    marginTop: 2,
  },
  chevronRight: {
    transform: [{ rotate: '-90deg' }],
  },
  menuLoader: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  versionText: {
    ...Typography['caption'],
    textAlign: 'center',
    marginTop: 16,
  },
});
