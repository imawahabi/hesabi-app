import { Ionicons } from '@expo/vector-icons';
import {
  Notification as Bell,
  CloudAdd,
  DocumentDownload,
  FingerScan,
  InfoCircle,
  LanguageCircle,
  Lock,
  Logout,
  Message,
  MessageQuestion,
  Moon,
  ProfileCircle,
  Setting2,
  ShieldTick,
  Trash,
  Wallet as WalletIcon,
} from 'iconsax-react-nativejs';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SubPageHeader from './components/SubPageHeader';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const userInfo = {
    name: 'محمد أحمد العقاد',
    email: 'imawahabi@gmail.com',
    phone: '+965 65500470',
    monthlyIncome: 520.000,
    joinDate: '2025-01-15',
  };

  const getIconsaxByName = (name: string): React.ComponentType<any> => {
    switch (name) {
      case 'person': return ProfileCircle;
      case 'wallet': return WalletIcon;
      case 'lock-closed': return Lock;
      case 'notifications': return Bell;
      case 'finger-print': return FingerScan;
      case 'shield-checkmark': return ShieldTick;
      case 'moon': return Moon;
      case 'cloud-upload': return CloudAdd;
      case 'download': return DocumentDownload;
      case 'language': return LanguageCircle;
      case 'help-circle': return MessageQuestion;
      case 'chatbubble-ellipses': return Message;
      case 'information-circle': return InfoCircle;
      case 'log-out': return Logout;
      case 'trash': return Trash;
      default: return InfoCircle;
    }
  };

  const settingSections = [
    {
      title: 'الحساب الشخصي',
      items: [
        {
          id: 'profile',
          title: 'الملف الشخصي',
          subtitle: 'تعديل المعلومات الشخصية',
          icon: 'person',
          color: '#3B82F6',
          action: 'navigate',
        },
        {
          id: 'income',
          title: 'الدخل الشهري',
          subtitle: `${userInfo.monthlyIncome.toLocaleString()} د.ك`,
          icon: 'wallet',
          color: '#10B981',
          action: 'navigate',
        },
        {
          id: 'password',
          title: 'كلمة المرور',
          subtitle: 'تغيير كلمة المرور',
          icon: 'lock-closed',
          color: '#F59E0B',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'الإشعارات والأمان',
      items: [
        {
          id: 'notifications',
          title: 'الإشعارات',
          subtitle: 'تذكيرات المدفوعات والتحديثات',
          icon: 'notifications',
          color: '#8B5CF6',
          action: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'biometric',
          title: 'المصادقة البيومترية',
          subtitle: 'بصمة الإصبع أو Face ID',
          icon: 'finger-print',
          color: '#EF4444',
          action: 'toggle',
          value: biometric,
          onToggle: setBiometric,
        },
        {
          id: 'privacy',
          title: 'الخصوصية والأمان',
          subtitle: 'إعدادات الحماية والخصوصية',
          icon: 'shield-checkmark',
          color: '#06B6D4',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'التطبيق والبيانات',
      items: [
        {
          id: 'theme',
          title: 'الوضع الليلي',
          subtitle: 'تفعيل المظهر الداكن',
          icon: 'moon',
          color: '#374151',
          action: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'backup',
          title: 'النسخ الاحتياطي التلقائي',
          subtitle: 'حفظ البيانات تلقائياً',
          icon: 'cloud-upload',
          color: '#10B981',
          action: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: 'export',
          title: 'تصدير البيانات',
          subtitle: 'تحميل نسخة من بياناتك',
          icon: 'download',
          color: '#3B82F6',
          action: 'navigate',
        },
        {
          id: 'language',
          title: 'اللغة',
          subtitle: 'العربية',
          icon: 'language',
          color: '#F59E0B',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'الدعم والمساعدة',
      items: [
        {
          id: 'help',
          title: 'المساعدة والدعم',
          subtitle: 'الأسئلة الشائعة والدعم الفني',
          icon: 'help-circle',
          color: '#8B5CF6',
          action: 'navigate',
        },
        {
          id: 'feedback',
          title: 'إرسال ملاحظات',
          subtitle: 'شاركنا رأيك لتحسين التطبيق',
          icon: 'chatbubble-ellipses',
          color: '#10B981',
          action: 'navigate',
        },
        {
          id: 'about',
          title: 'حول التطبيق',
          subtitle: 'الإصدار 1.0.0',
          icon: 'information-circle',
          color: '#6B7280',
          action: 'navigate',
        },
      ],
    },
  ];

  const dangerousActions = [
    {
      id: 'logout',
      title: 'تسجيل الخروج',
      subtitle: 'الخروج من الحساب الحالي',
      icon: 'log-out',
      color: '#EF4444',
      action: () => handleLogout(),
    },
    {
      id: 'delete',
      title: 'حذف الحساب',
      subtitle: 'حذف الحساب نهائياً مع جميع البيانات',
      icon: 'trash',
      color: '#DC2626',
      action: () => handleDeleteAccount(),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'تحذير: هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف نهائياً', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  const handleSettingPress = (item: any) => {
    if (item.action === 'navigate') {
      console.log(`Navigate to ${item.id}`);
    }
  };

  // SubPageHeader will be used instead of a custom header

  const renderUserCard = () => (
    <View style={styles.userCard}>
      <View style={styles.userAvatar}>
        <Text style={styles.userInitials}>
          {userInfo.name.split('.').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.userEmail}>{userInfo.email}</Text>
        <Text style={styles.userJoinDate}>
          عضو منذ {new Date(userInfo.joinDate).toLocaleDateString('ar-US')}
        </Text>
      </View>
      <TouchableOpacity style={styles.editProfileButton}>
        <Ionicons name="create" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => handleSettingPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
        {(() => {
          const IconCmp = getIconsaxByName(item.icon);
          return <IconCmp size={20} color={item.color} variant={'Bold'} />;
        })()}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>

      {item.action === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#E5E7EB', true: `${item.color}40` }}
          thumbColor={item.value ? item.color : '#F3F4F6'}
        />
      ) : (
        <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  const renderDangerousItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, styles.dangerousItem]}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
        {(() => { const IconCmp = getIconsaxByName(item.icon); return <IconCmp size={20} color={item.color} variant={'Bold'} />; })()}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>

      <Ionicons name="chevron-back" size={20} color={item.color} />
    </TouchableOpacity>
  );

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubPageHeader
        title="الإعدادات"
        scrollY={scrollY}
        showBackButton={false}
        titleIcon={<Setting2 size={22} color="#111827" variant={'Outline'} />}
        compact={true}
      />
      
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderUserCard()}
        
        {settingSections.map(renderSection)}
        
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>المنطقة الخطرة</Text>
          <View style={styles.sectionContent}>
            {dangerousActions.map(renderDangerousItem)}
          </View>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            تطبيق حسابي • الإصدار 1.0.0
          </Text>
          <Text style={styles.appInfoText}>
            © 2024 جميع الحقوق محفوظة
          </Text>
        </View>
        
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
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
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginTop: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  userInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  userJoinDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
    fontFamily: 'Cairo-Regular',
  },
  dangerZone: {
    marginBottom: 24,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  dangerousItem: {
    backgroundColor: '#FEF2F2',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SettingsScreen;
