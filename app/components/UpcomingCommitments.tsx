
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
          <View key={commitment.id} style={[styles.card, commitment.overdue && styles.overdueCard]}>
            <View style={styles.amountContainer}>
              <Text style={styles.commitmentAmount}>{commitment.amount.toLocaleString()} د.ك</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>دفع</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
                  <Text style={[styles.actionText, styles.secondaryActionText]}>تأجيل</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.commitmentDetails}>
              <Text style={styles.commitmentName}>{commitment.name}</Text>
              <Text style={styles.commitmentDueDate}>{commitment.dueDate}</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: `${commitment.color}20` }]}>
              <Ionicons name={commitment.type === 'قرض بنكي' ? 'card' : commitment.type === 'إيجار' ? 'home' : commitment.type === 'أقساط' ? 'car' : 'receipt'} size={24} color={commitment.color} />
            </View>
          </View>
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
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  overdueCard: {
    borderWidth: 1,
    borderColor: '#EF4444',
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
});

export default UpcomingCommitments;
