import { Ionicons } from '@expo/vector-icons';
import { TickCircle, Notification as Bell, MedalStar, Danger } from 'iconsax-react-nativejs';
import React from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'reminder' | 'achievement' | 'warning';
  read: boolean;
  amount?: number;
}

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const getNotificationIconCmp = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return TickCircle;
      case 'reminder': return Bell;
      case 'achievement': return MedalStar;
      case 'warning': return Danger;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return '#10B981';
      case 'reminder': return '#3B82F6';
      case 'achievement': return '#F59E0B';
      case 'warning': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>الإشعارات</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Actions */}
          {unreadCount > 0 && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.markAllButton} onPress={onMarkAllAsRead}>
                <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                <Text style={styles.markAllText}>تحديد الكل كمقروء</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
                <Text style={styles.emptyMessage}>ستظهر الإشعارات الجديدة هنا</Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification,
                  ]}
                  onPress={() => onMarkAsRead(notification.id)}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <View style={styles.notificationLeft}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: `${getNotificationColor(notification.type)}20` },
                          ]}
                        >
                          {(() => {
                            const IconCmp = getNotificationIconCmp(notification.type);
                            return <IconCmp size={20} color={getNotificationColor(notification.type)} variant={notification.read ? 'Outline' : 'Bold'} />;
                          })()}
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={styles.notificationTitle}>{notification.title}</Text>
                          <Text style={styles.notificationMessage}>{notification.message}</Text>
                        </View>
                      </View>
                      <View style={styles.notificationRight}>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                        {notification.amount && (
                          <Text style={[styles.amount, { color: getNotificationColor(notification.type) }]}>
                            {notification.amount} د.ك
                          </Text>
                        )}
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>عرض جميع الإشعارات</Text>
              <Ionicons name="arrow-back" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    minHeight: '60%',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  markAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
  },
  markAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginRight: 6,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    fontFamily: 'Cairo-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#FAFBFC',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BFDBFE',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    lineHeight: 20,
  },
  notificationRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Cairo-Regular',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viewAllText: {
    fontSize: 16,
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    marginRight: 8,
  },
});

export default NotificationsModal;
