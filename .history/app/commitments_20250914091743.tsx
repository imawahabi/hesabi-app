import { Ionicons } from '@expo/vector-icons';
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
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  // refs to control initial horizontal position (RTL feel)
  const typeFiltersScrollRef = useRef<ScrollView | null>(null);
  const statusFiltersScrollRef = useRef<ScrollView | null>(null);
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

  // اشتقاق الالتزامات بناءً على نوع الالتزام أولاً
  const typeFilteredCommitments = React.useMemo(() => (
    selectedTypeFilter === 'all'
      ? commitments
      : commitments.filter(c => c.type === selectedTypeFilter)
  ), [commitments, selectedTypeFilter]);

  // حساب أعداد الحالات للنوع المختار فقط
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: typeFilteredCommitments.length };
    for (const c of typeFilteredCommitments) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  }, [typeFilteredCommitments]);

  // خيارات فلتر الحالة مشتقة ديناميكياً من النوع المختار
  const statusFilterOptions = React.useMemo(() => {
    const base = [
      { id: 'all', name: 'الكل', color: '#6B7280' },
      { id: 'active', name: 'نشط', color: '#10B981' },
      { id: 'overdue', name: 'متأخر', color: '#EF4444' },
      { id: 'completed', name: 'مكتمل', color: '#3B82F6' },
    ];
    return base
      .map(opt => ({ ...opt, count: statusCounts[opt.id] || 0 }))
      .filter(opt => opt.id === 'all' || opt.count > 0);
  }, [statusCounts]);

  // إذا تغير النوع وجعل الحالة المختارة غير متاحة، نعيدها إلى "الكل"
  React.useEffect(() => {
    const availableIds = new Set(statusFilterOptions.map(o => o.id));
    if (!availableIds.has(selectedStatusFilter)) {
      setSelectedStatusFilter('all');
    }
  }, [selectedTypeFilter, statusFilterOptions, selectedStatusFilter]);

  const typeFilterOptions = [
    { id: 'all', name: 'الكل', icon: 'grid-outline' as const, color: '#6B7280', count: commitments.length },
    { id: 'bank_loan', name: 'قروض', icon: 'card-outline' as const, color: '#3B82F6', count: commitments.filter(c => c.type === 'bank_loan').length },
    { id: 'personal_debt', name: 'ديون', icon: 'person-outline' as const, color: '#EF4444', count: commitments.filter(c => c.type === 'personal_debt').length },
    { id: 'installments', name: 'أقساط', icon: 'bag-outline' as const, color: '#10B981', count: commitments.filter(c => c.type === 'installments').length },
    { id: 'rent', name: 'إيجار', icon: 'home-outline' as const, color: '#06B6D4', count: commitments.filter(c => c.type === 'rent').length },
    { id: 'utilities', name: 'فواتير', icon: 'flash-outline' as const, color: '#F59E0B', count: commitments.filter(c => c.type === 'utilities').length },
  ];

  const filteredCommitments = React.useMemo(() => {
    const withinType = typeFilteredCommitments;
    return withinType.filter(commitment => {
      const matchesSearch =
        commitment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commitment.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatusFilter === 'all' || commitment.status === selectedStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [typeFilteredCommitments, searchQuery, selectedStatusFilter]);

  const handleAddCommitment = (newCommitment: any) => {
    setCommitments([...commitments, { ...newCommitment, id: Date.now().toString() }]);
  };



  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث في الالتزامات..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
      </View>

      {/* فلتر أنواع الالتزامات */}
      <View style={styles.filtersRow}>
        <ScrollView
          ref={typeFiltersScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFiltersContainer}
          onContentSizeChange={() => typeFiltersScrollRef.current?.scrollToEnd({ animated: false })}
        >
          {typeFilterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.typeFilterChip,
                selectedTypeFilter === filter.id && styles.typeFilterChipActive
              ]}
              onPress={() => setSelectedTypeFilter(filter.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={filter.icon}
                size={18}
                color={selectedTypeFilter === filter.id ? 'white' : filter.color}
              />
              <Text style={[
                styles.typeFilterText,
                selectedTypeFilter === filter.id && styles.typeFilterTextActive
              ]}>
                {filter.name}
              </Text>
              <View style={[
                styles.typeFilterBadge,
                selectedTypeFilter === filter.id && styles.typeFilterBadgeActive
              ]}>
                <Text style={[
                  styles.typeFilterBadgeText,
                  selectedTypeFilter === filter.id && styles.typeFilterBadgeTextActive
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* فلتر حالات الالتزامات */}
      <ScrollView
        ref={statusFiltersScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusFiltersContainer}
        onContentSizeChange={() => statusFiltersScrollRef.current?.scrollToEnd({ animated: false })}
      >
        {statusFilterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.statusFilterChip,
              selectedStatusFilter === filter.id && styles.statusFilterChipActive
            ]}
            onPress={() => setSelectedStatusFilter(filter.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.statusIndicator, { backgroundColor: filter.color }]} />
            <Text
              style={[
                styles.statusFilterText,
                selectedStatusFilter === filter.id && styles.statusFilterTextActive
              ]}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {filter.name}
            </Text>
            <Text style={[
              styles.statusFilterCount,
              selectedStatusFilter === filter.id && styles.statusFilterCountActive
            ]}>
              {filter.count}
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
      activeOpacity={0.7}
      onPress={() => router.push(`/commitment-details?id=${commitment.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeIcon, { backgroundColor: commitment.color }]}>
            <Ionicons name={commitment.icon} size={20} color="white" />
          </View>
          <View style={styles.commitmentInfo}>
            <Text style={styles.commitmentName}>{commitment.name}</Text>
            <Text style={styles.commitmentSource}>{commitment.source}</Text>
          </View>
          <View style={[styles.priorityBadge, { 
            backgroundColor: commitment.priority === 'urgent' ? '#FEE2E2' :
                           commitment.priority === 'high' ? '#FEF3C7' : '#D1FAE5'
          }]}>
            <Text style={[styles.priorityText, {
              color: commitment.priority === 'urgent' ? '#DC2626' :
                     commitment.priority === 'high' ? '#D97706' : '#059669'
            }]}>
              {commitment.priority === 'urgent' ? 'عاجل' :
               commitment.priority === 'high' ? 'مهم' : 'عادي'}
            </Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.remainingAmount}>
              {commitment.remainingAmount.toLocaleString()} د.ك
            </Text>
            <Text style={styles.amountLabel}>المتبقي</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${commitment.progress * 100}%`,
                    backgroundColor: commitment.color,
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(commitment.progress * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.dueDate}>{commitment.dueDate}</Text>
          </View>
          <Text style={styles.monthlyAmount}>
            {commitment.monthlyPayment.toLocaleString()} د.ك/شهر
          </Text>
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


  const renderCommitmentsList = () => (
    <View style={styles.commitmentsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الالتزامات المالية</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionCount}>{filteredCommitments.length}</Text>
        </View>
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
          onPress: () => setShowFilters(prev => !prev)
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
        {showFilters && renderSearchAndFilters()}
        {renderQuickStats()}
        {renderCommitmentsList()}
      </Animated.ScrollView>

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
  filtersContent: {
    paddingHorizontal: 4,
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
  filterBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
    fontWeight: '600',
  },
  filterBadgeTextActive: {
    color: 'white',
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
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  commitmentsList: {
    gap: 0,
  },
  // أنماط الفلاتر المحدثة
  filtersRow: {
    marginBottom: 16,
  },
  typeFiltersContainer: {
    paddingHorizontal: 16,
    paddingRight: 8,
    flexDirection: 'row-reverse',
  },
  typeFilterChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  typeFilterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeFilterText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Cairo-SemiBold',
    fontWeight: '600',
    marginRight: 8,
    marginLeft: 6,
  },
  typeFilterTextActive: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  typeFilterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeFilterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  typeFilterBadgeText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Cairo-Bold',
    fontWeight: '700',
  },
  typeFilterBadgeTextActive: {
    color: 'white',
  },
  // أنماط فلتر الحالات
  statusFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statusFiltersContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusFilterChip: {
    flexDirection: 'row-reverse',
    alignItems: 'between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginLeft: 10,
    minHeight: 40,
  },
  statusFilterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },

  statusFilterText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Cairo-SemiBold',
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginRight: 8,
  },
  statusFilterTextActive: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  statusFilterCount: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Cairo-Bold',
    fontWeight: '700',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 22,
    textAlign: 'center',
  },
  statusFilterCountActive: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  commitmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Cairo-Bold',
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
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  monthlyAmount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  progressContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
    minWidth: 35,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  dueDateContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 11,
    color: '#6B7280',
    marginRight: 4,
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
