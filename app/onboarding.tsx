import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  onGetStarted: () => void;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  totalSteps,
  icon,
  title,
  description,
  onNext,
  onBack,
  isLastStep,
  onGetStarted,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [iconScaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Reset and start animations
    fadeAnim.setValue(0);
    slideUpAnim.setValue(50);
    iconScaleAnim.setValue(0.8);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, fadeAnim, slideUpAnim, iconScaleAnim]);

  // منطق الأزرار - الحل الجذري النهائي
  const renderButtons = () => {
    if (isLastStep) {
      // المرحلة الأخيرة: زرين (السابق + ابدأ الآن)
      return (
        <View style={styles.twoButtonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={20} color="#64748B" />
            <Text style={styles.backButtonText}>السابق</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
            <Text style={styles.primaryButtonText}>ابدأ الآن</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    } else if (step === 1) {
      // المرحلة الأولى: زر واحد فقط (التالي)
      return (
        <View style={styles.singleButtonContainer}>
          {/* Temp Button */}
          <TouchableOpacity
            style={styles.skipDevButton}
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipDevText}>تخطي مؤقتاً </Text>
            <Ionicons name="arrow-forward" size={22} color="#3B82F6" />
          </TouchableOpacity>

          {/* Temp Button */}

          <TouchableOpacity style={styles.fullWidthButton} onPress={onNext}>
            <Text style={styles.primaryButtonText}>التالي</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    } else {
      // المراحل الوسطى: زرين (السابق + التالي)
      return (
        <View style={styles.twoButtonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={20} color="#64748B" />
            <Text style={styles.backButtonText}>السابق</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
            <Text style={styles.primaryButtonText}>التالي</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* مؤشر التقدم */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index + 1 === step ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      {/* المحتوى الرئيسي */}
      <View style={styles.contentContainer}>
        {/* الأيقونة */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: iconScaleAnim }],
            },
          ]}
        >
          <Ionicons name={icon} size={screenWidth * 0.2} color="#FFFFFF" />
        </Animated.View>

        {/* النص */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </Animated.View>
      </View>

      {/* الأزرار */}
      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        {renderButtons()}
      </Animated.View>
    </View>
  );
};

// الشاشة الرئيسية
export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);

  const onboardingSteps = [
    {
      icon: 'wallet-outline' as keyof typeof Ionicons.glyphMap,
      title: 'أهلاً بك في حسابي',
      description: 'تطبيقك الشخصي لإدارة جميع التزاماتك المالية والديون بسهولة وأمان تام',
    },
    {
      icon: 'list-outline' as keyof typeof Ionicons.glyphMap,
      title: 'تتبع التزاماتك المالية',
      description: 'راقب جميع قروضك وأقساطك في مكان واحد مع تفاصيل شاملة عن كل التزام مالي',
    },
    {
      icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
      title: 'تذكير بمواعيد الاستحقاق',
      description: 'احصل على تنبيهات ذكية قبل مواعيد استحقاق مدفوعاتك لتتجنب التأخير والغرامات',
    },
    {
      icon: 'stats-chart-outline' as keyof typeof Ionicons.glyphMap,
      title: 'تقارير مالية شاملة',
      description: 'اطلع على تحليلات مفصلة لوضعك المالي وتتبع تقدمك في سداد التزاماتك',
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={false} />
      <OnboardingStep
        step={currentStep}
        totalSteps={onboardingSteps.length}
        icon={onboardingSteps[currentStep - 1].icon}
        title={onboardingSteps[currentStep - 1].title}
        description={onboardingSteps[currentStep - 1].description}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={currentStep === onboardingSteps.length}
        onGetStarted={handleGetStarted}
      />
    </>
  );
}

// التنسيقات الجديدة - مُعاد تصميمها بالكامل
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.08,
    paddingBottom: screenHeight * 0.04,
  },

  // مؤشر التقدم
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenHeight * 0.04,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
    width: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressDotInactive: {
    opacity: 0.6,
  },

  // المحتوى الرئيسي
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // الأيقونة
  iconContainer: {
    backgroundColor: '#3B82F6',
    borderRadius: screenWidth * 0.12,
    padding: screenWidth * 0.08,
    marginBottom: screenHeight * 0.08,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },

  // النصوص
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
  },
  title: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Cairo-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: screenHeight * 0.02,
    lineHeight: screenWidth * 0.09,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Cairo-Regular',
    color: '#475569',
    textAlign: 'center',
    lineHeight: screenWidth * 0.065,
    paddingHorizontal: screenWidth * 0.02,
    opacity: 0.9,
  },

  // حاويات الأزرار
  buttonsContainer: {
    marginTop: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.02,
  },
  singleButtonContainer: {
    width: '100%',
  },
  twoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: screenWidth * 0.04,
  },

  // تنسيقات الأزرار
  fullWidthButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.018,
    paddingHorizontal: screenWidth * 0.06,
    borderRadius: 14,
    minHeight: screenHeight * 0.06,
    gap: 8,
    width: '100%',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  // مؤقت: زر تخطي إلى الداشبورد أثناء التطوير
  skipDevButton: {
    marginBottom: 22,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    width:"100%",
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipDevText: {
    color: '#3B82F6',
    fontFamily: 'Cairo-Bold',
    fontSize: 18,
  },
  // مؤقت: زر تخطي إلى الداشبورد أثناء التطوير

  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.018,
    paddingHorizontal: screenWidth * 0.06,
    borderRadius: 14,
    minHeight: screenHeight * 0.06,
    gap: 8,
    flex: 1,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Cairo-Bold',
    letterSpacing: 0.3,
  },

  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.018,
    paddingHorizontal: screenWidth * 0.06,
    borderRadius: 14,
    minHeight: screenHeight * 0.06,
    gap: 8,
    flex: 1,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 17,
    fontFamily: 'Cairo-Bold',
    letterSpacing: 0.3,
  },
});
