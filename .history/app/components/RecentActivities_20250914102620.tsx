
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View, ListRenderItem } from 'react-native';

type ActivityType = 'payment' | 'reminder' | 'new' | 'settings' | string;

interface Activity {
  id: string | number;
  amount: number;
  color: string;
  title: string;
  time: string;
  type: ActivityType;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const renderItem: ListRenderItem<Activity> = ({ item }) => (
    <View style={styles.activityItem}>
      {item.amount > 0 && (
        <Text style={[styles.activityAmount, { color: item.color }]}>
          {item.amount.toLocaleString()} د.ك
        </Text>
      )}
      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.type === 'payment' ? 'checkmark-circle' : item.type === 'reminder' ? 'notifications' : item.type === 'new' ? 'add-circle' : 'settings'} size={24} color={item.color} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الأنشطة الأخيرة</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    marginBottom: 15,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    textAlign: 'left',
  },
});

export default RecentActivities;
