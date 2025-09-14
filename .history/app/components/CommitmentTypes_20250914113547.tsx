
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CommitmentTypes = ({ types }: { types: any[] }) => {
  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrapper}>
              <Ionicons name="grid" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.sectionTitle}>أنواع الالتزامات</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreText}>المزيد</Text>
            <Ionicons name="chevron-back" size={14} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        style={{ transform: [{ scaleX: -1 }] }}
      >
        {types.map((type) => (
          <TouchableOpacity key={type.id} style={[styles.card, { transform: [{ scaleX: -1 }] }]} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                  <Ionicons name={type.icon} size={22} color="white" />
                </View>
                <View style={[styles.countBadge, { backgroundColor: `${type.color}20` }]}>
                  <Text style={[styles.countText, { color: type.color }]}>{type.count}</Text>
                </View>
              </View>
              <Text style={styles.typeName} numberOfLines={1}>{type.name}</Text>
              <View style={styles.amountSection}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>شهرياً</Text>
                  <Text style={[styles.monthlyAmount, { color: type.color }]}>{type.monthlyAmount} د.ك</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>إجمالي</Text>
                  <Text style={styles.totalAmount}>{type.totalAmount} د.ك</Text>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: `${type.color}15` }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: type.color,
                      width: `${Math.min((type.monthlyAmount / type.totalAmount) * 100 * 12, 100)}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.card, styles.addCard, { transform: [{ scaleX: -1 }] }]} activeOpacity={0.7}>
          <View style={styles.addCardContent}>
            <View style={styles.addIconWrapper}>
              <View style={styles.addIconContainer}>
                <Ionicons name="add" size={24} color="#3B82F6" />
              </View>
              <View style={styles.addPlusIcon}>
                <Ionicons name="add-circle" size={18} color="#10B981" />
              </View>
            </View>
            <Text style={styles.addTitle}>إضافة التزام</Text>
            <Text style={styles.addSubtitle}>نوع جديد</Text>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>إضافة</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#08234d',
    fontFamily: 'Cairo-Bold',
  },
  moreButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moreText: {
    fontSize: 13,
    color: '#6366F1',
    fontFamily: 'Cairo-Bold',
    marginLeft: 6,
  },
  scrollView: {
    flexDirection: 'row-reverse',
  },
  scrollContainer: {
    paddingRight: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    marginLeft: 15,
    width: 160,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(9, 36, 80, 0.08)',
  },
  addCard: {
    backgroundColor: '#F8FAFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  addIconWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  addIconContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlusIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  addTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  addSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  countBadge: {
    borderRadius: 32,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  typeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 22,
  },
  amountSection: {
    marginBottom: 12,
    gap: 6,
  },
  amountRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
  },
  monthlyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  totalAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Cairo-Bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default CommitmentTypes;
