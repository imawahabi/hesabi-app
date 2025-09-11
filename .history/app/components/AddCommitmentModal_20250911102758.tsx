import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface CommitmentType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
}

interface AddCommitmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (commitment: any) => void;
}

const AddCommitmentModal: React.FC<AddCommitmentModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CommitmentType | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [calculatedPayment, setCalculatedPayment] = useState<number>(0);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const stepAnim = useRef(new Animated.Value(1)).current; // Initialize to 1 so content is visible

  const commitmentTypes: CommitmentType[] = [
    {
      id: 'personal_debt',
      name: 'ديون شخصية',
      icon: 'people',
      color: '#10B981',
      description: 'ديون من الأصدقاء والعائلة'
    },
    {
      id: 'bank_loan',
      name: 'قروض بنكية',
      icon: 'card',
      color: '#EF4444',
      description: 'قروض شخصية، سيارات، عقارات'
    },
    {
      id: 'installments',
      name: 'أقساط تجارية',
      icon: 'storefront',
      color: '#F59E0B',
      description: 'أقساط المتاجر والشركات التجارية'
    },
    {
      id: 'bnpl',
      name: 'اشتر الآن ادفع لاحقاً',
      icon: 'phone-portrait',
      color: '#8B5CF6',
      description: 'تابي، تمارة وخدمات الدفع الآجل'
    },
    {
      id: 'credit_card',
      name: 'بطاقات ائتمان',
      icon: 'card-outline',
      color: '#EC4899',
      description: 'مستحقات البطاقات الائتمانية'
    },
    {
      id: 'telecom',
      name: 'فواتير الاتصالات',
      icon: 'phone-portrait-outline',
      color: '#06B6D4',
      description: 'زين، STC، أوريدو، فيفا'
    },
    {
      id: 'utilities',
      name: 'فواتير المرافق',
      icon: 'flash',
      color: '#84CC16',
      description: 'كهرباء، ماء، إنترنت منزلي'
    },
    {
      id: 'rent',
      name: 'إيجارات',
      icon: 'home',
      color: '#F97316',
      description: 'إيجار السكن، المكتب، المحل'
    },
    {
      id: 'insurance',
      name: 'تأمينات',
      icon: 'shield-checkmark',
      color: '#3B82F6',
      description: 'التأمين الصحي، تأمين السيارة'
    }
  ];

  const kuwaitiBanks: Institution[] = [
    // البنوك التقليدية
    { id: 'nbk', name: 'بنك الكويت الوطني', type: 'conventional_bank', icon: 'business', color: '#1E40AF' },
    { id: 'gulf_bank', name: 'بنك الخليج', type: 'conventional_bank', icon: 'business', color: '#059669' },
    { id: 'cbk', name: 'البنك التجاري الكويتي', type: 'conventional_bank', icon: 'business', color: '#DC2626' },
    { id: 'ahli_bank', name: 'البنك الأهلي الكويتي', type: 'conventional_bank', icon: 'business', color: '#EA580C' },
    { id: 'burgan_bank', name: 'بنك برقان', type: 'conventional_bank', icon: 'business', color: '#7C3AED' },
    
    // البنوك الإسلامية
    { id: 'kfh', name: 'بيت التمويل الكويتي', type: 'islamic_bank', icon: 'business', color: '#16A34A' },
    { id: 'boubyan', name: 'بنك بوبيان', type: 'islamic_bank', icon: 'business', color: '#0891B2' },
    { id: 'warba', name: 'بنك وربة', type: 'islamic_bank', icon: 'business', color: '#9333EA' },
    { id: 'abu', name: 'البنك الأهلي المتحد', type: 'islamic_bank', icon: 'business', color: '#C2410C' },
    { id: 'kib', name: 'بنك الكويت الدولي', type: 'islamic_bank', icon: 'business', color: '#065F46' }
  ];

  const kuwaiti_stores: Institution[] = [
    // متاجر الإلكترونيات
    { id: 'xcite', name: 'اكسايت الغانم', type: 'electronics_store', icon: 'storefront', color: '#DC2626' },
    { id: 'best', name: 'بست الزهراء', type: 'electronics_store', icon: 'storefront', color: '#059669' },
    { id: 'eureka', name: 'يوريكا', type: 'electronics_store', icon: 'storefront', color: '#7C3AED' },
    { id: 'carrefour', name: 'كارفور', type: 'retail_store', icon: 'storefront', color: '#1E40AF' },
    { id: 'lulu', name: 'لولو هايبر ماركت', type: 'retail_store', icon: 'storefront', color: '#F59E0B' },
    { id: 'sultan_center', name: 'سلطان سنتر', type: 'retail_store', icon: 'storefront', color: '#8B5CF6' }
  ];

  const bnpl_companies: Institution[] = [
    { id: 'tabby', name: 'تابي', type: 'bnpl', icon: 'phone-portrait', color: '#8B5CF6' },
    { id: 'tamara', name: 'تمارة', type: 'bnpl', icon: 'phone-portrait', color: '#10B981' },
    { id: 'postpay', name: 'بوست باي', type: 'bnpl', icon: 'phone-portrait', color: '#F59E0B' }
  ];

  const telecom_companies: Institution[] = [
    { id: 'zain', name: 'زين الكويت', type: 'telecom', icon: 'phone-portrait-outline', color: '#7C3AED' },
    { id: 'stc', name: 'STC الكويت', type: 'telecom', icon: 'phone-portrait-outline', color: '#DC2626' },
    { id: 'ooredoo', name: 'أوريدو الكويت', type: 'telecom', icon: 'phone-portrait-outline', color: '#EA580C' },
    { id: 'viva', name: 'فيفا الكويت', type: 'telecom', icon: 'phone-portrait-outline', color: '#059669' }
  ];

  const utility_companies: Institution[] = [
    { id: 'mew', name: 'وزارة الكهرباء والماء', type: 'utility', icon: 'flash', color: '#F59E0B' },
    { id: 'fasttelco', name: 'فاست تلكو', type: 'utility', icon: 'wifi', color: '#06B6D4' },
    { id: 'qualitynet', name: 'كواليتي نت', type: 'utility', icon: 'wifi', color: '#8B5CF6' },
    { id: 'gulfnet', name: 'جلف نت', type: 'utility', icon: 'wifi', color: '#10B981' }
  ];

  const insurance_companies: Institution[] = [
    { id: 'kig', name: 'شركة الكويت للتأمين', type: 'insurance', icon: 'shield-checkmark', color: '#3B82F6' },
    { id: 'gulf_insurance', name: 'الخليج للتأمين', type: 'insurance', icon: 'shield-checkmark', color: '#059669' },
    { id: 'warba_insurance', name: 'وربة للتأمين التكافلي', type: 'insurance', icon: 'shield-checkmark', color: '#7C3AED' },
    { id: 'arig', name: 'شركة إعادة التأمين العربية', type: 'insurance', icon: 'shield-checkmark', color: '#DC2626' }
  ];

  useEffect(() => {
    if (visible) {
      // Reset state
      setCurrentStep(1);
      setSelectedType(null);
      setSelectedInstitution(null);
      setFormData({});
      
      // Start entrance animations
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Exit animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayOpacity, slideAnim]);

  const animateStepTransition = () => {
    Animated.sequence([
      Animated.timing(stepAnim, {
        toValue: 0.7, // Reduce opacity slightly for transition
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(stepAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      animateStepTransition();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      animateStepTransition();
    }
  };

  const calculateLoanPayment = (principal: number, rate: number, months: number) => {
    if (rate === 0) return principal / months;
    const monthlyRate = rate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              currentStep >= step && styles.stepTextActive
            ]}>
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderTypeSelector = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>اختر نوع الالتزام</Text>      
      <ScrollView style={styles.typesList} showsVerticalScrollIndicator={false}>
        {commitmentTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              selectedType?.id === type.id && styles.typeCardSelected
            ]}
            onPress={() => setSelectedType(type)}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
              <Ionicons name={type.icon as any} size={24} color={type.color} />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
            </View>
            {selectedType?.id === type.id && (
              <Ionicons name="checkmark-circle" size={24} color={type.color} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderInstitutionSelector = () => {
    let institutions: Institution[] = [];
    let sectionTitle = '';
    
    switch (selectedType?.id) {
      case 'bank_loan':
        institutions = kuwaitiBanks;
        sectionTitle = 'اختر البنك أو المؤسسة المالية';
        break;
      case 'installments':
        institutions = kuwaiti_stores;
        sectionTitle = 'اختر المتجر أو الشركة';
        break;
      case 'bnpl':
        institutions = bnpl_companies;
        sectionTitle = 'اختر شركة اشتر الآن ادفع لاحقاً';
        break;
      case 'telecom':
        institutions = telecom_companies;
        sectionTitle = 'اختر شركة الاتصالات';
        break;
      case 'utilities':
        institutions = utility_companies;
        sectionTitle = 'اختر مزود الخدمة';
        break;
      case 'insurance':
        institutions = insurance_companies;
        sectionTitle = 'اختر شركة التأمين';
        break;
      case 'personal_debt':
        // For personal debts, we'll show a different interface
        return renderPersonalContactSelector();
      default:
        institutions = [];
        sectionTitle = 'اختر الجهة المعنية';
    }
    
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>اختر الجهة</Text>
        <Text style={styles.stepDescription}>{sectionTitle}</Text>
        
        <ScrollView style={styles.typesList} showsVerticalScrollIndicator={false}>
          {institutions.map((institution) => (
            <TouchableOpacity
              key={institution.id}
              style={[
                styles.typeCard,
                selectedInstitution?.id === institution.id && styles.typeCardSelected
              ]}
              onPress={() => setSelectedInstitution(institution)}
              activeOpacity={0.7}
            >
              <View style={[styles.typeIcon, { backgroundColor: `${institution.color}20` }]}>
                <Ionicons name={institution.icon as any} size={24} color={institution.color} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>{institution.name}</Text>
                <Text style={styles.typeDescription}>
                  {institution.type === 'conventional_bank' ? 'بنك تقليدي' :
                   institution.type === 'islamic_bank' ? 'بنك إسلامي' :
                   institution.type === 'electronics_store' ? 'متجر إلكترونيات' :
                   institution.type === 'retail_store' ? 'متجر تجاري' :
                   institution.type === 'bnpl' ? 'دفع آجل' :
                   institution.type === 'telecom' ? 'اتصالات' :
                   institution.type === 'utility' ? 'مرافق' :
                   institution.type === 'insurance' ? 'تأمين' : 'أخرى'}
                </Text>
              </View>
              {selectedInstitution?.id === institution.id && (
                <Ionicons name="checkmark-circle" size={24} color={institution.color} />
              )}
            </TouchableOpacity>
          ))}
          
          {institutions.length > 0 && (
            <TouchableOpacity
              style={[
                styles.typeCard,
                selectedInstitution?.id === 'custom' && styles.typeCardSelected
              ]}
              onPress={() => setSelectedInstitution({
                id: 'custom',
                name: 'أخرى',
                type: 'custom',
                icon: 'add-circle-outline',
                color: '#6B7280'
              })}
              activeOpacity={0.7}
            >
              <View style={[styles.typeIcon, { backgroundColor: '#6B728020' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>أخرى</Text>
                <Text style={styles.typeDescription}>إضافة جهة جديدة</Text>
              </View>
              {selectedInstitution?.id === 'custom' && (
                <Ionicons name="checkmark-circle" size={24} color="#6B7280" />
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderPersonalContactSelector = () => {
    // TODO: Implement personal contacts management
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>اختر الشخص</Text>
        <Text style={styles.stepDescription}>اختر الشخص المدين له أو أضف شخص جديد</Text>
        
        <View style={styles.noContactsContainer}>
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text style={styles.noContactsTitle}>لا توجد جهات اتصال محفوظة</Text>
          <Text style={styles.noContactsDescription}>
            يجب إضافة الأشخاص أولاً قبل إنشاء التزامات الديون الشخصية
          </Text>
          
          <TouchableOpacity
            style={styles.addContactButton}
            onPress={() => {
              // TODO: Navigate to add contact screen
              alert('سيتم إضافة شاشة إدارة جهات الاتصال قريباً');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addContactButtonText}>إضافة شخص جديد</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDetailsForm = () => {
    const updateFormData = (key: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [key]: value }));
      
      // Auto-calculate loan payment for bank loans
      if (selectedType?.id === 'bank_loan' && 
          formData.principal && formData.interestRate && formData.termMonths) {
        const payment = calculateLoanPayment(
          parseFloat(formData.principal || '0'),
          parseFloat(formData.interestRate || '0'),
          parseInt(formData.termMonths || '0')
        );
        setCalculatedPayment(payment);
      }
    };

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>تفاصيل الالتزام</Text>
        <Text style={styles.stepDescription}>أدخل تفاصيل {selectedType?.name}</Text>
        
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Common Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>اسم الالتزام *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="مثال: قسط السيارة"
              value={formData.name || ''}
              onChangeText={(value) => updateFormData('name', value)}
              textAlign="right"
            />
          </View>

          {selectedInstitution?.id === 'custom' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم الجهة *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل اسم الجهة"
                value={formData.customInstitution || ''}
                onChangeText={(value) => updateFormData('customInstitution', value)}
                textAlign="right"
              />
            </View>
          )}

          {/* Bank Loan Specific Fields */}
          {selectedType?.id === 'bank_loan' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>مبلغ القرض (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.principal || ''}
                  onChangeText={(value) => updateFormData('principal', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>معدل الفائدة السنوي (%) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="5.5"
                  value={formData.interestRate || ''}
                  onChangeText={(value) => updateFormData('interestRate', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>مدة القرض (شهر) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="60"
                  value={formData.termMonths || ''}
                  onChangeText={(value) => updateFormData('termMonths', value)}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              
              {calculatedPayment > 0 && (
                <View style={styles.calculatorResult}>
                  <Text style={styles.calculatorLabel}>القسط الشهري المحسوب:</Text>
                  <Text style={styles.calculatorAmount}>{calculatedPayment.toFixed(3)} د.ك</Text>
                </View>
              )}
            </>
          )}

          {/* Personal Debt Fields */}
          {selectedType?.id === 'personal_debt' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المبلغ الإجمالي (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.totalAmount || ''}
                  onChangeText={(value) => updateFormData('totalAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المبلغ المتبقي (د.ك)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.remainingAmount || ''}
                  onChangeText={(value) => updateFormData('remainingAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Installments Fields */}
          {selectedType?.id === 'installments' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>إجمالي المبلغ (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.totalAmount || ''}
                  onChangeText={(value) => updateFormData('totalAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>عدد الأقساط *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="12"
                  value={formData.installmentCount || ''}
                  onChangeText={(value) => updateFormData('installmentCount', value)}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>قيمة القسط الشهري (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.monthlyPayment || ''}
                  onChangeText={(value) => updateFormData('monthlyPayment', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* BNPL Fields */}
          {selectedType?.id === 'bnpl' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>مبلغ الشراء (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.purchaseAmount || ''}
                  onChangeText={(value) => updateFormData('purchaseAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>عدد الأقساط *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="4"
                  value={formData.installmentCount || ''}
                  onChangeText={(value) => updateFormData('installmentCount', value)}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>قيمة القسط (د.ك)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.installmentAmount || ''}
                  onChangeText={(value) => updateFormData('installmentAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ القسط التالي</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.nextPaymentDate || ''}
                  onChangeText={(value) => updateFormData('nextPaymentDate', value)}
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Credit Card Fields */}
          {selectedType?.id === 'credit_card' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الحد الائتماني (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.creditLimit || ''}
                  onChangeText={(value) => updateFormData('creditLimit', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الرصيد المستحق (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.currentBalance || ''}
                  onChangeText={(value) => updateFormData('currentBalance', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الحد الأدنى للسداد (د.ك)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.minimumPayment || ''}
                  onChangeText={(value) => updateFormData('minimumPayment', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>معدل الفائدة السنوي (%)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="24.0"
                  value={formData.interestRate || ''}
                  onChangeText={(value) => updateFormData('interestRate', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ الاستحقاق</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.dueDate || ''}
                  onChangeText={(value) => updateFormData('dueDate', value)}
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Telecom Fields */}
          {selectedType?.id === 'telecom' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نوع الخدمة *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: خط مفوتر، إنترنت منزلي"
                  value={formData.serviceType || ''}
                  onChangeText={(value) => updateFormData('serviceType', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم الحساب</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل رقم الحساب"
                  value={formData.accountNumber || ''}
                  onChangeText={(value) => updateFormData('accountNumber', value)}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المبلغ الشهري (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.monthlyAmount || ''}
                  onChangeText={(value) => updateFormData('monthlyAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ الاستحقاق الشهري</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: 15 من كل شهر"
                  value={formData.billingDate || ''}
                  onChangeText={(value) => updateFormData('billingDate', value)}
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Utilities Fields */}
          {selectedType?.id === 'utilities' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نوع الخدمة *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: كهرباء وماء، إنترنت"
                  value={formData.serviceType || ''}
                  onChangeText={(value) => updateFormData('serviceType', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم الحساب</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل رقم الحساب"
                  value={formData.accountNumber || ''}
                  onChangeText={(value) => updateFormData('accountNumber', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>متوسط المبلغ الشهري (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.averageAmount || ''}
                  onChangeText={(value) => updateFormData('averageAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ الاستحقاق</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: آخر كل شهر"
                  value={formData.dueDate || ''}
                  onChangeText={(value) => updateFormData('dueDate', value)}
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Rent Fields */}
          {selectedType?.id === 'rent' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نوع الإيجار *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: شقة سكنية، محل تجاري"
                  value={formData.rentType || ''}
                  onChangeText={(value) => updateFormData('rentType', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الإيجار الشهري (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.monthlyRent || ''}
                  onChangeText={(value) => updateFormData('monthlyRent', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ بداية العقد</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.startDate || ''}
                  onChangeText={(value) => updateFormData('startDate', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ انتهاء العقد</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.endDate || ''}
                  onChangeText={(value) => updateFormData('endDate', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>مبلغ التأمين (د.ك)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.securityDeposit || ''}
                  onChangeText={(value) => updateFormData('securityDeposit', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Insurance Fields */}
          {selectedType?.id === 'insurance' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نوع التأمين *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: تأمين صحي، تأمين سيارة"
                  value={formData.insuranceType || ''}
                  onChangeText={(value) => updateFormData('insuranceType', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم البوليصة</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل رقم البوليصة"
                  value={formData.policyNumber || ''}
                  onChangeText={(value) => updateFormData('policyNumber', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>قسط التأمين (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.premiumAmount || ''}
                  onChangeText={(value) => updateFormData('premiumAmount', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تكرار الدفع</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: شهري، سنوي"
                  value={formData.paymentFrequency || ''}
                  onChangeText={(value) => updateFormData('paymentFrequency', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ انتهاء الصلاحية</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.expiryDate || ''}
                  onChangeText={(value) => updateFormData('expiryDate', value)}
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* Notes Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ملاحظات</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="أي ملاحظات إضافية..."
              value={formData.notes || ''}
              onChangeText={(value) => updateFormData('notes', value)}
              multiline
              numberOfLines={3}
              textAlign="right"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        
        <Animated.View style={[
          styles.modalContainer,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              })
            }]
          }
        ]}>
          {/* Header */}
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>إضافة التزام جديد</Text>
              <View style={styles.headerSpacer} />
            </View>
            {renderStepIndicator()}
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            {currentStep === 1 && renderTypeSelector()}
            {currentStep === 2 && renderInstitutionSelector()}
            {currentStep === 3 && renderDetailsForm()}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={currentStep === 1 ? onClose : prevStep}
            >
              <Text style={styles.buttonSecondaryText}>
                {currentStep === 1 ? 'إلغاء' : 'السابق'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                ((!selectedType && currentStep === 1) || 
                 (!selectedInstitution && currentStep === 2) || 
                 (!formData.name && currentStep === 3)) && styles.buttonDisabled
              ]}
              onPress={currentStep === 3 ? () => {
                onSubmit({
                  type: selectedType,
                  institution: selectedInstitution,
                  ...formData
                });
                onClose();
              } : nextStep}
              disabled={((!selectedType && currentStep === 1) || 
                       (!selectedInstitution && currentStep === 2) || 
                       (!formData.name && currentStep === 3))}
            >
              <Text style={styles.buttonPrimaryText}>
                {currentStep === 3 ? 'حفظ الالتزام' : 'التالي'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%', // Increased from maxHeight/minHeight to fixed height
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
  },
  headerSpacer: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: 'white',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTextActive: {
    color: '#3B82F6',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  stepLineActive: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 120, // Increase padding to ensure content doesn't overlap footer
  },
  stepContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 8,
    fontFamily: 'Cairo-Bold',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 24,
    fontFamily: 'Cairo-Regular',
  },
  typesList: {
    flexGrow: 1,
    maxHeight: '100%',
  },
  typeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  typeInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  typeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  typeDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
  },
  footer: {
    flexDirection: 'row-reverse',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    backgroundColor: 'white', // Ensure footer has white background
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3B82F6',
  },
  buttonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    fontFamily: 'Cairo-Bold',
  },
  formContainer: {
    flex: 1,
    maxHeight: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 8,
    fontFamily: 'Cairo-Bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    fontFamily: 'Cairo-Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  calculatorResult: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  calculatorLabel: {
    fontSize: 14,
    color: '#1E40AF',
    textAlign: 'right',
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  calculatorAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noContactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Cairo-Bold',
  },
  noContactsDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
    fontFamily: 'Cairo-Regular',
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addContactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
});

export default AddCommitmentModal;
