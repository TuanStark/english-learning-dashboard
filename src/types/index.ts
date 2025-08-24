// ================== USERS & ROLES ==================
export interface Role {
  id: number;
  roleName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  emailVerified: boolean;
  roleId: number;
  status: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

// ================== EXAMS & TESTS ==================
export interface Exam {
  id: number;
  title: string;
  description?: string;
  duration: number; // Duration in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  examId: number;
  content: string;
  questionType: string; // "MultipleChoice", "FillInBlank", etc.
  orderIndex: number;
  points: number;
  answerOptions?: AnswerOption[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: number;
  questionId: number;
  content: string;
  isCorrect: boolean;
  optionLabel: string; // A, B, C, D
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: number;
  userId: number;
  examId: number;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  status: 'InProgress' | 'Completed' | 'Cancelled';
  detailedResult?: any;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ================== VOCABULARY ==================
export interface VocabularyTopic {
  id: number;
  topicName: string;
  description?: string;
  image?: string;
  orderIndex: number;
  isActive: boolean;
  vocabularies?: Vocabulary[];
  createdAt: string;
  updatedAt: string;
}

export interface Vocabulary {
  id: number;
  topicId: number;
  englishWord: string;
  pronunciation?: string;
  vietnameseMeaning: string;
  wordType?: string;
  difficultyLevel: string;
  image?: string;
  audioFile?: string;
  isActive: boolean;
  topic?: VocabularyTopic;
  examples?: VocabularyExample[];
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyExample {
  id: number;
  vocabularyId: number;
  englishSentence: string;
  vietnameseSentence: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

// ================== GRAMMAR ==================
export interface Grammar {
  id: number;
  title: string;
  content: string;
  difficultyLevel: string;
  orderIndex: number;
  isActive: boolean;
  examples?: GrammarExample[];
  createdAt: string;
  updatedAt: string;
}

export interface GrammarExample {
  id: number;
  grammarId: number;
  englishSentence: string;
  vietnameseSentence: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

// ================== LEARNING PATHS ==================
export interface LearningPath {
  id: number;
  pathName: string;
  description?: string;
  coverImage?: string;
  targetLevel: string;
  estimatedWeeks?: number;
  orderIndex: number;
  isActive: boolean;
  pathSteps?: PathStep[];
  createdAt: string;
  updatedAt: string;
}

export interface PathStep {
  id: number;
  learningPathId: number;
  stepName: string;
  description?: string;
  contentType: string;
  contentId?: number;
  orderIndex: number;
  isRequired: boolean;
  estimatedMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

// ================== BLOG ==================
export interface BlogCategory {
  id: number;
  categoryName: string;
  description?: string;
  slug: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId: number;
  categoryId: number;
  status: 'Draft' | 'Published' | 'Archived';
  viewCount: number;
  seoKeywords?: string;
  seoDescription?: string;
  publishedAt?: string;
  author?: User;
  category?: BlogCategory;
  createdAt: string;
  updatedAt: string;
}

// ================== FILE UPLOAD & IMPORT ==================
export interface UploadedFile {
  id: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

export interface ImportJob {
  id: number;
  fileId: number;
  importType: 'vocabulary' | 'grammar' | 'exam' | 'user';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  failedRecords: number;
  errorLog?: string;
  result?: any;
  createdAt: string;
  updatedAt: string;
}

// ================== DASHBOARD & COMMON ==================
export interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalVocabulary: number;
  totalGrammar: number;
  averageScore: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
