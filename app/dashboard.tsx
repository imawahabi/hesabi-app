import { Ionicons } from '@expo/vector-icons';
import { Notification } from 'iconsax-react-nativejs';
import React, { useRef, useState } from 'react';
import { Animated, Easing, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddCommitmentModal from './components/AddCommitmentModal';
import CommitmentTypes from './components/CommitmentTypes';
import FinancialSummaryCard from './components/FinancialSummaryCard';
import Header from './components/Header';
import NotificationsModal from './components/NotificationsModal';
import PaymentRecordModal from './components/PaymentRecordModal';
import PostponeModal from './components/PostponeModal';
import RecentActivities from './components/RecentActivities';
import SidebarMenu from './components/SidebarMenu';
import UpcomingCommitments from './components/UpcomingCommitments';

// Realistic financial data based on Kuwait market
const mockUser = {
  name: 'محمد أحمد',
  monthlyIncome: 520, // KWD - Average Kuwait salary
  totalCommitments: 11250, // Total outstanding debt
  monthlyCommitments: 312.25, // Monthly payment obligations
  paidThisMonth: 120, // Already paid this month
  remainingThisMonth: 155.25, // Still due this month
  availableIncome: 188.75, // Income after commitments (1200 - 680)
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

type RecentActivityItem = {
  id: number;
  title: string;
  time: string;
  amount?: number;
  color: string;
  type: 'payment' | 'reminder' | 'new' | 'update';
  progress?: string;
};

const recentActivitiesData: RecentActivityItem[] = [
  { 
    id: 1, 
    title: 'تم سداد قسط السيارة', 
    amount: 100, 
    type: 'payment', 
    color: '#10B981', 
    time: 'منذ ساعتين',
    progress: '+2.5%'
  },
  { 
    id: 2, 
    title: 'تذكير: فاتورة الكهرباء متأخرة', 
    amount: 45, 
    type: 'reminder', 
    color: '#EF4444', 
    time: 'منذ يومين',
    progress: '-0.5%'
  },
  { 
    id: 3, 
    title: 'تحديث الراتب الشهري', 
    amount: 1200, 
    type: 'update', 
    color: '#3B82F6', 
    time: 'أمس',
    progress: 'تحسن الوضع المالي'
  },
  { 
    id: 4, 
    title: 'إضافة التزام جديد: إيجار الشقة', 
    amount: 300, 
    type: 'new', 
    color: '#3B82F6', 
    time: 'منذ 3 أيام',
    progress: 'تمت الإضافة'
  },
  { 
    id: 5, 
    title: 'تذكير: قسط بنك - بعد 5 أيام', 
    amount: 180, 
    type: 'reminder', 
    color: '#F59E0B', 
    time: 'منذ 4 أيام',
    progress: 'موعد قريب'
  },
  { 
    id: 6, 
    title: 'تم سداد فاتورة الإنترنت', 
    amount: 12, 
    type: 'payment', 
    color: '#10B981', 
    time: 'منذ 5 أيام',
    progress: '+0.3%'
  },
  { 
    id: 7, 
    title: 'تحديث: تعديل ميزانية الشهر', 
    amount: 0, 
    type: 'update', 
    color: '#64748B', 
    time: 'منذ 6 أيام',
    progress: 'تم التعديل'
  },
  { 
    id: 8, 
    title: 'إضافة التزام جديد: جمعية', 
    amount: 50, 
    type: 'new', 
    color: '#8B5CF6', 
    time: 'منذ أسبوع',
    progress: 'تمت الإضافة'
  },
  { 
    id: 9, 
    title: 'تذكير: قسط السيارة بعد 10 أيام', 
    amount: 100, 
    type: 'reminder', 
    color: '#F59E0B', 
    time: 'منذ 8 أيام',
    progress: 'موعد قريب'
  },
  { 
    id: 10, 
    title: 'تم سداد دين شخصي', 
    amount: 80, 
    type: 'payment', 
    color: '#10B981', 
    time: 'منذ 9 أيام',
    progress: '+1.0%'
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddCommitmentModal, setShowAddCommitmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState<any>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyHeaderAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const menuButtonScale = useRef(new Animated.Value(1)).current;
  const notificationButtonScale = useRef(new Animated.Value(1)).current;
  
  // Component entrance animations
  const financialCardAnim = useRef(new Animated.Value(0)).current;
  const commitmentTypesAnim = useRef(new Animated.Value(0)).current;
  const upcomingCommitmentsAnim = useRef(new Animated.Value(0)).current;
  const recentActivitiesAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    // Staggered entrance animations for dashboard components
    const entranceAnimations = [
      Animated.timing(financialCardAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(commitmentTypesAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(upcomingCommitmentsAnim, {
        toValue: 1,
        duration: 600,
        delay: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(recentActivitiesAnim, {
        toValue: 1,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ];
    
    Animated.stagger(100, entranceAnimations).start();
  }, [financialCardAnim, commitmentTypesAnim, upcomingCommitmentsAnim, recentActivitiesAnim]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh with staggered animations
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Button press animations
  const handleMenuPress = () => {
    Animated.sequence([
      Animated.timing(menuButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(menuButtonScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      })
    ]).start();
    // Open sidebar menu
    setShowSidebar(true);
  };

  const handleNotificationPress = () => {
    Animated.sequence([
      Animated.timing(notificationButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(notificationButtonScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      })
    ]).start();
    // Open notifications modal
    setShowNotificationsModal(true);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // Header parallax effect - stays fixed until 80px, then fades out until 150px
        if (offsetY <= 80) {
          headerOpacity.setValue(1);
          headerTranslateY.setValue(0);
        } else if (offsetY <= 150) {
          const progress = (offsetY - 80) / 70; // 0 to 1
          headerOpacity.setValue(1 - progress * 0.8); // Fade to 20% opacity
          headerTranslateY.setValue(-offsetY * 0.3); // Parallax movement
        } else {
          headerOpacity.setValue(0.2);
          headerTranslateY.setValue(-offsetY * 0.3);
        }
        
        // Sticky header animation - appears at 120px with smooth slide-down
        if (offsetY > 120 && !showStickyHeader) {
          setShowStickyHeader(true);
          Animated.timing(stickyHeaderAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.back(1.2),
            useNativeDriver: true,
          }).start();
        } else if (offsetY <= 120 && showStickyHeader) {
          Animated.timing(stickyHeaderAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.cubic,
            useNativeDriver: true,
          }).start(() => {
            setShowStickyHeader(false);
          });
        }
      },
    }
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <Animated.View style={[
          styles.stickyHeader,
          {
            transform: [{
              translateY: stickyHeaderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })
            }],
            opacity: stickyHeaderAnim,
          }
        ]}>
          <View style={styles.stickyContainer}>
            <TouchableOpacity 
              style={styles.stickyMenuButton}
              onPress={handleMenuPress}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={28} color="#363636" />
            </TouchableOpacity>
            
            <View style={styles.stickyTitleContainer}>
              <Text style={styles.stickyTitle}>حسابي</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.stickyNotificationButton}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
            >
              <Notification size={22} color="#1F2937" variant="Bold" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
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
          />
        }
      >
        <Animated.View style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }}>
          <Header 
            userName={mockUser.name} 
            onMenuPress={() => setShowSidebar(true)}
          />
        </Animated.View>
        
        <SidebarMenu 
          visible={showSidebar}
          onClose={() => setShowSidebar(false)}
          userName={mockUser.name}
          userEmail="user@example.com"
          onAddCommitment={() => {
            setShowSidebar(false);
            setShowAddCommitmentModal(true);
          }}
        />
        
        {/* Content Sections with Simple Animations */}
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.sectionContainer, {
            opacity: financialCardAnim,
            transform: [{ translateY: financialCardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })}]
          }]}>
            <FinancialSummaryCard data={financialSummaryData} scrollY={scrollY} />
          </Animated.View>
          
          <Animated.View style={[styles.sectionContainer, {
            opacity: commitmentTypesAnim,
            transform: [{ translateY: commitmentTypesAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })}]
          }]}>
            <CommitmentTypes 
              types={commitmentTypesData} 
              onAddCommitment={() => setShowAddCommitmentModal(true)}
            />
          </Animated.View>
          
          <Animated.View style={[styles.sectionContainer, {
            opacity: upcomingCommitmentsAnim,
            transform: [{ translateY: upcomingCommitmentsAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })}]
          }]}>
            <UpcomingCommitments 
              commitments={upcomingCommitmentsData} 
              onPayCommitment={(commitment) => {
                setSelectedCommitment({
                  name: commitment.name,
                  institution: commitment.type,
                  amount: commitment.amount.toString(),
                  remainingAmount: (commitment.amount * 10).toString(),
                  remainingInstallments: 12,
                  icon: commitment.type === 'قرض بنكي' ? 'card' : 
                        commitment.type === 'إيجار' ? 'home' :
                        commitment.type === 'قسط' ? 'time' : 'flash',
                  color: commitment.color
                });
                setShowPaymentModal(true);
              }}
              onPostponeCommitment={(commitment) => {
                setSelectedCommitment({
                  name: commitment.name,
                  institution: commitment.type,
                  amount: commitment.amount.toString(),
                  dueDate: commitment.dueDate,
                  icon: commitment.type === 'قرض بنكي' ? 'card' : 
                        commitment.type === 'إيجار' ? 'home' :
                        commitment.type === 'قسط' ? 'time' : 'flash',
                  color: commitment.color
                });
                setShowPostponeModal(true);
              }}
            />
          </Animated.View>
          
          <Animated.View style={[styles.sectionContainer, {
            opacity: recentActivitiesAnim,
            transform: [{ translateY: recentActivitiesAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })}]
          }]}>
            <RecentActivities activities={recentActivitiesData} />
          </Animated.View>
        </View>
      </Animated.ScrollView>
      
      
      <AddCommitmentModal 
        visible={showAddCommitmentModal}
        onClose={() => setShowAddCommitmentModal(false)}
        onSubmit={(commitmentData) => {
          console.log('New commitment:', commitmentData);
          setShowAddCommitmentModal(false);
          // TODO: Add commitment to state/database
        }}
      />
      
      <PaymentRecordModal
        visible={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedCommitment(null);
        }}
        onSubmit={(paymentData) => {
          console.log('Payment recorded:', paymentData, 'for commitment:', selectedCommitment);
          // TODO: Process payment and update commitment status
          alert('تم تسجيل الدفعة بنجاح!');
        }}
        commitmentData={selectedCommitment}
      />
      
      <PostponeModal
        visible={showPostponeModal}
        onClose={() => {
          setShowPostponeModal(false);
          setSelectedCommitment(null);
        }}
        onSubmit={(postponeData) => {
          console.log('Commitment postponed:', postponeData, 'for commitment:', selectedCommitment);
          // TODO: Update commitment due date
          alert('تم تأجيل الالتزام بنجاح!');
        }}
        commitmentData={selectedCommitment}
      />
      
      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={[
          { id: 1, title: 'دفعة مسجلة', message: 'تم تسجيل دفعة قسط السيارة', time: 'قبل ساعة', type: 'payment', read: false, amount: 100 },
          { id: 2, title: 'تذكير استحقاق', message: 'فاتورة الكهرباء مستحقة خلال 3 أيام', time: 'اليوم', type: 'reminder', read: false },
          { id: 3, title: 'إنجاز', message: 'أكملت 30% من خطة السداد', time: 'أمس', type: 'achievement', read: true },
        ]}
        onMarkAsRead={(id) => {
          // TODO: integrate with store later
        }}
        onMarkAllAsRead={() => {
          // TODO: integrate with store later
        }}
      />

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
  // Simplified Sticky Header
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 45,
    paddingBottom: 12,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  stickyContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  stickyMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stickyTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stickyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  stickyNotificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  
  // Content Layout
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
  },
});