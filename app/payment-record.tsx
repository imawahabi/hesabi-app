// removed unused Ionicons import
import {
  Money,
  Card as CardIcon,
  DocumentText,
  Mobile,
  Car,
  TickCircle,
  CloseCircle,
} from 'iconsax-react-nativejs';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SubPageHeader from './components/SubPageHeader';

const { width } = Dimensions.get('window');

const PaymentRecordScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    method: '',
    reference: '',
    notes: '',
  });

  const paymentMethods = [
    { id: 'cash', name: 'نقداً', icon: 'cash' },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: 'card' },
    { id: 'check', name: 'شيك', icon: 'document' },
    { id: 'online', name: 'دفع إلكتروني', icon: 'phone-portrait' },
  ];

  const handleSubmit = () => {
    if (!formData.amount || !formData.date || !formData.method) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
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
            // هنا سيتم حفظ البيانات
            Alert.alert('نجح', 'تم تسجيل الدفعة بنجاح', [
              { text: 'موافق', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const renderPaymentForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>تفاصيل الدفعة</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>مبلغ الدفعة (د.ك) *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="0.000"
          placeholderTextColor="#6B7280"
          value={formData.amount}
          onChangeText={(text) => setFormData({...formData, amount: text})}
          keyboardType="numeric"
          textAlign="right"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>تاريخ الدفعة *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#6B7280"
          value={formData.date}
          onChangeText={(text) => setFormData({...formData, date: text})}
          textAlign="right"
        />
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
              {(() => {
                const color = formData.method === method.id ? '#3B82F6' : '#6B7280';
                const variant = formData.method === method.id ? 'Bold' : 'Outline';
                const IconCmp =
                  method.icon === 'cash' ? Money :
                  method.icon === 'card' ? CardIcon :
                  method.icon === 'document' ? DocumentText :
                  method.icon === 'phone-portrait' ? Mobile : Money;
                return <IconCmp size={24} color={color} variant={variant as any} />;
              })()}
              <Text style={[
                styles.methodText,
                formData.method === method.id && styles.methodTextSelected
              ]}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>رقم المرجع</Text>
        <TextInput
          style={styles.textInput}
          placeholder="رقم الشيك أو المرجع"
          placeholderTextColor="#6B7280"
          value={formData.reference}
          onChangeText={(text) => setFormData({...formData, reference: text})}
          textAlign="right"
        />
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

  const renderCommitmentSummary = () => (
    <View style={styles.summarySection}>
      <LinearGradient
        colors={['#10B981', '#10B981CC']}
        style={styles.summaryCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            <Car size={20} color="white" variant="Bold" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>قسط السيارة</Text>
            <Text style={styles.summarySubtitle}>الغانم أوتو</Text>
          </View>
        </View>
        
        <View style={styles.summaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>القسط الشهري:</Text>
            <Text style={styles.summaryValue}>250.000 د.ك</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المبلغ المتبقي:</Text>
            <Text style={styles.summaryValue}>11,250.000 د.ك</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>الأقساط المتبقية:</Text>
            <Text style={styles.summaryValue}>45 قسط</Text>
          </View>
        </View>
      </LinearGradient>
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
          <TickCircle size={20} color="white" variant="Bold" />
          <Text style={styles.buttonText}>تسجيل الدفعة</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.back()}
      >
        <CloseCircle size={20} color="#6B7280" variant="Bold" />
        <Text style={[styles.buttonText, { color: '#6B7280' }]}>إلغاء</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SubPageHeader 
        title="تسجيل دفعة"
        subtitle="إضافة دفعة جديدة للالتزام"
        scrollY={scrollY}
      />
      
      <Animated.ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderCommitmentSummary()}
        {renderPaymentForm()}
        {renderActionButtons()}
        
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  methodsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  methodCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  methodText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  methodTextSelected: {
    color: '#3B82F6',
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
    height: 100,
  },
});

export default PaymentRecordScreen;
