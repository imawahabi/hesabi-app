import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Professional Background Component with Floating Icons
function ProfessionalBackground({ children }: { children: React.ReactNode }) {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Create floating animations for icons
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

    // Create rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Create gentle scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    createFloatingAnimation(floatAnim1, 3000, 0).start();
    createFloatingAnimation(floatAnim2, 4000, 1000).start();
    createFloatingAnimation(floatAnim3, 5000, 2000).start();
    rotationAnimation.start();
    scaleAnimation.start();
  }, [floatAnim1, floatAnim2, floatAnim3, rotateAnim, scaleAnim]);

  // Animation interpolations
  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -15],
  });

  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 25],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Base Professional Gradient */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#4a90e2']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Secondary Gradient Layer */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.3)', 'transparent', 'rgba(29, 78, 216, 0.4)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Floating Financial Icons */}
      
      {/* Dollar Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            top: '20%', 
            left: '10%',
            transform: [{ translateY: float1Y }, { scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name="logo-usd" size={24} color="rgba(255, 255, 255, 0.2)" />
      </Animated.View>

      {/* Credit Card Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            top: '30%', 
            right: '15%',
            transform: [{ translateY: float2Y }, { rotate }]
          }
        ]}
      >
        <Ionicons name="card-outline" size={28} color="rgba(255, 255, 255, 0.15)" />
      </Animated.View>

      {/* Bank Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            bottom: '25%', 
            left: '20%',
            transform: [{ translateY: float3Y }]
          }
        ]}
      >
        <Ionicons name="business-outline" size={26} color="rgba(255, 255, 255, 0.18)" />
      </Animated.View>

      {/* Wallet Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            top: '50%', 
            right: '25%',
            transform: [{ translateY: float1Y }, { scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name="wallet-outline" size={22} color="rgba(255, 255, 255, 0.2)" />
      </Animated.View>

      {/* Calculator Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            bottom: '40%', 
            right: '10%',
            transform: [{ translateY: float2Y }]
          }
        ]}
      >
        <Ionicons name="calculator-outline" size={24} color="rgba(255, 255, 255, 0.16)" />
      </Animated.View>

      {/* Analytics Icon */}
      <Animated.View
        style={[
          styles.floatingIcon,
          { 
            top: '15%', 
            right: '35%',
            transform: [{ translateY: float3Y }, { rotate }]
          }
        ]}
      >
        <Ionicons name="analytics-outline" size={20} color="rgba(255, 255, 255, 0.14)" />
      </Animated.View>

      {/* Content */}
      <View style={styles.contentOverlay}>
        {children}
      </View>
    </View>
  );
}

// Loading Animation Component
function LoadingSpinner() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    
    return () => rotation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate }] }]}>
      <View />
    </Animated.View>
  );
}

// Animated Logo Component
function AnimatedLogo() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Ionicons name="wallet" size={80} color="#3B82F6" />
    </Animated.View>
  );
}

export default function SplashScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Router for navigation
  const router = useRouter();

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideUpAnim, scaleAnim, router]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      <ProfessionalBackground>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* Logo with pulse animation */}
          <AnimatedLogo />

          {/* App Name */}
          <Text style={styles.appName}>حسابي</Text>

          {/* App Description */}
          <Text style={styles.appDescription}>
            متابعة التزاماتك صارت أسهل وأذكى
          </Text>

          {/* Loading Spinner */}
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        </Animated.View>
      </ProfessionalBackground>
    </>
  );
}

SplashScreen.options = {
  headerShown: false,
  title: '',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auroraLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    width: screenWidth * 2,
    height: screenHeight * 2,
    borderRadius: screenWidth,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 45,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 48,
    fontFamily: 'Cairo-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appDescription: {
    fontSize: 18,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 28,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
  },
  spinnerOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
  },
  spinnerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 5,
  },
});
