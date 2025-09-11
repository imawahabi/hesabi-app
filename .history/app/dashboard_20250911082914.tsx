import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, RefreshControl, StyleSheet, Text, View, Easing, TouchableOpacity } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animation values for entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const summaryScaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardsStaggerAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  
  // Progress animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Sticky header animation
  const stickyHeaderOpacity = useRef(new Animated.Value(0)).current;
  const stickyHeaderTranslateY = useRef(new Animated.Value(-50)).current;
  
  // Header parallax effect
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(1)).current;
  
  // Button interaction animations
  const menuButtonScale = useRef(new Animated.Value(1)).current;
  const notificationButtonScale = useRef(new Animated.Value(1)).current;

  // Initialize animations on component mount
  useEffect(() => {
    const initializeAnimations = () => {
      // Entrance animation sequence
      Animated.sequence([
        // Header slide in
        Animated.timing(headerSlideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Summary card scale and fade
        Animated.parallel([
          Animated.timing(summaryScaleAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Staggered card animations
        Animated.stagger(150, 
          cardsStaggerAnim.map(anim => 
            Animated.parallel([
              Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
            ])
          )
        ),
      ]).start();

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: mockUser.payoffProgress / 100,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // Continuous pulse animation for important elements
      const createPulseAnimation = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => createPulseAnimation());
      };
      
      setTimeout(() => createPulseAnimation(), 2000);
      setTimeout(() => setIsLoading(false), 1000);
    };

    initializeAnimations();
  }, [cardsStaggerAnim, fadeAnim, headerSlideAnim, progressAnim, pulseAnim, slideAnim, summaryScaleAnim, setIsLoading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Enhanced refresh animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Simulate data refresh with staggered card refresh
    setTimeout(() => {
      // Refresh cards with stagger effect
      Animated.stagger(100, 
        cardsStaggerAnim.map(anim => 
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.8,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
          ])
        )
      ).start();
      
      setRefreshing(false);
    }, 1500);
  }, [pulseAnim, cardsStaggerAnim]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // Header parallax effect - stays fixed until 150px, then starts fading
        const headerFadeStart = 80;
        const headerFadeEnd = 150;
        const stickyHeaderStart = 120;
        
        // Calculate header opacity and transform based on scroll
        if (offsetY <= headerFadeStart) {
          // Header fully visible and fixed
          Animated.parallel([
            Animated.timing(headerOpacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(headerTranslateY, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(headerScale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        } else if (offsetY > headerFadeStart && offsetY < headerFadeEnd) {
          // Header fading out with parallax effect
          const progress = (offsetY - headerFadeStart) / (headerFadeEnd - headerFadeStart);
          const opacity = 1 - progress;
          const translateY = -offsetY * 0.3; // Parallax effect
          const scale = 1 - progress * 0.1; // Slight scale down
          
          Animated.parallel([
            Animated.timing(headerOpacity, {
              toValue: opacity,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(headerTranslateY, {
              toValue: translateY,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(headerScale, {
              toValue: scale,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          // Header completely hidden
          Animated.parallel([
            Animated.timing(headerOpacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(headerTranslateY, {
              toValue: -100,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
        
        // Sticky header logic
        const shouldShowSticky = offsetY > stickyHeaderStart;
        
        if (shouldShowSticky !== showStickyHeader) {
          setShowStickyHeader(shouldShowSticky);
          
          // Animate sticky header with elegant entrance
          Animated.parallel([
            Animated.timing(stickyHeaderOpacity, {
              toValue: shouldShowSticky ? 1 : 0,
              duration: 400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(stickyHeaderTranslateY, {
              toValue: shouldShowSticky ? 0 : -60,
              duration: 400,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
          ]).start();
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
            opacity: stickyHeaderOpacity,
            transform: [{ translateY: stickyHeaderTranslateY }]
          }
        ]}>
          <View style={styles.stickyNavBar}>
            <Animated.View style={{ transform: [{ scale: menuButtonScale }] }}>
              <TouchableOpacity 
                style={styles.stickyNavButton}
                onPressIn={() => {
                  Animated.spring(menuButtonScale, {
                    toValue: 0.9,
                    useNativeDriver: true,
                  }).start();
                }}
                onPressOut={() => {
                  Animated.spring(menuButtonScale, {
                    toValue: 1,
                    useNativeDriver: true,
                  }).start();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="menu" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </Animated.View>
            
            <View style={styles.stickyAppNameContainer}>
              <Ionicons name="wallet" size={18} color="#3B82F6" />
              <Text style={styles.stickyAppName}>حسابي</Text>
            </View>
            
            <Animated.View style={{ transform: [{ scale: notificationButtonScale }] }}>
              <TouchableOpacity 
                style={styles.stickyNavButton}
                onPressIn={() => {
                  Animated.spring(notificationButtonScale, {
                    toValue: 0.9,
                    useNativeDriver: true,
                  }).start();
                }}
                onPressOut={() => {
                  Animated.spring(notificationButtonScale, {
                    toValue: 1,
                    useNativeDriver: true,
                  }).start();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
                <Animated.View style={[
                  styles.stickyNotificationBadge,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.stickyNotificationText}>3</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
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
        {/* Animated Header with Parallax Effect */}
        <Animated.View style={{
          transform: [
            { translateY: headerSlideAnim },
            { translateY: headerTranslateY },
            { scale: headerScale }
          ],
          opacity: Animated.multiply(fadeAnim, headerOpacity)
        }}>
          <Header userName={mockUser.name} />
        </Animated.View>

        {/* Animated Financial Summary Card with Pulse Effect */}
        <Animated.View style={{
          transform: [
            { scale: Animated.multiply(summaryScaleAnim, pulseAnim) },
            { translateY: slideAnim }
          ],
          opacity: fadeAnim
        }}>
          <FinancialSummaryCard data={financialSummaryData} />
        </Animated.View>
        
        {/* Animated Commitment Types with Slide Effect */}
        <Animated.View style={{
          opacity: cardsStaggerAnim[0],
          transform: [
            { translateY: slideAnim },
            { translateX: Animated.multiply(slideAnim, 0.3) }
          ]
        }}>
          <CommitmentTypes types={commitmentTypesData} />
        </Animated.View>

        {/* Animated Upcoming Commitments with Bounce Effect */}
        <Animated.View style={{
          opacity: cardsStaggerAnim[1],
          transform: [
            { translateY: slideAnim },
            { scale: cardsStaggerAnim[1] }
          ]
        }}>
          <UpcomingCommitments commitments={upcomingCommitmentsData} />
        </Animated.View>

        {/* Animated Recent Activities with Fade and Slide */}
        <Animated.View style={{
          opacity: cardsStaggerAnim[2],
          transform: [
            { translateY: slideAnim },
            { translateX: Animated.multiply(slideAnim, -0.2) }
          ]
        }}>
          <RecentActivities activities={recentActivitiesData} />
        </Animated.View>

        {/* Loading State Overlay */}
        {isLoading && (
          <Animated.View style={[
            styles.loadingOverlay,
            { opacity: fadeAnim }
          ]}>
            <Animated.View style={{
              transform: [{ scale: pulseAnim }]
            }}>
              <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
            </Animated.View>
          </Animated.View>
        )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.15)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    // Add backdrop blur effect simulation
    backdropFilter: 'blur(10px)',
  },
  stickyNavBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyNavButton: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
});