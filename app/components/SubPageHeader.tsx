import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SubPageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  scrollY?: Animated.Value;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  scrollY,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    // Scroll-based animations
    if (scrollY) {
      const headerOpacityListener = scrollY.addListener(({ value }) => {
        const opacity = Math.max(0.7, 1 - value / 100);
        headerOpacity.setValue(opacity);
        
        const height = Math.max(0.8, 1 - value / 200);
        headerHeight.setValue(height);
      });

      return () => {
        scrollY.removeListener(headerOpacityListener);
      };
    }
  }, [scrollY]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: headerOpacity,
          transform: [{ scale: headerHeight }],
        }
      ]}
    >
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              }
            ]}
          >
            <View style={styles.topRow}>
              {showBackButton && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.backButtonContainer}>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                )}
              </View>

              {rightAction ? (
                <TouchableOpacity
                  style={styles.rightAction}
                  onPress={rightAction.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.rightActionContainer}>
                    <Ionicons name={rightAction.icon as any} size={24} color="white" />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.rightAction} />
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rightAction: {
    padding: 8,
    width: 56, // Same width as back button for balance
  },
  rightActionContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default SubPageHeader;
