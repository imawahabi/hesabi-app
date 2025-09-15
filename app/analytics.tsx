import {
  ArrowDown,
  ArrowUp,
  Bag2,
  Card as CardIcon,
  Category,
  Danger,
  Eye,
  Flash,
  Home3,
  InfoCircle,
  MoneyRecive,
  More,
  TickCircle,
  TrendUp,
  Wallet as WalletIcon,
} from 'iconsax-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SubPageHeader from './components/SubPageHeader';

const isRTL = I18nManager.isRTL;

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  const scrollY = useRef(new Animated.Value(0)).current;
  // Sticky tabs lift using transform (native driver)
  const clampedScrollY = Animated.diffClamp(scrollY, 0, 120);
  const tabsTranslateY = clampedScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -32],
    extrapolate: 'clamp',
  });
  const tabsOpacity = clampedScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 1],
    extrapolate: 'clamp',
  });
  const tabsScaleY = clampedScrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.92],
    extrapolate: 'clamp',
  });
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useMemo(() => [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ], []);
  
  // RTL support - use global constant
  // const isRTL = I18nManager.isRTL || true; // Force RTL for Arabic
  
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Staggered card animations
    const cardAnimationSequence = cardAnimations.map((anim: Animated.Value, index: number) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(100, cardAnimationSequence).start();
  }, [fadeAnim, slideAnim, cardAnimations]);
  
  const periods = [
    { id: 'all', name: 'كامل' },
    { id: 'week', name: 'أسبوع' },
    { id: 'month', name: 'شهر' },
    { id: 'quarter', name: '3 أشهر' },
    { id: 'year', name: 'سنة' },
  ];

  // Helpers: dynamic period labels and simple value projections
  const getPeriodDescriptor = (periodId: string) => {
    switch (periodId) {
      case 'week':
        return { paid: 'هذا الأسبوع', remaining: 'هذا الأسبوع' };
      case 'month':
        return { paid: 'هذا الشهر', remaining: 'هذا الشهر' };
      case 'quarter':
        return { paid: 'خلال 3 أشهر', remaining: 'خلال 3 أشهر' };
      case 'year':
        return { paid: 'هذا العام', remaining: 'هذا العام' };
      case 'all':
        return { paid: 'طوال الفترة', remaining: 'طوال الفترة' };
      default:
        return { paid: 'هذا الشهر', remaining: 'هذا الشهر' };
    }
  };

  // Map Arabic category label to an Iconsax icon (reference: AddCommitmentModal.tsx)
  const getCategoryIconForName = (name: string): React.ComponentType<any> => {
    switch (name) {
      case 'قروض بنكية':
        return CardIcon;
      case 'إيجارات':
        return Home3;
      case 'أقساط':
        return Bag2;
      case 'فواتير':
        return Flash;
      default:
        return Category; // fallback
    }
  };

  const getPeriodFactor = (periodId: string) => {
    switch (periodId) {
      case 'week':
        return 1 / 4; // تقريبياً أسبوع من شهر
      case 'month':
        return 1;
      case 'quarter':
        return 3;
      case 'year':
        return 12;
      case 'all':
        return 12; // تقدير مبدئي حتى تتوفر بيانات فعلية لكل الفترة
      default:
        return 1;
    }
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: Eye },
    { id: 'breakdown', name: 'التفصيل', icon: Category },
    { id: 'trends', name: 'الاتجاهات', icon: TrendUp },
    { id: 'insights', name: 'الرؤى', icon: InfoCircle },
  ];

  const financialData = {
    totalCommitments: 1250.750,
    monthlyPayments: 415.125,
    paidThisMonth: 380.500,
    remainingThisMonth: 34.625,
    debtToIncomeRatio: 0.42,
    monthlyIncome: 1000.000,
    savingsRate: 0.15,
    paymentStreak: 12,
    totalPaidToDate: 4980.500,
    totalRemaining: 8750.250,
    paymentRate: 91.7,
  };

  const commitmentsByType = [
    { 
      type: 'قروض بنكية', 
      amount: 450.250, 
      percentage: 36, 
      color: '#3B82F6', 
      icon: CardIcon, 
      trend: -2.5,
      monthlyPayment: 120.000,
      totalAmount: 2400.000,
      paidAmount: 960.000,
      remainingAmount: 1440.000,
      incomePercentage: 12.0,
      paymentHistory: 8,
      nextPaymentDate: '2024-01-15',
      status: 'منتظم',
      interestRate: 7.5,
    },
    { 
      type: 'إيجارات', 
      amount: 350.000, 
      percentage: 28, 
      color: '#06B6D4', 
      icon: Home3, 
      trend: 0,
      monthlyPayment: 350.000,
      totalAmount: 4200.000,
      paidAmount: 1750.000,
      remainingAmount: 2450.000,
      incomePercentage: 35.0,
      paymentHistory: 5,
      nextPaymentDate: '2024-01-01',
      status: 'منتظم',
      contractDuration: 12,
    },
    { 
      type: 'أقساط', 
      amount: 280.500, 
      percentage: 22, 
      color: '#10B981', 
      icon: Bag2, 
      trend: 5.2,
      monthlyPayment: 93.500,
      totalAmount: 1870.000,
      paidAmount: 748.000,
      remainingAmount: 1122.000,
      incomePercentage: 9.35,
      paymentHistory: 8,
      nextPaymentDate: '2024-01-10',
      status: 'منتظم',
      installmentCount: 20,
    },
    { 
      type: 'فواتير', 
      amount: 120.000, 
      percentage: 10, 
      color: '#F59E0B', 
      icon: Flash, 
      trend: 1.8,
      monthlyPayment: 120.000,
      totalAmount: 120.000,
      paidAmount: 120.000,
      remainingAmount: 0.000,
      incomePercentage: 12.0,
      paymentHistory: 12,
      nextPaymentDate: '2024-01-30',
      status: 'منتظم',
      recurring: true,
    },
    { 
      type: 'أخرى', 
      amount: 50.000, 
      percentage: 4, 
      color: '#8B5CF6', 
      icon: More, 
      trend: -8.5,
      monthlyPayment: 50.000,
      totalAmount: 600.000,
      paidAmount: 200.000,
      remainingAmount: 400.000,
      incomePercentage: 5.0,
      paymentHistory: 4,
      nextPaymentDate: '2024-01-20',
      status: 'متأخر',
      daysOverdue: 5,
    },
  ];

  const monthlyTrend = [
    { month: 'يناير', paid: 400, planned: 415, savings: 60, efficiency: 96.4 },
    { month: 'فبراير', paid: 415, planned: 415, savings: 85, efficiency: 100.0 },
    { month: 'مارس', paid: 380, planned: 415, savings: 45, efficiency: 91.6 },
    { month: 'أبريل', paid: 415, planned: 415, savings: 90, efficiency: 100.0 },
    { month: 'مايو', paid: 395, planned: 415, savings: 70, efficiency: 95.2 },
    { month: 'يونيو', paid: 415, planned: 415, savings: 95, efficiency: 100.0 },
  ];

  const trendAnalytics = {
    paymentConsistency: 94.7,
    averageEfficiency: 97.2,
    totalSavings: 445,
    bestMonth: 'فبراير',
    improvement: 8.5,
    riskScore: 15,
  };

  const categoryTrends = [
    { category: 'قروض بنكية', trend: -5.2, amount: 450, color: '#3B82F6' },
    { category: 'إيجارات', trend: 0, amount: 350, color: '#06B6D4' },
    { category: 'أقساط', trend: 8.1, amount: 281, color: '#10B981' },
    { category: 'فواتير', trend: 3.2, amount: 120, color: '#F59E0B' },
  ];

  // Mock utilities to make sections respond to selectedPeriod
  const getFilteredMonthlyTrend = () => {
    // Use the last N entries to emulate the selected window
    switch (selectedPeriod) {
      case 'week':
        return monthlyTrend.slice(-1); // approximate: show latest point
      case 'month':
        return monthlyTrend.slice(-1);
      case 'quarter':
        return monthlyTrend.slice(-3);
      case 'year':
        return monthlyTrend.slice(-6); // we only have 6 months of mock data
      case 'all':
        return monthlyTrend;
      default:
        return monthlyTrend.slice(-1);
    }
  };

  const insights = [
    {
      type: 'success',
      icon: TickCircle,
      title: 'تحسن في الانضباط المالي',
      description: 'لديك سجل ممتاز في السداد خلال آخر 12 شهراً',
      color: '#10B981'
    },
    {
      type: 'warning',
      icon: Danger,
      title: 'نسبة الدين إلى الدخل مرتفعة',
      description: 'نسبة 42% أعلى من المعدل المثالي (30%)',
      color: '#F59E0B'
    },
    {
      type: 'tip',
      icon: InfoCircle,
      title: 'فرصة للادخار',
      description: 'يمكنك زيادة معدل الادخار إلى 20% من الدخل الشهري',
      color: '#3B82F6'
    }
  ];

  // Add refs for tab scrolling like in commitments.tsx
  const tabScrollRef = useRef<ScrollView | null>(null);
  const tabsInitScrolled = useRef(false);

  const renderTabSelector = () => (
    <Animated.View style={[
      styles.tabContainer,
      { transform: [{ translateY: tabsTranslateY }, { scaleY: tabsScaleY }], opacity: tabsOpacity }
    ]}>
      <ScrollView 
        style={styles.tabsScroll}
        ref={tabScrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContentContainer}
        onContentSizeChange={() => {
          if (!tabsInitScrolled.current) {
            // With row-reverse, scrolling to end aligns the first tab to the right edge
            tabScrollRef.current?.scrollToEnd({ animated: false });
            tabsInitScrolled.current = true;
          }
        }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.8}
            >
              <IconComponent 
                size={18} 
                color={isActive ? '#FFFFFF' : '#1D4ED8'} 
                variant={isActive ? 'Bold' : 'Outline'}
              />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      <ScrollView 
        ref={periodScrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.periodContentContainer}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.id && styles.activePeriodText
            ]}>
              {period.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Add ref for period scrolling like in commitments.tsx
  const periodScrollRef = useRef<ScrollView | null>(null);


  const renderOverviewCards = () => {
    // Smaller, more condensed overview cards
    const periodText = getPeriodDescriptor(selectedPeriod);
    const periodFactor = getPeriodFactor(selectedPeriod);
    const paidForPeriod = Math.max(0, Math.round(financialData.paidThisMonth * periodFactor));
    const remainingForPeriod = Math.max(0, Math.round(financialData.remainingThisMonth * periodFactor));

    const overviewStats = [
      {
        title: 'إجمالي الالتزامات',
        value: financialData.totalCommitments.toLocaleString(),
        unit: 'د.ك',
        icon: WalletIcon,
        color: '#3B82F6',
        change: null,
      },
      {
        title: `المسدد ${periodText.paid}`,
        value: paidForPeriod.toLocaleString(),
        unit: 'د.ك',
        icon: MoneyRecive,
        color: '#10B981',
        change: '+12%',
      },
      {
        title: `المتبقي ${periodText.remaining}`,
        value: remainingForPeriod.toLocaleString(),
        unit: 'د.ك',
        icon: Danger,
        color: '#EF4444',
        change: null,
      },
      {
        title: 'معدل السداد',
        value: financialData.paymentRate.toString(),
        unit: '%',
        icon: TrendUp,
        color: '#10B981',
        change: '+5%',
      },
      {
        title: 'إجمالي المدفوع',
        value: financialData.totalPaidToDate.toLocaleString(),
        unit: 'د.ك',
        icon: TickCircle,
        color: '#06B6D4',
        change: null,
      },
      {
        title: 'إجمالي المتبقي',
        value: financialData.totalRemaining.toLocaleString(),
        unit: 'د.ك',
        icon: InfoCircle,
        color: '#F59E0B',
        change: '-8%',
      },
    ];

    return (
      <Animated.View 
        style={[
          styles.compactCardsGrid,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {overviewStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Animated.View
              key={index}
              style={[
                styles.compactCard,
                {
                  opacity: cardAnimations[index % 3] || 1,
                  transform: [{
                    scale: (cardAnimations[index % 3] || new Animated.Value(1)).interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.compactCardTouchable}
                activeOpacity={0.8}
              >
                <View style={styles.compactCardContent}>
                  <View style={[styles.compactCardHeader, isRTL && styles.compactCardHeaderRTL]}>
                    <View style={[styles.compactIconContainer, { backgroundColor: `${stat.color}20` }]}>
                      <IconComponent size={18} color={stat.color} variant="Bold" />
                    </View>
                    {/* Change badge removed per request */}
                  </View>
                  
                  <Text style={styles.compactCardTitle}>{stat.title}</Text>
                  
                  <View style={styles.compactValueContainer}>
                    <Text style={[styles.compactCardValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={styles.compactCardUnit}>{stat.unit}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  };

  const renderFinancialHealth = () => (
    <Animated.View 
      style={[
        styles.healthContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
        <View style={styles.sectionIconContainer}>
          <InfoCircle size={18} color="#1D4ED8" variant="Bold" />
        </View>
        <Text style={styles.sectionTitle}>الصحة المالية</Text>
      </View>
      
      <View style={styles.healthMetric}>
        <View style={[styles.metricHeader, isRTL && styles.metricHeaderRTL]}>
          <Text style={[styles.metricLabel, isRTL && styles.metricLabelRTL]}>نسبة الدين إلى الدخل</Text>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: financialData.debtToIncomeRatio > 0.3 ? '#EF4444' : '#10B981' }]}>
              {Math.round(financialData.debtToIncomeRatio * 100)}%
            </Text>
            <Text style={styles.metricStatus}>
              {financialData.debtToIncomeRatio > 0.3 ? 'مرتفع' : 'جيد'}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.healthProgressFill, 
              { 
                width: `${financialData.debtToIncomeRatio * 100}%`,
                backgroundColor: financialData.debtToIncomeRatio > 0.3 ? '#EF4444' : '#10B981'
              }
            ]} 
          />
        </View>
        <Text style={[styles.metricDescription, isRTL && styles.metricDescriptionRTL]}>
          {financialData.debtToIncomeRatio > 0.3 
            ? 'يُنصح بتقليل الديون أو زيادة الدخل' 
            : 'نسبة صحية للديون مقارنة بالدخل'}
        </Text>
      </View>

      <View style={styles.healthMetric}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricLabel}>معدل الادخار</Text>
          <Text style={styles.metricValue}>
            {Math.round(financialData.savingsRate * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${financialData.savingsRate * 100}%`,
                backgroundColor: '#3B82F6'
              }
            ]} 
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderCommitmentBreakdown = () => (
    <Animated.View 
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Category size={20} color="#1D4ED8" variant="Bold" />
        </View>
        <Text style={styles.sectionTitle}>تفصيل الالتزامات</Text>
      </View>
      
      {commitmentsByType.map((item, index) => {
        const IconComponent = item.icon;
        const completionPercentage = (item.paidAmount / item.totalAmount) * 100;
        const statusColor = item.status === 'منتظم' ? '#10B981' : item.status === 'متأخر' ? '#EF4444' : '#F59E0B';
        
        return (
          <View key={index} style={[
            styles.enhancedBreakdownCard,
            item.status === 'متأخر' && styles.overdueBreakdownCard
          ]}>
            {/* Main Header with Icon, Title and Status */}
            <View style={styles.cardMainHeader}>
              <View style={styles.headerLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}>
                  <IconComponent size={24} color={item.color} variant="Bold" />
                </View>
                <View style={styles.titleSection}>
                  <Text style={styles.categoryTitle}>{item.type}</Text>
                  <View style={[styles.statusIndicator, { backgroundColor: `${statusColor}15` }]}>
                    <Text style={[styles.statusLabel, { color: statusColor }]}>{item.status}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.headerRight}>
                <Text style={styles.monthlyPaymentValue}>
                  {item.monthlyPayment.toLocaleString()}
                  <Text style={styles.currencyText}> د.ك</Text>
                </Text>
                <Text style={styles.monthlyPaymentLabel}>القسط الشهري</Text>
              </View>
            </View>

            {/* Key Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={[styles.metricValueNew, { color: '#6B7280' }]}>{item.incomePercentage}%</Text>
                <Text style={styles.metricLabelNew}>من الدخل</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValueNew}>{item.totalAmount.toLocaleString()} د.ك</Text>
                <Text style={styles.metricLabelNew}>المبلغ الكلي</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={[styles.metricValueNew, { color: '#10B981' }]}>{item.paidAmount.toLocaleString()} د.ك</Text>
                <Text style={styles.metricLabelNew}>المدفوع</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={[styles.metricValueNew, { color: '#EF4444' }]}>{item.remainingAmount.toLocaleString()} د.ك</Text>
                <Text style={styles.metricLabelNew}>المتبقي</Text>
              </View>
            </View>

            {/* Progress Bar Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>نسبة الإنجاز</Text>
                <Text style={styles.progressValue}>{Math.round(completionPercentage)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${completionPercentage}%`,
                      backgroundColor: item.color
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Quick Info Row */}
            <View style={styles.quickInfoRow}>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoLabel}>سجل السداد</Text>
                <Text style={[styles.quickInfoValue, { color: '#10B981' }]}>{item.paymentHistory} أشهر</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoLabel}>الدفعة القادمة</Text>
                <Text style={styles.quickInfoValue}>{item.nextPaymentDate}</Text>
              </View>
            </View>

            {/* Additional Details (Collapsible-style) */}
            {(item.interestRate || item.installmentCount || item.contractDuration || item.daysOverdue) && (
              <View style={styles.additionalDetails}>
                {item.interestRate && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>معدل الفائدة</Text>
                    <Text style={[styles.detailValue, { color: '#F59E0B' }]}>{item.interestRate}%</Text>
                  </View>
                )}
                {item.installmentCount && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>عدد الأقساط</Text>
                    <Text style={styles.detailValue}>{item.installmentCount} قسط</Text>
                  </View>
                )}
                {item.contractDuration && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>مدة العقد</Text>
                    <Text style={styles.detailValue}>{item.contractDuration} شهر</Text>
                  </View>
                )}
                {item.daysOverdue && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>متأخر</Text>
                    <Text style={[styles.detailValue, { color: '#EF4444' }]}>{item.daysOverdue} أيام</Text>
                  </View>
                )}
              </View>
            )}

            {/* Trend Indicator */}
            {item.trend !== 0 && (
              <View style={styles.trendBanner}>
                <View style={styles.trendIcon}>
                  {item.trend > 0 ? (
                    <ArrowUp size={12} color="#10B981" variant="Bold" />
                  ) : (
                    <ArrowDown size={12} color="#EF4444" variant="Bold" />
                  )}
                </View>
                <Text style={[styles.trendLabel, { color: item.trend > 0 ? '#10B981' : '#EF4444' }]}>
                  {item.trend > 0 ? 'زيادة' : 'انخفاض'} {Math.abs(item.trend)}% هذا الشهر
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </Animated.View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
        <View style={styles.sectionIconContainer}>
          <InfoCircle size={18} color="#1D4ED8" variant="Bold" />
        </View>
        <Text style={styles.sectionTitle}>رؤى مالية</Text>
      </View>
      {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <View key={index} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                <IconComponent size={20} color={insight.color} variant="Bold" />
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <>
            {renderOverviewCards()}
            {renderFinancialHealth()}
          </>
        );
      case 'trends':
        return (
          <Animated.View 
            style={[
              styles.trendsMainContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Trends Analytics Summary */}
            <View style={styles.trendsStatsGrid}>
              <View style={styles.trendStatCard}>
                <View style={[styles.trendStatHeader, isRTL && styles.trendStatHeaderRTL]}>
                  <TrendUp size={20} color="#10B981" variant="Bold" />
                  <Text style={styles.trendStatValue}>{trendAnalytics.paymentConsistency}%</Text>
                </View>
                <Text style={styles.trendStatLabel}>انتظام السداد</Text>
              </View>
              
              <View style={styles.trendStatCard}>
                <View style={[styles.trendStatHeader, isRTL && styles.trendStatHeaderRTL]}>
                  <TickCircle size={20} color="#3B82F6" variant="Bold" />
                  <Text style={styles.trendStatValue}>{trendAnalytics.averageEfficiency}%</Text>
                </View>
                <Text style={styles.trendStatLabel}>معدل الكفاءة</Text>
              </View>
              
              <View style={styles.trendStatCard}>
                <View style={[styles.trendStatHeader, isRTL && styles.trendStatHeaderRTL]}>
                  <MoneyRecive size={20} color="#F59E0B" variant="Bold" />
                  <Text style={styles.trendStatValue}>{trendAnalytics.totalSavings}</Text>
                </View>
                <Text style={styles.trendStatLabel}>إجمالي التوفير</Text>
              </View>
              
              <View style={styles.trendStatCard}>
                <View style={[styles.trendStatHeader, isRTL && styles.trendStatHeaderRTL]}>
                  <Danger size={20} color="#EF4444" variant="Bold" />
                  <Text style={styles.trendStatValue}>{trendAnalytics.riskScore}%</Text>
                </View>
                <Text style={styles.trendStatLabel}>مؤشر المخاطر</Text>
              </View>
            </View>

            {/* Enhanced Monthly Chart */}
            <View style={styles.trendsContainer}>
              <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
                <View style={styles.sectionIconContainer}>
                  <TrendUp size={18} color="#10B981" variant="Bold" />
                </View>
                <Text style={styles.sectionTitle}>{`الأداء خلال ${getPeriodDescriptor(selectedPeriod).paid}`}</Text>
              </View>
              <View style={styles.enhancedChartContainer}>
                {getFilteredMonthlyTrend().map((month, index) => (
                  <View key={index} style={styles.enhancedBarContainer}>
                    <View style={styles.multiBarGroup}>
                      <View 
                        style={[
                          styles.bar,
                          styles.plannedBar,
                          { height: (month.planned / 450) * 100 }
                        ]}
                      />
                      <View 
                        style={[
                          styles.bar,
                          styles.paidBar,
                          { height: (month.paid / 450) * 100 }
                        ]}
                      />
                      <View 
                        style={[
                          styles.bar,
                          styles.savingsBar,
                          { height: (month.savings / 100) * 60 }
                        ]}
                      />
                    </View>
                    <Text style={styles.monthLabel}>{month.month}</Text>
                    <Text style={styles.efficiencyLabel}>{month.efficiency}%</Text>
                  </View>
                ))}
              </View>
              <View style={styles.enhancedLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.legendText}>مخطط</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>مدفوع</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.legendText}>توفير</Text>
                </View>
              </View>
            </View>

            {/* Category Trends */}
            <View style={styles.categoryTrendsContainer}>
              <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
                <View style={styles.sectionIconContainer}>
                  <Category size={18} color="#1D4ED8" variant="Bold" />
                </View>
                <Text style={styles.sectionTitle}>اتجاهات الفئات</Text>
              </View>
              {categoryTrends
                .map((category) => ({
                  ...category,
                  amount: Math.round(category.amount * getPeriodFactor(selectedPeriod))
                }))
                .map((category, index) => (
                <View key={index} style={styles.categoryTrendItem}>
                  <View style={[styles.categoryTrendHeader, isRTL && styles.categoryTrendHeaderRTL]}>
                    <View style={styles.categoryTrendInfo}>
                      <View style={styles.categoryTrendTitleRow}>
                        <View style={[styles.categoryTrendIconChip, { backgroundColor: category.color + '20' }]}>
                          {(() => { const IconCmp = getCategoryIconForName(category.category); return <IconCmp size={24} color={category.color} variant={'Bold'} />; })()}
                        </View>
                        <Text style={styles.categoryTrendName}>{category.category}</Text>
                        <View style={[styles.trendBadgeContainer, isRTL && styles.trendBadgeContainerRTL, { marginRight: 8 }]}>
                          {category.trend > 0 ? (
                            <ArrowUp size={14} color="#10B981" variant="Bold" />
                          ) : category.trend < 0 ? (
                            <ArrowDown size={14} color="#EF4444" variant="Bold" />
                          ) : (
                            <View style={styles.neutralTrendIndicator} />
                          )}
                          <Text style={[
                            styles.categoryTrendText,
                            { 
                              color: category.trend > 0 ? '#10B981' : 
                                     category.trend < 0 ? '#EF4444' : '#6B7280' 
                            }
                          ]}>
                            {category.trend === 0 ? 'مستقر' : `${Math.abs(category.trend)}%`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[
                      styles.categoryAmountBadge,
                      { borderColor: category.color + '40', backgroundColor: category.color + '12' }
                    ]}>
                      <Text style={styles.categoryAmountValue}>{category.amount.toLocaleString()}</Text>
                      <Text style={styles.categoryAmountUnit}>د.ك</Text>
                    </View>
                  </View>
                  <View style={styles.categoryTrendBar}>
                    <View 
                      style={[
                        styles.categoryTrendFill,
                        { 
                          backgroundColor: category.color,
                          width: `${(category.amount / 500) * 100}%`
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        );
      case 'breakdown':
        return renderCommitmentBreakdown();
      case 'insights':
        return renderInsights();
      default:
        return renderOverviewCards();
    }
  };

  return (
    <View style={styles.container}>
      <SubPageHeader
        title="التحليلات المالية"
        subtitle="تتبع أداءك المالي"
        scrollY={scrollY}
        titleIcon={<TrendUp size={22} color="#111827" variant="Outline" />}
        showBackButton={false}
        compact={true}
      />
      
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {renderTabSelector()}
        {renderPeriodSelector()}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
    elevation: 3,
  },
  tabsContentContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    direction: 'ltr',
  },
  tabsScroll: {
    direction: 'rtl',
  },
  tab: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 40,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tabText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Cairo-SemiBold',
    fontWeight: '600',
    marginRight: 8,
    marginLeft: 6,
  },
  activeTabText: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  periodContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodContentContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 2,
  },
  periodButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 11,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  activePeriodText: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  cardsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  cardTouchable: {
    marginBottom: 16,
  },
  overviewCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  cardHeaderRTL: {
    flexDirection: 'row',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Cairo',
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
  },
  trendBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  trendBadgeRTL: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  trendBadgeText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  cardAmountContainer: {
    marginBottom: 12,
  },
  cardAmount: {
    fontSize: 32,
    fontFamily: 'Cairo',
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 38,
  },
  cardCurrency: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.9,
  },
  cardSubtext: {
    fontSize: 14,
    fontFamily: 'Cairo',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    lineHeight: 20,
  },
  cardSubtextRTL: {
    textAlign: 'left',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'right',
    marginRight: 6,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionHeaderRTL: {
    flexDirection: 'row',
  },
  healthContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  healthMetric: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  metricLabelRTL: {
    textAlign: 'left',
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'right',
  },
  metricValueContainer: {
    alignItems: 'flex-end',
  },
  metricStatus: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'right',
  },
  metricDescription: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'right',
    lineHeight: 18,
  },
  metricDescriptionRTL: {
    textAlign: 'left',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    flexDirection: 'row-reverse',
  },
  healthProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  breakdownItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownHeaderRTL: {
    flexDirection: 'row',
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownType: {
    fontSize: 16,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
  },
  breakdownTypeRTL: {
    textAlign: 'left',
  },
  breakdownPercentage: {
    fontSize: 14,
    fontFamily: 'Cairo',
    color: '#6B7280',
    textAlign: 'right',
  },
  breakdownPercentageRTL: {
    textAlign: 'left',
  },
  breakdownValueContainer: {
    alignItems: 'flex-end',
  },
  breakdownAmount: {
    fontSize: 18,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 4,
  },
  breakdownAmountRTL: {
    textAlign: 'left',
  },
  trendContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  trendContainerRTL: {
    flexDirection: 'row',
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    fontWeight: '600',
    marginLeft: 4,
  },
  insightsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  insightCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  insightHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  insightTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Cairo',
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'right',
  },
  trendsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 12,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  plannedBar: {
    backgroundColor: '#3B82F6',
  },
  paidBar: {
    backgroundColor: '#10B981',
  },
  monthLabel: {
    fontSize: 10,
    fontFamily: 'Cairo',
    color: '#6B7280',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
  },
  // Enhanced breakdown card styles
  enhancedBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  overdueBreakdownCard: {
    borderWidth: 4,
    borderColor: 'rgba(255, 0, 0, 0.45)',
  },
  cardMainHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  titleSection: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 4,
    marginRight: 6,
  },
  statusIndicator: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    fontWeight: '600',
  },
  monthlyPaymentValue: {
    fontSize: 20,
    fontFamily: 'Cairo-Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  currencyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  monthlyPaymentLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFBFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricValueNew: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  metricLabelNew: {
    fontSize: 10,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  metricCurrency: {
    fontSize: 10,
    fontFamily: 'Cairo-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    fontWeight: '600',
  },
  monthlyLabel: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  monthlyLabelRTL: {
    textAlign: 'left',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailedMetricValue: {
    fontSize: 16,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'center',
  },
  detailedMetricLabel: {
    fontSize: 11,
    fontFamily: 'Cairo',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#374151',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  quickInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  quickInfoLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#1F2937',
    textAlign: 'right',
  },
  additionalDetails: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFBFC',
  },
  detailItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'Cairo-SemiBold',
    color: '#1F2937',
  },
  trendBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  trendIcon: {
    marginLeft: 8,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    fontWeight: '600',
  },
  additionalInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoRowRTL: {
    flexDirection: 'row-reverse',
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Cairo',
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trendIndicatorRTL: {
    flexDirection: 'row-reverse',
  },
  // Compact overview cards styles
  compactCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  compactCard: {
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e3e4e6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactCardTouchable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactCardContent: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  compactCardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactCardHeaderRTL: {
    flexDirection: 'row',
  },
  compactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactChangeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'center',
  },
  compactChangeText: {
    fontSize: 10,
    fontFamily: 'Cairo',
    fontWeight: '600',
  },
  compactCardTitle: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  compactValueContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  compactCardValue: {
    fontSize: 18,
    fontFamily: 'Cairo',
    fontWeight: '700',
    textAlign: 'center',
  },
  compactCardUnit: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 4,
    textAlign: 'center',
  },
  // Enhanced trends styles
  trendsMainContainer: {
    marginBottom: 24,
  },
  trendsStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  trendStatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  trendStatHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendStatHeaderRTL: {
    flexDirection: 'row',
  },
  trendStatValue: {
    fontSize: 20,
    fontFamily: 'Cairo',
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
  },
  trendStatLabel: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
    lineHeight: 16,
  },
  enhancedChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  enhancedBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  multiBarGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    justifyContent: 'center',
  },
  savingsBar: {
    backgroundColor: '#F59E0B',
    width: 8,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  efficiencyLabel: {
    fontSize: 9,
    fontFamily: 'Cairo',
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  enhancedLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  categoryTrendsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3e4e6',
  },
  categoryTrendItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryTrendHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTrendHeaderRTL: {
    flexDirection: 'row',
  },
  categoryTrendInfo: {
    flex: 1,
  },
  categoryTrendTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryTrendIconChip: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  categoryTrendName: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#1b2e47',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 0,
  },
  categoryTrendAmount: {
    fontSize: 14,
    fontFamily: 'Cairo-Bold',
    color: '#6B7280',
    textAlign: 'right',
  },
  categoryAmountBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    gap: 4,
  },
  categoryAmountValue: {
    fontSize: 15,
    fontFamily: 'Cairo-Bold',
    color: '#0F172A',
    textAlign: 'right',
  },
  categoryAmountUnit: {
    fontSize: 11,
    fontFamily: 'Cairo-Regular',
    color: '#64748B',
    textAlign: 'right',
    marginRight: 2,
    marginTop: 1,
  },
  trendBadgeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendBadgeContainerRTL: {
    flexDirection: 'row',
  },
  neutralTrendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  categoryTrendText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  categoryTrendBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  categoryTrendFill: {
    height: '100%',
    borderRadius: 50,
  },
  // RTL support styles for tabs and filters
  tabRTL: {
    marginLeft: 12,
    marginRight: 0,
    flexDirection: 'row-reverse',
  },
  tabTextRTL: {
    marginRight: 8,
    marginLeft: 0,
    textAlign: 'left',
  },
  periodContainerRTL: {
    flexDirection: 'row-reverse',
  },
  periodButtonRTL: {
    marginLeft: 8,
    marginRight: 0,
  },
});

export default AnalyticsScreen;
