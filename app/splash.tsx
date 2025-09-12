import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const float1Y = useRef(new Animated.Value(0)).current;
  const float2Y = useRef(new Animated.Value(0)).current;
  const float3Y = useRef(new Animated.Value(0)).current;
  const float4Y = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]).start();

      // Floating animations
      const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: -20,
              duration: 2000 + delay,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 20,
              duration: 2000 + delay,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
      };

      createFloatingAnimation(float1Y, 0).start();
      createFloatingAnimation(float2Y, 500).start();
      createFloatingAnimation(float3Y, 1000).start();
      createFloatingAnimation(float4Y, 1500).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimations();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const financialIcons = [
    { name: 'wallet' as const, color: '#60A5FA', size: 24 },
    { name: 'card' as const, color: '#93C5FD', size: 20 },
    { name: 'trending-up' as const, color: '#DBEAFE', size: 18 },
    { name: 'pie-chart' as const, color: '#BFDBFE', size: 22 },
    { name: 'bar-chart' as const, color: '#93C5FD', size: 20 },
    { name: 'calculator' as const, color: '#60A5FA', size: 18 },
    { name: 'cash' as const, color: '#DBEAFE', size: 24 },
    { name: 'home' as const, color: '#BFDBFE', size: 20 },
  ];

  return (
    <View style={styles.container}>
      {/* Multi-layer gradient background */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.3)', 'rgba(147, 197, 253, 0.2)', 'transparent']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(191, 219, 254, 0.1)', 'rgba(59, 130, 246, 0.2)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating financial icons */}
      <Animated.View
        style={[
          styles.floatingIconContainer,
          {
            top: '15%',
            right: '20%',
            transform: [{ translateY: float1Y }, { rotate }]
          }
        ]}
      >
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(147, 197, 253, 0.3)' }]}>
          <Ionicons name={financialIcons[0].name} size={financialIcons[0].size} color={financialIcons[0].color} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIconContainer,
          {
            top: '28%',
            right: '12%',
            transform: [{ translateY: float2Y }, { rotate }]
          }
        ]}
      >
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(191, 219, 254, 0.3)' }]}>
          <Ionicons name={financialIcons[1].name} size={financialIcons[1].size} color={financialIcons[1].color} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIconContainer,
          {
            top: '45%',
            left: '15%',
            transform: [{ translateY: float3Y }, { rotate }]
          }
        ]}
      >
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(147, 197, 253, 0.3)' }]}>
          <Ionicons name={financialIcons[2].name} size={financialIcons[2].size} color={financialIcons[2].color} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIconContainer,
          {
            top: '65%',
            right: '25%',
            transform: [{ translateY: float4Y }, { rotate }]
          }
        ]}
      >
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(191, 219, 254, 0.3)' }]}>
          <Ionicons name={financialIcons[3].name} size={financialIcons[3].size} color={financialIcons[3].color} />
        </View>
      </Animated.View>

      {/* Additional floating icons */}
      {financialIcons.slice(4).map((icon, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingIconContainer,
            {
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
              transform: [{ translateY: index % 2 === 0 ? float1Y : float3Y }]
            }
          ]}
        >
          <View style={[styles.iconGlow, { backgroundColor: 'rgba(147, 197, 253, 0.2)' }]}>
            <Ionicons name={icon.name} size={icon.size} color={icon.color} />
          </View>
        </Animated.View>
      ))}

      {/* Main content */}
      <Animated.View
        style={[
          styles.contentOverlay,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.content}>
          {/* Enhanced logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <View style={styles.logo}>
              <Ionicons name="wallet" size={48} color="#60A5FA" />
            </View>
          </Animated.View>

          {/* Enhanced app title */}
          <Text style={styles.appTitle}>حسابي</Text>
          <Text style={styles.appSubtitle}>إدارة ذكية لالتزاماتك المالية</Text>

          {/* Enhanced loading indicator */}
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingSpinner,
                {
                  transform: [{ rotate }]
                }
              ]}
            />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIconContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  iconGlow: {
    padding: 12,
    borderRadius: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#60A5FA',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  appTitle: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Cairo-Bold',
    textShadowColor: 'rgba(59, 130, 246, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'Cairo-Regular',
    textShadowColor: 'rgba(59, 130, 246, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: 28,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(147, 197, 253, 0.3)',
    borderTopColor: '#60A5FA',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Cairo-Regular',
    textShadowColor: 'rgba(59, 130, 246, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

export default SplashScreen;
