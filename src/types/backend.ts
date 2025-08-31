// global-types.ts

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Role
export interface Role {
  id: number;
  roleName: string;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

// User
export interface User {
  id: number;
  email: string;
  password?: string; // optional khi trả về frontend
  fullName: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  emailVerified: boolean;
  roleId: number;
  status: "active" | "inactive" | "banned";
  codeId?: string;
  codeExpired?: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

// Exam
export interface Exam {
  id: number;
  title: string;
  description?: string;
  type?: "TOEIC" | "IELTS" | "SAT" | "CUSTOM";
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  examAttempts?: ExamAttempt[];
}

// Question
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

// Answer Option
export interface AnswerOption {
  id: number;
  questionId: number;
  content: string;
  isCorrect: boolean;
  optionLabel: string; // A, B, C, D
  createdAt: string;
  updatedAt: string;
}

// Exam Attempt
export interface ExamAttempt {
  id: number;
  userId: number;
  examId: number;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  status: "InProgress" | "Completed" | "Abandoned";
  detailedResult?: any; // JSON
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  exam?: Exam;
}

// Vocabulary
export interface Vocabulary {
  id: number;
  topicId: number;
  englishWord: string;
  pronunciation?: string;
  vietnameseMeaning: string;
  wordType?: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  image?: string;
  audioFile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  examples?: VocabularyExample[];
}

// Vocabulary Example
export interface VocabularyExample {
  id: number;
  vocabularyId: number;
  englishSentence: string;
  vietnameseSentence: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

// Grammar
export interface Grammar {
  id: number;
  title: string;
  content: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  examples?: GrammarExample[];
}

// Grammar Example
export interface GrammarExample {
  id: number;
  grammarId: number;
  englishSentence: string;
  vietnameseSentence: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface Pagination {
  page: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// Additional types for API
export interface UserStats {
  totalExams: number;
  totalVocabularies: number;
  totalGrammar: number;
  averageScore: number;
}

export interface CreateVocabularyDto {
  topicId: number;
  englishWord: string;
  pronunciation?: string;
  vietnameseMeaning: string;
  wordType?: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
}

export interface CreateExamDto {
  title: string;
  description?: string;
  type?: "TOEIC" | "IELTS" | "SAT" | "CUSTOM";
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isActive: boolean;
}

export interface CreateGrammarDto {
  title: string;
  content: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  isActive: boolean;
}

export interface UserVocabularyProgress {
  id: number;
  userId: number;
  vocabularyId: number;
  status: "NotStarted" | "InProgress" | "Completed";
  lastReviewed: string;
  reviewCount: number;
}

export interface UserGrammarProgress {
  id: number;
  userId: number;
  grammarId: number;
  status: "NotStarted" | "InProgress" | "Completed";
  lastReviewed: string;
  reviewCount: number;
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
  createdAt: string;
  updatedAt: string;
  author?: User;
  category?: BlogCategory;
  comments?: BlogComment[];
}

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId: number;
  categoryId: number;
  status: 'Draft' | 'Published' | 'Archived';
  seoKeywords?: string;
  seoDescription?: string;
}

export interface BlogCategory {
  id: number;
  categoryName: string;
  description?: string;
  slug: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  blogPosts?: BlogPost[];
}

export interface VocabularyTopic {
  id: number;
  topicName: string;
  description?: string;
  image?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPath {
  id: number;
  title: string;
  description?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLearningPath {
  id: number;
  userId: number;
  learningPathId: number;
  progress: number;
  status: "NotStarted" | "InProgress" | "Completed";
  startedAt: string;
  completedAt?: string;
}

export interface AIExplanation {
  id: number;
  content: string;
  type: "Vocabulary" | "Grammar" | "Question";
  referenceId: number;
  createdAt: string;
}

export interface BlogComment {
  id: number;
  blogPostId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  blogPost?: BlogPost;
  user?: User;
  parentComment?: BlogComment;
  childComments?: BlogComment[];
}

export interface PathStep {
  id: number;
  learningPathId: number;
  title: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}