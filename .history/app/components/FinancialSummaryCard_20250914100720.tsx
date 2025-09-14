
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FinancialSummaryCardProps {
  data: any;
  scrollY?: Animated.Value;
}

const FinancialSummaryCard = ({ data, scrollY }: FinancialSummaryCardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: 'analytics' as const },
    { id: 'repayment', label: 'السداد', icon: 'card' as const },
    { id: 'savings', label: 'المدخرات', icon: 'wallet' as const },
  ];

  const getTabContent = () => {
    const remainingAmount = data.amount - data.paidAmount;
    const progressPercentage = (data.paidAmount / data.amount) * 100;
    const monthlyPayment = data.monthlyCommitments || 680;
    const monthsToFreedom = Math.ceil(remainingAmount / monthlyPayment);
    const monthlySavings = data.monthlyIncome - data.monthlyCommitments;
    const savingsRatio = (monthlySavings / data.monthlyIncome) * 100;
    const totalSaved = monthlySavings * 12; // افتراض سنة واحدة من الادخار
    
    switch (activeTab) {
      case 'overview':
        return {
          amount: data.monthlyIncome,
          subtitle: 'الدخل الشهري',
          stats: [
            { icon: 'card' as const, color: '#EF4444', label: 'إجمالي الالتزامات', value: data.monthlyCommitments },
            { icon: 'wallet' as const, color: '#10B981', label: 'المتبقي شهرياً', value: monthlySavings },
            { icon: 'trending-up' as const, color: data.debtToIncomeRatio > 50 ? '#EF4444' : '#10B981', label: 'نسبة الدين للراتب', value: Math.round(data.debtToIncomeRatio), isPercentage: true },
          ]
        };
      case 'repayment':
        return {
          amount: monthsToFreedom,
          subtitle: monthsToFreedom <= 12 ? 'للتخلص من الديون' : 'شهر للتخلص من الدين',
          isMonths: true,
          stats: [
            { icon: 'cash' as const, color: '#F59E0B', label: 'دفعة شهرية', value: monthlyPayment },
            { icon: 'trending-up' as const, color: '#3B82F6', label: 'التقدم', value: Math.round(progressPercentage), isPercentage: true },
          ]
        };
      case 'savings':
        return {
          amount: monthlySavings,
          subtitle: 'المبلغ المدخر شهرياً',
          stats: [
            { icon: 'trending-up' as const, color: '#10B981', label: 'نسبة الادخار', value: Math.round(savingsRatio), isPercentage: true },
            { icon: 'wallet' as const, color: '#3B82F6', label: 'إجمالي المدخر', value: totalSaved },
          ]
        };
      default:
        return { amount: 0, subtitle: '', stats: [] };
    }
  };


  const tabContent = getTabContent();

  // Create scroll-based animations
  const cardTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, -10, -20],
    extrapolate: 'clamp',
  }) : 0;

  const cardScale = scrollY ? scrollY.interpolate({
    inputRange: [0, 150, 300],
    outputRange: [1, 0.98, 0.95],
    extrapolate: 'clamp',
  }) : 1;

  const cardOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 200, 400],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  }) : 1;

  return (
    <Animated.View style={[
      styles.cardContainer,
      {
        transform: [
          { translateY: cardTranslateY },
          { scale: cardScale }
        ],
        opacity: cardOpacity,
      }
    ]}>
      {/* Centered Title */}
      {/* Enhanced Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconContainer, activeTab === tab.id && styles.activeTabIconContainer]}>
                <Ionicons name={tab.icon} size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />
              </View>
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        {/* Main Amount Display */}
        <View style={styles.amountSection}>
          <Text style={styles.mainAmount}>
            {tabContent.amount?.toLocaleString()}
            <Text style={styles.unitText}>
              {(tabContent as any).isPercentage ? '%' : (tabContent as any).isMonths ? ' شهر' : (tabContent as any).isCount ? ' نوع' : ' د.ك'}
            </Text>
          </Text>
          <Text style={styles.amountSubtitle} numberOfLines={2}>{tabContent.subtitle}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {tabContent.stats?.map((stat: any, index: number) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={styles.statValue}>
                {stat.value?.toLocaleString()}
                {stat.isPercentage ? '%' : stat.isMonths ? ' ش' : ' د.ك'}
              </Text>
              <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 14,
    marginHorizontal: 20,
    marginTop: -50,
    minHeight: 200,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    overflow: 'hidden',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
  trendBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    fontFamily: 'Cairo-Bold',
  },
  amountContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mainAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
    marginRight: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  tabsContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  tabsWrapper: {
    flexDirection: 'row-reverse',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 60,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeTabIconContainer: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  unitText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  amountSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.08)',
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginTop: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    marginRight: 4,
    textAlign: 'center',
    lineHeight: 14,
  },
  activeTabLabel: {
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
  },
  contentHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  statContent: {
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 20,
    marginBottom: 15,
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
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
});

export default FinancialSummaryCard;
