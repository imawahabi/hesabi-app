import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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
  onSubmit: (data: any) => void;
}

const AddCommitmentModal: React.FC<AddCommitmentModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CommitmentType | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionModalData, setSelectionModalData] = useState<any[]>([]);

  // Advanced animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(1)).current;
  const stickyHeaderAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const [showStickyHeader, setShowStickyHeader] = useState(false);

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
      color: '#3B82F6',
      description: 'قروض البنوك والمؤسسات المالية'
    },
    {
      id: 'installments_free',
      name: 'أقساط بدون فوائد',
      icon: 'gift',
      color: '#10B981',
      description: 'أقساط بدون فوائد أو رسوم إضافية'
    },
    {
      id: 'installments_interest',
      name: 'أقساط بفوائد',
      icon: 'trending-up',
      color: '#EF4444',
      description: 'أقساط مع فوائد أو رسوم إضافية'
    },
    {
      id: 'cooperative',
      name: 'جمعيات',
      icon: 'people-circle',
      color: '#8B5CF6',
      description: 'جمعيات ادخار أو تعاونية'
    },
    {
      id: 'rent',
      name: 'إيجارات',
      icon: 'home',
      color: '#F59E0B',
      description: 'إيجار المنزل أو المكتب'
    },
    {
      id: 'utilities',
      name: 'خدمات عامة',
      icon: 'flash',
      color: '#06B6D4',
      description: 'كهرباء، ماء، انترنت، هاتف'
    },
    {
      id: 'health_insurance',
      name: 'تأمين صحي',
      icon: 'medical',
      color: '#EC4899',
      description: 'بوليصة التأمين الصحي'
    }
  ];

  // Pre-registered contacts and institutions
  const getPreRegisteredData = (typeId: string) => {
    switch (typeId) {
      case 'personal_debt':
        return [
          { id: 'contact_1', name: 'أحمد محمد العلي', phone: '99887766', relationship: 'صديق', type: 'contact', icon: 'person', color: '#3B82F6' },
          { id: 'contact_2', name: 'فاطمة خالد', phone: '66554433', relationship: 'قريبة', type: 'contact', icon: 'person', color: '#10B981' },
          { id: 'contact_3', name: 'سالم الرشيد', phone: '55443322', relationship: 'زميل', type: 'contact', icon: 'person', color: '#F59E0B' },
          { id: 'contact_4', name: 'نورا العنزي', phone: '77889900', relationship: 'صديقة', type: 'contact', icon: 'person', color: '#8B5CF6' }
        ];
      
      case 'bank_loan':
        return [
          { id: 'nbk_acc', name: 'بنك الكويت الوطني - حساب 123456', accountNumber: '123456789', type: 'bank_account', icon: 'card', color: '#1E40AF' },
          { id: 'cbk_acc', name: 'البنك التجاري - حساب 987654', accountNumber: '987654321', type: 'bank_account', icon: 'card', color: '#059669' },
          { id: 'gulf_acc', name: 'بنك الخليج - حساب 456789', accountNumber: '456789123', type: 'bank_account', icon: 'card', color: '#DC2626' }
        ];
      
      case 'installments_free':
      case 'installments_interest':
        return [
          { id: 'alghanim_acc', name: 'الغانم أوتو - رقم العميل 1001', customerNumber: '1001', type: 'merchant_account', icon: 'car', color: '#EF4444' },
          { id: 'xcite_acc', name: 'اكسايت - رقم العميل 2002', customerNumber: '2002', type: 'merchant_account', icon: 'phone-portrait', color: '#F59E0B' },
          { id: 'best_acc', name: 'بست اليوسفي - رقم العميل 3003', customerNumber: '3003', type: 'merchant_account', icon: 'tv', color: '#3B82F6' }
        ];
      
      case 'cooperative':
        return [
          { id: 'work_coop_member', name: 'جمعية العمل - عضو رقم 15', memberNumber: '15', totalMembers: 20, type: 'coop_membership', icon: 'briefcase', color: '#059669' },
          { id: 'family_coop_member', name: 'جمعية العائلة - عضو رقم 8', memberNumber: '8', totalMembers: 12, type: 'coop_membership', icon: 'home', color: '#DC2626' }
        ];
      
      default:
        return [];
    }
  };

  // Get existing entities with commitment count for this type
  const getExistingEntitiesForType = (typeId: string) => {
    switch (typeId) {
      case 'personal_debt':
        return [
          { id: 'contact_1', name: 'أحمد محمد العلي', phone: '99887766', relationship: 'صديق', commitmentCount: 2, type: 'contact', icon: 'person', color: '#3B82F6' },
          { id: 'contact_2', name: 'فاطمة خالد', phone: '66554433', relationship: 'قريبة', commitmentCount: 1, type: 'contact', icon: 'person', color: '#10B981' },
          { id: 'contact_3', name: 'سالم الرشيد', phone: '55443322', relationship: 'زميل', commitmentCount: 3, type: 'contact', icon: 'person', color: '#F59E0B' }
        ];
      
      case 'bank_loan':
        return [
          { id: 'nbk_acc', name: 'بنك الكويت الوطني', accountNumber: '123456789', commitmentCount: 1, type: 'bank_account', icon: 'card', color: '#1E40AF' },
          { id: 'cbk_acc', name: 'البنك التجاري الكويتي', accountNumber: '987654321', commitmentCount: 2, type: 'bank_account', icon: 'card', color: '#059669' }
        ];
      
      case 'installments_free':
      case 'installments_interest':
        return [
          { id: 'alghanim_acc', name: 'الغانم أوتو', customerNumber: '1001', commitmentCount: 2, type: 'merchant_account', icon: 'car', color: '#EF4444' },
          { id: 'xcite_acc', name: 'اكسايت الغانم', customerNumber: '2002', commitmentCount: 1, type: 'merchant_account', icon: 'phone-portrait', color: '#F59E0B' }
        ];
      
      case 'cooperative':
        return [
          { id: 'work_coop_member', name: 'جمعية العمل', memberNumber: '15', totalMembers: 20, commitmentCount: 1, type: 'coop_membership', icon: 'briefcase', color: '#059669' }
        ];
      
      case 'rent':
        return [
          { id: 'landlord_1', name: 'محمد العلي', phone: '99887766', commitmentCount: 1, type: 'landlord', icon: 'person', color: '#10B981' }
        ];
      
      case 'utilities':
        return [
          { id: 'mew_acc', name: 'وزارة الكهرباء والماء', accountNumber: '12345', commitmentCount: 2, type: 'utility', icon: 'flash', color: '#059669' }
        ];
      
      case 'health_insurance':
        return [
          { id: 'insurance_1', name: 'الخليج للتأمين', policyNumber: 'POL123', commitmentCount: 1, type: 'insurance', icon: 'shield', color: '#1E40AF' }
        ];
      
      default:
        return [];
    }
  };

  // Choice options for step 2
  const getChoiceOptions = () => [
    { 
      id: 'add_to_existing', 
      name: 'إضافة التزام لجهة موجودة', 
      description: 'اختر من الجهات المسجلة لديك',
      type: 'existing', 
      icon: 'people', 
      color: '#3B82F6' 
    },
    { 
      id: 'add_new_entity', 
      name: 'إضافة جهة جديدة', 
      description: 'أنشئ جهة جديدة وأضف التزام لها',
      type: 'new', 
      icon: 'add-circle', 
      color: '#059669' 
    }
  ];

  // Form validation
  const validateCurrentStep = () => {
    const errors: any = {};
    
    if (currentStep === 1) {
      if (!selectedType) {
        errors.type = 'يرجى اختيار نوع الالتزام';
        return false;
      }
    } else if (currentStep === 2) {
      if (!selectedChoice) {
        errors.choice = 'يرجى اختيار طريقة الإضافة';
        return false;
      }
    } else if (currentStep === 3) {
      if (!selectedInstitution) {
        errors.institution = 'يرجى اختيار الجهة';
        return false;
      }
    } else if (currentStep === 4) {
      // Basic validation
      if (!formData.name?.trim()) {
        errors.name = 'اسم الالتزام مطلوب';
      }
      if (!formData.amount?.trim()) {
        errors.amount = 'المبلغ مطلوب';
      }
      
      // Type-specific validation
      if (selectedType) {
        switch (selectedType.id) {
          case 'personal_debt':
            if (!formData.creditorName?.trim()) {
              errors.creditorName = 'اسم الدائن مطلوب';
            }
            break;
          case 'bank_loan':
            if (!formData.bankName?.trim()) {
              errors.bankName = 'اسم البنك مطلوب';
            }
            break;
          case 'installments_free':
          case 'installments_interest':
            if (!formData.merchantName?.trim()) {
              errors.merchantName = 'اسم المتجر/الشركة مطلوب';
            }
            break;
          case 'cooperative':
            if (!formData.cooperativeName?.trim()) {
              errors.cooperativeName = 'اسم الجمعية مطلوب';
            }
            break;
          case 'rent':
            if (!formData.propertyAddress?.trim()) {
              errors.propertyAddress = 'عنوان العقار مطلوب';
            }
            break;
          case 'utilities':
            if (!formData.serviceType?.trim()) {
              errors.serviceType = 'نوع الخدمة مطلوب';
            }
            break;
          case 'health_insurance':
            if (!formData.insuranceCompany?.trim()) {
              errors.insuranceCompany = 'شركة التأمين مطلوبة';
            }
            break;
        }
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return false;
      }
    }
    
    setFormErrors({});
    return true;
  };


  // Advanced scroll handling with parallax
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // Phase 1: Header fixed (0-80px)
        if (offsetY <= 80) {
          headerOpacity.setValue(1);
          headerTranslateY.setValue(0);
          headerScale.setValue(1);
          contentOpacity.setValue(1);
        } 
        // Phase 2: Parallax fade (80-160px)
        else if (offsetY <= 160) {
          const progress = (offsetY - 80) / 80;
          headerOpacity.setValue(1 - progress * 0.8);
          headerTranslateY.setValue(-offsetY * 0.5);
          headerScale.setValue(1 - progress * 0.05);
          contentOpacity.setValue(1 - progress * 0.3);
        } 
        // Phase 3: Almost invisible
        else {
          headerOpacity.setValue(0.2);
          headerTranslateY.setValue(-offsetY * 0.5);
          headerScale.setValue(0.95);
          contentOpacity.setValue(0.7);
        }
        
        // Sticky header with bounce
        if (offsetY > 120 && !showStickyHeader) {
          setShowStickyHeader(true);
          Animated.sequence([
            Animated.timing(stickyHeaderAnim, {
              toValue: 1.1,
              duration: 200,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.spring(stickyHeaderAnim, {
              toValue: 1,
              tension: 180,
              friction: 12,
              useNativeDriver: true,
            })
          ]).start();
        } else if (offsetY <= 120 && showStickyHeader) {
          Animated.timing(stickyHeaderAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.back(1.5)),
            useNativeDriver: true,
          }).start(() => setShowStickyHeader(false));
        }
      },
    }
  );

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      overlayOpacity.setValue(0);
      headerOpacity.setValue(1);
      headerTranslateY.setValue(0);
      headerScale.setValue(1);
      scrollY.setValue(0);
      contentOpacity.setValue(1);
      setShowStickyHeader(false);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 2 && selectedChoice?.type === 'new') {
        // Skip step 3 for new entities, go directly to step 4
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && selectedChoice?.type === 'new') {
      // Go back to step 2 for new entities
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <View style={styles.stepContainer}>
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
          </View>
          {step < 3 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const handleInstitutionSelection = (institution: Institution) => {
    if (institution.type === 'add_new') {
      setSelectedInstitution(institution);
    } else if (institution.type === 'select_existing') {
      const preRegisteredData = getPreRegisteredData(selectedType?.id || '');
      setSelectionModalData(preRegisteredData);
      setShowSelectionModal(true);
    } else {
      setSelectedInstitution(institution);
    }
  };

  const handleSelectFromRegistered = (selectedData: any) => {
    setSelectedInstitution({
      id: selectedData.id,
      name: selectedData.name,
      type: selectedData.type,
      icon: selectedData.icon,
      color: selectedData.color
    });
    
    // Pre-populate form fields based on selected data type
    let prePopulatedData: any = { selectedPreRegistered: selectedData };
    
    if (selectedData.type === 'contact') {
      prePopulatedData = {
        ...prePopulatedData,
        creditorName: selectedData.name,
        creditorPhone: selectedData.phone,
        relationship: selectedData.relationship
      };
    } else if (selectedData.type === 'bank_account') {
      prePopulatedData = {
        ...prePopulatedData,
        bankName: selectedData.name.split(' - ')[0],
        accountNumber: selectedData.accountNumber
      };
    } else if (selectedData.type === 'merchant_account') {
      prePopulatedData = {
        ...prePopulatedData,
        merchantName: selectedData.name.split(' - ')[0],
        customerNumber: selectedData.customerNumber
      };
    } else if (selectedData.type === 'coop_membership') {
      prePopulatedData = {
        ...prePopulatedData,
        cooperativeName: selectedData.name.split(' - ')[0],
        turnNumber: selectedData.memberNumber,
        memberCount: selectedData.totalMembers
      };
    }
    
    setFormData({...formData, ...prePopulatedData});
    setShowSelectionModal(false);
  };

  const renderSelectionModal = () => (
    <Modal
      visible={showSelectionModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSelectionModal(false)}
    >
      <View style={styles.selectionOverlay}>
        <View style={styles.selectionModal}>
          <View style={styles.selectionHeader}>
            <TouchableOpacity onPress={() => setShowSelectionModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.selectionTitle}>اختر من القائمة</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.selectionList}>
            {selectionModalData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.selectionItem}
                onPress={() => handleSelectFromRegistered(item)}
              >
                <View style={[styles.selectionIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={20} color="white" />
                </View>
                <View style={styles.selectionInfo}>
                  <Text style={styles.selectionName}>{item.name}</Text>
                  <Text style={styles.selectionDetail}>
                    {item.phone || item.accountNumber || item.customerNumber || item.memberNumber || 'تفاصيل إضافية'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderStepContent = () => {
    if (currentStep === 2) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>طريقة الإضافة</Text>
          <Text style={styles.stepDescription}>
            هل تريد إضافة التزام لجهة موجودة أم إنشاء جهة جديدة؟
          </Text>
          
          <View style={styles.choiceGrid}>
            {getChoiceOptions().map((choice) => (
              <TouchableOpacity
                key={choice.id}
                style={[
                  styles.choiceCard,
                  selectedChoice?.id === choice.id && styles.choiceCardSelected
                ]}
                onPress={() => setSelectedChoice(choice)}
              >
                <View style={[styles.choiceIcon, { backgroundColor: choice.color }]}>
                  <Ionicons name={choice.icon as any} size={24} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.choiceName}>{choice.name}</Text>
                  <Text style={styles.choiceDescription}>{choice.description}</Text>
                </View>
                {selectedChoice?.id === choice.id && (
                  <View style={styles.stepIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (currentStep === 3 && selectedChoice?.type === 'existing') {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>اختر الجهة الموجودة</Text>
          <Text style={styles.stepDescription}>
            اختر من الجهات التي لديك التزامات معها
          </Text>
          
          <ScrollView style={styles.typesList} showsVerticalScrollIndicator={false}>
            {getExistingEntitiesForType(selectedType?.id || '').map((entity) => (
              <TouchableOpacity
                key={entity.id}
                style={[
                  styles.institutionCard,
                  selectedInstitution?.id === entity.id && styles.institutionCardSelected
                ]}
                onPress={() => setSelectedInstitution(entity)}
                activeOpacity={0.7}
              >
                <View style={[styles.institutionIcon, { backgroundColor: entity.color }]}>
                  <Ionicons name={entity.icon as any} size={20} color="white" />
                </View>
                
                <View style={styles.institutionInfo}>
                  <Text style={styles.institutionName}>{entity.name}</Text>
                  <Text style={styles.institutionDetail}>
                    {(entity as any).phone && `هاتف: ${(entity as any).phone}`}
                    {(entity as any).accountNumber && `حساب: ${(entity as any).accountNumber}`}
                    {(entity as any).customerNumber && `عميل: ${(entity as any).customerNumber}`}
                    {(entity as any).memberNumber && `عضو: ${(entity as any).memberNumber}`}
                  </Text>
                  <Text style={styles.commitmentCount}>
                    {entity.commitmentCount} التزامات موجودة
                  </Text>
                </View>

                {selectedInstitution?.id === entity.id && (
                  <View style={styles.stepIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    return null;
  };


  const renderTypeSelector = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>اختر نوع الالتزام</Text>
      <Text style={styles.stepDescription}>حدد نوع الالتزام المالي</Text>
      
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
            <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
              <Ionicons name={type.icon as any} size={24} color="white" />
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

  const renderDetailsForm = () => (
    <ScrollView 
      style={styles.formContainer}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>تفاصيل الالتزام</Text>
        <Text style={styles.stepDescription}>أدخل المعلومات المطلوبة</Text>
        
        {/* Basic Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>اسم الالتزام *</Text>
          <TextInput
            style={[
              styles.textInput,
              formErrors.name && styles.textInputError
            ]}
            placeholder="مثال: قسط السيارة"
            value={formData.name || ''}
            onChangeText={(value) => setFormData({...formData, name: value})}
            textAlign="right"
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>المبلغ (د.ك) *</Text>
          <TextInput
            style={[
              styles.textInput,
              formErrors.amount && styles.textInputError
            ]}
            placeholder="0.000"
            value={formData.amount || ''}
            onChangeText={(value) => setFormData({...formData, amount: value})}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          {formErrors.amount && (
            <Text style={styles.errorText}>{formErrors.amount}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>تاريخ الاستحقاق</Text>
          <TextInput
            style={styles.textInput}
            placeholder="dd/mm/yyyy"
            value={formData.dueDate || ''}
            onChangeText={(value) => setFormData({...formData, dueDate: value})}
            textAlign="right"
          />
        </View>

        {/* Type-specific fields */}
        {selectedType && renderTypeSpecificFields()}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>ملاحظات</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="معلومات إضافية..."
            value={formData.notes || ''}
            onChangeText={(value) => setFormData({...formData, notes: value})}
            multiline
            numberOfLines={3}
            textAlign="right"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderTypeSpecificFields = () => {
    if (!selectedType) return null;

    switch (selectedType.id) {
      case 'personal_debt':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل الدين الشخصي</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم الدائن *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: أحمد محمد"
                value={formData.creditorName || ''}
                onChangeText={(value) => setFormData({...formData, creditorName: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم الهاتف</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 99999999"
                value={formData.creditorPhone || ''}
                onChangeText={(value) => setFormData({...formData, creditorPhone: value})}
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>العلاقة</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: صديق، قريب، زميل"
                value={formData.relationship || ''}
                onChangeText={(value) => setFormData({...formData, relationship: value})}
                textAlign="right"
              />
            </View>
          </>
        );

      case 'bank_loan':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل القرض البنكي</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم البنك *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: بنك الكويت الوطني"
                value={formData.bankName || ''}
                onChangeText={(value) => setFormData({...formData, bankName: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم القرض</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 123456789"
                value={formData.loanNumber || ''}
                onChangeText={(value) => setFormData({...formData, loanNumber: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>معدل الفائدة (%)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 3.5"
                value={formData.interestRate || ''}
                onChangeText={(value) => setFormData({...formData, interestRate: value})}
                keyboardType="decimal-pad"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>المبلغ الإجمالي للقرض</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.000"
                value={formData.totalLoanAmount || ''}
                onChangeText={(value) => setFormData({...formData, totalLoanAmount: value})}
                keyboardType="decimal-pad"
                textAlign="right"
              />
            </View>
          </>
        );

      case 'installments_free':
      case 'installments_interest':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل القسط</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم المتجر/الشركة *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: الغانم أوتو"
                value={formData.merchantName || ''}
                onChangeText={(value) => setFormData({...formData, merchantName: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>نوع المنتج</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: سيارة، جهاز، أثاث"
                value={formData.productType || ''}
                onChangeText={(value) => setFormData({...formData, productType: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عدد الأقساط</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 12"
                value={formData.installmentCount || ''}
                onChangeText={(value) => setFormData({...formData, installmentCount: value})}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            {selectedType.id === 'installments_interest' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>معدل الفائدة (%)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: 2.5"
                  value={formData.interestRate || ''}
                  onChangeText={(value) => setFormData({...formData, interestRate: value})}
                  keyboardType="decimal-pad"
                  textAlign="right"
                />
              </View>
            )}
          </>
        );

      case 'cooperative':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل الجمعية</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم الجمعية *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: جمعية الموظفين"
                value={formData.cooperativeName || ''}
                onChangeText={(value) => setFormData({...formData, cooperativeName: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم الدور</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 5"
                value={formData.turnNumber || ''}
                onChangeText={(value) => setFormData({...formData, turnNumber: value})}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عدد الأعضاء</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 12"
                value={formData.memberCount || ''}
                onChangeText={(value) => setFormData({...formData, memberCount: value})}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>المبلغ الإجمالي</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.000"
                value={formData.totalAmount || ''}
                onChangeText={(value) => setFormData({...formData, totalAmount: value})}
                keyboardType="decimal-pad"
                textAlign="right"
              />
            </View>
          </>
        );

      case 'rent':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل الإيجار</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عنوان العقار *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: الجابرية، قطعة 1، شارع 5"
                value={formData.propertyAddress || ''}
                onChangeText={(value) => setFormData({...formData, propertyAddress: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم المالك</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: محمد العلي"
                value={formData.landlordName || ''}
                onChangeText={(value) => setFormData({...formData, landlordName: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم هاتف المالك</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 99999999"
                value={formData.landlordPhone || ''}
                onChangeText={(value) => setFormData({...formData, landlordPhone: value})}
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>مدة العقد (شهر)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 12"
                value={formData.contractDuration || ''}
                onChangeText={(value) => setFormData({...formData, contractDuration: value})}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
          </>
        );

      case 'utilities':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل الخدمة</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>نوع الخدمة *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: كهرباء، ماء، إنترنت"
                value={formData.serviceType || ''}
                onChangeText={(value) => setFormData({...formData, serviceType: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>اسم مقدم الخدمة</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: وزارة الكهرباء والماء"
                value={formData.serviceProvider || ''}
                onChangeText={(value) => setFormData({...formData, serviceProvider: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم الحساب</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 123456789"
                value={formData.accountNumber || ''}
                onChangeText={(value) => setFormData({...formData, accountNumber: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>العنوان</Text>
              <TextInput
                style={styles.textInput}
                placeholder="عنوان الخدمة"
                value={formData.serviceAddress || ''}
                onChangeText={(value) => setFormData({...formData, serviceAddress: value})}
                textAlign="right"
              />
            </View>
          </>
        );

      case 'health_insurance':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل التأمين الصحي</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>شركة التأمين *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: الخليج للتأمين"
                value={formData.insuranceCompany || ''}
                onChangeText={(value) => setFormData({...formData, insuranceCompany: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم البوليصة</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: POL123456"
                value={formData.policyNumber || ''}
                onChangeText={(value) => setFormData({...formData, policyNumber: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>نوع التغطية</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: شاملة، أساسية"
                value={formData.coverageType || ''}
                onChangeText={(value) => setFormData({...formData, coverageType: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عدد المؤمن عليهم</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 4"
                value={formData.insuredCount || ''}
                onChangeText={(value) => setFormData({...formData, insuredCount: value})}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>تاريخ انتهاء البوليصة</Text>
              <TextInput
                style={styles.textInput}
                placeholder="dd/mm/yyyy"
                value={formData.policyExpiryDate || ''}
                onChangeText={(value) => setFormData({...formData, policyExpiryDate: value})}
                textAlign="right"
              />
            </View>
          </>
        );

      default:
        return null;
    }
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
                outputRange: [Dimensions.get('window').height, 0],
              })
            }]
          }
        ]}>
          {/* Sticky Header */}
          {showStickyHeader && (
            <Animated.View style={[
              styles.stickyHeader,
              {
                transform: [
                  {
                    translateY: stickyHeaderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                    })
                  },
                  {
                    scale: stickyHeaderAnim.interpolate({
                      inputRange: [0, 1, 1.1],
                      outputRange: [0.8, 1, 1.05],
                    })
                  }
                ],
                opacity: stickyHeaderAnim,
              }
            ]}>
              <Text style={styles.stickyTitle}>إضافة التزام جديد</Text>
              <TouchableOpacity onPress={onClose} style={styles.stickyCloseButton}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Main Header with Advanced Parallax */}
          <Animated.View style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [
                { translateY: headerTranslateY },
                { scale: headerScale }
              ]
            }
          ]}>
            <LinearGradient
              colors={['#1E40AF', '#3B82F6']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View style={[
                styles.headerContent,
                { opacity: contentOpacity }
              ]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>إضافة التزام جديد</Text>
                <View style={styles.headerSpacer} />
              </Animated.View>
              {renderStepIndicator()}
            </LinearGradient>
          </Animated.View>

          {/* Content */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            {currentStep === 1 && renderTypeSelector()}
            {currentStep === 2 && renderStepContent()}
            {currentStep === 3 && renderStepContent()}
            {currentStep === 4 && renderDetailsForm()}
          </KeyboardAvoidingView>

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
            >
              <Text style={styles.buttonPrimaryText}>
                {currentStep === 3 ? 'حفظ' : 'التالي'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
      
      {/* Selection Modal for pre-registered data */}
      {renderSelectionModal()}
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
    height: '85%',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  stickyCloseButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerGradient: {
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
  skipButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  footer: {
    flexDirection: 'row-reverse',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    backgroundColor: 'white',
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
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  textInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
  },
  // Institution cards - improved design
  institutionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  institutionCardSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.1,
  },
  institutionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  institutionInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  institutionDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
    fontFamily: 'Cairo-Regular',
  },
  institutionAction: {
    marginRight: 8,
  },
  // Selection Modal Styles
  selectionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  selectionModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
  },
  selectionList: {
    maxHeight: 400,
  },
  selectionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  selectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  selectionInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  selectionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-SemiBold',
  },
  selectionDetail: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  // Choice styles
  choiceGrid: {
    gap: 16,
    marginTop: 20,
  },
  choiceCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  choiceCardSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  choiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Cairo',
    textAlign: 'right',
    flex: 1,
    lineHeight: 22,
  },
  choiceDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Cairo', 
    textAlign: 'right',
    marginTop: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  
  // Additional styles
  institutionDetail: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginTop: 2,
  },
  commitmentCount: {
    fontSize: 12,
    color: '#059669',
    fontFamily: 'Cairo',
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default AddCommitmentModal;
