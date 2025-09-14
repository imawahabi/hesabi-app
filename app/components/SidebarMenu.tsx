import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: number;
  color: string;
}

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onAddCommitment?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  visible,
  onClose,
  userName,
  userEmail,
  onAddCommitment,
}) => {
  const slideAnim = useRef(new Animated.Value(320)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(false);
  const menuItems: MenuItem[] = [
    { id: 'dashboard', title: 'لوحة التحكم', icon: 'home', color: '#3B82F6' },
    { id: 'commitments', title: 'الالتزامات المالية', icon: 'card', badge: 8, color: '#EF4444' },
    { id: 'payments', title: 'المدفوعات', icon: 'wallet', color: '#10B981' },
    { id: 'analytics', title: 'التقارير والتحليلات', icon: 'bar-chart', color: '#F59E0B' },
    { id: 'reminders', title: 'التذكيرات', icon: 'notifications', badge: 3, color: '#8B5CF6' },
    { id: 'categories', title: 'فئات الالتزامات', icon: 'grid', color: '#06B6D4' },
    { id: 'goals', title: 'الأهداف المالية', icon: 'trophy', color: '#F97316' },
    { id: 'calculator', title: 'حاسبة الديون', icon: 'calculator', color: '#84CC16' },
  ];

  const settingsItems: MenuItem[] = [
    { id: 'profile', title: 'الملف الشخصي', icon: 'person', color: '#6B7280' },
    { id: 'settings', title: 'الإعدادات', icon: 'settings', color: '#6B7280' },
    { id: 'security', title: 'الأمان والخصوصية', icon: 'shield-checkmark', color: '#6B7280' },
    { id: 'help', title: 'المساعدة والدعم', icon: 'help-circle', color: '#6B7280' },
  ];

  useEffect(() => {
    if (visible) {
      // Mount modal then animate in
      setInternalVisible(true);
      slideAnim.setValue(320);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (internalVisible) {
      // Animate out then unmount
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 320,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible, internalVisible, slideAnim, overlayOpacity]);

  const handleMenuItemPress = (itemId: string) => {
    // Add haptic feedback or navigation logic here
    console.log('Menu item pressed:', itemId);
  };

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        <Animated.View style={[
          styles.sidebarContainer,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}>
          {/* Header */}
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userName}</Text>
              </View>
            </View>
            
            <View style={styles.closeButton}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Menu Content */}
          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            {/* Main Menu */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>القائمة الرئيسية</Text>
              {menuItems.map((item) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }] }>
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-back" size={16} color="#D1D5DB" />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Settings Menu */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>الإعدادات</Text>
              {settingsItems.map((item) => (
                  <View key={item.id}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => handleMenuItemPress(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }] }>
                          <Ionicons name={item.icon as any} size={20} color={item.color} />
                        </View>
                        <Text style={styles.menuItemText}>{item.title}</Text>
                      </View>
                      <Ionicons name="chevron-back" size={16} color="#D1D5DB" />
                    </TouchableOpacity>
                  </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <View>
                <TouchableOpacity 
                  style={styles.quickActionButton} 
                  activeOpacity={0.8}
                  onPress={onAddCommitment}
                >
                  <Ionicons name="add-circle" size={20} color="#3B82F6" />
                  <Text style={styles.quickActionText}>إضافة التزام جديد</Text>
                </TouchableOpacity>
              </View>
              
              <View>
                <TouchableOpacity style={styles.quickActionButton} activeOpacity={0.8}>
                  <Ionicons name="card" size={20} color="#10B981" />
                  <Text style={styles.quickActionText}>تسجيل دفعة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
              <Ionicons name="log-out" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </TouchableOpacity>
            
            <View style={styles.appInfo}>
              <Text style={styles.appVersion}>تطبيق حسابي v1.0.0</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebarContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  userDetails: {
    marginRight: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginLeft: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Cairo-Regular',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuItemLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  menuItemRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Cairo-Bold',
    marginRight: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontFamily: 'Cairo-Bold',
    marginRight: 8,
  },
  appInfo: {
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Cairo-Regular',
  },
});

export default SidebarMenu;
