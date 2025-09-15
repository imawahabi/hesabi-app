import { Ionicons } from '@expo/vector-icons';
import { Activity, TickCircle } from 'iconsax-react-nativejs';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InsightData {
  id: number;
  type: 'tip' | 'warning' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface FinancialInsightsProps {
  insights: InsightData[];
  availableIncome: number;
  debtToIncomeRatio: number;
  payoffProgress: number;
}

const FinancialInsights = ({ insights, availableIncome, debtToIncomeRatio, payoffProgress }: FinancialInsightsProps) => {
  const getInsightColor = (type: InsightData['type']) => {
    switch (type) {
      case 'tip': return '#3B82F6';
      case 'warning': return '#EF4444';
      case 'achievement': return '#10B981';
      case 'opportunity': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getInsightBackground = (type: InsightData['type']) => {
    switch (type) {
      case 'tip': return 'rgba(59, 130, 246, 0.1)';
      case 'warning': return 'rgba(239, 68, 68, 0.1)';
      case 'achievement': return 'rgba(16, 185, 129, 0.1)';
      case 'opportunity': return 'rgba(245, 158, 11, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getPriorityBadge = (priority: InsightData['priority']) => {
    switch (priority) {
      case 'high': return { color: '#EF4444', text: 'عاجل' };
      case 'medium': return { color: '#F59E0B', text: 'متوسط' };
      case 'low': return { color: '#10B981', text: 'منخفض' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>رؤى مالية ذكية</Text>
          <Text style={styles.subtitle}>نصائح مخصصة لتحسين وضعك المالي</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAll}>عرض الكل</Text>
          <Ionicons name="chevron-back" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Financial Health Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Activity size={20} color="#3B82F6" variant="Bold" />
          <Text style={styles.summaryTitle}>ملخص الوضع المالي</Text>
        </View>
        <View style={styles.summaryMetrics}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryValue}>{availableIncome} د.ك</Text>
            <Text style={styles.summaryLabel}>الدخل المتاح</Text>
          </View>
          <View style={styles.summaryMetric}>
            <Text style={[styles.summaryValue, { color: debtToIncomeRatio > 50 ? '#EF4444' : '#10B981' }]}>
              {debtToIncomeRatio}%
            </Text>
            <Text style={styles.summaryLabel}>نسبة الدين للدخل</Text>
          </View>
          <View style={styles.summaryMetric}>
            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{payoffProgress}%</Text>
            <Text style={styles.summaryLabel}>تقدم السداد</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {insights.map((insight) => {
          const priorityBadge = getPriorityBadge(insight.priority);
          return (
            <TouchableOpacity key={insight.id} style={[styles.insightCard, { backgroundColor: getInsightBackground(insight.type) }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getInsightColor(insight.type) }]}>
                  <Ionicons name={insight.icon} size={20} color="white" />
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityBadge.color }]}>
                  <Text style={styles.priorityText}>{priorityBadge.text}</Text>
                </View>
              </View>
              
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              
              {insight.action && (
                <TouchableOpacity style={[styles.actionButton, { borderColor: getInsightColor(insight.type) }]}>
                  <Text style={[styles.actionText, { color: getInsightColor(insight.type) }]}>{insight.action}</Text>
                  <Ionicons name="arrow-back" size={14} color={getInsightColor(insight.type)} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick Financial Tips */}
      <View style={styles.quickTipsContainer}>
        <Text style={styles.quickTipsTitle}>نصائح سريعة</Text>
        <View style={styles.quickTipsList}>
          <View style={styles.quickTip}>
            <TickCircle size={16} color="#10B981" variant="Bold" />
            <Text style={styles.quickTipText}>ادفع أكثر من الحد الأدنى للأقساط</Text>
          </View>
          <View style={styles.quickTip}>
            <TickCircle size={16} color="#10B981" variant="Bold" />
            <Text style={styles.quickTipText}>راجع نفقاتك الشهرية بانتظام</Text>
          </View>
          <View style={styles.quickTip}>
            <TickCircle size={16} color="#10B981" variant="Bold" />
            <Text style={styles.quickTipText}>ابدأ بسداد الديون عالية الفائدة</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  viewAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    marginRight: 8,
  },
  summaryMetrics: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  summaryMetric: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingRight: 20,
  },
  insightCard: {
    borderRadius: 15,
    padding: 20,
    marginLeft: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Cairo-Bold',
    marginLeft: 6,
  },
  quickTipsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  quickTipsList: {
    gap: 12,
  },
  quickTip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  quickTipText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Cairo-Regular',
    marginRight: 10,
    flex: 1,
    textAlign: 'right',
  },
});

export default FinancialInsights;
