import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Easing,
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
  phone?: string;
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
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [personalContacts, setPersonalContacts] = useState<Institution[]>([]);

  // Shared updateFormData function
  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

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
      color: '#10B981',
      description: 'تأمين صحي أو حياة أو سيارة',
    },
    {
      id: 'cooperative',
      name: 'جمعيات',
      icon: 'people-circle',
      color: '#8B5CF6',
      description: 'جمعيات ادخار أو استثمار',
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
      case 'credit_card':
        institutions = kuwaitiBanks;
        sectionTitle = 'اختر البنك المصدر للبطاقة';
        break;
      case 'cooperative':
        institutions = [
          { id: 'custom_cooperative', name: 'أخرى (إدخال يدوي)', type: 'custom', icon: 'add-circle', color: '#6B7280' }
        ];
        sectionTitle = 'اختر الجمعية أو أدخل اسمها';
        break;
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
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>اختر جهة الاتصال</Text>
        <Text style={styles.stepDescription}>اختر الشخص الذي تدين له بالمال</Text>
        
        {personalContacts.length === 0 ? (
          <View style={styles.noContactsContainer}>
            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noContactsTitle}>لا توجد جهات اتصال</Text>
            <Text style={styles.noContactsDescription}>
              أضف جهة اتصال جديدة لتسجيل الدين الشخصي
            </Text>
            
            <TouchableOpacity 
              style={styles.addContactButton}
              onPress={() => setShowAddContact(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color="white" />
              <Text style={styles.addContactButtonText}>إضافة جهة اتصال</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.contactsList}>
            {personalContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactItem,
                  selectedInstitution?.id === contact.id && styles.contactItemSelected
                ]}
                onPress={() => setSelectedInstitution(contact)}
                activeOpacity={0.7}
              >
                <View style={styles.contactInfo}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitial}>
                      {contact.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.phone && (
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    )}
                  </View>
                </View>
                {selectedInstitution?.id === contact.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addAnotherContactButton}
              onPress={() => setShowAddContact(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={20} color="#6366F1" />
              <Text style={styles.addAnotherContactText}>إضافة جهة اتصال أخرى</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        
        {/* Add Contact Modal */}
        <Modal
          visible={showAddContactModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddContactModal(false)}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.overlayTouchable}
              onPress={() => setShowAddContactModal(false)}
              activeOpacity={1}
            />
            <View style={styles.addContactModalContainer}>
              <Text style={styles.addContactModalTitle}>إضافة جهة اتصال</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الاسم *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل اسم الشخص"
                  value={formData.contactName || ''}
                  onChangeText={(value) => updateFormData('contactName', value)}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم الهاتف</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل رقم الهاتف"
                  value={formData.contactPhone || ''}
                  onChangeText={(value) => updateFormData('contactPhone', value)}
                  keyboardType="phone-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.addContactModalButtons}>
                <TouchableOpacity
                  style={styles.cancelContactButton}
                  onPress={() => {
                    setShowAddContactModal(false);
                    updateFormData('contactName', '');
                    updateFormData('contactPhone', '');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelContactButtonText}>إلغاء</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.saveContactButton,
                    !formData.contactName && styles.saveContactButtonDisabled
                  ]}
                  onPress={() => {
                    if (formData.contactName) {
                      const newContact: Institution = {
                        id: Date.now().toString(),
                        name: formData.contactName,
                        phone: formData.contactPhone || '',
                        type: 'شخص',
                        icon: 'person',
                        color: '#6366F1'
                      };
                      setPersonalContacts([...personalContacts, newContact]);
                      setSelectedInstitution(newContact);
                      setShowAddContactModal(false);
                      updateFormData('contactName', '');
                      updateFormData('contactPhone', '');
                    }
                  }}
                  disabled={!formData.contactName}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.saveContactButtonText,
                    !formData.contactName && styles.saveContactButtonTextDisabled
                  ]}>
                    حفظ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderDetailsForm = () => {
    // Use the shared updateFormData function defined above

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
                <Text style={styles.inputLabel}>نوع القرض *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: قرض شخصي، قرض سيارة، قرض عقاري"
                  value={formData.loanType || ''}
                  onChangeText={(value) => updateFormData('loanType', value)}
                  textAlign="right"
                />
              </View>
              
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
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>القسط الشهري (د.ك) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.monthlyPayment || ''}
                  onChangeText={(value) => updateFormData('monthlyPayment', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>معدل الفائدة السنوي (%)</Text>
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
                <Text style={styles.inputLabel}>تاريخ تنفيذ القرض</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="dd/mm/yyyy"
                  value={formData.disbursementDate || ''}
                  onChangeText={(value) => updateFormData('disbursementDate', value)}
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
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المبلغ المتبقي (د.ك)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.000"
                  value={formData.remainingBalance || ''}
                  onChangeText={(value) => updateFormData('remainingBalance', value)}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
              
              {formData.principal && formData.termMonths && formData.interestRate && (
                <View style={styles.calculatorResult}>
                  <Text style={styles.calculatorLabel}>حاسبة القسط الشهري:</Text>
                  <Text style={styles.calculatorAmount}>
                    {calculateLoanPayment(
                      parseFloat(formData.principal || '0'),
                      parseFloat(formData.interestRate || '0'),
                      parseInt(formData.termMonths || '0')
                    ).toFixed(3)} د.ك
                  </Text>
                  <Text style={styles.calculatorNote}>
                    هذه حاسبة تقريبية - أدخل القسط الفعلي في الحقل أعلاه
                  </Text>
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
                <View style={styles.bnplOptionsContainer}>
                  {[3, 4, 6].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.bnplOption,
                        formData.installmentCount === option.toString() && styles.bnplOptionSelected
                      ]}
                      onPress={() => {
                        updateFormData('installmentCount', option.toString());
                        if (formData.purchaseAmount) {
                          const amount = parseFloat(formData.purchaseAmount) / option;
                          updateFormData('installmentAmount', amount.toFixed(3));
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.bnplOptionText,
                        formData.installmentCount === option.toString() && styles.bnplOptionTextSelected
                      ]}>
                        {option} أقساط
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>قيمة القسط (د.ك)</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  placeholder="0.000"
                  value={formData.installmentAmount || ''}
                  editable={false}
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

          {/* Cooperative Fields */}
          {selectedType?.id === 'cooperative' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المبلغ المستحق (د.ك) *</Text>
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
                <Text style={styles.inputLabel}>عدد الدفعات *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="12"
                  value={formData.numberOfPayments || ''}
                  onChangeText={(value) => updateFormData('numberOfPayments', value)}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تكرار الدفع *</Text>
                <View style={styles.bnplOptionsContainer}>
                  {['شهري', 'ربع سنوي', 'نصف سنوي', 'سنوي'].map((frequency) => (
                    <TouchableOpacity
                      key={frequency}
                      style={[
                        styles.bnplOption,
                        formData.cooperativeFrequency === frequency && styles.bnplOptionSelected
                      ]}
                      onPress={() => updateFormData('cooperativeFrequency', frequency)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.bnplOptionText,
                        formData.cooperativeFrequency === frequency && styles.bnplOptionTextSelected
                      ]}>
                        {frequency}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>قيمة الدفعة الواحدة (د.ك)</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  placeholder="0.000"
                  value={formData.totalAmount && formData.numberOfPayments ? 
                    (parseFloat(formData.totalAmount) / parseInt(formData.numberOfPayments)).toFixed(3) : ''}
                  editable={false}
                  textAlign="right"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تاريخ الدفعة التالية</Text>
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
        transparent
        animationType="none"
        onRequestClose={onClose}
        style={{ margin: 0 }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={onClose}
            activeOpacity={1}
          />

          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
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

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardContent}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {currentStep === 1 && renderTypeSelector()}
                {currentStep === 2 && renderInstitutionSelector()}
                {currentStep === 3 && renderDetailsForm()}
              </ScrollView>

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
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddContact}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddContact(false)}
        style={{ margin: 0 }}
      >
        <View style={styles.addContactModalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.addContactModalKeyboard}
          >
            <Animated.View
              style={[
                styles.addContactModalContainer,
                {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.addContactModalHeader}>
                <Text style={styles.addContactModalTitle}>إضافة جهة اتصال جديدة</Text>
                <TouchableOpacity
                  onPress={() => setShowAddContact(false)}
                  style={styles.addContactCloseButton}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.addContactModalContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>اسم جهة الاتصال *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="أدخل الاسم"
                    value={newContactName}
                    onChangeText={setNewContactName}
                    textAlign="right"
                    autoFocus
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>رقم الهاتف *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="أدخل رقم الهاتف"
                    value={newContactPhone}
                    onChangeText={setNewContactPhone}
                    keyboardType="phone-pad"
                    textAlign="right"
                  />
                </View>
              </ScrollView>

              <View style={styles.addContactModalButtons}>
                <TouchableOpacity
                  style={styles.cancelContactButton}
                  onPress={() => {
                    setShowAddContact(false);
                    setNewContactName('');
                    setNewContactPhone('');
                  }}
                >
                  <Text style={styles.cancelContactButtonText}>إلغاء</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveContactButton,
                    (!newContactName.trim() || !newContactPhone.trim()) && styles.saveContactButtonDisabled
                  ]}
                  onPress={() => {
                    if (newContactName.trim() && newContactPhone.trim()) {
                      const newContact: Institution = {
                        id: `personal_${Date.now()}`,
                        name: newContactName.trim(),
                        phone: newContactPhone.trim(),
                        type: 'personal',
                        icon: 'person',
                        color: '#6366F1'
                      };
                      setPersonalContacts(prev => [...prev, newContact]);
                      setSelectedInstitution(newContact);
                      setShowAddContact(false);
                      setNewContactName('');
                      setNewContactPhone('');
                    }
                  }}
                  disabled={!newContactName.trim() || !newContactPhone.trim()}
                >
                  <Text style={[
                    styles.saveContactButtonText,
                    (!newContactName.trim() || !newContactPhone.trim()) && styles.saveContactButtonTextDisabled
                  ]}>
                    حفظ
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get('window').height * 0.85, // 85% of screen height
    width: '100%',
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area padding for iOS
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
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
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: 'Cairo-Regular',
  },
  bnplOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  bnplOption: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bnplOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  bnplOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Cairo-SemiBold',
  },
  bnplOptionTextSelected: {
    color: '#3B82F6',
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactItemSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'right',
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  addAnotherContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addAnotherContactText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
    fontFamily: 'Cairo-SemiBold',
  },
  addContactModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  addContactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Cairo-Bold',
  },
  addContactModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelContactButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelContactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Cairo-SemiBold',
  },
  saveContactButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  saveContactButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveContactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  saveContactButtonTextDisabled: {
    color: '#9CA3AF',
  },
  addContactButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  addContactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Cairo-Bold',
  },
  calculatorNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: 'Cairo-Regular',
  },
});

export default AddCommitmentModal;
