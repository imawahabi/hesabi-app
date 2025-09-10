# حسابي - Hisabi
**Arabic Debt Management App for Kuwait Market**

![Hisabi Logo](./assets/icon.png)

## 📱 About (حول التطبيق)

حسابي (Hisabi) is a comprehensive debt management application specifically designed for the Kuwait market. The app features Arabic as the primary language with full RTL support, integrates with local Kuwaiti financial institutions, supports KWD currency, and provides advanced debt tracking features.

**Key Features:**
- 📊 **28 Kuwait-specific debt types** including banks, BNPL, personal debts
- 🏦 **Local bank integration** (NBK, KFH, Burgan, Boubyan, etc.)
- 💰 **KWD currency support** with proper formatting
- 🔒 **Secure & Private** with biometric authentication
- 📱 **Arabic RTL interface** with English fallback
- 📈 **Advanced analytics** and financial insights
- 🔔 **Smart notifications** and payment reminders

## 🛠️ Tech Stack

- **Framework:** React Native with Expo SDK 51+
- **Language:** TypeScript 5.0+ for type safety
- **Backend:** Appwrite (Database, Auth, Storage, Functions, Messaging)
  - Database ID: `hesabi`
  - Project ID: `66d2e8e8000a87d0a79e`
  - 5 Collections: Users, Commitments, Payments, Reminders, Categories
- **State Management:** Redux Toolkit 2.0+
- **Navigation:** React Navigation 6+ with RTL support
- **UI Framework:** React Native Elements + Custom Components
- **Localization:** react-native-localize with Arabic RTL

## 🚀 Getting Started

### Prerequisites

- Node.js 18 LTS or later
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or Android Emulator
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/hisabi.git
   cd hisabi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Appwrite (Required)**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Update with your Appwrite credentials
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=66d2e8e8000a87d0a79e
   APPWRITE_DATABASE_ID=hesabi
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   npm run ios    # For iOS
   npm run android # For Android
   ```

## 📁 Project Structure

```
hisabi/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Buttons, Cards, Inputs
│   │   ├── charts/         # Data visualization
│   │   └── forms/          # Form components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── main/          # Main app screens
│   │   └── onboarding/    # Onboarding flow
│   ├── navigation/         # Navigation configuration
│   ├── services/           # Business logic services
│   │   ├── database/      # Database operations
│   │   ├── calculations/  # Financial calculations
│   │   └── notifications/ # Notification scheduling
│   ├── store/             # State management (Redux)
│   │   ├── slices/        # Redux slices
│   │   └── hooks/         # Custom hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript definitions
│   └── constants/         # App constants
├── assets/                # Static assets
├── docs/                 # Documentation
│   ├── PLANNING.md       # Project planning
│   ├── CLAUDE.md         # Technical guide
│   ├── RPD.md            # Requirements document
│   └── TASKS.md          # Development tasks
└── tests/                # Test files
```

## 🎯 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checking
- `npm run build` - Build for production

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Auto-fix linting errors
```

### Testing

```bash
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏦 Supported Kuwaiti Institutions

### Banks (البنوك)
- NBK (البنك الوطني الكويتي)
- KFH (بيت التمويل الكويتي)
- Burgan Bank (بنك برقان)
- Boubyan Bank (بنك بوبيان)
- Warba Bank (بنك وربة)
- KIB (البنك الكويتي الصناعي)
- Gulf Bank (بنك الخليج)
- CBK (البنك التجاري الكويتي)
- Al-Ahli Bank (البنك الأهلي الكويتي)

### BNPL Providers
- Tabby
- Tamara
- Deema
- Manual entry for others

### Utilities
- MEW (Ministry of Electricity & Water)
- Telecom: Ooredoo, Zain, stc Kuwait

## 🔒 Security & Privacy

- **Local-first storage** with optional cloud sync
- **Biometric authentication** (Face ID/Touch ID)
- **End-to-end encryption** for sensitive data
- **No third-party data sharing**
- **Complete data export/deletion** capabilities

## 🌍 Localization

- **Primary:** Arabic (العربية) with RTL support
- **Secondary:** English (English)
- **Currency:** Kuwaiti Dinar (KWD) with proper formatting
- **Date/Time:** Localized formats

## 📋 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email:** support@hisabi.app
- **Documentation:** [docs.hisabi.app](https://docs.hisabi.app)
- **Issues:** [GitHub Issues](https://github.com/your-org/hisabi/issues)

## 🗺️ Roadmap

- [ ] Project setup and architecture
- [ ] Authentication system
- [ ] Core debt management
- [ ] Payment tracking
- [ ] Dashboard and analytics
- [ ] Notifications system
- [ ] Beta testing
- [ ] App Store release

---

**Made with ❤️ for the Kuwait financial community**
