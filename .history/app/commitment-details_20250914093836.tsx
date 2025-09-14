import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';

import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SubPageHeader from './components/SubPageHeader';

const { width } = Dimensions.get('window');

const CommitmentDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من قاعدة البيانات
  const commitment = {
    id: id,
    name: 'قسط السيارة',
    type: 'installments',
    amount: 250.000,
    totalAmount: 15000.000,
    paidAmount: 3750.000,
    remainingAmount: 11250.000,
    progress: 0.25,
    status: 'active',
    dueDate: '2024-01-15',
    source: 'الغانم أوتو',
    color: '#10B981',
    description: 'قسط شهري للسيارة الجديدة',
    installmentCount: 60,
    paidInstallments: 15,
    remainingInstallments: 45,
    interestRate: 2.5,
    startDate: '2023-01-15',
    endDate: '2028-01-15',
    paymentHistory: [
      { id: '1', date: '2024-01-15', amount: 250.000, status: 'paid' },
      { id: '2', date: '2023-12-15', amount: 250.000, status: 'paid' },
      { id: '3', date: '2023-11-15', amount: 250.000, status: 'paid' },
      { id: '4', date: '2023-10-15', amount: 250.000, status: 'paid' },
      { id: '5', date: '2024-02-15', amount: 250.000, status: 'upcoming' },
    ]
  };

  const renderCommitmentInfo = () => (
    <View style={styles.infoSection}>
      <View style={styles.infoCard}>
        <LinearGradient
          colors={["#1D4ED8", "#3B82F6"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardHeaderGradient}
        >
          <View style={styles.headerTopRow}>
            <View style={[styles.infoIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="car" size={22} color="white" />
            </View>
            <View style={styles.headerTitles}>
              <Text style={styles.headerTitleText}>{commitment.name}</Text>
              <Text style={styles.headerSubtitleText}>{commitment.source}</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>نشط</Text>
            </View>
          </View>

          <View style={styles.headerAmountRow}>
            <Text style={styles.headerAmountValue}>{commitment.amount.toFixed(3)}</Text>
            <Text style={styles.headerAmountCurrency}>د.ك</Text>
          </View>
          <Text style={styles.headerAmountLabel}>القسط الشهري</Text>
        </LinearGradient>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{commitment.dueDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{commitment.installmentCount} قسط</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>التقدم</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(commitment.progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarTrack} />
            <View
              style={[styles.progressBarFill, { width: `${commitment.progress * 100}%`, backgroundColor: commitment.color }]}
            />
          </View>
          <Text style={styles.progressDetailText}>
            {commitment.paidInstallments} من {commitment.installmentCount} قسط مدفوع
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFinancialSummary = () => (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>الملخص المالي</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Ionicons name="wallet" size={20} color="#10B981" />
          <Text style={styles.summaryValue}>{commitment.totalAmount.toFixed(3)}</Text>
          <Text style={styles.summaryLabel}>المبلغ الإجمالي</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
          <Text style={styles.summaryValue}>{commitment.paidAmount.toFixed(3)}</Text>
          <Text style={styles.summaryLabel}>المبلغ المدفوع</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="time" size={20} color="#F59E0B" />
          <Text style={styles.summaryValue}>{commitment.remainingAmount.toFixed(3)}</Text>
          <Text style={styles.summaryLabel}>المبلغ المتبقي</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-up" size={20} color="#EF4444" />
          <Text style={styles.summaryValue}>{commitment.interestRate}%</Text>
          <Text style={styles.summaryLabel}>معدل الفائدة</Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentHistory = () => (
    <View style={styles.historySection}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>سجل المدفوعات</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>عرض الكل</Text>
          <Ionicons name="chevron-back" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {commitment.paymentHistory.slice(0, 5).map((payment) => (
        <View key={payment.id} style={styles.paymentItem}>
          <View style={styles.paymentIcon}>
            <Ionicons 
              name={payment.status === 'paid' ? 'checkmark-circle' : 'time'} 
              size={20} 
              color={payment.status === 'paid' ? '#10B981' : '#F59E0B'} 
            />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentDate}>{payment.date}</Text>
            <Text style={styles.paymentStatus}>
              {payment.status === 'paid' ? 'مدفوع' : 'مستحق'}
            </Text>
          </View>
          <Text style={styles.paymentAmount}>{payment.amount.toFixed(3)} د.ك</Text>
        </View>
      ))}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => router.push('/payment-record')}
      >
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.buttonText}>تسجيل دفعة</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.push('/edit-commitment')}
      >
        <Ionicons name="create" size={20} color="#3B82F6" />
        <Text style={[styles.buttonText, { color: '#3B82F6' }]}>تعديل الالتزام</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubPageHeader 
        title="تفاصيل الالتزام"
        subtitle={commitment.name}
        scrollY={scrollY}
        rightAction={{
          icon: 'share',
          onPress: () => console.log('Share commitment')
        }}
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
        {renderCommitmentInfo()}
        {renderFinancialSummary()}
        {renderPaymentHistory()}
        {renderActionButtons()}
        
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeaderGradient: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  headerTitleText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  headerSubtitleText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Cairo-Regular',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginLeft: 6,
  },
  statusPillText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  headerAmountRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginTop: 14,
  },
  headerAmountValue: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  headerAmountCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: 'Cairo-Bold',
    marginRight: 6,
  },
  headerAmountLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    marginRight: 6,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  progressSection: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Cairo-Regular',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  progressBarWrapper: {
    position: 'relative',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarTrack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressDetailText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    marginTop: 6,
    textAlign: 'right',
    },
  summarySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  historySection: {
    padding: 20,
    paddingTop: 0,
  },
  historyHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontFamily: 'Cairo-Regular',
    marginLeft: 4,
  },
  paymentItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIcon: {
    marginLeft: 12,
  },
  paymentInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  paymentDate: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Cairo-Regular',
  },
  paymentStatus: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  actionSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default CommitmentDetailsScreen;
