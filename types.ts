// Fix: Removed self-import which caused multiple declaration conflicts.
export type Translations = { [key: string]: string };

export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Student = 'STUDENT',
}

export enum PostType {
  Post = 'POST',
  Activity = 'ACTIVITY',
  Announcement = 'ANNOUNCEMENT',
}

export enum FeedbackStatus {
  Pending = 'PENDING',
  Opened = 'OPENED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should only exist in mock data, not in real app state
  role: Role;
  avatarUrl?: string;
  bio: string;
  cvUrl?: string;
  loginAttempts: number;
  lockoutUntil: Date | null;
}

export interface Rating {
  userId: string;
  rating: number; // 1-5
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  stars: number;
  starredBy: string[];
  media?: {
    url: string;
    type: 'image' | 'video';
  };
  ratings?: Rating[];
  averageRating?: number;
  ratingCount?: number;
}

export interface Feedback {
  id: string;
  author: User;
  title: string;
  content: string;
  status: FeedbackStatus;
  isAnonymous: boolean;
  createdAt: string;
  reply?: string;
}

// --- AI Tool Types ---

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface MCQ {
    question: string;
    options: string[];
    answer: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// --- App Context & State Types ---

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';


export interface AppContextType {
  // Session
  session: User | null;
  signIn: (email: string, password: string) => true | 'invalidCredentials' | 'accountLocked';
  signOut: () => void;
  signUp: (name: string, email: string, password: string, role: Role) => true | 'emailInUse';
  
  // View Management
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Data
  users: User[];
  posts: Post[];
  feedback: Feedback[];
  
  // Actions
  addPost: (postData: { title: string, content: string, type: PostType, media?: { url: string, type: 'image'|'video' } }) => void;
  toggleStar: (postId: string) => void;
  addFeedback: (feedbackData: { title: string, content: string, isAnonymous: boolean }) => void;
  openFeedback: (feedbackId: string) => void;
  addFeedbackReply: (feedbackId: string, reply: string) => void;
  deleteFeedback: (feedbackId: string) => void;
  rateActivity: (postId: string, rating: number) => void;
  updateUserProfile: (userId: string, data: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl' | 'cvUrl'>>) => void;

  // Password Reset
  passwordResetToken: string | null;
  requestPasswordReset: (email: string) => void;
  resetPassword: (token: string, newPassword: string) => boolean;

  // UI
  toasts: ToastMessage[];
  addToast: (message: string, type: 'success' | 'error') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: Direction;
  translations: Translations;
}