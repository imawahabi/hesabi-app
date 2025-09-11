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
      name: 'أقساط',
      icon: 'time',
      color: '#F59E0B',
      description: 'أقساط المتاجر والشركات'
    },
    {
      id: 'credit_card',
      name: 'بطاقات ائتمان',
      icon: 'card-outline',
      color: '#8B5CF6',
      description: 'مستحقات البطاقات الائتمانية'
    },
    {
      id: 'utilities',
      name: 'فواتير ثابتة',
      icon: 'flash',
      color: '#06B6D4',
      description: 'كهرباء، ماء، إنترنت'
    }
  ];

  const kuwaitiBanks: Institution[] = [
    { id: 'nbk', name: 'بنك الكويت الوطني', type: 'bank', icon: 'business', color: '#1E40AF' },
    { id: 'gulf_bank', name: 'بنك الخليج', type: 'bank', icon: 'business', color: '#059669' },
    { id: 'cbk', name: 'البنك التجاري الكويتي', type: 'bank', icon: 'business', color: '#DC2626' },
    { id: 'kfh', name: 'بيت التمويل الكويتي', type: 'bank', icon: 'business', color: '#7C3AED' },
    { id: 'ahli_bank', name: 'البنك الأهلي الكويتي', type: 'bank', icon: 'business', color: '#EA580C' },
    { id: 'boubyan', name: 'بنك بوبيان', type: 'bank', icon: 'business', color: '#0891B2' }
  ];

  const kuwaiti_stores: Institution[] = [
    { id: 'xcite', name: 'اكسايت', type: 'store', icon: 'storefront', color: '#DC2626' },
    { id: 'best', name: 'بست الزهراء', type: 'store', icon: 'storefront', color: '#059669' },
    { id: 'eureka', name: 'يوريكا', type: 'store', icon: 'storefront', color: '#7C3AED' },
    { id: 'carrefour', name: 'كارفور', type: 'store', icon: 'storefront', color: '#DC2626' }
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
    const institutions = selectedType?.id === 'bank_loan' ? kuwaitiBanks : 
                        selectedType?.id === 'installments' ? kuwaiti_stores : [];
    
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>اختر الجهة</Text>
        <Text style={styles.stepDescription}>
          {selectedType?.id === 'bank_loan' ? 'اختر البنك أو المؤسسة المالية' : 
           selectedType?.id === 'installments' ? 'اختر المتجر أو الشركة' : 
           'اختر الجهة المعنية'}
        </Text>
        
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
                <Text style={styles.typeDescription}>{institution.type === 'bank' ? 'بنك' : 'متجر'}</Text>
              </View>
              {selectedInstitution?.id === institution.id && (
                <Ionicons name="checkmark-circle" size={24} color={institution.color} />
              )}
            </TouchableOpacity>
          ))}
          
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
        </ScrollView>
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
    paddingBottom: 100, // Add padding to prevent overlap with footer
  },
  stepContent: {
    flex: 1,
    minHeight: '100%', // Ensure content takes full height
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
    flex: 1,
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
});

export default AddCommitmentModal;
