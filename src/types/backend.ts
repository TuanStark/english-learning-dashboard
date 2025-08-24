// Backend API Response Types
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    pageNumber: number;
    limitNumber: number;
    totalPages: number;
  };
}

// User Management
export interface User {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Vocabulary System
export interface VocabularyTopic {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vocabularies?: Vocabulary[];
}

export interface Vocabulary {
  id: number;
  topicId: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  topic?: VocabularyTopic;
  examples?: VocabularyExample[];
  userProgress?: UserVocabularyProgress[];
}

export interface VocabularyExample {
  id: number;
  vocabularyId: number;
  sentence: string;
  translation: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserVocabularyProgress {
  id: number;
  userId: number;
  vocabularyId: number;
  masteryLevel: number;
  lastPracticedAt: string;
  practiceCount: number;
  createdAt: string;
  updatedAt: string;
  vocabulary?: Vocabulary;
}

// Exam System
export interface Exam {
  id: number;
  title: string;
  description?: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  examAttempts?: ExamAttempt[];
  _count?: {
    questions: number;
    examAttempts: number;
  };
}

export interface Question {
  id: number;
  examId: number;
  content: string;
  questionType: string;
  orderIndex: number;
  points: number;
  createdAt: string;
  updatedAt: string;
  answerOptions?: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  questionId: number;
  content: string;
  isCorrect: boolean;
  optionLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: number;
  userId: number;
  examId: number;
  status: 'InProgress' | 'Completed' | 'Cancelled';
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  timeSpent?: number;
  startedAt: string;
  completedAt?: string;
  detailedResult?: any;
  createdAt: string;
  updatedAt: string;
  user?: User;
  exam?: Exam;
}

// Grammar System
export interface Grammar {
  id: number;
  title: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  examples?: GrammarExample[];
  userProgress?: UserGrammarProgress[];
}

export interface GrammarExample {
  id: number;
  grammarId: number;
  sentence: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGrammarProgress {
  id: number;
  userId: number;
  grammarId: number;
  masteryLevel: number;
  lastPracticedAt: string;
  practiceCount: number;
  createdAt: string;
  updatedAt: string;
  grammar?: Grammar;
}

// Blog System
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  posts?: BlogPost[];
}

export interface BlogPost {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: number;
  status: 'Draft' | 'Published' | 'Archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: BlogCategory;
  author?: User;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  post?: BlogPost;
  user?: User;
}

// Learning Path System
export interface LearningPath {
  id: number;
  title: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  steps?: PathStep[];
  userProgress?: UserLearningPath[];
}

export interface PathStep {
  id: number;
  pathId: number;
  title: string;
  description?: string;
  orderIndex: number;
  stepType: 'Vocabulary' | 'Grammar' | 'Exam' | 'Practice';
  resourceId?: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  path?: LearningPath;
}

export interface UserLearningPath {
  id: number;
  userId: number;
  pathId: number;
  currentStepId: number;
  progress: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  path?: LearningPath;
  currentStep?: PathStep;
}

// AI System
export interface AIExplanation {
  id: number;
  userId: number;
  attemptId?: number;
  question: string;
  explanation: string;
  aiModel: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  attempt?: ExamAttempt;
}

// Statistics & Analytics
export interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalVocabularies: number;
  totalGrammar: number;
  totalBlogPosts: number;
  activeUsers: number;
  examCompletions: number;
  averageScore: number;
}

export interface UserStats {
  totalExamsTaken: number;
  averageScore: number;
  totalVocabularyMastered: number;
  totalGrammarMastered: number;
  learningStreak: number;
  totalStudyTime: number;
}

// Form Types
export interface CreateExamDto {
  title: string;
  description?: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  isActive?: boolean;
}

export interface CreateVocabularyDto {
  topicId: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive?: boolean;
}

export interface CreateGrammarDto {
  title: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  isActive?: boolean;
}

export interface CreateBlogPostDto {
  categoryId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status?: 'Draft' | 'Published' | 'Archived';
}
