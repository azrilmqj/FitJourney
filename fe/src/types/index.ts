export interface Profile {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goal?: string;
  activity?: number;
  location?: string;
  dob?: string;
  bio?: string;
  avatar?: string;
}
export interface Target {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile?: Profile;
  onboarded: boolean;
  notifications: boolean;
  target?: Target;
  createdAt: string;
}
export interface Workout {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  trainer: string;
  target: string;
  image: string;
  videoId: string;
  exercises: string[];
  status: string;
  translations?: {
    id?: Partial<Pick<Workout, 'title' | 'description' | 'target' | 'exercises'>>;
  };
}
export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  readTime: number;
  status: string;
  createdAt: string;
  translations?: {
    id?: Partial<Pick<Article, 'title' | 'excerpt' | 'content'>>;
  };
}
export interface Progress {
  _id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  sleep?: number;
  notes?: string;
  photo?: string;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  user?: User;
}
export interface Activity {
  _id: string;
  date: string;
  water: number;
  workouts: { workout: string; title: string; duration: number }[];
}
