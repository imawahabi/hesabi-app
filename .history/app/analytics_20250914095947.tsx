import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import BottomNav from './components/BottomNav';
import SubPageHeader from './components/SubPageHeader';

// no width needed here

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const periods = [
    { id: 'week', name: 'أسبوع' },
    { id: 'month', name: 'شهر' },
    { id: 'quarter', name: '3 أشهر' },
    { id: 'year', name: 'سنة' },
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
  };

  const commitmentsByType = [
    { type: 'قروض بنكية', amount: 450.250, percentage: 36, color: '#3B82F6', icon: 'card' },
    { type: 'إيجارات', amount: 350.000, percentage: 28, color: '#06B6D4', icon: 'home' },
    { type: 'أقساط', amount: 280.500, percentage: 22, color: '#10B981', icon: 'bag' },
    { type: 'فواتير', amount: 120.000, percentage: 10, color: '#F59E0B', icon: 'flash' },
    { type: 'أخرى', amount: 50.000, percentage: 4, color: '#8B5CF6', icon: 'ellipsis-horizontal' },
  ];

  const monthlyTrend = [
    { month: 'يناير', paid: 400, planned: 415 },
    { month: 'فبراير', paid: 415, planned: 415 },
    { month: 'مارس', paid: 380, planned: 415 },
    { month: 'أبريل', paid: 415, planned: 415 },
    { month: 'مايو', paid: 395, planned: 415 },
    { month: 'يونيو', paid: 415, planned: 415 },
  ];

  // SubPageHeader will be used instead of a custom header

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodChip,
              selectedPeriod === period.id && styles.periodChipActive
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.id && styles.periodTextActive
            ]}>
              {period.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOverviewCards = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.overviewRow}>
        <View style={[styles.overviewCard, styles.primaryCard]}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.cardGradient}
          >
            <Ionicons name="wallet" size={24} color="white" />
            <Text style={styles.cardValue}>
              {financialData.totalCommitments.toLocaleString()} د.ك
            </Text>
            <Text style={styles.cardLabel}>إجمالي الالتزامات</Text>
          </LinearGradient>
        </View>
        
        <View style={[styles.overviewCard, styles.secondaryCard]}>
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color="#10B981" />
            <Text style={[styles.cardValue, { color: '#1F2937' }]}>
              {financialData.monthlyPayments.toLocaleString()} د.ك
            </Text>
            <Text style={[styles.cardLabel, { color: '#6B7280' }]}>الأقساط الشهرية</Text>
          </View>
        </View>
      </View>

      <View style={styles.overviewRow}>
        <View style={[styles.overviewCard, styles.secondaryCard]}>
          <View style={styles.cardContent}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={[styles.cardValue, { color: '#1F2937' }]}>
              {financialData.paidThisMonth.toLocaleString()} د.ك
            </Text>
            <Text style={[styles.cardLabel, { color: '#6B7280' }]}>مدفوع هذا الشهر</Text>
          </View>
        </View>
        
        <View style={[styles.overviewCard, styles.secondaryCard]}>
          <View style={styles.cardContent}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={[styles.cardValue, { color: '#1F2937' }]}>
              {financialData.remainingThisMonth.toLocaleString()} د.ك
            </Text>
            <Text style={[styles.cardLabel, { color: '#6B7280' }]}>متبقي هذا الشهر</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFinancialHealth = () => (
    <View style={styles.healthContainer}>
      <Text style={styles.sectionTitle}>الصحة المالية</Text>
      
      <View style={styles.healthCard}>
        <View style={styles.healthMetric}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>نسبة الدين إلى الدخل</Text>
            <Text style={[
              styles.metricValue,
              { color: financialData.debtToIncomeRatio > 0.4 ? '#EF4444' : '#10B981' }
            ]}>
              {Math.round(financialData.debtToIncomeRatio * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${financialData.debtToIncomeRatio * 100}%`,
                  backgroundColor: financialData.debtToIncomeRatio > 0.4 ? '#EF4444' : '#10B981'
                }
              ]}
            />
          </View>
          <Text style={styles.metricDescription}>
            {financialData.debtToIncomeRatio > 0.4 ? 'مرتفع - يُنصح بتقليل الالتزامات' : 'صحي - ضمن المعدل المقبول'}
          </Text>
        </View>

        <View style={styles.healthMetric}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>معدل الادخار</Text>
            <Text style={[
              styles.metricValue,
              { color: financialData.savingsRate >= 0.2 ? '#10B981' : '#F59E0B' }
            ]}>
              {Math.round(financialData.savingsRate * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${financialData.savingsRate * 100}%`,
                  backgroundColor: financialData.savingsRate >= 0.2 ? '#10B981' : '#F59E0B'
                }
              ]}
            />
          </View>
          <Text style={styles.metricDescription}>
            {financialData.savingsRate >= 0.2 ? 'ممتاز - معدل ادخار جيد' : 'يمكن تحسينه - حاول زيادة الادخار'}
          </Text>
        </View>

        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={24} color="#F59E0B" />
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{financialData.paymentStreak} شهر</Text>
            <Text style={styles.streakLabel}>سلسلة الدفع في الوقت المحدد</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCommitmentBreakdown = () => (
    <View style={styles.breakdownContainer}>
      <Text style={styles.sectionTitle}>توزيع الالتزامات</Text>
      
      <View style={styles.pieChartContainer}>
        <View style={styles.pieHeaderRow}>
          <Text style={styles.pieHeaderValue}>{financialData.totalCommitments.toLocaleString()} د.ك</Text>
          <Text style={styles.pieHeaderLabel}>الإجمالي</Text>
        </View>
        <View style={styles.pieChart}>
          {/* Simplified pie chart representation */}
          <View style={styles.pieCenter}>
            <Text style={styles.pieCenterValue}>
              {financialData.totalCommitments.toLocaleString()}
            </Text>
            <Text style={styles.pieCenterLabel}>د.ك</Text>
          </View>
        </View>
        
        <View style={styles.legendContainer}>
          {commitmentsByType.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendInfo}>
                <Text style={styles.legendType}>{item.type}</Text>
                <Text style={styles.legendAmount}>
                  {item.amount.toLocaleString()} د.ك ({item.percentage}%)
                </Text>
              </View>
              <View style={styles.legendBadge}>
                <Text style={styles.legendBadgeText}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderMonthlyTrend = () => (
    <View style={styles.trendContainer}>
      <Text style={styles.sectionTitle}>اتجاه المدفوعات الشهرية</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {monthlyTrend.map((month, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barGroup}>
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
              </View>
              <Text style={styles.monthLabel}>{month.month}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.legendText}>مخطط</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>مدفوع</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>رؤى وتوصيات</Text>
      
      <View style={styles.insightCard}>
        <Ionicons name="bulb" size={24} color="#F59E0B" />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>توصية الشهر</Text>
          <Text style={styles.insightText}>
            يمكنك توفير 25 د.ك شهرياً عبر إعادة جدولة قرض السيارة بمعدل فائدة أقل
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Ionicons name="trending-up" size={24} color="#10B981" />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>تحسن ملحوظ</Text>
          <Text style={styles.insightText}>
            انخفضت نسبة الدين إلى الدخل بـ 5% مقارنة بالشهر الماضي
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Ionicons name="warning" size={24} color="#EF4444" />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>تنبيه</Text>
          <Text style={styles.insightText}>
            لديك 3 التزامات تستحق خلال الأسبوع القادم
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubPageHeader
        title="التحليلات المالية"
        subtitle="نظرة شاملة على وضعك المالي"
        scrollY={scrollY}
        showBackButton={false}
        entrance={false}
      />

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderPeriodSelector()}
        {renderOverviewCards()}
        {renderFinancialHealth()}
        {renderCommitmentBreakdown()}
        {renderMonthlyTrend()}
        {renderInsights()}
        
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      <BottomNav currentRoute="التحليلات" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Cairo-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodContainer: {
    marginBottom: 20,
  },
  periodChip: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  periodTextActive: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  overviewContainer: {
    marginBottom: 24,
  },
  overviewRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryCard: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryCard: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    fontFamily: 'Cairo-Bold',
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  healthContainer: {
    marginBottom: 24,
  },
  healthCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  healthMetric: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    flexDirection: 'row-reverse',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  streakContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  streakInfo: {
    marginRight: 12,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  streakLabel: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  breakdownContainer: {
    marginBottom: 24,
  },
  pieChartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  pieHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieHeaderLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  pieHeaderValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  pieCenterLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendType: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  legendAmount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  legendBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  legendBadgeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
  },
  trendContainer: {
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 8,
  },
  bar: {
    width: 8,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  plannedBar: {
    backgroundColor: '#3B82F6',
  },
  paidBar: {
    backgroundColor: '#10B981',
  },
  monthLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  chartLegend: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 20,
  },
  legendRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightContent: {
    flex: 1,
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 4,
    fontFamily: 'Cairo-Bold',
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    lineHeight: 18,
    fontFamily: 'Cairo-Regular',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default AnalyticsScreen;
