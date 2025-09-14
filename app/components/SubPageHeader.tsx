import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
  entrance?: boolean; // enable/disable entrance animation on mount
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  scrollY,
  entrance = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const blurIntensity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation (can be disabled)
    if (entrance) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // jump to final state immediately
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }

    // Scroll-based animations with blur effect
    if (scrollY) {
      const headerListener = scrollY.addListener(({ value }) => {
        const opacity = Math.max(0.95, 1 - value / 150);
        headerOpacity.setValue(opacity);
        
        const blur = Math.min(20, value / 5);
        blurIntensity.setValue(blur);
      });

      return () => {
        scrollY.removeListener(headerListener);
      };
    }
  }, [scrollY, entrance, fadeAnim, slideAnim, headerOpacity, blurIntensity]);

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
        }
      ]}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.backgroundOverlay} />
        <SafeAreaView>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.topRow}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.6}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="chevron-forward" size={20} color="#1F2937" />
                  </View>
                </TouchableOpacity>
              ) : (
                // spacer to keep title centered when no back button
                <View style={styles.rightAction} />
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
                  activeOpacity={0.6}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name={rightAction.icon as any} size={20} color="#1F2937" />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.rightAction} />
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    elevation: 10,
  },
  blurContainer: {
    paddingBottom: 20,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(31, 41, 55, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.12)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'Cairo-Regular',
    fontWeight: '500',
  },
  rightAction: {
    padding: 8,
    width: 52,
  },
});

export default SubPageHeader;
