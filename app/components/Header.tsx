import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LampCharge, Notification, User, Wallet } from 'iconsax-react-nativejs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NotificationsModal from './NotificationsModal';

interface HeaderProps {
  userName: string;
  onMenuPress?: () => void;
}

const Header = ({ userName, onMenuPress }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;

  // Rotating financial tips
  const tips = useMemo(
    () => [
      'خصّص 20% من دخلك للادخار الطارئ',
      'سدّد الديون ذات الفائدة الأعلى أولاً',
      'راقب مصاريفك الأسبوعية وحدّد سقفاً لكل فئة',
      'ادّخر قبل أن تصرف (Pay Yourself First)',
      'خطّط للالتزامات الموسمية مبكراً (مدارس/سفر)',
      'استقطع مبلغ الادخار تلقائياً فور استلام الراتب',
      'استثمر جزءاً من مدخراتك في أدوات منخفضة المخاطر',
      'ضع ميزانية شهرية والتزم بها مهما كانت الظروف',
      'أعد التفاوض على القروض إذا توفرت فائدة أقل',
      'تخلص من الاشتراكات التلقائية غير المستخدمة',
    ],
    []
  );
  const [tipIndex, setTipIndex] = useState(0);
  const tipAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.timing(tipAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
        Animated.timing(tipAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    };
    const id = setInterval(cycle, 10000);
    return () => clearInterval(id);
  }, [tips, tipAnim]);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'تذكير دفع القسط',
      message: 'حان موعد دفع قسط بيت التمويل الكويتي',
      time: 'منذ ساعة',
      type: 'reminder' as const,
      read: false,
      amount: 180,
    },
    {
      id: 2,
      title: 'تم السداد بنجاح',
      message: 'تم سداد قسط السيارة بنجاح',
      time: 'منذ 3 ساعات',
      type: 'payment' as const,
      read: false,
      amount: 100,
    },
    {
      id: 3,
      title: 'إنجاز رائع!',
      message: 'لقد حققت 35% من هدف سداد الديون',
      time: 'أمس',
      type: 'achievement' as const,
      read: true,
    },
  ];

  useEffect(() => {
    // Create floating animations for circles
    const createFloatingAnimation = (animValue: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Create gentle scale animations
    const createScaleAnimation = (animValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1.2,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start animations
    createFloatingAnimation(floatAnim1, 4000, 0).start();
    createFloatingAnimation(floatAnim2, 5000, 1000).start();
    createFloatingAnimation(floatAnim3, 6000, 2000).start();
    createScaleAnimation(scaleAnim1, 3000).start();
    createScaleAnimation(scaleAnim2, 4000).start();
  }, [floatAnim1, floatAnim2, floatAnim3, scaleAnim1, scaleAnim2]);

  // Animation interpolations
  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -8],
  });

  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 15],
  });

  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.headerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          {
            transform: [{ translateY: float1Y }, { scale: scaleAnim1 }]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          {
            transform: [{ translateY: float2Y }, { scale: scaleAnim2 }]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle3,
          {
            transform: [{ translateY: float3Y }]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle4,
          {
            transform: [{ translateY: float1Y }]
          }
        ]}
      />
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
            <Ionicons name="menu" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.appNameContainer}>
          <Wallet size={24} color="white" variant="Bold" style={styles.appLogo as any} />
          <Text style={styles.appName}>حسابي</Text>
        </View>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => setShowNotifications(true)}
          activeOpacity={0.7}
        >
          <View>
            <Notification size={24} color="white" variant="Bold" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.welcomeContainer}>
        <View style={styles.greetingRow}>
          {/* Avatar on the right in RTL (row-reverse) by placing it first */}
          <View style={styles.avatarPlaceholder} accessibilityRole="image" accessibilityLabel="صورة المستخدم">
            <User size={18} color="white" variant="Bold" />
          </View>
          <Text style={styles.welcomeMessage}>مرحباً، </Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.tipContainer}>
          <LampCharge size={18} color="yellow" variant="Bold" style={styles.tipIcon as any} />
          <Animated.Text
            style={[
              styles.motivationText,
              {
                opacity: tipAnim,
                transform: [
                  {
                    translateY: tipAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
                  },
                ],
              },
            ]}
            accessibilityRole="text"
            accessibilityLabel="نصيحة مالية"
          >
            <Text style={{color:"yellow"}}>نصيحة : </Text>{tips[tipIndex]}
          </Animated.Text>
        </View>
      </View>
      
      {/* Modals */}
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          // Handle mark as read logic
        }}
        onMarkAllAsRead={() => {
          notifications.forEach(notification => {
            notification.read = true;
          });
        }}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  navBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    padding: 5,
  },
  appNameContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  appLogo: {
    marginLeft: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    marginLeft:10,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: -20,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 40,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: 20,
    right: 50,
  },
  circle4: {
    width: 100,
    height: 100,
    bottom: -30,
    left: 30,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    marginBottom:10,
    fontWeight:'bold',
    fontFamily:'Cairo-Bold',
  },
  welcomeTextContainer: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 12,
  },
  salaryCountdownContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 90,
  },
  salaryCountdownLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Cairo-Regular',
    marginBottom: 3,
    textAlign: 'center',
  },
  salaryCountdownDays: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    marginBottom: 4,
  },
  welcomeMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Cairo-Regular',
  },
  userName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    marginBottom: 4,
    marginRight:5,
  },
  greetingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  waveEmoji: {
    marginLeft: 6,
  },
  waveText: {
    fontSize: 18,
  },
  tipContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    marginHorizontal: 0,
    marginRight:-25
  },
  tipIcon: {
    marginLeft: 4,
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Cairo-Regular',
  },
  salaryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 4,
  },
  countdownProgress: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
});

export default Header;
