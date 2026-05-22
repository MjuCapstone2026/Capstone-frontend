import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useApi } from '@/hooks/useApi';
import { Alert } from '@/components/ui/Alert';
import { Typography, BorderRadius } from '@/constants/theme';
import { AlertMessages } from '@/constants/alerts';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import { PRIVACY_PREAMBLE, PRIVACY_EFFECTIVE_DATE, PRIVACY_SECTIONS } from '@/constants/privacyPolicy';
import { deleteUser } from '@/api/auth';
import { getErrorMessage } from '@/utils/getErrorMessage';
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
  const { authRequest } = useApi();
  const queryClient = useQueryClient();

  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleLogoutConfirm = async () => {
    if (isSigningOut) return;
    setLogoutAlertVisible(false);
    try {
      setIsSigningOut(true);
      queryClient.clear();
      await signOut();
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: '로그아웃에 실패했어요', text2: '다시 시도해주세요.' });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeletingAccount) return;
    setDeleteAlertVisible(false);
    try {
      setIsDeletingAccount(true);
      await authRequest(deleteUser);
      queryClient.clear();
      await signOut();
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: getErrorMessage(e) });
    } finally {
      setIsDeletingAccount(false);
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

        {/* 개인정보 */}
        <Text style={[styles.sectionLabel, { color: colors.textSub }]}>개인정보</Text>
        <Pressable
          onPress={() => setPrivacyModalVisible(true)}
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
          disabled={isDeletingAccount}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.divider }]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.menuRow}>
                <IcUserRemove width={20} height={20} color={colors.danger} />
                <Text style={[styles.menuText, { color: colors.danger }]}>회원탈퇴</Text>
                {isDeletingAccount ? (
                  <ActivityIndicator color={colors.danger} />
                ) : (
                  <View style={styles.chevronRight}>
                    <IcChevronDown width={20} height={20} color={colors.textCaption} />
                  </View>
                )}
              </View>
              {pressed && !isDeletingAccount && (
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

      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <PrivacyPolicyContent onClose={() => setPrivacyModalVisible(false)} />
      </Modal>
    </>
  );
}

function PrivacyPolicyContent({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[privacyStyles.container, { backgroundColor: colors.pageBg }]}
      contentContainerStyle={[privacyStyles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[privacyStyles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={onClose} hitSlop={12} style={privacyStyles.backButton}>
          {({ pressed }) => (
            <IcChevronDown
              width={24}
              height={24}
              color={pressed ? colors.textCaption : colors.textTitle}
              style={privacyStyles.backIcon}
            />
          )}
        </Pressable>
        <Text style={[privacyStyles.pageTitle, { color: colors.textTitle }]}>개인정보 처리방침</Text>
      </View>

      <Text style={[privacyStyles.preamble, { color: colors.textSub }]}>{PRIVACY_PREAMBLE}</Text>
      <Text style={[privacyStyles.effectiveDate, { color: colors.textCaption }]}>{PRIVACY_EFFECTIVE_DATE}</Text>

      {PRIVACY_SECTIONS.map((section) => (
        <View key={section.title} style={privacyStyles.section}>
          <Text style={[privacyStyles.sectionTitle, { color: colors.textTitle }]}>{section.title}</Text>
          <Text style={[privacyStyles.sectionBody, { color: colors.textSub }]}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const privacyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    transform: [{ rotate: '90deg' }],
  },
  pageTitle: {
    ...Typography['heading-lg'],
  },
  preamble: {
    ...Typography['body-md'],
    lineHeight: 22,
  },
  effectiveDate: {
    ...Typography['caption'],
    marginTop: -12,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography['body-lg'],
  },
  sectionBody: {
    ...Typography['body-md'],
    lineHeight: 22,
  },
});

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
  versionText: {
    ...Typography['caption'],
    textAlign: 'center',
    marginTop: 16,
  },
});
