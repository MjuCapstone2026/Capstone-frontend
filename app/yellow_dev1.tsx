import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { QuickMenu } from '@/components/QuickMenu';
import { RecentChatSection } from '@/components/RecentChatSection';
import { RecentTravelSection } from '@/components/RecentTravelSection';
import { RenameChatModal } from '@/components/RenameChatModal';
import { ReservationCard } from '@/components/ReservationCard';
import { NavigationDrawer } from '@/components/ui/NavigationDrawer';
import { OverflowMenu } from '@/components/ui/OverflowMenu';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { borderBottomColor: colors.divider, color: colors.textTitle }]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const SAMPLE_CHATS = [
  { id: 1, title: '제주도 3박 4일 여행 계획', aiSummary: '렌트카 포함 일정 생성 완료', updatedAt: '방금 전' },
  { id: 2, title: '부산 당일치기', aiSummary: '해운대 → 광안리 → 국제시장 코스 추천', updatedAt: '어제' },
];

const SAMPLE_TRAVELS = [
  { id: 1, title: '제주도 3박 4일', dateRange: '2025.06.10 ~ 2025.06.13', status: 'upcoming' as const },
  { id: 2, title: '부산 당일치기', dateRange: '2025.04.20', status: 'completed' as const },
];

export default function YellowDev1Screen() {
  const { colors } = useTheme();

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [overflowMenuVisible, setOverflowMenuVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]}>

      <Section title="QuickMenu">
        <QuickMenu
          onChatPress={() => {}}
          onPlanPress={() => {}}
        />
      </Section>

      <Section title="RecentChatSection">
        <RecentChatSection
          chats={SAMPLE_CHATS}
          onChatPress={() => {}}
          onMorePress={() => {}}
        />
      </Section>

      <Section title="RecentTravelSection">
        <RecentTravelSection
          travels={SAMPLE_TRAVELS}
          onTravelPress={() => {}}
          onMorePress={() => {}}
        />
      </Section>

      <Section title="RenameChatModal">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setRenameModalVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>RenameChatModal 열기</Text>
        </Pressable>
        <RenameChatModal
          visible={renameModalVisible}
          initialName="제주도 3박 4일 여행 계획"
          onSave={() => setRenameModalVisible(false)}
          onCancel={() => setRenameModalVisible(false)}
        />
      </Section>

      <Section title="ReservationCard — 예약">
        <ReservationCard
          vendor="롯데렌터카"
          carModel="쏘나타 (준중형)"
          pickupDateTime="2025.06.10 (화) 10:00"
          pickupLocation="제주국제공항"
          dropoffDateTime="2025.06.13 (금) 18:00"
          dropoffLocation="제주국제공항"
          price="₩ 210,000"
          bookedBy="ai"
          reservationNumber="RC-20250610-001"
          reservationDate="2025.05.20"
          status="active"
        />
      </Section>

      <Section title="ReservationCard — 취소">
        <ReservationCard
          vendor="제주렌트카"
          carModel="아반떼 (소형)"
          pickupDateTime="2025.04.20 (일) 09:00"
          pickupLocation="제주국제공항"
          dropoffDateTime="2025.04.20 (일) 20:00"
          dropoffLocation="제주국제공항"
          price="₩ 85,000"
          bookedBy="user"
          reservationNumber="RC-20250420-002"
          reservationDate="2025.03.15"
          status="cancelled"
        />
      </Section>

      <Section title="NavigationDrawer">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setDrawerVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>NavigationDrawer 열기</Text>
        </Pressable>
        <NavigationDrawer
          visible={drawerVisible}
          chats={[
            { id: 1, title: '제주도 3박 4일 여행 계획' },
            { id: 2, title: '부산 당일치기' },
            { id: 3, title: '강릉 1박 2일 카페 투어' },
            { id: 4, title: '경주 역사 여행' },
          ]}
          activeChatId={1}
          onClose={() => setDrawerVisible(false)}
          onNewChat={() => setDrawerVisible(false)}
          onChatPress={() => setDrawerVisible(false)}
          onChatLongPress={() => {}}
        />
      </Section>

      <Section title="OverflowMenu">
        <Pressable
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => setOverflowMenuVisible(true)}
        >
          <Text style={[styles.openButtonText, { color: colors.cardBg }]}>OverflowMenu 열기</Text>
        </Pressable>
        <OverflowMenu
          visible={overflowMenuVisible}
          position={{ top: 120, right: 16 }}
          onClose={() => setOverflowMenuVisible(false)}
          onRename={() => setOverflowMenuVisible(false)}
          onEditInfo={() => setOverflowMenuVisible(false)}
          onViewPlan={() => setOverflowMenuVisible(false)}
          onDelete={() => setOverflowMenuVisible(false)}
        />
      </Section>

      <Section title="PrimaryButton">
        <PrimaryButton label="채팅방 생성하기" onPress={() => {}} />
        <PrimaryButton label="수정하기 (비활성)" onPress={() => {}} disabled />
      </Section>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography['heading-sm'],
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  sectionContent: {
    gap: 8,
  },
  openButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  openButtonText: {
    ...Typography['body-md'],
    fontWeight: '600',
  },
});
