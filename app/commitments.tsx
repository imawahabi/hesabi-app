import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AddCommitmentModal from './components/AddCommitmentModal';
import BottomNav from './components/BottomNav';
import SubPageHeader from './components/SubPageHeader';

const CommitmentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [commitments, setCommitments] = useState([
    {
      id: '1',
      name: 'قرض السيارة',
      type: 'bank_loan',
      source: 'بنك الكويت الوطني',
      amount: 250.500,
      remainingAmount: 180.750,
      monthlyPayment: 45.125,
      dueDate: '2024-12-15',
      status: 'active',
      priority: 'high',
      color: '#3B82F6',
      icon: 'car',
      progress: 0.28,
    },
    {
      id: '2',
      name: 'إيجار الشقة',
      type: 'rent',
      source: 'محمد العلي',
      amount: 350.000,
      remainingAmount: 350.000,
      monthlyPayment: 350.000,
      dueDate: '2024-12-01',
      status: 'active',
      priority: 'urgent',
      color: '#06B6D4',
      icon: 'home',
      progress: 0,
    },
    {
      id: '3',
      name: 'أقساط الجوال',
      type: 'installments',
      source: 'اكسايت الغانم',
      amount: 120.000,
      remainingAmount: 60.000,
      monthlyPayment: 20.000,
      dueDate: '2024-12-10',
      status: 'active',
      priority: 'normal',
      color: '#10B981',
      icon: 'phone-portrait',
      progress: 0.5,
    },
  ]);

  const filterOptions = [
    { id: 'all', name: 'الكل', count: commitments.length },
    { id: 'active', name: 'نشط', count: commitments.filter(c => c.status === 'active').length },
    { id: 'overdue', name: 'متأخر', count: 2 },
    { id: 'completed', name: 'مكتمل', count: 5 },
  ];

  const commitmentTypes = [
    { id: 'bank_loan', name: 'قروض بنكية', icon: 'card' as const, color: '#3B82F6' },
    { id: 'personal_debt', name: 'ديون شخصية', icon: 'people' as const, color: '#EF4444' },
    { id: 'installments', name: 'أقساط', icon: 'bag' as const, color: '#10B981' },
    { id: 'rent', name: 'إيجارات', icon: 'home' as const, color: '#06B6D4' },
    { id: 'utilities', name: 'فواتير', icon: 'flash' as const, color: '#F59E0B' },
    { id: 'insurance', name: 'تأمينات', icon: 'shield-checkmark' as const, color: '#8B5CF6' },
  ];

  const filteredCommitments = commitments.filter(commitment => {
    const matchesSearch = commitment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         commitment.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || commitment.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddCommitment = (newCommitment: any) => {
    setCommitments([...commitments, { ...newCommitment, id: Date.now().toString() }]);
  };



  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="البحث في الالتزامات..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        <Ionicons name="search" size={20} color="#9CA3AF" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}

      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.name} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCommitmentCard = (commitment: any) => (
    <TouchableOpacity
      key={commitment.id}
      style={styles.commitmentCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/commitment-details?id=${commitment.id}`)}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: 
        commitment.priority === 'urgent' ? '#EF4444' :
        commitment.priority === 'high' ? '#F59E0B' : '#10B981'
      }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeIcon, { backgroundColor: `${commitment.color}15` }]}>
            <Ionicons name={commitment.icon} size={24} color={commitment.color} />
          </View>
          <View style={styles.commitmentInfo}>
            <Text style={styles.commitmentName}>{commitment.name}</Text>
            <Text style={styles.commitmentSource}>{commitment.source}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>المبلغ المتبقي</Text>
            <Text style={styles.remainingAmount}>
              {commitment.remainingAmount.toLocaleString()} د.ك
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>القسط الشهري</Text>
            <Text style={styles.monthlyAmount}>
              {commitment.monthlyPayment.toLocaleString()} د.ك
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>التقدم</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(commitment.progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${commitment.progress * 100}%`,
                  backgroundColor: commitment.color,
                  alignSelf: 'flex-end' // RTL progress bar
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.dueDate}>استحقاق: {commitment.dueDate}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: commitment.color }]}
              onPress={(e) => {
                e.stopPropagation();
                router.push('/payment-record');
              }}
            >
              <Text style={styles.actionButtonText}>دفع</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/commitment-details?id=${commitment.id}`);
              }}
            >
              <Text style={styles.secondaryActionText}>تفاصيل</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          {commitments.reduce((sum, c) => sum + c.remainingAmount, 0).toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>إجمالي المتبقي (د.ك)</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          {commitments.reduce((sum, c) => sum + c.monthlyPayment, 0).toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>الأقساط الشهرية (د.ك)</Text>
      </View>
    </View>
  );

  const renderCommitmentTypes = () => (
    <View style={styles.typesContainer}>
      <Text style={styles.sectionTitle}>الأنواع</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {commitmentTypes.map((type) => {
          const count = commitments.filter(c => c.type === type.id).length;
          return (
            <TouchableOpacity key={type.id} style={styles.typeCard}>
              <View style={[styles.typeCardIcon, { backgroundColor: type.color }]}>
                <Ionicons name={type.icon} size={20} color="white" />
              </View>
              <Text style={styles.typeCardName}>{type.name}</Text>
              <Text style={styles.typeCardCount}>{count}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderCommitmentsList = () => (
    <View style={styles.commitmentsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الالتزامات</Text>
        <Text style={styles.sectionCount}>{filteredCommitments.length}</Text>
      </View>

      <View style={styles.commitmentsList}>
        {filteredCommitments.map(renderCommitmentCard)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubPageHeader
        title="الالتزامات المالية"
        subtitle={`${commitments.length} التزام نشط`}
        scrollY={scrollY}
        rightAction={{
          icon: 'filter',
          onPress: () => console.log('Filter')
        }}
      />

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderSearchAndFilters()}
        {renderQuickStats()}
        {renderCommitmentsList()}
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNav
        onAddCommitment={() => setShowAddModal(true)}
        currentRoute="الالتزامات"
      />

      <AddCommitmentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCommitment}
      />
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
  searchContainer: {
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  filtersContainer: {
    flexDirection: 'row-reverse',
  },
  filterChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  filterTextActive: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  typesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  typeCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  typeCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeCardName: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  typeCardCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 4,
    fontFamily: 'Cairo-Bold',
  },
  commitmentsSection: {
    marginBottom: 100,
  },
  commitmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    zIndex: 1,
  },
  cardContent: {
    padding: 16,
    paddingRight: 20,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  commitmentInfo: {
    flex: 1,
  },
  commitmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  commitmentSource: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
  },
  moreButton: {
    padding: 8,
  },
  amountSection: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    fontFamily: 'Cairo-Bold',
  },
  monthlyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row-reverse', // RTL progress bar
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
    fontFamily: 'Cairo-Regular',
  },
  actionButtons: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  secondaryActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommitmentsScreen;
