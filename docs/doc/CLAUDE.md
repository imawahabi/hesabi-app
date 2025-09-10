# CLAUDE.md - Hisabi Project Guide

## Project Overview (نظرة عامة على المشروع)

**حسابي (Hisabi)** is a React Native Expo mobile application for tracking and managing financial commitments (debts, loans, installments). The app is designed specifically for the Kuwait market with Arabic as the primary language and comprehensive debt management features tailored for local financial institutions.

**Tech Stack (المكدس التقني):**
- React Native with Expo SDK (Mobile Cross-Platform)
- TypeScript (Type safety and better DX)
- **Appwrite Cloud** for backend services (Database, Auth, Storage, Functions, Messaging)
  - **Project ID**: `66d2e8e8000a87d0a79e`
  - **Database ID**: `hesabi`
  - **Endpoint**: `https://cloud.appwrite.io/v1`
  - **Collections**: Users, Commitments, Payments, Payment Reminders, Categories
- Redux Toolkit for state management
- React Navigation 6
- Arabic RTL support with i18n
- KWD (Kuwaiti Dinar) as primary currency
- Local and regional payment gateway integration

## Core Principles

### 1. Design Philosophy
- **Minimalist First**: Every UI element must justify its existence
- **Local-First**: Data stored locally by default, cloud sync optional
- **Privacy-Centric**: No unnecessary data collection or third-party sharing
- **Performance**: Sub-2 second launch, <300ms transitions
- **Accessibility**: Full VoiceOver support, WCAG AA compliance

### 2. Code Standards
```typescript
// Use TypeScript with strict typing
interface Commitment {
  id: string;
  type: CommitmentType;
  name: string;
  originalAmount: number;
  currentBalance: number;
  // ... all fields must be typed
}

// Consistent naming conventions
// Components: PascalCase
// Functions: camelCase
// Constants: UPPER_SNAKE_CASE
// Files: kebab-case.tsx
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  monthlyIncome: number;
  currency: string;
  createdAt: Date;
  settings: UserSettings;
}

interface UserSettings {
  notifications: boolean;
  biometric: boolean;
  theme: 'light' | 'dark' | 'auto';
  notificationLeadTime: number; // hours before due date
}
```

### Commitment Model (نموذج الالتزامات)
```typescript
// Kuwait-specific debt types (أنواع الديون الكويتية)
enum CommitmentType {
  // Banking (بنكية)
  BANK_LOAN = 'bank_loan',           // قروض بنكية
  CREDIT_CARD = 'credit_card',       // بطاقات ائتمانية
  
  // Personal (شخصية)
  PERSONAL_DEBT = 'personal_debt',   // ديون شخصية
  FAMILY_DEBT = 'family_debt',       // دين عائلي
  FRIEND_DEBT = 'friend_debt',       // دين صديق
  GUARANTOR_DEBT = 'guarantor_debt', // دين كفيل/ضامن
  
  // Local Financing (تمويل محلي)
  SAVINGS_ASSOCIATION = 'savings_association', // جمعيات ادخار
  FINANCING_COMPANY = 'financing_company',     // شركات تمويل
  
  // BNPL (أقساط بدون فوائد)
  TABBY = 'tabby',
  TAMARA = 'tamara',
  DEEMA = 'deema',
  BNPL_OTHER = 'bnpl_other',
  
  // Installments (تقسيط)
  ELECTRONICS = 'electronics',       // إلكترونيات
  FURNITURE = 'furniture',           // أثاث
  MEDICAL = 'medical',               // طبي
  GENERAL_STORE = 'general_store',   // متجر عام
  
  // Bills (فواتير)
  UTILITY_BILL = 'utility_bill',     // فواتير مرافق
  TELECOM_BILL = 'telecom_bill',     // فواتير اتصالات
  RENT = 'rent',                     // إيجار
  EDUCATION = 'education',           // تعليم
  INSURANCE = 'insurance',           // تأمين
  SUBSCRIPTION = 'subscription',     // اشتراكات
  
  // Salary Related (متعلق بالراتب)
  SALARY_ADVANCE = 'salary_advance', // سلفة راتب
  SALARY_DEDUCTION = 'salary_deduction', // اقتطاع راتب
  
  // Medical (طبي)
  HOSPITAL_INSTALLMENT = 'hospital_installment', // أقساط مستشفى
  CLINIC_PAYMENT = 'clinic_payment',             // دفعات عيادة
  
  CUSTOM = 'custom'                  // مخصص
}

// Kuwaiti Banks (البنوك الكويتية)
enum KuwaitiBanks {
  NBK = 'nbk',           // البنك الوطني الكويتي
  KFH = 'kfh',           // بيت التمويل الكويتي
  BURGAN = 'burgan',     // بنك برقان
  BOUBYAN = 'boubyan',   // بنك بوبيان
  WARBA = 'warba',       // بنك وربة
  KIB = 'kib',           // البنك الكويتي الصناعي
  GULF_BANK = 'gulf_bank', // بنك الخليج
  CBK = 'cbk',           // البنك التجاري الكويتي
  AL_AHLI = 'al_ahli',   // البنك الأهلي الكويتي
}

// Loan Types (أنواع القروض)
enum LoanTypes {
  HOUSING = 'housing',           // قرض إسكان
  CONSUMER = 'consumer',         // قرض استهلاكي
  CAR = 'car',                   // قرض سيارة
  SECURED = 'secured',           // قرض بضمان وديعة
  COMMERCIAL = 'commercial',     // قرض تجاري
  AGRICULTURAL = 'agricultural', // قرض زراعي
  ISLAMIC_FINANCING = 'islamic_financing' // تمويل إسلامي
}

interface Commitment {
  id: string;
  userId: string;
  type: CommitmentType;
  name: string;
  nameAr?: string;              // Arabic name
  originalAmount: number;
  currentBalance: number;
  currency: string;             // Default: 'KWD'
  interestRate?: number;        // Annual percentage (for bank loans)
  startDate: Date;
  endDate?: Date;
  paymentSchedule: PaymentSchedule;
  status: 'draft' | 'active' | 'overdue' | 'paid' | 'delinquent' | 'disputed';
  
  // Kuwait-specific fields
  institution?: KuwaitiBanks | string;  // Bank or institution
  loanType?: LoanTypes;                 // For bank loans
  personName?: string;                  // For personal debts
  guarantorName?: string;               // For guarantor debts
  associationName?: string;             // For savings associations
  storeDetails?: {
    name: string;
    address?: string;
    branch?: string;
  };
  
  // Nested debt support (دعم الديون المتداخلة)
  parentDebtId?: string;        // Parent debt ID for nested debts
  childDebts?: string[];        // Array of child debt IDs
  
  // Settlement & refinancing (تسوية وإعادة تمويل)
  settledByDebtId?: string;     // If settled by another debt
  refinancedFromDebtId?: string; // If this debt refinanced another
  
  metadata: Record<string, any>; // Type-specific fields
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  dayOfMonth?: number;
  amount: number;
  nextDueDate: Date;
}
```

### Payment Model
```typescript
interface Payment {
  id: string;
  commitmentId: string;
  amount: number;
  date: Date;
  method?: string;
  notes?: string;
  receiptUrl?: string;
  isLate: boolean;
}
```

## UI/UX Guidelines

### Color Palette
```typescript
const colors = {
  primary: '#4A90E2',    // Soft blue - primary actions
  success: '#4CD964',    // Mint green - positive states
  warning: '#FF9500',    // Warm amber - attention needed
  danger: '#FF3B30',     // Soft red - overdue/critical
  background: '#FAFAFA', // Off-white - main background
  surface: '#FFFFFF',    // Pure white - cards/surfaces
  text: {
    primary: '#2C3E50',   // Dark gray - main text
    secondary: '#7F8C8D', // Medium gray - secondary text
    light: '#BDC3C7'      // Light gray - disabled/hints
  }
};
```

### Component Patterns
```tsx
// All interactive components should have:
// 1. Haptic feedback
// 2. Loading states
// 3. Error states
// 4. Accessibility labels

// Example component structure:
const CommitmentCard: React.FC<Props> = ({ commitment, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(commitment);
      }}
      accessible={true}
      accessibilityLabel={`${commitment.name}, balance ${commitment.currentBalance}`}
      accessibilityRole="button"
    >
      {/* Card content */}
    </TouchableOpacity>
  );
};
```

### Screen Structure
```
- SafeAreaView
  - KeyboardAvoidingView (when needed)
    - ScrollView/FlatList
      - Content with consistent padding (16px)
```

## Key Features Implementation

### 1. Dashboard Screen
- Display total outstanding balance prominently
- Show debt-to-income ratio as visual indicator
- List upcoming payments (next 7 days)
- Quick action buttons for adding payment/commitment
- Pull-to-refresh functionality

### 2. Add Commitment Flow
```typescript
// Step-by-step wizard approach
const steps = [
  'SelectType',      // Choose commitment type
  'BasicDetails',    // Name, amount, dates
  'PaymentSchedule', // Frequency, amounts
  'Review'          // Confirm all details
];

// Each step validates before proceeding
// Auto-save draft in case of interruption
```

### 3. Payment Recording
```typescript
// Quick payment with smart defaults
interface QuickPaymentProps {
  commitment: Commitment;
  suggestedAmount: number; // Based on payment schedule
  onComplete: (payment: Payment) => void;
}

// Support partial payments
// Validate against overpayment
// Update balance immediately (optimistic update)
```

### 4. Notifications System
```typescript
// Notification scheduling via Appwrite Messaging
const schedulePaymentReminder = async (commitment: Commitment) => {
  const appwrite = AppwriteService.getInstance();
  const reminderDate = new Date(commitment.paymentSchedule.nextDueDate);
  reminderDate.setHours(reminderDate.getHours() - user.settings.notificationLeadTime);
  
  // Create reminder document
  await appwrite.getDatabases().createDocument(
    'hesabi',
    'payment_reminders',
    'unique()',
    {
      commitmentId: commitment.id,
      userId: commitment.userId,
      reminderDate: reminderDate.toISOString(),
      reminderType: 'push',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  );
  
  // Send via Appwrite Function (scheduled)
  await appwrite.executeFunction('payment-reminder-function', {
    commitmentId: commitment.id,
    scheduledDate: reminderDate.toISOString(),
    message: `${commitment.name} payment of ${formatCurrency(commitment.paymentSchedule.amount)} is due`
  });
};
```

## Appwrite Database Schema

### Collections Overview
- **Database ID**: `hesabi`
- **Project ID**: `66d2e8e8000a87d0a79e`
- **Collections**: 5 main collections with proper indexing

```typescript
// Appwrite Database Collections
interface AppwriteCollections {
  USERS: 'users';
  COMMITMENTS: 'commitments'; 
  PAYMENTS: 'payments';
  PAYMENT_REMINDERS: 'payment_reminders';
  CATEGORIES: 'categories';
}

// Collection schemas defined in AppwriteDatabase.ts
// - Users: Profile, income, settings, biometric preferences
// - Commitments: All debt types, payment schedules, status tracking
// - Payments: Transaction history, receipts, payment methods
// - Payment_Reminders: Notification scheduling and tracking
// - Categories: Debt categorization with Arabic/English names
```

## State Management Structure

```typescript
// Redux Toolkit slice example
interface AppState {
  user: {
    profile: User | null;
    isLoading: boolean;
    error: string | null;
  };
  commitments: {
    items: Commitment[];
    isLoading: boolean;
    error: string | null;
    filter: CommitmentType | 'all';
  };
  payments: {
    items: Record<string, Payment[]>; // Grouped by commitmentId
    isLoading: boolean;
    error: string | null;
  };
  ui: {
    activeScreen: string;
    isOnboarding: boolean;
    refreshing: boolean;
  };
}
```

## Navigation Structure

```typescript
// Navigation hierarchy
const NavigationStructure = {
  Root: {
    Auth: {
      Login: {},
      Register: {},
      ForgotPassword: {}
    },
    Main: {
      Tabs: {
        Dashboard: {},
        Commitments: {
          List: {},
          Detail: {},
          Edit: {}
        },
        Analytics: {},
        Settings: {}
      },
      Modals: {
        AddCommitment: {}, // Multi-step wizard
        RecordPayment: {},
        FilterOptions: {}
      }
    },
    Onboarding: {} // First-time user flow
  }
};
```

## Testing Approach

```typescript
// Test file naming: ComponentName.test.tsx

// Critical test cases:
// 1. Payment calculations with interest
// 2. Date calculations for schedules
// 3. Balance updates after payments
// 4. Notification scheduling logic
// 5. Data validation and sanitization

// Example test structure:
describe('PaymentCalculator', () => {
  it('should calculate correct interest for annual rate', () => {
    // Test implementation
  });
  
  it('should handle partial payments correctly', () => {
    // Test implementation
  });
});
```

## Performance Optimizations

1. **List Rendering**: Use FlatList with getItemLayout for fixed heights
2. **Images**: Lazy load receipt images, compress before upload
3. **Animations**: Use native driver, limit to 60fps
4. **Data**: Paginate large lists, implement virtual scrolling
5. **Storage**: Regular cleanup of completed commitments (archive)

## Error Handling

```typescript
// Consistent error handling pattern
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

// User-friendly error messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Can't connect right now. Your data is safe offline.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PAYMENT_OVERDRAFT: "Payment amount exceeds remaining balance.",
  // ... more messages
};
```

## Appwrite Backend Setup Instructions

### 1. Environment Configuration
Create `.env` file in project root:
```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=66d2e8e8000a87d0a79e
APPWRITE_DATABASE_ID=hesabi

# Optional: API Keys for messaging services
APPWRITE_API_KEY_MESSAGING=your_messaging_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
```

### 2. Database Setup
All collections and schemas are defined in `src/services/database/AppwriteDatabase.ts`:
- **Users**: User profiles, settings, biometric preferences
- **Commitments**: All debt types with Kuwaiti banking support
- **Payments**: Transaction history and receipt storage
- **Payment_Reminders**: Notification scheduling
- **Categories**: Arabic/English debt categorization

### 3. Authentication Setup
Configure in Appwrite Console:
- Enable Email/Password authentication
- Set up OAuth providers (optional)
- Configure password policies
- Enable account verification

### 4. Storage Configuration
Create storage buckets:
- `receipts` - For payment receipt uploads
- `profiles` - For user profile images
- `documents` - For commitment-related documents

### 5. Functions Setup
Deploy Appwrite Functions for:
- `payment-reminder-function` - Scheduled payment notifications
- `analytics-function` - Generate financial insights
- `backup-function` - Data backup and sync

### 6. Messaging Configuration
Configure messaging providers in Appwrite Console:
- **SMS**: Twilio integration for payment reminders
- **Push**: Native push notifications
- **Email**: SendGrid for statements and reports

## Security Checklist

- [x] Appwrite authentication with secure token management
- [x] Document-level permissions in Appwrite collections
- [x] Encrypted storage for sensitive user data
- [ ] Biometric authentication implemented
- [ ] Input validation on all forms
- [x] Secure API communication via HTTPS
- [ ] No sensitive data in logs
- [x] Role-based access control in Appwrite
- [ ] Regular dependency updates
- [ ] Code obfuscation for production builds

## Common Code Patterns

### Currency Formatting
```typescript
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
```

### Date Handling
```typescript
import { format, addMonths, differenceInDays } from 'date-fns';

const getNextPaymentDate = (schedule: PaymentSchedule): Date => {
  // Implementation based on frequency
};

const isOverdue = (dueDate: Date): boolean => {
  return differenceInDays(new Date(), dueDate) > 0;
};
```

### Async Storage Wrapper
```typescript
class StorageService {
  static async getSecure(key: string): Promise<any> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  }
  
  static async setSecure(key: string, value: any): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
}
```

## Development Workflow

1. **Branch Naming**: `feature/`, `bugfix/`, `hotfix/`
2. **Commit Messages**: Conventional commits (feat:, fix:, docs:)
3. **Code Review**: All PRs require review before merge
4. **Testing**: Minimum 80% coverage for business logic
5. **Documentation**: Update this file for architectural changes

## Deployment Notes

### iOS Specific
- Configure Info.plist for Face ID usage description
- Set up push notification certificates
- Configure app transport security for API calls
- Test on multiple iPhone sizes (SE to Pro Max)

### Expo Configuration
```json
{
  "expo": {
    "name": "Hisabi",
    "slug": "hisabi",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourcompany.hisabi",
      "buildNumber": "1",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Secure your financial data with Face ID"
      }
    }
  }
}
```

## Quick Reference

### Priority Order for Features
1. Core commitment CRUD operations
2. Payment recording and tracking
3. Dashboard with key metrics
4. Basic notifications
5. Analytics and insights
6. Cloud sync
7. Advanced features

### Known Constraints
- iOS only initially (no Android support in v1)
- Offline-first (network features secondary)
- Local notifications only (no push initially)
- English language only in MVP

### Support & Resources
- React Native Expo docs: https://docs.expo.dev
- UI inspiration: Minimal finance apps (Mint, Clarity Money)
- Icons: Expo Vector Icons (Ionicons preferred)
- Testing: Jest + React Native Testing Library

---

**Remember**: When in doubt, choose simplicity and user privacy. This is a trust-based application handling sensitive financial data.