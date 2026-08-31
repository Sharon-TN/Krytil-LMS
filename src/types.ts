export type Role = 'student' | 'admin';

export type Route =
  | '/'
  | '/login'
  | '/signup'
  | '/admin/login'
  | '/forgot-password'
  | '/courses'
  | '/courses/:id'
  | '/student/dashboard'
  | '/student/courses'
  | '/student/notes'
  | '/student/assignments'
  | '/student/quizzes'
  | '/student/tests'
  | '/student/results'
  | '/student/certificates'
  | '/student/payments'
  | '/student/profile'
  | '/student/settings'
  | '/admin/dashboard'
  | '/admin/courses'
  | '/admin/notes'
  | '/admin/students'
  | '/admin/assignments'
  | '/admin/quizzes'
  | '/admin/tests'
  | '/admin/question-bank'
  | '/admin/payments'
  | '/admin/certificates'
  | '/admin/reports'
  | '/admin/settings';

export type CourseLesson = {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz' | 'resource';
  completed?: boolean;
  videoUrl?: string;
  content?: string;
};

export type CourseModule = {
  id: number;
  title: string;
  duration: string;
  lessons: CourseLesson[];
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  instructorRole?: string;
  instructorAvatar?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  lessonsCount?: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount?: number;
  students: number;
  image: string;
  description: string;
  purchased?: boolean;
  progress?: number;
  lastAccessed?: string;
  badge?: string;
  modules?: CourseModule[];
  whatYouWillLearn?: string[];
  requirements?: string[];
};

export type Note = {
  id: number;
  title: string;
  course: string;
  module: string;
  date: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'ZIP' | 'TXT';
  size: string;
  downloadUrl?: string;
  contentPreview?: string;
};

export type Assignment = {
  id: number;
  title: string;
  course: string;
  due: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  score?: number;
  maxScore?: number;
  instructions?: string;
  submittedFile?: string;
  submissionDate?: string;
  feedback?: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed index or exact value
  explanation?: string;
};

export type Quiz = {
  id: number;
  title: string;
  course: string;
  duration: string; // e.g. "15 mins"
  durationMinutes: number;
  questionsCount: number;
  score?: number;
  status: 'Available' | 'Completed' | 'In Progress';
  questions: QuizQuestion[];
};

export type Assessment = {
  id: number;
  title: string;
  course: string;
  duration: string;
  durationMinutes: number;
  questionsCount: number;
  status: 'Available' | 'Upcoming' | 'Completed';
  proctored: boolean;
  passingScore: number;
  attemptsAllowed: number;
  attemptsTaken: number;
  instructions: string[];
  questions: QuizQuestion[];
};

export type QuestionBankItem = {
  id: number;
  q: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Short Answer' | 'True/False';
  points: number;
  course?: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  courses: number;
  completion: string;
  score: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  enrolledDate: string;
};

export type Payment = {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  date: string;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet';
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  invoiceId: string;
};

export type Certificate = {
  id: string;
  courseId: number;
  course: string;
  studentName: string;
  issueDate: string;
  credentialId: string;
  instructor: string;
  grade: string;
  badgeUrl?: string;
};

export type ToastMessage = {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
};
