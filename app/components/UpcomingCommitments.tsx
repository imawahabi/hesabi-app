import {
  Calendar,
  TickCircle,
  Home3,
  Card as CardIcon,
  Bag2,
  Tag2,
  Profile2User,
  Flash,
  Heart,
  Wallet,
  Receipt1,
  Clock,
} from 'iconsax-react-nativejs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UpcomingCommitmentsProps {
  commitments: any[];
  onPayCommitment?: (commitment: any) => void;
  onPostponeCommitment?: (commitment: any) => void;
}

const UpcomingCommitments: React.FC<UpcomingCommitmentsProps> = ({ 
  commitments, 
  onPayCommitment, 
  onPostponeCommitment 
}) => {
  const getCommitmentIcon = (type: string) => {
    const map: { [key: string]: React.ComponentType<any> } = {
      'قرض شخصي': Profile2User,
      'قرض بنكي': CardIcon,
      'أقساط بدون فوائد': Bag2,
      'أقساط بفوائد': Tag2,
      'تعاونيات': Profile2User,
      'إيجار': Home3,
      'خدمات عامة': Flash,
      'تأمين صحي': Heart,
      'الإدخار': Wallet,
    };
    return map[type] || Receipt1;
  };

  const getUrgencyData = (daysLeft: number) => {
    if (daysLeft < 0) return { color: '#DC2626', bgColor: '#FEF2F2', text: `متأخر ${Math.abs(daysLeft)} يوم`, level: 'urgent' };
    if (daysLeft === 0) return { color: '#EA580C', bgColor: '#FFF7ED', text: 'مستحق اليوم', level: 'today' };
    if (daysLeft <= 3) return { color: '#D97706', bgColor: '#FFFBEB', text: `${daysLeft} أيام`, level: 'soon' };
    if (daysLeft <= 7) return { color: '#2563EB', bgColor: '#EFF6FF', text: `${daysLeft} أيام`, level: 'week' };
    return { color: '#059669', bgColor: '#ECFDF5', text: `${daysLeft} يوم`, level: 'safe' };
  };

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrapper}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 15,
                  backgroundColor: '#EEF2FF',
                  borderWidth: 2,
                  borderColor: 'rgba(59, 130, 246, 0.25)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Calendar size={22} color="#3B82F6" variant="Bold" />
              </View>
            </View>
            <Text style={styles.sectionTitle}>الالتزامات القادمة</Text>
            {commitments.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{commitments.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => router.push('/commitments')}
          >
            <Text style={styles.moreText}>المزيد</Text>
            <Ionicons name="chevron-back" size={18} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {commitments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.emptyCard}
          >
            <View style={styles.emptyIconBg}>
              <TickCircle size={32} color="#16A34A" variant="Bold" />
            </View>
            <Text style={styles.emptyMainText}>رائع! لا توجد التزامات عاجلة</Text>
            <Text style={styles.emptySubText}>جميع التزاماتك تحت السيطرة</Text>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {commitments.map((commitment, index) => {
            const urgency = getUrgencyData(commitment.daysLeft || 0);
            
            return (
              <View key={commitment.id} style={[styles.card, index === 0 && styles.firstCard]}>
                <LinearGradient
                  colors={['#FFFFFF', '#FAFBFF']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardMain}>
                    {/* Left: Icon & Info */}
                    <View style={styles.leftSection}>
                      <View style={[styles.iconBg, { backgroundColor: `${commitment.color}15` }]}>
                        {(() => {
                          const IconCmp = getCommitmentIcon(commitment.type);
                          return <IconCmp size={20} color={commitment.color} variant={'Bold'} />;
                        })()}
                      </View>
                      <View style={styles.infoSection}>
                        <Text style={styles.commitmentTitle} numberOfLines={1}>
                          {commitment.name}
                        </Text>
                        <View style={styles.metaRow}>
                          <Calendar size={12} color="#94A3B8" variant="Outline" />
                          <Text style={styles.dateText}>{commitment.dueDate}</Text>
                          <View style={[styles.urgencyBadge, { backgroundColor: urgency.bgColor }]}>
                            <View style={[styles.urgencyDot, { backgroundColor: urgency.color }]} />
                            <Text style={[styles.urgencyText, { color: urgency.color }]}>
                              {urgency.text}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Right: Amount & Actions */}
                    <View style={styles.rightSection}>
                      <View style={styles.amountContainer}>
                        <Text style={styles.amount}>{commitment.amount.toLocaleString()}</Text>
                        <Text style={styles.currency}>د.ك</Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity 
                      style={[styles.primaryAction, { backgroundColor: commitment.color }]}
                      onPress={() => onPayCommitment?.(commitment)}
                      activeOpacity={0.7}
                    >
                      <CardIcon size={16} color="white" variant="Bold" />
                      <Text style={styles.primaryActionText}>دفع الآن</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.secondaryAction}
                      onPress={() => onPostponeCommitment?.(commitment)}
                      activeOpacity={0.7}
                    >
                      <Clock size={16} color="#64748B" variant="Outline" />
                      <Text style={styles.secondaryActionText}>تأجيل</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Cairo-Bold',
  },
  badge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 3,
    marginRight: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  moreButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moreText: {
    fontSize: 13,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginLeft: 6,
  },
  
  // Empty State
  emptyContainer: {
    marginTop: 16,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    fontFamily: 'Cairo-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#16A34A',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  
  // Cards Container
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  firstCard: {
    // reserved for potential special styling of the first card
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  
  // Card Content
  cardMain: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
  infoSection: {
    flex: 1,
  },
  commitmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: 'Cairo-Regular',
    marginRight: 6,
  },
  
  // Right Section
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    marginBottom: 0,
  },
  amount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Cairo-Bold',
  },
  currency: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Cairo-Regular',
    marginTop: 0,
    marginRight: 4,
  },
  urgencyBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Cairo-Bold',
  },
  
  // Actions
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  primaryAction: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  secondaryAction: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    gap: 6,
  },
  secondaryActionText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Cairo-Bold',
  },
});

export default UpcomingCommitments;
