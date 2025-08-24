import axios from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse,
  User, 
  Role,
  Vocabulary,
  VocabularyTopic,
  VocabularyExample,
  UserVocabularyProgress,
  Exam,
  Question,
  AnswerOption,
  ExamAttempt,
  Grammar,
  GrammarExample,
  UserGrammarProgress,
  BlogCategory,
  BlogPost,
  BlogComment,
  LearningPath,
  PathStep,
  UserLearningPath,
  AIExplanation,
  DashboardStats,
  UserStats,
  CreateExamDto,
  CreateVocabularyDto,
  CreateGrammarDto,
  CreateBlogPostDto
} from '@/types/backend';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for specific endpoints that require auth
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login page or if it's a dashboard API call
      if (!currentPath.includes('/login') && !currentPath.includes('/dashboard')) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  // Generic CRUD operations
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T> | PaginatedResponse<T>> {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.patch(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

// User Management API
export const userApi = {
  // Get all users with pagination
  getUsers: (params?: any) => 
    apiService.get<PaginatedResponse<User>>('/users', params),

  // Get user by ID
  getUser: (id: number) => 
    apiService.get<User>(`/users/${id}`),

  // Create new user
  createUser: (data: Partial<User>) => 
    apiService.post<User>('/users', data),

  // Update user
  updateUser: (id: number, data: Partial<User>) => 
    apiService.patch<User>(`/users/${id}`, data),

  // Delete user
  deleteUser: (id: number) => 
    apiService.delete<User>(`/users/${id}`),

  // Get user stats
  getUserStats: (id: number) => 
    apiService.get<UserStats>(`/users/${id}/stats`),
};

// Role Management API
export const roleApi = {
  getRoles: () => 
    apiService.get<Role[]>('/roles'),

  getRole: (id: number) => 
    apiService.get<Role>(`/roles/${id}`),

  createRole: (data: Partial<Role>) => 
    apiService.post<Role>('/roles', data),

  updateRole: (id: number, data: Partial<Role>) => 
    apiService.patch<Role>(`/roles/${id}`, data),

  deleteRole: (id: number) => 
    apiService.delete<Role>(`/roles/${id}`),
};

// Vocabulary Management API
export const vocabularyApi = {
  // Get all vocabularies with search and filter
  getVocabularies: (params?: any) => 
    apiService.get<PaginatedResponse<Vocabulary>>('/vocabularies', params),

  // Get vocabulary by ID
  getVocabulary: (id: number) => 
    apiService.get<Vocabulary>(`/vocabularies/${id}`),

  // Create new vocabulary
  createVocabulary: (data: CreateVocabularyDto) => 
    apiService.post<Vocabulary>('/vocabularies', data),

  // Update vocabulary
  updateVocabulary: (id: number, data: Partial<Vocabulary>) => 
    apiService.patch<Vocabulary>(`/vocabularies/${id}`, data),

  // Delete vocabulary
  deleteVocabulary: (id: number) => 
    apiService.delete<Vocabulary>(`/vocabularies/${id}`),

  // Get vocabulary topics
  getTopics: () => 
    apiService.get<VocabularyTopic[]>('/vocabulary-topics'),

  // Get vocabulary examples
  getExamples: (vocabularyId: number) => 
    apiService.get<VocabularyExample[]>(`/vocabulary-examples?vocabularyId=${vocabularyId}`),

  // Get user progress
  getUserProgress: (userId: number) => 
    apiService.get<UserVocabularyProgress[]>(`/user-vocabularies-progress?userId=${userId}`),
};

// Exam Management API
export const examApi = {
  // Get all exams with search and filter
  getExams: (params?: any) => 
    apiService.get<PaginatedResponse<Exam>>('/exams', params),

  // Get exam by ID
  getExam: (id: number) => 
    apiService.get<Exam>(`/exams/${id}`),

  // Create new exam
  createExam: (data: CreateExamDto) => 
    apiService.post<Exam>('/exams', data),

  // Update exam
  updateExam: (id: number, data: Partial<Exam>) => 
    apiService.patch<Exam>(`/exams/${id}`, data),

  // Delete exam
  deleteExam: (id: number) => 
    apiService.delete<Exam>(`/exams/${id}`),

  // Get exam stats
  getExamStats: (id: number) => 
    apiService.get<Exam>(`/exams/${id}/stats`),

  // Get active exams
  getActiveExams: () => 
    apiService.get<Exam[]>('/exams/active'),

  // Get questions for exam
  getExamQuestions: (examId: number) => 
    apiService.get<Question[]>(`/questions/exam/${examId}`),

  // Get exam attempts
  getExamAttempts: (params?: any) => 
    apiService.get<PaginatedResponse<ExamAttempt>>('/exam-attempts', params),

  // Submit exam
  submitExam: (attemptId: number, answers: any[]) => 
    apiService.post<ExamAttempt>(`/exam-attempts/${attemptId}/submit`, { answers }),
};

// Grammar Management API
export const grammarApi = {
  // Get all grammar with search and filter
  getGrammar: (params?: any) => 
    apiService.get<PaginatedResponse<Grammar>>('/grammar', params),

  // Get grammar by ID
  getGrammarById: (id: number) => 
    apiService.get<Grammar>(`/grammar/${id}`),

  // Create new grammar
  createGrammar: (data: CreateGrammarDto) => 
    apiService.post<Grammar>('/grammar', data),

  // Update grammar
  updateGrammar: (id: number, data: Partial<Grammar>) => 
    apiService.patch<Grammar>(`/grammar/${id}`, data),

  // Delete grammar
  deleteGrammar: (id: number) => 
    apiService.delete<Grammar>(`/grammar/${id}`),

  // Get grammar examples
  getGrammarExamples: (grammarId: number) => 
    apiService.get<GrammarExample[]>(`/grammar-examples?grammarId=${grammarId}`),

  // Get user progress
  getUserGrammarProgress: (userId: number) => 
    apiService.get<UserGrammarProgress[]>(`/user-grammar-progress?userId=${userId}`),
};

// Blog Management API
export const blogApi = {
  // Get all blog posts
  getPosts: (params?: any) => 
    apiService.get<PaginatedResponse<BlogPost>>('/blog-posts', params),

  // Get published posts
  getPublishedPosts: (params?: any) => 
    apiService.get<PaginatedResponse<BlogPost>>('/blog-posts/published', params),

  // Get post by ID
  getPost: (id: number) => 
    apiService.get<BlogPost>(`/blog-posts/${id}`),

  // Get post by slug
  getPostBySlug: (slug: string) => 
    apiService.get<BlogPost>(`/blog-posts/slug/${slug}`),

  // Create new post
  createPost: (data: CreateBlogPostDto) => 
    apiService.post<BlogPost>('/blog-posts', data),

  // Update post
  updatePost: (id: number, data: Partial<BlogPost>) => 
    apiService.patch<BlogPost>(`/blog-posts/${id}`, data),

  // Delete post
  deletePost: (id: number) => 
    apiService.delete<BlogPost>(`/blog-posts/${id}`),

  // Get categories
  getCategories: () => 
    apiService.get<BlogCategory[]>('/blog-categories'),

  // Get posts by category
  getPostsByCategory: (categorySlug: string) => 
    apiService.get<BlogPost[]>(`/blog-categories/${categorySlug}/posts`),
};

// Learning Path API
export const learningPathApi = {
  // Get all learning paths
  getPaths: () => 
    apiService.get<LearningPath[]>('/learning-paths'),

  // Get path by ID
  getPath: (id: number) => 
    apiService.get<LearningPath>(`/learning-paths/${id}`),

  // Get user progress
  getUserProgress: (userId: number) => 
    apiService.get<UserLearningPath[]>(`/user-learning-paths?userId=${userId}`),
};

// AI API
export const aiApi = {
  // Get AI explanations
  getExplanations: (params?: any) => 
    apiService.get<PaginatedResponse<AIExplanation>>('/ai-explanations', params),

  // Generate AI explanation
  generateExplanation: (data: { question: string; userId: number }) => 
    apiService.post<AIExplanation>('/ai-explanations', data),
};

// Dashboard API
export const dashboardApi = {
  // Get overall statistics (Admin only)
  getOverallStats: () => 
    apiService.get<any>('/dashboard/stats/overall'),

  // Get user statistics
  getUserStats: () => 
    apiService.get<any>('/dashboard/stats/user'),

  // Get admin statistics (Admin only)
  getAdminStats: () => 
    apiService.get<any>('/dashboard/stats/admin'),

  // Get learning path progress
  getLearningPathProgress: () => 
    apiService.get<any>('/dashboard/learning-paths/progress'),

  // Get user statistics by ID (Admin only)
  getUserStatsById: (userId: number) => 
    apiService.get<any>(`/dashboard/user/${userId}/stats`),
};

export default api;
