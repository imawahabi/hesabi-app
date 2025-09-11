import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  onAddCommitment?: () => void;
  onNavigate?: (screen: string) => void;
  activeScreen?: string;
}

const BottomNav = ({ onAddCommitment, onNavigate, activeScreen = 'الرئيسية' }: BottomNavProps) => {
  const [active, setActive] = React.useState(activeScreen);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const navItems = [
    { name: 'الرئيسية', activeIcon: 'home' as const, inactiveIcon: 'home' as const },
    { name: 'الالتزامات', activeIcon: 'document-text' as const, inactiveIcon: 'document-text' as const },
    { name: '+', activeIcon: 'add' as const, inactiveIcon: 'add' as const },
    { name: 'التحليلات', activeIcon: 'bar-chart' as const, inactiveIcon: 'bar-chart' as const },
    { name: 'الاعدادات', activeIcon: 'settings' as const, inactiveIcon: 'settings' as const },
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
      <View style={styles.navWrapper}>
        <View style={styles.navContainer}>
          {navItems.map((item, index) => {
            const isCenter = index === 2; // Make the third item (+) the center FAB
            
            if (isCenter) {
              return (
                <Animated.View key={item.name} style={[styles.fabContainer, { transform: [{ scale: scaleAnim }] }]}>
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
                      <Ionicons
                        name="add"
                        size={28}
                        color="white"
                      />
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
                  onNavigate?.(item.name);
                }}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={(activeScreen === item.name || active === item.name) ? item.activeIcon : item.inactiveIcon}
                  size={24}
                  color={(activeScreen === item.name || active === item.name) ? '#3B82F6' : '#9CA3AF'}
                />
                <Text style={[
                  styles.navText,
                  active === item.name && styles.activeNavText
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: 11,
    color: '#9CA3AF',
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