import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Award, Calculator, Card, Chart, DollarCircle, Global, Home, Shapes, Star, TrendUp, Wallet2 } from 'iconsax-react-native';
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
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

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

      // Refined pulse animation for professional feel
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 3000,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ])
      ).start();

      

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Particle animation
      Animated.loop(
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Logo rotation
      Animated.loop(
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimations();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, float1Y, float2Y, float3Y, float4Y, rotateAnim, pulseAnim, glowAnim, particleAnim, logoRotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const financialIcons = [
    { key: 'wallet', color: '#7094b5', size: 28, glow: '#1D4ED8' },
    { key: 'card', color: '#7094b5', size: 24, glow: '#3B82F6' },
    { key: 'trending-up', color: '#7094b5', size: 22, glow: '#1E40AF' },
    { key: 'pie-chart', color: '#7094b5', size: 26, glow: '#4338CA' },
    { key: 'calculator', color: '#7094b5', size: 20, glow: '#2563EB' },
    { key: 'cash', color: '#7094b5', size: 28, glow: '#1E40AF' },
    { key: 'home', color: '#7094b5', size: 24, glow: '#3B82F6' },
    { key: 'star', color: '#7094b5', size: 20, glow: '#1E40AF' },
    { key: 'shapes', color: '#7094b5', size: 22, glow: '#4338CA' },
    { key: 'global', color: '#7094b5', size: 24, glow: '#2563EB' },
    { key: 'award', color: '#7094b5', size: 20, glow: '#1E3A8A' },
  ] as const;

  const particleIcons = [
    { key: 'star', size: 12, opacity: 0.6 },
    { key: 'shapes', size: 8, opacity: 0.4 },
    { key: 'global', size: 10, opacity: 0.5 },
  ] as const;

  const renderIcon = (key: string, size: number, color: string, variant: 'Bold' | 'Outline' = 'Bold') => {
    switch (key) {
      case 'wallet': return <Ionicons name="wallet-outline" size={size} color={color} />;
      case 'card': return <Card size={size} color={color} variant={variant} />;
      case 'trending-up': return <TrendUp size={size} color={color} variant={variant} />;
      case 'pie-chart': return <Chart size={size} color={color} variant={variant} />;
      case 'calculator': return <Calculator size={size} color={color} variant={variant} />;
      case 'cash': return <DollarCircle size={size} color={color} variant={variant} />;
      case 'home': return <Home size={size} color={color} variant={variant} />;
      case 'star': return <Star size={size} color={color} variant={variant} />;
      case 'shapes': return <Shapes size={size} color={color} variant={variant} />;
      case 'global': return <Global size={size} color={color} variant={variant} />;
      case 'award': return <Award size={size} color={color} variant={variant} />;
      default: return <Chart size={size} color={color} variant={variant} />;
    }
  };

  

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Two-color vertical gradient background (top to bottom) */}
      <LinearGradient
        colors={['#0b58a1', '#053461']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Enhanced floating financial icons */}
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
        <Animated.View style={[styles.iconGlow, { 
          shadowColor: financialIcons[0].glow,
          opacity: glowOpacity
        }]}>
          {renderIcon(financialIcons[0].key, financialIcons[0].size, financialIcons[0].color)}
        </Animated.View>
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
        <Animated.View style={[styles.iconGlow, { 
          backgroundColor: `${financialIcons[1].glow}30`,
          shadowColor: financialIcons[1].glow,
          opacity: glowOpacity
        }]}>
          {renderIcon(financialIcons[1].key, financialIcons[1].size, financialIcons[1].color)}
        </Animated.View>
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
        <Animated.View style={[styles.iconGlow, { 
          backgroundColor: `${financialIcons[2].glow}30`,
          shadowColor: financialIcons[2].glow,
          opacity: glowOpacity
        }]}>
          {renderIcon(financialIcons[2].key, financialIcons[2].size, financialIcons[2].color)}
        </Animated.View>
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
        <Animated.View style={[styles.iconGlow, { 
          backgroundColor: `${financialIcons[3].glow}30`,
          shadowColor: financialIcons[3].glow,
          opacity: glowOpacity
        }]}>
          {renderIcon(financialIcons[3].key, financialIcons[3].size, financialIcons[3].color)}
        </Animated.View>
      </Animated.View>

      {/* Enhanced additional floating icons */}
      {financialIcons.slice(4).map((icon, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingIconContainer,
            {
              top: `${15 + index * 12}%`,
              left: index % 2 === 0 ? `${8 + index * 15}%` : undefined,
              right: index % 2 === 1 ? `${8 + index * 15}%` : undefined,
              transform: [{ translateY: index % 2 === 0 ? float1Y : float3Y }, { rotate: logoRotate }]
            }
          ]}
        >
          <Animated.View style={[styles.iconGlow, { 
            backgroundColor: `${icon.glow}25`,
            shadowColor: icon.glow,
            opacity: glowOpacity
          }]}>
            {renderIcon(icon.key, icon.size, icon.color, 'Outline')}
          </Animated.View>
        </Animated.View>
      ))}

      {/* Floating particles */}
      {particleIcons.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particleContainer,
            {
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              opacity: particle.opacity,
              transform: [
                { translateY: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50 - Math.random() * 100],
                }) },
                { rotate: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }) }
              ]
            }
          ]}
        >
          {renderIcon(particle.key, particle.size, '#FFFFFF', 'Outline')}
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
          {/* Static logo without animations */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Wallet2 size={80} color="#1D4ED8" variant="Bold" />
            </View>
          </View>

          {/* App title without animations or shimmer */}
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>حسابي</Text>
          </View>
          <Text style={styles.appSubtitle}>إدارة ذكية لالتزاماتك المالية</Text>

          {/* Advanced loading indicator */}
          <Animated.View style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }) }]
            }
          ]}>
            <View style={styles.loadingSpinnerContainer}>
              <Animated.View
                style={[
                  styles.loadingSpinner,
                  {
                    transform: [{ rotate }],
                    shadowOpacity: glowOpacity,
                  }
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingSpinnerInner,
                  {
                    transform: [{ rotate: logoRotate }, { scale: pulseAnim.interpolate({
                      inputRange: [1, 1.15],
                      outputRange: [0.7, 1],
                    }) }],
                  }
                ]}
              />
            </View>
            <Animated.Text style={[
              styles.loadingText,
              {
                opacity: glowOpacity,
              }
            ]}>جاري التحميل...</Animated.Text>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    {
                      opacity: particleAnim.interpolate({
                        inputRange: [0, 0.3 + index * 0.2, 0.6 + index * 0.2, 1],
                        outputRange: [0.3, 1, 0.3, 0.3],
                      }),
                      transform: [{
                        scale: particleAnim.interpolate({
                          inputRange: [0, 0.3 + index * 0.2, 0.6 + index * 0.2, 1],
                          outputRange: [0.8, 1.2, 0.8, 0.8],
                        })
                      }]
                    }
                  ]}
                />
              ))}
            </View>
          </Animated.View>
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
  particleContainer: {
    position: 'absolute',
    zIndex: 0,
  },
  iconGlow: {
    padding: 16,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
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
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
  },
  appSubtitle: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 70,
    fontFamily: 'Cairo-Regular',
    lineHeight: 36,
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingSpinnerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  loadingSpinner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: 'rgba(30, 64, 175, 0.3)',
    borderTopColor: '#1D4ED8',
    borderRightColor: '#2563EB',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  loadingSpinnerInner: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Cairo-Bold',
    fontWeight: '900',
    marginBottom: 18,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(30, 64, 175, 0.9)',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default SplashScreen;
