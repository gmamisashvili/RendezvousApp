# Rendezvous App

A mobile application for matchmaking that helps users find dates based on visual profiles, shared interests and location preferences.

## Overview

Rendezvous is a matchmaking app that focuses on connecting people based on both visual appeal and compatibility. Users can create profiles with photos, specify their interests, set location preferences, and get matched with compatible individuals for immediate dates.

## Technologies Used

- React Native / Expo
- TypeScript
- Context API for state management
- Axios for API requests
- React Navigation for routing

## Features

- User authentication (login/register)
- Profile management with photo uploads
- Visual profile browsing
- Interest selection
- Location preferences
- Date requests and matching
- Date scheduling and management
- Immediate date arrangements (no chat phase)

## Project Structure

- **app/**: Main application screens using file-based routing
  - Login and registration screens
  - Dashboard for managing matches and date requests
- **components/**: Reusable UI components
  - Authentication related components
  - Common UI elements (Button, Input)
  - Dashboard components
  - Date-related components
  - Profile display components
- **constants/**: Application constants for colors, layout, etc.
- **hooks/**: Custom React hooks
- **services/**: API service integrations
  - Authentication
  - Date management
  - Interest management
  - Location services
- **store/**: Application state management
  - Authentication context
  - Date and matching context
- **types/**: TypeScript type definitions
- **utils/**: Utility functions

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional for local development)
- Expo Go app on your physical device (for testing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/rendezvous-app.git
cd rendezvous-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npx expo start
```

4. Follow the instructions in the terminal to open the app on your device or emulator

### Environment Configuration

Create a `.env` file in the root directory with the following variables:
```
API_BASE_URL=https://your-rendezvous-api-url.com
```

## Backend API

The app connects to the Rendezvous API which provides endpoints for:
- User authentication
- Interest management
- Date requests
- Match management

For more information about the API, refer to the [Rendezvous API documentation](https://github.com/your-username/rendezvous-api).

## Development

### Running Tests

```bash
npm test
# or
yarn test
```

### Building for Production

```bash
npx expo build:android
# or
npx expo build:ios
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Rendezvous team for their vision and support
- The open source community for providing amazing tools and libraries

`
