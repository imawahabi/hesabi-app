import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authService } from '../services/stackAuth';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AuthScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Router for navigation
  const router = useRouter();

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Starting Google Sign In...');
      const result = await authService.signInWithGoogle();
      
      if (result && result.success) {
        console.log('Google Sign In successful:', result.user);
        // التوجه إلى صفحة الداش بورد
        router.push('/dashboard');
      } else {
        console.error('Google Sign In failed:', result?.error);
        // التوجه إلى صفحة الداش بورد على أي حال (بيانات وهمية)
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Unexpected error during Google Sign In:', error);
      // التوجه إلى صفحة الداش بورد على أي حال (بيانات وهمية)
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Sign In (placeholder)
  const handleEmailSignIn = () => {
    router.push('/dashboard');
  };

  // Handle Create Account (placeholder)
  const handleCreateAccount = () => {
    alert('إنشاء حساب جديد قيد التطوير');
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      <View style={styles.container}>
        {/* Header Section */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={80} color="#fff" />
          </View>

          {/* App Name */}
          <Text style={styles.appName}>حسابي</Text>

          {/* Welcome Message */}
          <Text style={styles.subtitleText}>
            سجل دخولك للمتابعة
          </Text>
        </Animated.View>

        {/* Auth Options */}
        <View style={styles.authSection}>
          {/* Google Sign In Button */}
          <TouchableOpacity 
            style={[styles.authButton, styles.googleButton]} 
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#FFFFFF" />
            <Text style={styles.authButtonText}>
              المتابعة مع Google
            </Text>
          </TouchableOpacity>

          {/* Email Sign In Button */}
          <TouchableOpacity 
            style={[styles.authButton, styles.emailButton]} 
            onPress={handleEmailSignIn}
          >
            <Ionicons name="mail" size={20} color="#FFFFFF" />
            <Text style={styles.authButtonText}>
              المتابعة مع الإيميل
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity 
            style={[styles.authButton, styles.createAccountButton]}
            onPress={handleCreateAccount}
          >
            <Ionicons name="person-add" size={20} color="#3B82F6" />
            <Text style={styles.createAccountButtonText}>
              إنشاء حساب جديد
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>
              هل نسيت كلمة المرور؟
            </Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <TouchableOpacity>
              <Text style={styles.linkText}>شروط الاستخدام</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> و </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>سياسة الخصوصية</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              بالمتابعة، أنت توافق على{' '}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

AuthScreen.options = {
  headerShown: false,
  title: '',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    backgroundColor: '#3B82F6',
    borderRadius: 60,
    padding: 40,
    marginBottom: 30,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Cairo-Bold',
    color: '#3B82F6',
    textAlign: 'center',

  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  authSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#EA4335',
  },
  emailButton: {
    backgroundColor: '#3B82F6',
  },
  createAccountButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  authButtonText: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#FFFFFF',
  },
  createAccountButtonText: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#3B82F6',
  },
  footerSection: {
    alignItems: 'center',
  },
  forgotPasswordButton: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});

AuthScreen.options = {
  headerShown: false,
  title: '',
};
