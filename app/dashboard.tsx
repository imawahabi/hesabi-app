import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';
import BottomNav from './components/BottomNav';
import CommitmentTypes from './components/CommitmentTypes';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import Header from './components/Header';
import RecentActivities from './components/RecentActivities';
import UpcomingCommitments from './components/UpcomingCommitments';

// Realistic financial data based on Kuwait market
const mockUser = {
  name: 'محمد أحمد',
  monthlyIncome: 1200, // KWD - Average Kuwait salary
  totalCommitments: 8500, // Total outstanding debt
  monthlyCommitments: 680, // Monthly payment obligations
  paidThisMonth: 450, // Already paid this month
  remainingThisMonth: 230, // Still due this month
  availableIncome: 520, // Income after commitments (1200 - 680)
  debtToIncomeRatio: 56.7, // (680/1200) * 100
  payoffProgress: 35, // Overall debt elimination progress
};

const commitmentTypesData = [
  { 
    id: 1, 
    name: 'إيجارات', 
    icon: 'home' as const, 
    color: '#3B82F6', 
    count: 1,
    monthlyAmount: 450,
    totalAmount: 5400,
    priority: 'high' as const,
    nextPayment: '15 أكتوبر'
  },
  { 
    id: 2, 
    name: 'قروض بنكية', 
    icon: 'card' as const, 
    color: '#EF4444', 
    count: 3,
    monthlyAmount: 180,
    totalAmount: 8640,
    priority: 'high' as const,
    nextPayment: '20 أكتوبر'
  },
  { 
    id: 3, 
    name: 'أقساط', 
    icon: 'time' as const, 
    color: '#F59E0B', 
    count: 2,
    monthlyAmount: 50,
    totalAmount: 1200,
    priority: 'medium' as const,
    nextPayment: '25 أكتوبر'
  },
  { 
    id: 4, 
    name: 'ديون شخصية', 
    icon: 'people' as const, 
    color: '#10B981', 
    count: 2,
    monthlyAmount: 80,
    totalAmount: 960,
    priority: 'low' as const,
    nextPayment: '30 أكتوبر'
  },
];

const upcomingCommitmentsData = [
  { 
    id: 1, 
    name: 'قسط بيت التمويل الكويتي', 
    amount: 180, 
    dueDate: '15/09/2025', 
    type: 'قرض بنكي', 
    overdue: false, 
    color: '#3B82F6',
    daysLeft: 5,
    priority: 'high'
  },
  { 
    id: 2, 
    name: 'إيجار شقة', 
    amount: 300, 
    dueDate: '01/10/2025', 
    type: 'إيجار', 
    overdue: false, 
    color: '#F59E0B',
    daysLeft: 21,
    priority: 'medium'
  },
  { 
    id: 3, 
    name: 'قسط سيارة', 
    amount: 100, 
    dueDate: '25/09/2025', 
    type: 'قسط', 
    overdue: false, 
    color: '#10B981',
    daysLeft: 15,
    priority: 'medium'
  },
  { 
    id: 4, 
    name: 'فاتورة الكهرباء', 
    amount: 45, 
    dueDate: '08/09/2025', 
    type: 'فاتورة', 
    overdue: true, 
    color: '#EF4444',
    daysLeft: -2,
    priority: 'urgent'
  },
];

const recentActivitiesData = [
  { 
    id: 1, 
    title: 'تم سداد قسط السيارة', 
    amount: 100, 
    type: 'payment', 
    color: '#10B981', 
    time: 'منذ ساعتين',
    progress: '+2.5%' // Progress toward debt freedom
  },
  { 
    id: 2, 
    title: 'تذكير: فاتورة الكهرباء متأخرة', 
    amount: 45, 
    type: 'overdue', 
    color: '#EF4444', 
    time: 'منذ يومين',
    progress: '-0.5%' // Negative impact
  },
  { 
    id: 3, 
    title: 'تحديث الراتب الشهري', 
    amount: 1200, 
    type: 'income', 
    color: '#3B82F6', 
    time: 'أمس',
    progress: 'تحسن الوضع المالي'
  },
];

const financialSummaryData = {
  title: 'رحلتك نحو الحرية المالية',
  amount: mockUser.totalCommitments,
  paidAmount: mockUser.paidThisMonth,
  upcomingAmount: mockUser.remainingThisMonth,
  monthlyIncome: mockUser.monthlyIncome,
  monthlyCommitments: mockUser.monthlyCommitments,
  availableIncome: mockUser.availableIncome,
  debtToIncomeRatio: mockUser.debtToIncomeRatio,
  payoffProgress: mockUser.payoffProgress,
  trendIcon: mockUser.payoffProgress > 30 ? 'trending-up' : 'trending-down',
  trendText: `${mockUser.payoffProgress}% من التقدم`,
  trendColor: mockUser.payoffProgress > 50 ? '#10B981' : mockUser.payoffProgress > 30 ? '#F59E0B' : '#EF4444',
};


export default function Dashboard() {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowStickyHeader(offsetY > 100);
      },
    }
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <Animated.View style={styles.stickyHeader}>
          <View style={styles.stickyNavBar}>
            <View style={styles.stickyNavButton}>
              <Ionicons name="menu" size={20} color="#3B82F6" />
            </View>
            <View style={styles.stickyAppNameContainer}>
              <Ionicons name="wallet" size={18} color="#3B82F6" />
              <Text style={styles.stickyAppName}>حسابي</Text>
            </View>
            <View style={styles.stickyNavButton}>
              <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
              <View style={styles.stickyNotificationBadge}>
                <Text style={styles.stickyNotificationText}>3</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6', '#10B981', '#F59E0B']}
            tintColor="#3B82F6"
            title="جاري تحديث البيانات..."
            titleColor="#3B82F6"
            progressBackgroundColor="#F8FAFF"
            progressViewOffset={20}
          />
        }
      >
        <Header userName={mockUser.name} />
        <FinancialSummaryCard data={financialSummaryData} />
        
        <CommitmentTypes types={commitmentTypesData} />
        <UpcomingCommitments commitments={upcomingCommitmentsData} />
        <RecentActivities activities={recentActivitiesData} />
      </Animated.ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    paddingBottom: 100, // To make space for the bottom nav
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  stickyNavBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyNavButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  stickyAppNameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  stickyAppName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginRight: 6,
  },
  stickyNotificationBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyNotificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  healthOverviewContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  healthMetricsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  healthMetric: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  healthMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginBottom: 5,
  },
  healthMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  healthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
});