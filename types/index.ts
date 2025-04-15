// User related types
export interface User {
  userId: number;
  name: string;
  email: string;
  gender: string;
  interestedInGenders: string;
  dateOfBirth: Date;
  interests: Interest[];
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  gender: string;
  interestedInGenders: string;
  dateOfBirth: Date;
  interestIds: number[];
  agreeToTerms: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Interest related types
export interface Interest {
  interestId: number;
  name: string;
  category: string;
}

// Location related types
export interface Location {
  locationId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface UserLocation {
  userLocationId: number;
  userId: number;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

// Date request related types
export type DateRequestStatus = 'Waiting' | 'Matched' | 'Cancelled';

export interface DateRequest {
  requestId: number;
  userId: number;
  status: DateRequestStatus;
  createdAt: Date;
  expiresAt: Date;
}

// Match related types
export type MatchStatus = 'Accepted' | 'On the Way' | 'Arrived' | 'Met';

export interface Match {
  matchId: number;
  requestId1: number;
  requestId2: number;
  locationId: number;
  matchedAt: Date;
  status: MatchStatus;
}

export interface DateStatus {
  statusId: number;
  matchId: number;
  userId: number;
  status: MatchStatus;
  updatedAt: Date;
}

// Form error types
export interface RegistrationErrors {
  name: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
  interestedInGenders: string;
  interests: string;
  terms: string;
}

export interface LoginErrors {
  email: string;
  password: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
} 