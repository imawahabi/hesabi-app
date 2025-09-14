
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UpcomingCommitments = ({ commitments }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الالتزامات القادمة</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>عرض الكل</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {commitments.map((commitment) => (
          <TouchableOpacity
            key={commitment.id}
            style={[styles.card, commitment.overdue && styles.overdueCard]}
            activeOpacity={0.8}
          >
            {/* Priority Indicator */}
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: commitment.priority === 'urgent' ? '#EF4444' :
                                 commitment.priority === 'high' ? '#F59E0B' : '#10B981' }
            ]} />

            {/* Card Content */}
            <View style={styles.cardContent}>
              <View style={styles.amountContainer}>
                <Text style={styles.commitmentAmount}>{commitment.amount.toLocaleString()} د.ك</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: commitment.color }]}>
                    <Text style={styles.actionText}>دفع</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
                    <Text style={[styles.actionText, styles.secondaryActionText]}>تأجيل</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.commitmentDetails}>
                <Text style={styles.commitmentName}>{commitment.name}</Text>
                <View style={styles.dueDateContainer}>
                  <Text style={[styles.commitmentDueDate, commitment.overdue && styles.overdueDateText]}>
                    {commitment.dueDate}
                  </Text>
                  {commitment.daysLeft !== undefined && (
                    <Text style={[styles.daysLeftText,
                      { color: commitment.daysLeft < 0 ? '#EF4444' :
                               commitment.daysLeft <= 3 ? '#F59E0B' : '#10B981' }
                    ]}>
                      {commitment.daysLeft < 0 ? `متأخر ${Math.abs(commitment.daysLeft)} يوم` :
                       commitment.daysLeft === 0 ? 'اليوم' : `${commitment.daysLeft} يوم`}
                    </Text>
                  )}
                </View>
              </View>

              <View style={[styles.iconContainer, { backgroundColor: `${commitment.color}15` }]}>
                <Ionicons name={commitment.type === 'قرض بنكي' ? 'card' : commitment.type === 'إيجار' ? 'home' : commitment.type === 'أقساط' ? 'car' : 'receipt'} size={24} color={commitment.color} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  viewAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
  },
  listContainer: {
    // No specific styles needed here, cards will be styled individually
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  overdueCard: {
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.15,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 20, // Extra padding for priority indicator
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  commitmentDetails: {
    flex: 1,
  },
  commitmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  commitmentDueDate: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  commitmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  secondaryActionButton: {
    backgroundColor: '#E5E7EB',
  },
  secondaryActionText: {
    color: '#1F2937',
  },
  dueDateContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  overdueDateText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  daysLeftText: {
    fontSize: 11,
    fontFamily: 'Cairo-Regular',
    marginTop: 2,
    textAlign: 'right',
  },
});

export default UpcomingCommitments;
