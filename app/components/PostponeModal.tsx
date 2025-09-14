import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface PostponeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  commitmentData?: {
    name: string;
    institution: string;
    amount: string;
    dueDate: string;
    icon: string;
    color: string;
  };
}

const PostponeModal: React.FC<PostponeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  commitmentData
}) => {
  const [formData, setFormData] = useState({
    postponeType: '', // days, weeks, months
    postponeValue: '',
    newDueDate: '',
    reason: '',
    customReason: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const postponeOptions = [
    { id: 'days', name: 'أيام', icon: 'calendar', color: '#10B981', singular: 'يوم', plural: 'أيام' },
    { id: 'weeks', name: 'أسابيع', icon: 'calendar-outline', color: '#3B82F6', singular: 'أسبوع', plural: 'أسابيع' },
    { id: 'months', name: 'أشهر', icon: 'time', color: '#F59E0B', singular: 'شهر', plural: 'أشهر' },
  ];

  const commonReasons = [
    'ظروف مالية مؤقتة',
    'سفر أو إجازة',
    'تأخير في الراتب',
    'نفقات طارئة',
    'مشاكل بنكية',
    'إعادة جدولة الميزانية',
  ];

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      setFormData({
        postponeType: 'days',
        postponeValue: '',
        newDueDate: '',
        reason: '',
        customReason: '',
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

  const calculateNewDueDate = (type: string, value: string) => {
    if (!type || !value || isNaN(parseInt(value))) return '';
    
    const currentDate = new Date();
    const daysToAdd = type === 'days' ? parseInt(value) : 
                     type === 'weeks' ? parseInt(value) * 7 :
                     type === 'months' ? parseInt(value) * 30 : 0;
    
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate.toLocaleDateString('en-GB');
  };

  useEffect(() => {
    if (formData.postponeType && formData.postponeValue) {
      const newDate = calculateNewDueDate(formData.postponeType, formData.postponeValue);
      setFormData(prev => ({ ...prev, newDueDate: newDate }));
    }
  }, [formData.postponeType, formData.postponeValue]);

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.postponeType?.trim()) {
      errors.postponeType = 'نوع التأجيل مطلوب';
    }
    
    if (!formData.postponeValue?.trim()) {
      errors.postponeValue = 'مدة التأجيل مطلوبة';
    } else if (isNaN(parseInt(formData.postponeValue)) || parseInt(formData.postponeValue) <= 0) {
      errors.postponeValue = 'المدة يجب أن تكون رقماً صحيحاً أكبر من صفر';
    }
    
    if (!formData.reason?.trim()) {
      errors.reason = 'سبب التأجيل مطلوب';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const selectedOption = postponeOptions.find(opt => opt.id === formData.postponeType);
    const periodText = parseInt(formData.postponeValue) === 1 ? 
      selectedOption?.singular : selectedOption?.plural;

    Alert.alert(
      'تأكيد التأجيل',
      `هل تريد تأجيل هذا الالتزام لمدة ${formData.postponeValue} ${periodText}؟\nالتاريخ الجديد: ${formData.newDueDate}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تأكيد', 
          style: 'destructive',
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
        colors={[commitmentData?.color || '#F59E0B', `${commitmentData?.color || '#F59E0B'}CC`]}
        style={styles.summaryCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            <Ionicons name={commitmentData?.icon as any || 'time'} size={20} color="white" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>{commitmentData?.name || 'التزام مالي'}</Text>
            <Text style={styles.summarySubtitle}>{commitmentData?.institution || 'جهة غير محددة'}</Text>
          </View>
        </View>
        
        <View style={styles.summaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المبلغ المستحق:</Text>
            <Text style={styles.summaryValue}>{commitmentData?.amount || '0.000'} د.ك</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>تاريخ الاستحقاق الحالي:</Text>
            <Text style={styles.summaryValue}>{commitmentData?.dueDate || 'غير محدد'}</Text>
          </View>
          {formData.newDueDate && (
            <View style={[styles.summaryRow, styles.newDateRow]}>
              <Text style={styles.summaryLabel}>التاريخ الجديد المقترح:</Text>
              <Text style={[styles.summaryValue, styles.newDateValue]}>{formData.newDueDate}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderPostponeForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>تفاصيل التأجيل</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>نوع التأجيل *</Text>
        <View style={styles.postponeTypeGrid}>
          {postponeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.postponeTypeCard,
                formData.postponeType === option.id && styles.postponeTypeCardSelected
              ]}
              onPress={() => setFormData({...formData, postponeType: option.id})}
            >
              <View style={[styles.postponeTypeIcon, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon as any} size={20} color="white" />
              </View>
              <Text style={[
                styles.postponeTypeText,
                formData.postponeType === option.id && styles.postponeTypeTextSelected
              ]}>
                {option.name}
              </Text>
              {formData.postponeType === option.id && (
                <View style={styles.postponeTypeCheckmark}>
                  <Ionicons name="checkmark-circle" size={16} color={option.color} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {formErrors.postponeType && (
          <Text style={styles.errorText}>{formErrors.postponeType}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          مدة التأجيل *
          {formData.postponeType && ` (${postponeOptions.find(opt => opt.id === formData.postponeType)?.name})`}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            formErrors.postponeValue && styles.textInputError
          ]}
          placeholder={formData.postponeType ? 
            `عدد ${postponeOptions.find(opt => opt.id === formData.postponeType)?.name}` : 
            'اختر نوع التأجيل أولاً'
          }
          placeholderTextColor="#6B7280"
          value={formData.postponeValue}
          onChangeText={(text) => setFormData({...formData, postponeValue: text})}
          keyboardType="numeric"
          textAlign="right"
          editable={!!formData.postponeType}
        />
        {formErrors.postponeValue && (
          <Text style={styles.errorText}>{formErrors.postponeValue}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>سبب التأجيل *</Text>
        <View style={styles.reasonsContainer}>
          {commonReasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonChip,
                formData.reason === reason && styles.reasonChipSelected
              ]}
              onPress={() => setFormData({...formData, reason: reason})}
            >
              <Text style={[
                styles.reasonText,
                formData.reason === reason && styles.reasonTextSelected
              ]}>
                {reason}
              </Text>
              {formData.reason === reason && (
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.reasonChip,
              styles.customReasonChip,
              formData.reason && !commonReasons.includes(formData.reason) && styles.reasonChipSelected
            ]}
            onPress={() => setFormData({...formData, reason: 'custom'})}
          >
            <Ionicons name="create" size={14} color="#6B7280" />
            <Text style={styles.reasonText}>سبب آخر</Text>
          </TouchableOpacity>
        </View>
        
        {formData.reason === 'custom' && (
          <TextInput
            style={[styles.textInput, { marginTop: 8 }]}
            placeholder="اكتب سبب التأجيل..."
            placeholderTextColor="#6B7280"
            value={formData.reason !== 'custom' ? formData.reason : ''}
            onChangeText={(text) => setFormData({...formData, reason: text})}
            textAlign="right"
          />
        )}
        
        {formErrors.reason && (
          <Text style={styles.errorText}>{formErrors.reason}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ملاحظات إضافية</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="أي معلومات إضافية حول سبب التأجيل..."
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
          colors={['#F59E0B', '#FBBF24']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="time" size={20} color="white" />
          <Text style={styles.buttonText}>تأجيل الالتزام</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={handleClose}
      >
        <Ionicons name="close-circle" size={20} color="#6B7280" />
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
              <Text style={styles.headerTitle}>تأجيل الالتزام</Text>
              <Text style={styles.headerSubtitle}>تأجيل موعد الاستحقاق لفترة محددة</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {renderCommitmentSummary()}
            {renderPostponeForm()}
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
  newDateRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
    marginTop: 8,
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
  newDateValue: {
    color: '#FEF3C7',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  postponeTypeGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 12,
  },
  postponeTypeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
  },
  postponeTypeCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  postponeTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  postponeTypeText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
  },
  postponeTypeTextSelected: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  postponeTypeCheckmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  reasonsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  reasonChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  reasonChipSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  customReasonChip: {
    borderStyle: 'dashed',
  },
  reasonText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Cairo-Regular',
  },
  reasonTextSelected: {
    color: '#059669',
    fontWeight: '600',
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
    shadowColor: '#F59E0B',
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

export default PostponeModal;
