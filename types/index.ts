// User related types
export interface User {
  userId: number;
  name: string;
  email: string;
  gender: Gender;
  interestedInGenders: Gender[];
  dateOfBirth: Date;
  interests: Interest[];
  photos?: string[];
  bio?: string;
  distance?: number;
  age?: number;
}

// Photo related types
export interface Photo {
  photoId: number;
  url: string;
  isMain: boolean;
  publicId: string;
  userId: number;
  dateAdded: Date;
}

// Profile for browsing/swiping - matches backend UserDiscoveryDto
export interface UserProfile {
  userId: number;
  name: string;
  age: number;
  bio?: string;
  photos: string[];
  interests: Interest[];
  distance: number;
  gender: Gender;
  isVerified: boolean;
}

// Swipe/Like actions
export type SwipeAction = 'like' | 'dislike';

export interface SwipeResult {
  match: boolean;
  matchId?: number;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  interestedInGenders: Gender[];
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
  gender: Gender;
  birthDate: string;
  interestedInGenders: Gender[];
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

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userId: number;
  email: string;
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}
