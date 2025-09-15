import { Ionicons } from '@expo/vector-icons';
import {
  Wallet as WalletIcon,
  Profile2User,
  Card as CardIcon,
  Bag2,
  Tag2,
  Home3,
  Flash,
  Call,
  ShieldTick,
  Heart,
  Activity,
  Car,
  Mobile,
  Monitor,
  Briefcase,
  Location,
  Wifi,
  DocumentText,
  Global,
  Airplane,
  TickCircle,
} from 'iconsax-react-nativejs';

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
  const getIconsaxByName = (name: string): React.ComponentType<any> => {
    switch (name) {
      case 'wallet': return WalletIcon;
      case 'people':
      case 'person':
      case 'people-circle': return Profile2User;
      case 'card':
      case 'card-outline': return CardIcon;
      case 'bag': return Bag2;
      case 'pricetag':
      case 'pricetag-outline': return Tag2;
      case 'home': return Home3;
      case 'flash': return Flash;
      case 'call': return Call;
      case 'shield-checkmark': return ShieldTick;
      case 'heart': return Heart;
      case 'pulse': return Activity;
      case 'car':
      case 'car-sport': return Car;
      case 'phone-portrait': return Mobile;
      case 'tv': return Monitor;
      case 'briefcase': return Briefcase;
      case 'location': return Location;
      case 'wifi': return Wifi;
      case 'document': return DocumentText;
      case 'globe': return Global;
      case 'airplane': return Airplane;
      case 'medical': return ShieldTick;
      default: return DocumentText;
    }
  };
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
  const stepProgressAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;

  const commitmentTypes: CommitmentType[] = [
    { id: 'savings', name: 'الإدخار', description: 'برنامج ادخار ذكي بتكرار مرن', icon: 'wallet', color: '#16A34A' },
    { id: 'personal_debt', name: 'ديون شخصية', description: 'ديون مستحقة لأشخاص', icon: 'people', color: '#EF4444' },
    { id: 'bank_loan', name: 'قروض بنكية', description: 'قروض من البنوك والمؤسسات المالية', icon: 'card', color: '#3B82F6' },
    { id: 'installments_free', name: 'أقساط بدون فوائد', description: 'أقساط المشتريات بدون فوائد', icon: 'bag', color: '#10B981' },
    { id: 'installments_interest', name: 'أقساط بفوائد', description: 'أقساط المشتريات مع فوائد', icon: 'card-outline', color: '#F59E0B' },
    { id: 'cooperative', name: 'جمعيات', description: 'الجمعيات المالية', icon: 'people-circle', color: '#8B5CF6' },
    { id: 'rent', name: 'إيجارات', description: 'إيجار العقارات والمكاتب', icon: 'home', color: '#06B6D4' },
    { id: 'utilities', name: 'خدمات عامة', description: 'فواتير الكهرباء والماء والخدمات', icon: 'flash', color: '#84CC16' },
    { id: 'telecom', name: 'شركات الاتصالات', description: 'خطوط الهاتف والإنترنت', icon: 'call', color: '#F97316' },
    { 
      id: 'insurance', 
      name: 'التأمينات', 
      description: 'جميع أنواع التأمينات والبوليصات', 
      icon: 'shield-checkmark', 
      color: '#EC4899' 
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
          { id: 'family_coop_member', name: 'جمعية العائلة - عضو رقم 8', memberNumber: '8', totalMembers: 12, type: 'coop_membership', icon: 'home', color: '#DC2626' },
          { id: 'friends_coop_member', name: 'جمعية الأصدقاء - عضو رقم 22', memberNumber: '22', totalMembers: 30, type: 'coop_membership', icon: 'people', color: '#8B5CF6' },
          { id: 'neighborhood_coop_member', name: 'جمعية الحي - عضو رقم 5', memberNumber: '5', totalMembers: 15, type: 'coop_membership', icon: 'location', color: '#F59E0B' }
        ];
      
      case 'rent':
        return [
          { id: 'landlord_1', name: 'محمد العلي', phone: '99887766', address: 'الجهراء، قطعة 5', type: 'landlord', icon: 'person', color: '#10B981' },
          { id: 'landlord_2', name: 'سارة الأحمد', phone: '55443322', address: 'حولي، شارع تونس', type: 'landlord', icon: 'person', color: '#3B82F6' },
          { id: 'property_mgmt_1', name: 'شركة العقارات المتميزة', phone: '22334455', address: 'مدينة الكويت', type: 'property_management', icon: 'business', color: '#059669' }
        ];
      
      case 'utilities':
        return [
          { id: 'mew', name: 'وزارة الكهرباء والماء', accountNumber: 'MEW123456', serviceType: 'كهرباء وماء', type: 'utility_provider', icon: 'flash', color: '#F59E0B' },
          { id: 'kems', name: 'شركة كهرباء وماء الكويت (كيمز)', accountNumber: 'KEMS789012', serviceType: 'كهرباء وماء', type: 'utility_provider', icon: 'water', color: '#06B6D4' },
          { id: 'qualitynet', name: 'كواليتي نت', accountNumber: 'QN345678', serviceType: 'إنترنت', type: 'utility_provider', icon: 'wifi', color: '#8B5CF6' }
        ];
      
      case 'telecom':
        return [
          { id: 'zain_kw', name: 'زين الكويت', accountNumber: 'ZN99887766', phoneNumber: '99887766', type: 'telecom_provider', icon: 'call', color: '#E11D48' },
          { id: 'ooredoo_kw', name: 'أوريدو الكويت', accountNumber: 'OR55443322', phoneNumber: '55443322', type: 'telecom_provider', icon: 'phone-portrait', color: '#DC2626' },
          { id: 'stc_kw', name: 'STC الكويت', accountNumber: 'STC66778899', phoneNumber: '66778899', type: 'telecom_provider', icon: 'cellular', color: '#7C3AED' },
          { id: 'viva_kw', name: 'فيفا الكويت', accountNumber: 'VV77889900', phoneNumber: '77889900', type: 'telecom_provider', icon: 'radio', color: '#F97316' }
        ];
      
      case 'insurance':
        return [
          // تأمين صحي
          { id: 'gulf_health_insurance', name: 'شركة الخليج للتأمين - صحي', policyNumber: 'GHI2024001', insuranceType: 'health', coverage: 'تأمين صحي شامل', type: 'insurance', icon: 'medical', color: '#EC4899' },
          { id: 'warba_health_insurance', name: 'شركة وربة للتأمين - صحي', policyNumber: 'WHI2024002', insuranceType: 'health', coverage: 'تأمين صحي عائلي', type: 'insurance', icon: 'heart', color: '#EF4444' },
          { id: 'kic_health_insurance', name: 'الشركة الكويتية للتأمين - صحي', policyNumber: 'KHI2024003', insuranceType: 'health', coverage: 'تأمين صحي فردي', type: 'insurance', icon: 'pulse', color: '#059669' },
          // تأمين سيارة
          { id: 'gulf_car_insurance', name: 'شركة الخليج - تأمين مركبات', policyNumber: 'GCI2024001', insuranceType: 'car', vehiclePlate: 'أ ب ج 123', type: 'insurance', icon: 'car', color: '#DC2626' },
          { id: 'warba_car_insurance', name: 'شركة وربة - تأمين مركبات', policyNumber: 'WCI2024002', insuranceType: 'car', vehiclePlate: 'د هـ و 456', type: 'insurance', icon: 'car-sport', color: '#F59E0B' },
          { id: 'ahlia_car_insurance', name: 'الأهلية للتأمين - مركبات', policyNumber: 'ACI2024003', insuranceType: 'car', vehiclePlate: 'ز ح ط 789', type: 'insurance', icon: 'shield', color: '#3B82F6' },
          // تأمين سفر
          { id: 'gulf_travel_insurance', name: 'شركة الخليج - تأمين سفر', policyNumber: 'GTI2024001', insuranceType: 'travel', coverage: 'تأمين سفر دولي', type: 'insurance', icon: 'airplane', color: '#059669' },
          { id: 'warba_travel_insurance', name: 'شركة وربة - تأمين سفر', policyNumber: 'WTI2024002', insuranceType: 'travel', coverage: 'تأمين سفر إقليمي', type: 'insurance', icon: 'globe', color: '#8B5CF6' }
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
          { id: 'work_coop_member', name: 'جمعية العمل', memberNumber: '15', totalMembers: 20, commitmentCount: 1, type: 'coop_membership', icon: 'briefcase', color: '#059669' },
          { id: 'family_coop_member', name: 'جمعية العائلة', memberNumber: '8', totalMembers: 12, commitmentCount: 2, type: 'coop_membership', icon: 'home', color: '#DC2626' }
        ];
      
      case 'rent':
        return [
          { id: 'landlord_1', name: 'محمد العلي', phone: '99887766', address: 'الجهراء، قطعة 5', commitmentCount: 1, type: 'landlord', icon: 'person', color: '#10B981' },
          { id: 'property_mgmt_1', name: 'شركة العقارات المتميزة', phone: '22334455', commitmentCount: 3, type: 'property_management', icon: 'business', color: '#059669' }
        ];
      
      case 'utilities':
        return [
          { id: 'mew_acc', name: 'وزارة الكهرباء والماء', accountNumber: 'MEW123456', commitmentCount: 2, type: 'utility_provider', icon: 'flash', color: '#F59E0B' },
          { id: 'qualitynet_acc', name: 'كواليتي نت', accountNumber: 'QN345678', commitmentCount: 1, type: 'utility_provider', icon: 'wifi', color: '#8B5CF6' }
        ];
      
      case 'telecom':
        return [
          { id: 'zain_kw_acc', name: 'زين الكويت', accountNumber: 'ZN99887766', phoneNumber: '99887766', commitmentCount: 2, type: 'telecom_provider', icon: 'call', color: '#E11D48' },
          { id: 'ooredoo_kw_acc', name: 'أوريدو الكويت', accountNumber: 'OR55443322', phoneNumber: '55443322', commitmentCount: 1, type: 'telecom_provider', icon: 'phone-portrait', color: '#DC2626' }
        ];
      
      case 'insurance':
        return [
          { id: 'gulf_health_insurance_acc', name: 'شركة الخليج للتأمين - صحي', policyNumber: 'GHI2024001', insuranceType: 'health', coverage: 'تأمين صحي شامل', commitmentCount: 1, type: 'insurance', icon: 'medical', color: '#EC4899' },
          { id: 'warba_health_insurance_acc', name: 'شركة وربة للتأمين - صحي', policyNumber: 'WHI2024002', insuranceType: 'health', coverage: 'تأمين صحي عائلي', commitmentCount: 2, type: 'insurance', icon: 'heart', color: '#EF4444' },
          { id: 'gulf_car_insurance_acc', name: 'شركة الخليج - تأمين مركبات', policyNumber: 'GCI2024001', insuranceType: 'car', vehiclePlate: 'أ ب ج 123', commitmentCount: 1, type: 'insurance', icon: 'car', color: '#DC2626' },
          { id: 'warba_car_insurance_acc', name: 'شركة وربة - تأمين مركبات', policyNumber: 'WCI2024002', insuranceType: 'car', vehiclePlate: 'د هـ و 456', commitmentCount: 1, type: 'insurance', icon: 'car-sport', color: '#F59E0B' },
          { id: 'gulf_travel_insurance_acc', name: 'شركة الخليج - تأمين سفر', policyNumber: 'GTI2024001', insuranceType: 'travel', coverage: 'تأمين سفر دولي', commitmentCount: 1, type: 'insurance', icon: 'airplane', color: '#059669' }
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
          case 'savings':
            if (!formData.savingsGoal?.trim()) {
              errors.savingsGoal = 'هدف الإدخار مطلوب';
            }
            if (!formData.savingsFrequency?.trim()) {
              errors.savingsFrequency = 'تكرار الإدخار مطلوب';
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



  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      overlayOpacity.setValue(0);

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
                  {(() => { const IconCmp = getIconsaxByName(item.icon); return <IconCmp size={20} color="white" variant={'Bold'} />; })()}
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
                    <TickCircle size={20} color="#059669" variant={'Bold'} />
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
                  {(() => { const IconCmp = getIconsaxByName(entity.icon); return <IconCmp size={20} color="white" variant={'Bold'} />; })()}
                </View>
                
                <View style={styles.institutionInfo}>
                  <Text style={styles.institutionName}>{entity.name}</Text>
                  <Text style={styles.institutionDetail}>
                    {(entity as any).phone && `هاتف: ${(entity as any).phone}`}
                    {(entity as any).accountNumber && `حساب: ${(entity as any).accountNumber}`}
                    {(entity as any).customerNumber && `عميل: ${(entity as any).customerNumber}`}
                    {(entity as any).memberNumber && `عضو: ${(entity as any).memberNumber}`}
                    {(entity as any).phoneNumber && `خط: ${(entity as any).phoneNumber}`}
                    {(entity as any).policyNumber && `بوليصة: ${(entity as any).policyNumber}`}
                    {(entity as any).vehiclePlate && `لوحة: ${(entity as any).vehiclePlate}`}
                    {(entity as any).coverage && `التغطية: ${(entity as any).coverage}`}
                    {(entity as any).serviceType && `خدمة: ${(entity as any).serviceType}`}
                    {(entity as any).address && `عنوان: ${(entity as any).address}`}
                    {(entity as any).totalMembers && `أعضاء: ${(entity as any).totalMembers}`}
                  </Text>
                  <Text style={styles.commitmentCount}>
                    {entity.commitmentCount} التزامات موجودة
                  </Text>
                </View>

                {selectedInstitution?.id === entity.id && (
                  <View style={styles.stepIndicator}>
                    <TickCircle size={20} color="#059669" variant={'Bold'} />
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
              {(() => { const IconCmp = getIconsaxByName(type.icon); return <IconCmp size={24} color="white" variant={'Bold'} />; })()}
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
            </View>
            {selectedType?.id === type.id && (
              <TickCircle size={24} color={type.color} variant={'Bold'} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* isRecurring Toggle for specific commitment types */}
      {selectedType && ['savings', 'rent'].includes(selectedType.id) && (
        <View style={styles.recurringSection}>
          <View style={styles.recurringHeader}>
            <Text style={styles.recurringTitle}>إلتزام شهري دائم</Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                formData.isRecurring && styles.toggleSwitchActive
              ]}
              onPress={() => setFormData({...formData, isRecurring: !formData.isRecurring})}
            >
              <View style={[
                styles.toggleButton,
                formData.isRecurring && styles.toggleButtonActive
              ]} />
            </TouchableOpacity>
          </View>
          {formData.isRecurring && (
            <Text style={styles.recurringDescription}>
              سيتم تكرار هذا الالتزام شهرياً بشكل تلقائي
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const renderDetailsForm = () => (
    <ScrollView 
      style={styles.formContainer}
      showsVerticalScrollIndicator={false}
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
            placeholderTextColor="#6B7280"
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
            placeholderTextColor="#6B7280"
            value={formData.amount || ''}
            onChangeText={(value) => setFormData({...formData, amount: value})}
            keyboardType="decimal-pad"
            textAlign="right"
          />
          {formErrors.amount && (
            <Text style={styles.errorText}>{formErrors.amount}</Text>
          )}
        </View>

        {/* Payment Frequency Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>تكرار الدفع *</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                (formData.paymentFrequency === 'monthly' || !formData.paymentFrequency) && styles.frequencyOptionSelected
              ]}
              onPress={() => setFormData({...formData, paymentFrequency: 'monthly'})}
            >
              <View style={[styles.frequencyIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="calendar" size={16} color="white" />
              </View>
              <Text style={[
                styles.frequencyText,
                (formData.paymentFrequency === 'monthly' || !formData.paymentFrequency) && styles.frequencyTextSelected
              ]}>
                شهري
              </Text>
              {(formData.paymentFrequency === 'monthly' || !formData.paymentFrequency) && (
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyOption,
                formData.paymentFrequency === 'yearly' && styles.frequencyOptionSelected
              ]}
              onPress={() => setFormData({...formData, paymentFrequency: 'yearly'})}
            >
              <View style={[styles.frequencyIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="calendar-outline" size={16} color="white" />
              </View>
              <Text style={[
                styles.frequencyText,
                formData.paymentFrequency === 'yearly' && styles.frequencyTextSelected
              ]}>
                سنوي
              </Text>
              {formData.paymentFrequency === 'yearly' && (
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
              )}
            </TouchableOpacity>
          </View>
          {formErrors.paymentFrequency && (
            <Text style={styles.errorText}>{formErrors.paymentFrequency}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>تاريخ الاستحقاق</Text>
          <TextInput
            style={styles.textInput}
            placeholder="dd/mm/yyyy"
            placeholderTextColor="#6B7280"
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
            placeholderTextColor="#6B7280"
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
              <View style={styles.selectionContainer}>
                {['صديق', 'قريب', 'زميل', 'جار', 'أخ/أخت', 'والد/والدة', 'ابن/ابنة'].map((relationship) => (
                  <TouchableOpacity
                    key={relationship}
                    style={[
                      styles.selectionOption,
                      formData.relationship === relationship && styles.selectionOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, relationship: relationship})}
                  >
                    <Text style={[
                      styles.selectionText,
                      formData.relationship === relationship && styles.selectionTextSelected
                    ]}>
                      {relationship}
                    </Text>
                    {formData.relationship === relationship && (
                      <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.selectionOption,
                    styles.customOption,
                    formData.relationshipCustom && styles.selectionOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, relationship: 'custom', relationshipCustom: ''})}
                >
                  <Ionicons name="create" size={16} color="#6B7280" />
                  <Text style={styles.selectionText}>أخرى</Text>
                </TouchableOpacity>
              </View>
              {formData.relationship === 'custom' && (
                <TextInput
                  style={[styles.textInput, { marginTop: 8 }]}
                  placeholder="اكتب العلاقة..."
                  value={formData.relationshipCustom || ''}
                  onChangeText={(value) => setFormData({...formData, relationshipCustom: value})}
                  textAlign="right"
                />
              )}
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
              <View style={styles.selectionContainer}>
                {['بنك الكويت الوطني', 'البنك التجاري الكويتي', 'بنك الخليج', 'بنك بوبيان', 'البنك الأهلي الكويتي', 'بيت التمويل الكويتي'].map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.selectionOption,
                      formData.bankName === bank && styles.selectionOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, bankName: bank})}
                  >
                    <Text style={[
                      styles.selectionText,
                      formData.bankName === bank && styles.selectionTextSelected
                    ]}>
                      {bank}
                    </Text>
                    {formData.bankName === bank && (
                      <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.selectionOption,
                    styles.customOption,
                    formData.bankNameCustom && styles.selectionOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, bankName: 'custom', bankNameCustom: ''})}
                >
                  <Ionicons name="create" size={16} color="#6B7280" />
                  <Text style={styles.selectionText}>بنك آخر</Text>
                </TouchableOpacity>
              </View>
              {formData.bankName === 'custom' && (
                <TextInput
                  style={[styles.textInput, { marginTop: 8 }]}
                  placeholder="اكتب اسم البنك..."
                  value={formData.bankNameCustom || ''}
                  onChangeText={(value) => setFormData({...formData, bankNameCustom: value})}
                  textAlign="right"
                />
              )}
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
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عنوان الجمعية</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: الجابرية، قطعة 3، شارع 15"
                value={formData.cooperativeAddress || ''}
                onChangeText={(value) => setFormData({...formData, cooperativeAddress: value})}
                textAlign="right"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>موعد الاستلام</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: كل شهر 15، أول كل شهر"
                value={formData.receiptDate || ''}
                onChangeText={(value) => setFormData({...formData, receiptDate: value})}
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
              <View style={styles.selectionContainer}>
                {['كهرباء وماء', 'إنترنت', 'هاتف أرضي', 'غاز', 'صرف صحي', 'تلفزيون مدفوع'].map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.selectionOption,
                      formData.serviceType === service && styles.selectionOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, serviceType: service})}
                  >
                    <Text style={[
                      styles.selectionText,
                      formData.serviceType === service && styles.selectionTextSelected
                    ]}>
                      {service}
                    </Text>
                    {formData.serviceType === service && (
                      <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.selectionOption,
                    styles.customOption,
                    formData.serviceTypeCustom && styles.selectionOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, serviceType: 'custom', serviceTypeCustom: ''})}
                >
                  <Ionicons name="create" size={16} color="#6B7280" />
                  <Text style={styles.selectionText}>خدمة أخرى</Text>
                </TouchableOpacity>
              </View>
              {formData.serviceType === 'custom' && (
                <TextInput
                  style={[styles.textInput, { marginTop: 8 }]}
                  placeholder="اكتب نوع الخدمة..."
                  value={formData.serviceTypeCustom || ''}
                  onChangeText={(value) => setFormData({...formData, serviceTypeCustom: value})}
                  textAlign="right"
                />
              )}
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

      case 'savings':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل برنامج الإدخار</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>هدف الإدخار *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  formErrors.savingsGoal && styles.textInputError
                ]}
                placeholder="مثال: شراء سيارة، السفر، طوارئ"
                value={formData.savingsGoal || ''}
                onChangeText={(value) => setFormData({...formData, savingsGoal: value})}
                textAlign="right"
              />
              {formErrors.savingsGoal && (
                <Text style={styles.errorText}>{formErrors.savingsGoal}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>تكرار الإدخار *</Text>
              <View style={styles.savingsFrequencyGrid}>
                {[
                  { id: 'weekly', name: 'أسبوعياً', icon: 'calendar', color: '#10B981', desc: 'كل أسبوع' },
                  { id: 'monthly', name: 'شهرياً', icon: 'calendar-outline', color: '#3B82F6', desc: 'كل شهر' },
                  { id: 'quarterly', name: 'ربع سنوي', icon: 'time', color: '#F59E0B', desc: 'كل 3 أشهر' },
                  { id: 'semiannual', name: 'نصف سنوي', icon: 'hourglass', color: '#8B5CF6', desc: 'كل 6 أشهر' },
                  { id: 'yearly', name: 'سنوياً', icon: 'timer', color: '#EF4444', desc: 'كل سنة' }
                ].map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.savingsFrequencyCard,
                      formData.savingsFrequency === freq.id && styles.savingsFrequencyCardSelected
                    ]}
                    onPress={() => setFormData({...formData, savingsFrequency: freq.id})}
                  >
                    <View style={[styles.savingsFrequencyIcon, { backgroundColor: freq.color }]}>
                      <Ionicons name={freq.icon as any} size={20} color="white" />
                    </View>
                    <Text style={[
                      styles.savingsFrequencyName,
                      formData.savingsFrequency === freq.id && styles.savingsFrequencyNameSelected
                    ]}>
                      {freq.name}
                    </Text>
                    <Text style={styles.savingsFrequencyDesc}>{freq.desc}</Text>
                    {formData.savingsFrequency === freq.id && (
                      <View style={styles.savingsFrequencyCheckmark}>
                        <Ionicons name="checkmark-circle" size={18} color={freq.color} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {formErrors.savingsFrequency && (
                <Text style={styles.errorText}>{formErrors.savingsFrequency}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>المبلغ المستهدف (اختياري)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.000"
                value={formData.targetAmount || ''}
                onChangeText={(value) => setFormData({...formData, targetAmount: value})}
                keyboardType="decimal-pad"
                textAlign="right"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>تاريخ البداية</Text>
              <TextInput
                style={styles.textInput}
                placeholder="dd/mm/yyyy"
                value={formData.startDate || ''}
                onChangeText={(value) => setFormData({...formData, startDate: value})}
                textAlign="right"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>تاريخ الانتهاء المتوقع (اختياري)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="dd/mm/yyyy"
                value={formData.endDate || ''}
                onChangeText={(value) => setFormData({...formData, endDate: value})}
                textAlign="right"
              />
            </View>
          </>
        );

      case 'insurance':
        return (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>تفاصيل التأمين</Text>
            </View>
            
            {/* اختيار نوع التأمين */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>نوع التأمين *</Text>
              <View style={styles.frequencyContainer}>
                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    (formData.insuranceType === 'health' || !formData.insuranceType) && styles.frequencyOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, insuranceType: 'health'})}
                >
                  <View style={[styles.frequencyIcon, { backgroundColor: '#EC4899' }]}>
                    <Ionicons name="medical" size={16} color="white" />
                  </View>
                  <Text style={[
                    styles.frequencyText,
                    (formData.insuranceType === 'health' || !formData.insuranceType) && styles.frequencyTextSelected
                  ]}>
                    صحي
                  </Text>
                  {(formData.insuranceType === 'health' || !formData.insuranceType) && (
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    formData.insuranceType === 'car' && styles.frequencyOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, insuranceType: 'car'})}
                >
                  <View style={[styles.frequencyIcon, { backgroundColor: '#DC2626' }]}>
                    <Ionicons name="car" size={16} color="white" />
                  </View>
                  <Text style={[
                    styles.frequencyText,
                    formData.insuranceType === 'car' && styles.frequencyTextSelected
                  ]}>
                    سيارة
                  </Text>
                  {formData.insuranceType === 'car' && (
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    formData.insuranceType === 'travel' && styles.frequencyOptionSelected
                  ]}
                  onPress={() => setFormData({...formData, insuranceType: 'travel'})}
                >
                  <View style={[styles.frequencyIcon, { backgroundColor: '#059669' }]}>
                    <Ionicons name="airplane" size={16} color="white" />
                  </View>
                  <Text style={[
                    styles.frequencyText,
                    formData.insuranceType === 'travel' && styles.frequencyTextSelected
                  ]}>
                    سفر
                  </Text>
                  {formData.insuranceType === 'travel' && (
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  )}
                </TouchableOpacity>
              </View>
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
            
            {/* حقول إضافية بناءً على نوع التأمين */}
            {(formData.insuranceType === 'health' || !formData.insuranceType) && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>نوع التغطية</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: شاملة، أساسية، عائلية"
                    value={formData.coverageType || ''}
                    onChangeText={(value) => setFormData({...formData, coverageType: value})}
                    textAlign="right"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>عدد المؤمن عليهم</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: 1، 2، 4"
                    value={formData.insuredCount || ''}
                    onChangeText={(value) => setFormData({...formData, insuredCount: value})}
                    keyboardType="numeric"
                    textAlign="right"
                  />
                </View>
              </>
            )}

            {formData.insuranceType === 'car' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>رقم اللوحة</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: أ ب ج 123"
                    value={formData.vehiclePlate || ''}
                    onChangeText={(value) => setFormData({...formData, vehiclePlate: value})}
                    textAlign="right"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>نوع التأمين</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: شامل، إجباري"
                    value={formData.coverageType || ''}
                    onChangeText={(value) => setFormData({...formData, coverageType: value})}
                    textAlign="right"
                  />
                </View>
              </>
            )}

            {formData.insuranceType === 'travel' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نطاق التأمين</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="مثال: دولي، إقليمي، أوروبي"
                  value={formData.coverageType || ''}
                  onChangeText={(value) => setFormData({...formData, coverageType: value})}
                  textAlign="right"
                />
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>تاريخ انتهاء البوليصة</Text>
              <TextInput
                style={styles.textInput}
                placeholder="dd/mm/yyyy"
                value={formData.expiryDate || ''}
                onChangeText={(value) => setFormData({...formData, expiryDate: value})}
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
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#1E40AF', '#3B82F6']}
              style={styles.headerGradient}
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
          </View>

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
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 6,
    fontFamily: 'Cairo-Bold',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 20,
    fontFamily: 'Cairo-Regular',
    lineHeight: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  typeDescription: {
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 6,
    fontFamily: 'Cairo-Bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
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
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  buttonSecondaryText: {
    fontSize: 14,
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
    fontSize: 14,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-Bold',
  },
  institutionDescription: {
    fontSize: 12,
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
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Cairo-SemiBold',
  },
  selectionDetail: {
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Cairo',
    textAlign: 'right',
    flex: 1,
    lineHeight: 20,
  },
  choiceDescription: {
    fontSize: 12,
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
  // Payment Frequency Styles
  frequencyContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  frequencyOption: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  frequencyOptionSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  frequencyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
    fontFamily: 'Cairo',
  },
  frequencyTextSelected: {
    color: '#059669',
    fontWeight: 'bold',
  },
  // Selection Field Styles
  selectionContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  selectionOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    marginBottom: 8,
  },
  selectionOptionSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  selectionText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  selectionTextSelected: {
    color: '#059669',
    fontWeight: 'bold',
  },
  customOption: {
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
  },
  // Recurring Toggle Styles
  recurringSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recurringHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recurringTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  recurringDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    lineHeight: 18,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#10B981',
  },
  toggleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonActive: {
    transform: [{ translateX: 20 }],
  },
  // Savings Frequency Styles
  savingsFrequencyGrid: {
    gap: 12,
    marginTop: 8,
  },
  savingsFrequencyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  savingsFrequencyCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  savingsFrequencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsFrequencyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  savingsFrequencyNameSelected: {
    color: '#059669',
    fontWeight: 'bold',
  },
  savingsFrequencyDesc: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  savingsFrequencyCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default AddCommitmentModal;
