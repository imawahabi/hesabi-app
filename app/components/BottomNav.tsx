import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Cards, Home3, StatusUp, UserOctagon } from 'iconsax-react-nativejs';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  onAddCommitment?: () => void;
  currentRoute?: string;
}

const BottomNav = ({ onAddCommitment, currentRoute }: BottomNavProps) => {
  const [active, setActive] = React.useState(currentRoute || 'الرئيسية');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Keep active tab in sync with the current route provided by parent
  React.useEffect(() => {
    if (currentRoute && currentRoute !== active) {
      setActive(currentRoute);
    }
  }, [currentRoute, active]);

  const navItems = [
    { name: 'الرئيسية', Icon: Home3, route: '/dashboard' as const },
    { name: 'الالتزامات', Icon: Cards, route: '/commitments' as const },
    { name: '+', Icon: null as any, route: null },
    { name: 'التحليلات', Icon: StatusUp, route: '/analytics' as const },
    { name: 'الاعدادات', Icon: UserOctagon, route: '/settings' as const },
  ];

  const handleFabPress = () => {
    setActive('+');
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAddCommitment?.();
    });
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={35} tint="light" style={styles.navWrapper}>
        {/* Subtle translucent overlay for premium glass effect */}
        <LinearGradient
          colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0.15)"]}
          style={styles.glassOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.navContainer}>
          {navItems.map((item, index) => {
            const isCenter = index === 2; // Make the third item (+) the center FAB
            
            if (isCenter) {
              return (
                <Animated.View key={item.name} style={[styles.fabContainer, { transform: [{ scale: scaleAnim }] }, { paddingHorizontal: 12 }]}>
                  <TouchableOpacity
                    style={styles.fabTouchable}
                    onPress={handleFabPress}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#60A5FA', '#3B82F6', '#1D4ED8']}
                      style={styles.fab}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="add" size={30} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            }
            
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => {
                  setActive(item.name);
                  if (item.route) {
                    try {
                      router.replace(item.route as any);
                    } catch (error) {
                      console.log('Navigation error:', error);
                    }
                  }
                }}
                activeOpacity={0.6}
              >
                <item.Icon
                  size={24}
                  color={active === item.name ? '#3B82F6' : '#9CA3AF'}
                  variant={active === item.name ? 'Bold' : 'Outline'}
                />
                <Text style={[
                  styles.navText,
                  active === item.name && styles.activeNavText,
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  navWrapper: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 0.95,
    overflow: 'hidden',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  navContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#7d838c',
    fontFamily: 'Cairo-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  activeNavText: {
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomNav;