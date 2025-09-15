import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Filter, More, SearchNormal1 } from 'iconsax-react-nativejs';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
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
    icon: 'filter' | 'more' | 'search';
    onPress: () => void;
    badge?: number;
  };
  scrollY?: Animated.Value;
  backgroundColor?: string;
  compact?: boolean;
  bottomSpacing?: number;
  titleIcon?: React.ReactNode;
}

const SubPageHeader: React.FC<SubPageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  scrollY,
  backgroundColor = '#FFFFFF',
  compact = false,
  bottomSpacing = 0,
  titleIcon,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const interpolatedShadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.08],
  });

  useEffect(() => {
    // Simple entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Scroll-based shadow animation
    if (scrollY) {
      const headerListener = scrollY.addListener(({ value }) => {
        const shadow = Math.min(1, value / 50);
        shadowAnim.setValue(shadow);
      });

      return () => {
        scrollY.removeListener(headerListener);
      };
    }
  }, [scrollY, fadeAnim, slideAnim, shadowAnim]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  const getRightActionIcon = () => {
    if (!rightAction) return null;
    switch (rightAction.icon) {
      case 'filter':
        return <Filter size={18} color="#374151" variant="Bold" />;
      case 'more':
        return <More size={18} color="#374151" variant="Bold" />;
      case 'search':
        return <SearchNormal1 size={18} color="#374151" variant="Bold" />;
      default:
        return <Filter size={18} color="#374151" variant="Bold" />;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <Animated.View 
        style={[
          styles.container,
          {
            backgroundColor,
            shadowOpacity: interpolatedShadowOpacity,
          },
          compact && styles.compactContainer
        ]}
      >
        <SafeAreaView>
          <Animated.View
            style={[
              styles.content,
              compact && styles.compactContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={[styles.topRow, compact && styles.compactTopRow]}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.6}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="chevron-forward" size={18} color="#374151" />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.spacer} />
              )}

              <View style={styles.titleContainer}>
                <View style={[styles.titleRow, compact && styles.compactTitleRow]}>
                  {titleIcon}
                  <Text style={[styles.title, compact && styles.compactTitle]}>
                    {title}
                  </Text>
                </View>
                {subtitle && !compact && (
                  <Text style={styles.subtitle}>
                    {subtitle}
                  </Text>
                )}
              </View>

              {rightAction ? (
                <TouchableOpacity
                  style={styles.rightAction}
                  onPress={rightAction.onPress}
                  activeOpacity={0.6}
                >
                  <View style={styles.iconContainer}>
                    {getRightActionIcon()}
                    {rightAction.badge && rightAction.badge > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {rightAction.badge > 99 ? '99+' : rightAction.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.spacer} />
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
      {/* Bottom spacer to keep content away from header */}
      <View style={{ height: bottomSpacing }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.10)',
  },
  compactContainer: {
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  compactContent: {
    paddingVertical: 8,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  compactTopRow: {
    minHeight: 40,
  },
  backButton: {
    padding: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  compactTitleRow: {
    gap: 6,
  },
  titleIconChip: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  compactTitleIconChip: {
    width: 22,
    height: 22,
    borderRadius: 8,
  },
  defaultTitleIconBg: {
    backgroundColor: '#EEF2FF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
  },
  compactTitle: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'Cairo-Regular',
  },
  rightAction: {
    padding: 6,
  },
  spacer: {
    width: 44,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
});

export default SubPageHeader;
