import { Ionicons } from '@expo/vector-icons';
import {
  Money,
  Mobile,
  Card as CardIcon,
  More,
  Car,
  TickCircle,
  CloseCircle,
} from 'iconsax-react-nativejs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PaymentRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  commitmentData?: {
    name: string;
    institution: string;
    amount: string;
    remainingAmount: string;
    remainingInstallments: number;
    icon: string;
    color: string;
  };
}

const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  visible,
  onClose,
  onSubmit,
  commitmentData
}) => {
  const getIconsaxByName = (name: string): React.ComponentType<any> => {
    switch (name) {
      case 'cash': return Money;
      case 'phone-portrait': return Mobile;
      case 'card': return CardIcon;
      case 'ellipsis-horizontal': return More;
      case 'car': return Car;
      default: return CardIcon;
    }
  };
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    method: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const paymentMethods = [
    { id: 'cash', name: 'نقداً', icon: 'cash', color: '#10B981' },
    { id: 'wamda_link', name: 'تحويل ومض / رابط', icon: 'phone-portrait', color: '#8B5CF6' },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: 'card', color: '#3B82F6' },
    { id: 'other', name: 'اخرى', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      setFormData({
        amount: '',
        date: new Date().toLocaleDateString('en-GB'), // Default to today
        method: '',
        notes: '',
      });
      setFormErrors({});

      // Animation
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
  }, [visible, slideAnim, overlayOpacity]);

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.amount?.trim()) {
      errors.amount = 'مبلغ الدفعة مطلوب';
    } else if (isNaN(parseFloat(formData.amount))) {
      errors.amount = 'المبلغ يجب أن يكون رقماً صحيحاً';
    }
    
    if (!formData.date?.trim()) {
      errors.date = 'تاريخ الدفعة مطلوب';
    }
    
    if (!formData.method?.trim()) {
      errors.method = 'طريقة الدفع مطلوبة';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'تأكيد الدفعة',
      `هل تريد تسجيل دفعة بمبلغ ${formData.amount} د.ك؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تأكيد', 
          onPress: () => {
            onSubmit(formData);
            handleClose();
          }
        }
      ]
    );
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const renderCommitmentSummary = () => (
    <View style={styles.summarySection}>
      <LinearGradient
        colors={[commitmentData?.color || '#10B981', `${commitmentData?.color || '#10B981'}CC`]}
        style={styles.summaryCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            {(() => { const IconCmp = getIconsaxByName(commitmentData?.icon || 'card'); return <IconCmp size={20} color="white" variant={'Bold'} />; })()}
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>{commitmentData?.name || 'التزام مالي'}</Text>
            <Text style={styles.summarySubtitle}>{commitmentData?.institution || 'جهة غير محددة'}</Text>
          </View>
        </View>
        
        <View style={styles.summaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>القسط الشهري:</Text>
            <Text style={styles.summaryValue}>{commitmentData?.amount || '0.000'} د.ك</Text>
          </View>
          {commitmentData?.remainingAmount && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>المبلغ المتبقي:</Text>
              <Text style={styles.summaryValue}>{commitmentData.remainingAmount} د.ك</Text>
            </View>
          )}
          {commitmentData?.remainingInstallments && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>الأقساط المتبقية:</Text>
              <Text style={styles.summaryValue}>{commitmentData.remainingInstallments} قسط</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderPaymentForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>تفاصيل الدفعة</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>مبلغ الدفعة (د.ك) *</Text>
        <TextInput
          style={[
            styles.textInput,
            formErrors.amount && styles.textInputError
          ]}
          placeholder="0.000"
          placeholderTextColor="#6B7280"
          value={formData.amount}
          onChangeText={(text) => setFormData({...formData, amount: text})}
          keyboardType="decimal-pad"
          textAlign="right"
        />
        {formErrors.amount && (
          <Text style={styles.errorText}>{formErrors.amount}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>تاريخ الدفعة *</Text>
        <TextInput
          style={[
            styles.textInput,
            formErrors.date && styles.textInputError
          ]}
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#6B7280"
          value={formData.date}
          onChangeText={(text) => setFormData({...formData, date: text})}
          textAlign="right"
        />
        {formErrors.date && (
          <Text style={styles.errorText}>{formErrors.date}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>طريقة الدفع *</Text>
        <View style={styles.methodsGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                formData.method === method.id && styles.methodCardSelected
              ]}
              onPress={() => setFormData({...formData, method: method.id})}
            >
              <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                {(() => { const IconCmp = getIconsaxByName(method.icon); return <IconCmp size={20} color="white" variant={'Bold'} />; })()}
              </View>
              <Text style={[
                styles.methodText,
                formData.method === method.id && styles.methodTextSelected
              ]}>
                {method.name}
              </Text>
              {formData.method === method.id && (
                <View style={styles.methodCheckmark}>
                  <TickCircle size={16} color={method.color} variant={'Bold'} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {formErrors.method && (
          <Text style={styles.errorText}>{formErrors.method}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ملاحظات</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="ملاحظات إضافية..."
          placeholderTextColor="#6B7280"
          value={formData.notes}
          onChangeText={(text) => setFormData({...formData, notes: text})}
          multiline
          numberOfLines={3}
          textAlign="right"
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleSubmit}
      >
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TickCircle size={20} color="white" variant={'Bold'} />
          <Text style={styles.buttonText}>تسجيل الدفعة</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={handleClose}
      >
        <CloseCircle size={20} color="#6B7280" variant={'Bold'} />
        <Text style={[styles.buttonText, { color: '#6B7280' }]}>إلغاء</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                })
              }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>تسجيل دفعة</Text>
              <Text style={styles.headerSubtitle}>إضافة دفعة جديدة للالتزام</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {renderCommitmentSummary()}
            {renderPaymentForm()}
            {renderActionButtons()}
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  summaryDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Cairo-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  formSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Cairo-Bold',
    textAlign: 'right',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'right',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'white',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
  },
  textInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: 'Cairo-Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  methodsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  methodCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    minHeight: 100,
    justifyContent: 'center',
  },
  methodCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  methodTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  methodCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Cairo-Bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default PaymentRecordModal;
