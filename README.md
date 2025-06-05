# Rendezvous Mobile App

> **The dating app that skips the small talk and gets straight to real meetings.**

## 🎯 App Concept

Rendezvous is a revolutionary dating application that eliminates endless chatting and focuses on facilitating real-world connections. The app encourages users to move quickly from digital matching to in-person dates through:

- **Visual-First Discovery**: Browse profiles through photo-centric interface
- **Interest-Based Matching**: Advanced compatibility scoring based on shared interests
- **Direct Date Coordination**: No chat feature - users coordinate meetings through structured preferences
- **Location-Centric**: Find matches and plan dates within preferred areas
- **Immediate Action**: Focus on "when and where" rather than "what to say"

## 🛠️ Technologies Used

- **Framework**: Expo SDK 53 with React Native 0.79
- **Language**: TypeScript for type safety and better development experience
- **State Management**: Redux Toolkit with React Redux for predictable state updates
- **Navigation**: Expo Router for file-based routing system
- **UI Framework**: React Native Paper + custom styled components
- **HTTP Client**: Axios for API communication with interceptors
- **Location Services**: Expo Location for geolocation and proximity features
- **Storage**: AsyncStorage for offline data persistence
- **Gestures**: React Native Gesture Handler for swipe interactions

## ✨ Core Features

### Profile Management
- **Photo Upload**: Up to 6 photos per profile with optimized compression
- **Interest Selection**: Category-based interests for compatibility matching
- **Location Preferences**: Set discovery radius and preferred date areas
- **Profile Verification**: Optional verification badges for authenticity

### Discovery & Matching
- **Swipeable Cards**: Tinder-like interface for browsing potential matches
- **Interest Compatibility**: Real-time compatibility scoring display
- **Location-Based Discovery**: Find matches within specified radius
- **Mutual Matching**: Both users must express interest to create a match

### Date Coordination (NO CHAT)
- **Time Preferences**: Specify available time slots and preferred days
- **Venue Selection**: Choose from categorized venue types (coffee, dinner, activities)
- **Location Coordination**: Share preferred areas for meeting up
- **Confirmation System**: Both parties must agree before personal details are shared
- **Safety Features**: Public venue suggestions and safety guidelines

### User Experience
- **Onboarding Flow**: Guided profile creation with tips and examples
- **Push Notifications**: Match notifications and date coordination updates
- **Offline Support**: Core functionality available without internet connection
- **Accessibility**: Full VoiceOver and TalkBack support

## 📁 Project Structure

```
rendezvous-app/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Landing/welcome screen
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx         # Tab layout configuration
│   │   ├── dashboard.tsx       # Main dashboard with matches
│   │   ├── matches.tsx         # Active matches and date coordination
│   │   └── profile.tsx         # User profile management
│   ├── auth/                    # Authentication flow
│   │   ├── index.tsx           # Auth landing
│   │   ├── login.tsx          # Login screen
│   │   └── register.tsx       # Registration flow
│   └── dashboard/               # Dashboard sub-screens
├── components/                   # Reusable UI components
│   ├── auth/                    # Authentication components
│   ├── common/                  # Shared UI elements
│   │   ├── Button.tsx          # Custom button component
│   │   └── Input.tsx           # Custom input component
│   ├── dashboard/               # Dashboard-specific components
│   ├── date/                    # Date coordination components
│   ├── discovery/               # Match discovery components
│   │   ├── DiscoverySettingsModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── MatchModal.tsx
│   │   └── SwipeableCard.tsx   # Core swipe card component
│   └── profile/                 # Profile management components
├── config/                      # Environment configurations
│   └── development.ts          # Development environment settings
├── constants/                   # App-wide constants
│   ├── Colors.ts               # Color palette and themes
│   └── Layout.ts               # Layout dimensions and spacing
├── hooks/                       # Custom React hooks
├── services/                    # API service layer
│   ├── api.ts                  # Base API configuration
│   ├── authService.ts          # Authentication API calls
│   ├── dateService.ts          # Date coordination API
│   ├── discoveryService.ts     # Match discovery API
│   ├── interestService.ts      # Interest management API
│   ├── locationService.ts      # Location services
│   └── index.ts                # Service exports
├── store/                       # Redux state management
│   ├── index.ts                # Store configuration
│   ├── auth/                   # Authentication state
│   └── date/                   # Date coordination state
├── types/                       # TypeScript type definitions
│   └── index.ts                # Shared type definitions
└── utils/                       # Utility functions
```

### Key Architectural Decisions

- **File-Based Routing**: Expo Router provides intuitive navigation structure
- **Component Organization**: Feature-based component grouping for maintainability
- **Service Layer**: Clean separation between UI and API communication
- **Type Safety**: Comprehensive TypeScript coverage for better development experience
- **State Management**: Redux Toolkit for predictable state updates with persistence

## Development Setup

### Prerequisites

- Node.js 16+ 
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Testing on Physical Devices

When testing on physical iOS/Android devices, the app needs to connect to your backend server. Since physical devices can't access `localhost`, you need to configure your computer's IP address:

#### Option 1: Automatic IP Detection (Recommended)
The app will try to automatically detect your computer's IP address from the Expo development server.

#### Option 2: Manual IP Configuration
1. Find your computer's IP address:
   ```bash
   ./scripts/find-ip.sh
   ```
   Or manually:
   - **macOS/Linux**: Run `ifconfig` and look for `inet` under `en0`
   - **Windows**: Run `ipconfig` and look for `IPv4 Address`

2. Update the configuration in `config/development.ts`:
   ```typescript
   export const DEVELOPMENT_CONFIG = {
     COMPUTER_IP: '192.168.1.100', // Replace with your actual IP
     API_PORT: 5166,
     DEBUG_API: true,
   };
   ```

3. Restart the Expo development server

#### Troubleshooting Network Issues
- Make sure your backend server is running and accessible on your network
- Ensure your phone and computer are on the same WiFi network
- Check if your firewall is blocking the connection
- The app will show the API URL in the console for debugging

## Getting Started

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Physical device with Expo Go app (recommended for testing)

### Installation

1. **Clone and navigate to the frontend directory**
   ```bash
   git clone <repository-url>
   cd Rendezvous/rendezvous-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on specific platforms**
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web browser
   ```

### Environment Configuration

Create environment-specific configuration files:

```typescript
// config/development.ts
export const config = {
  API_BASE_URL: 'http://localhost:5000/api',
  EXPO_PUBLIC_API_URL: 'http://localhost:5000/api',
  DEBUG_MODE: true,
  LOCATION_ACCURACY: 'high'
};
```

## 📱 User Experience Flow

### 1. Onboarding
- **Welcome Screen**: App introduction and value proposition
- **Registration**: Email/password with validation
- **Profile Setup**: Photo upload (minimum 2, maximum 6)
- **Interest Selection**: Choose from categorized interests
- **Location Permission**: Enable location services for discovery

### 2. Discovery Phase
- **Swipe Interface**: Card-based browsing of potential matches
- **Profile Details**: Expandable cards showing photos and interests
- **Compatibility Score**: Visual indicator of interest alignment
- **Like/Pass Actions**: Simple binary decision making

### 3. Matching & Coordination
- **Match Notification**: Immediate notification when mutual interest occurs
- **Date Preferences**: Time availability and preferred venue types
- **Location Selection**: Preferred areas for meeting within user's radius
- **Confirmation**: Both users must agree on all details before contact info is shared

### 4. Pre-Date
- **Meeting Details**: Confirmed time, place, and contact information
- **Safety Reminders**: Public venue recommendations and safety tips
- **Date Feedback**: Post-date rating and feedback system

## 🔧 API Integration

### Authentication Flow
```typescript
// services/authService.ts
export const authService = {
  register: (userData: RegisterRequest) => api.post('/auth/register', userData),
  login: (credentials: LoginRequest) => api.post('/auth/login', credentials),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout')
};
```

### Discovery Service
```typescript
// services/discoveryService.ts
export const discoveryService = {
  getProfiles: (filters: DiscoveryFilters) => api.get('/discovery', { params: filters }),
  likeProfile: (userId: number) => api.post('/discovery/like', { userId }),
  passProfile: (userId: number) => api.post('/discovery/pass', { userId }),
  getMatches: () => api.get('/matches')
};
```

### Location Integration
```typescript
// services/locationService.ts
export const locationService = {
  getCurrentLocation: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Location permission denied');
    
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
  },
  searchVenues: (location: Coordinates, type: VenueType) => 
    api.get('/venues/search', { params: { location, type } })
};
```

## 🎨 UI/UX Guidelines

### Design System
- **Colors**: Material Design 3 color system with custom dating app palette
- **Typography**: Consistent text styles with accessibility considerations
- **Spacing**: 8dp grid system for consistent layouts
- **Components**: Reusable components following React Native Paper patterns

### Accessibility
- **Screen Readers**: Full VoiceOver/TalkBack support
- **Color Contrast**: WCAG AA compliance for all text
- **Touch Targets**: Minimum 44dp touch targets
- **Navigation**: Keyboard navigation support

### Performance
- **Image Optimization**: Automatic compression and caching
- **Lazy Loading**: Components load as needed
- **Memory Management**: Proper cleanup of listeners and timers
- **Bundle Size**: Code splitting for optimal loading

## 🧪 Testing Strategy

### Unit Testing
```bash
npm test                  # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # Coverage report
```

### Component Testing
```typescript
// __tests__/SwipeableCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import SwipeableCard from '../components/discovery/SwipeableCard';

test('should handle swipe gestures', () => {
  const onLike = jest.fn();
  const onPass = jest.fn();
  
  const { getByTestId } = render(
    <SwipeableCard profile={mockProfile} onLike={onLike} onPass={onPass} />
  );
  
  fireEvent(getByTestId('swipe-card'), 'onSwipeRight');
  expect(onLike).toHaveBeenCalled();
});
```

### Integration Testing
- API integration tests with mock server
- Navigation flow testing
- State management testing with Redux

## 📦 Building & Deployment

### Development Build
```bash
expo build:android --type apk    # Android APK
expo build:ios --type simulator  # iOS Simulator
```

### Production Build (EAS)
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Over-the-Air Updates
```bash
eas update --branch production --message "Bug fixes and improvements"
```

## 🔍 Debugging & Development Tools

### Expo Developer Tools
- **Metro Bundler**: Real-time bundling and hot reloading
- **Device Logs**: Real-time log streaming from connected devices
- **Performance Monitor**: Track app performance metrics

### Redux DevTools
```typescript
// store/index.ts
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});
```

### Error Tracking
- Expo Application Services (EAS) for crash reporting
- Custom error boundaries for graceful error handling
- Analytics integration for user behavior tracking

## 🤝 Contributing

### Code Style
- ESLint + Prettier for consistent formatting
- TypeScript strict mode enabled
- Functional components with hooks preferred
- Custom hooks for reusable logic

### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature with tests
3. Update documentation if needed
4. Submit PR with detailed description
5. Address code review feedback

### Commit Convention
```
feat: add swipe gesture recognition
fix: resolve memory leak in image carousel
docs: update API integration guide
test: add unit tests for matching algorithm
```

---

*For backend documentation, see [RendezvousApi README](../RendezvousApi/README.md)*
*For overall project context, see [Project Context](../context.md)*
