
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Activity {
  id: number;
  title: string;
  time: string;
  amount?: number;
  color: string;
  type: 'payment' | 'reminder' | 'new' | 'update';
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Get last 10 activities and sort by most recent
  const recentActivities = activities.slice(-10).reverse();
  const displayActivities = showAll ? recentActivities : recentActivities.slice(0, 3);
  
  const getActivityIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'payment': 'checkmark-circle',
      'reminder': 'notifications',
      'new': 'add-circle',
      'update': 'sync-circle'
    };
    return iconMap[type] || 'information-circle';
  };

  const renderActivity = (item: Activity, index: number) => (
    <View key={item.id} style={[styles.activityCard, index === 0 && styles.firstCard]}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFBFF']}
        style={styles.cardGradient}
      >
        <View style={styles.activityMain}>
          {/* Left: Icon */}
          <View style={[styles.iconBg, { backgroundColor: `${item.color}15` }]}>
            <Ionicons 
              name={getActivityIcon(item.type) as any}
              size={22} 
              color={item.color} 
            />
          </View>
          
          {/* Center: Details */}
          <View style={styles.activityDetails}>
            <Text style={styles.activityTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color="#94A3B8" />
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
          
          {/* Right: Amount */}
          {item.amount && item.amount > 0 && (
            <View style={styles.amountContainer}>
              <Text style={[styles.activityAmount, { color: item.color }]}>
                {item.amount.toLocaleString()}
              </Text>
              <Text style={styles.currency}>د.ك</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.iconWrapper}>
              <Ionicons name="pulse" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.sectionTitle}>الأنشطة الأخيرة</Text>
            {recentActivities.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recentActivities.length}</Text>
              </View>
            )}
          </View>
          {recentActivities.length > 3 && (
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={styles.moreText}>{showAll ? 'أقل' : 'المزيد'}</Text>
              <Ionicons 
                name={showAll ? "chevron-up" : "chevron-down"} 
                size={14} 
                color="#6366F1" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {recentActivities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['#F3F4F6', '#E5E7EB']}
            style={styles.emptyCard}
          >
            <View style={styles.emptyIconBg}>
              <Ionicons name="document-text-outline" size={32} color="#6B7280" />
            </View>
            <Text style={styles.emptyMainText}>لا توجد أنشطة حديثة</Text>
            <Text style={styles.emptySubText}>ستظهر أنشطتك هنا عند القيام بأي عمليات</Text>
          </LinearGradient>
        </View>
      ) : (
        <ScrollView 
          style={styles.activitiesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {displayActivities.map((activity, index) => renderActivity(activity, index))}
          
          {showAll && recentActivities.length > 10 && (
            <View style={styles.loadMoreContainer}>
              <Text style={styles.loadMoreText}>إظهار آخر 10 أنشطة فقط</Text>
            </View>
          )}
        </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Cairo-Bold',
  },
  badge: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 8,
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
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  
  // Activities Container
  activitiesContainer: {
    maxHeight: 400, // Limit height for scrolling
  },
  scrollContent: {
    paddingBottom: 10,
  },
  activityCard: {
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  firstCard: {
    shadowOpacity: 0.1,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 18,
    padding: 16,
  },
  
  // Activity Content
  activityMain: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
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
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Cairo-Regular',
    marginRight: 6,
  },
  
  // Amount Section
  amountContainer: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  currency: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Cairo-Regular',
    marginTop: -2,
  },
  
  // Load More
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Cairo-Regular',
  },
});

export default RecentActivities;
