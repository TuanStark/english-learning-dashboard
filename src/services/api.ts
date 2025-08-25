import axios from 'axios';
import type { 
  ApiResponse,
  PaginatedResponse,
  User, 
  Role,
  Vocabulary,
  VocabularyTopic,
  VocabularyExample,
  Exam,
  Question,
  AnswerOption,
  ExamAttempt,
  Grammar,
  GrammarExample,
  Pagination,
  UserStats,
  CreateVocabularyDto,
  CreateExamDto,
  CreateGrammarDto,
  UserVocabularyProgress,
  UserGrammarProgress,
  BlogPost,
  CreateBlogPostDto,
  BlogCategory,
  BlogComment,
  LearningPath,
  PathStep,
  UserLearningPath,
  AIExplanation
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
  console.log
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
    apiService.get<PaginatedResponse<User>>('/user/all', params),

  // Get user by ID
  getUser: (id: number) => 
    apiService.get<User>(`/users/${id}`),

  // Create new user
  createUser: (data: Partial<User>) => 
    apiService.post<User>('/user/create', data),

  // Update user
  updateUser: (id: number, data: Partial<User>) => 
    apiService.patch<User>(`/user/${id}`, data),

  // Delete user
  deleteUser: (id: number) => 
    apiService.patch<User>(`/user/delete/${id}`, {}),

  // Get user stats
  getUserStats: (id: number) => 
    apiService.get<UserStats>(`/user/stats/${id}`),
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

// Learning Path API (Legacy - use learningPathApi below for full CRUD)
export const learningPathLegacyApi = {
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

// Question Management API
export const questionApi = {
  // Get all questions with pagination
  getQuestions: (params?: any) => 
    apiService.get<PaginatedResponse<Question>>('/questions', params),

  // Get question by ID
  getQuestion: (id: number) => 
    apiService.get<Question>(`/questions/${id}`),

  // Get questions by exam
  getQuestionsByExam: (examId: number) => 
    apiService.get<Question[]>(`/questions/exam/${examId}`),

  // Create new question
  createQuestion: (data: any) => 
    apiService.post<Question>('/questions', data),

  // Update question
  updateQuestion: (id: number, data: Partial<Question>) => 
    apiService.patch<Question>(`/questions/${id}`, data),

  // Delete question
  deleteQuestion: (id: number) => 
    apiService.delete<Question>(`/questions/${id}`),
};

// Answer Option Management API
export const answerOptionApi = {
  // Get all answer options
  getAnswerOptions: (params?: any) => 
    apiService.get<PaginatedResponse<AnswerOption>>('/answer-options', params),

  // Get answer options by question
  getAnswerOptionsByQuestion: (questionId: number) => 
    apiService.get<AnswerOption[]>(`/answer-options?questionId=${questionId}`),

  // Get answer option by ID
  getAnswerOption: (id: number) => 
    apiService.get<AnswerOption>(`/answer-options/${id}`),

  // Create new answer option
  createAnswerOption: (data: any) => 
    apiService.post<AnswerOption>('/answer-options', data),

  // Update answer option
  updateAnswerOption: (id: number, data: Partial<AnswerOption>) => 
    apiService.patch<AnswerOption>(`/answer-options/${id}`, data),

  // Delete answer option
  deleteAnswerOption: (id: number) => 
    apiService.delete<AnswerOption>(`/answer-options/${id}`),
};

// Exam Attempt Management API
export const examAttemptApi = {
  // Get all exam attempts with pagination
  getExamAttempts: (params?: any) => 
    apiService.get<PaginatedResponse<ExamAttempt>>('/exam-attempts', params),

  // Get exam attempt by ID
  getExamAttempt: (id: number) => 
    apiService.get<ExamAttempt>(`/exam-attempts/${id}`),

  // Get attempts by user
  getUserAttempts: (userId: number) => 
    apiService.get<ExamAttempt[]>(`/exam-attempts?userId=${userId}`),

  // Get attempts by exam
  getExamAttemptsByExam: (examId: number) => 
    apiService.get<ExamAttempt[]>(`/exam-attempts?examId=${examId}`),

  // Create new exam attempt
  createExamAttempt: (data: any) => 
    apiService.post<ExamAttempt>('/exam-attempts', data),

  // Submit exam attempt
  submitExamAttempt: (attemptId: number, answers: any[]) => 
    apiService.post<ExamAttempt>(`/exam-attempts/${attemptId}/submit`, { answers }),

  // Update exam attempt
  updateExamAttempt: (id: number, data: Partial<ExamAttempt>) => 
    apiService.patch<ExamAttempt>(`/exam-attempts/${id}`, data),

  // Delete exam attempt
  deleteExamAttempt: (id: number) => 
    apiService.delete<ExamAttempt>(`/exam-attempts/${id}`),
};

// Vocabulary Topic Management API
export const vocabularyTopicApi = {
  // Get all vocabulary topics
  getTopics: () => 
    apiService.get<VocabularyTopic[]>('/vocabulary-topics'),

  // Get topic by ID
  getTopic: (id: number) => 
    apiService.get<VocabularyTopic>(`/vocabulary-topics/${id}`),

  // Create new topic
  createTopic: (data: any) => 
    apiService.post<VocabularyTopic>('/vocabulary-topics', data),

  // Update topic
  updateTopic: (id: number, data: Partial<VocabularyTopic>) => 
    apiService.patch<VocabularyTopic>(`/vocabulary-topics/${id}`, data),

  // Delete topic
  deleteTopic: (id: number) => 
    apiService.delete<VocabularyTopic>(`/vocabulary-topics/${id}`),
};

// Vocabulary Example Management API
export const vocabularyExampleApi = {
  // Get all vocabulary examples
  getExamples: (params?: any) => 
    apiService.get<PaginatedResponse<VocabularyExample>>('/vocabulary-examples', params),

  // Get examples by vocabulary
  getExamplesByVocabulary: (vocabularyId: number) => 
    apiService.get<VocabularyExample[]>(`/vocabulary-examples?vocabularyId=${vocabularyId}`),

  // Get example by ID
  getExample: (id: number) => 
    apiService.get<VocabularyExample>(`/vocabulary-examples/${id}`),

  // Create new example
  createExample: (data: any) => 
    apiService.post<VocabularyExample>('/vocabulary-examples', data),

  // Update example
  updateExample: (id: number, data: Partial<VocabularyExample>) => 
    apiService.patch<VocabularyExample>(`/vocabulary-examples/${id}`, data),

  // Delete example
  deleteExample: (id: number) => 
    apiService.delete<VocabularyExample>(`/vocabulary-examples/${id}`),
};

// Grammar Example Management API
export const grammarExampleApi = {
  // Get all grammar examples
  getExamples: (params?: any) => 
    apiService.get<PaginatedResponse<GrammarExample>>('/grammar-examples', params),

  // Get examples by grammar
  getExamplesByGrammar: (grammarId: number) => 
    apiService.get<GrammarExample[]>(`/grammar-examples?grammarId=${grammarId}`),

  // Get example by ID
  getExample: (id: number) => 
    apiService.get<GrammarExample>(`/grammar-examples/${id}`),

  // Create new example
  createExample: (data: any) => 
    apiService.post<GrammarExample>('/grammar-examples', data),

  // Update example
  updateExample: (id: number, data: Partial<GrammarExample>) => 
    apiService.patch<GrammarExample>(`/grammar-examples/${id}`, data),

  // Delete example
  deleteExample: (id: number) => 
    apiService.delete<GrammarExample>(`/grammar-examples/${id}`),
};

// Blog Category Management API
export const blogCategoryApi = {
  // Get all blog categories
  getCategories: () => 
    apiService.get<BlogCategory[]>('/blog-categories'),

  // Get category by ID
  getCategory: (id: number) => 
    apiService.get<BlogCategory>(`/blog-categories/${id}`),

  // Get category by slug
  getCategoryBySlug: (slug: string) => 
    apiService.get<BlogCategory>(`/blog-categories/slug/${slug}`),

  // Create new category
  createCategory: (data: any) => 
    apiService.post<BlogCategory>('/blog-categories', data),

  // Update category
  updateCategory: (id: number, data: Partial<BlogCategory>) => 
    apiService.patch<BlogCategory>(`/blog-categories/${id}`, data),

  // Delete category
  deleteCategory: (id: number) => 
    apiService.delete<BlogCategory>(`/blog-categories/${id}`),
};

// Blog Comment Management API
export const blogCommentApi = {
  // Get all blog comments
  getComments: (params?: any) => 
    apiService.get<PaginatedResponse<BlogComment>>('/blog-comments', params),

  // Get comments by post
  getCommentsByPost: (postId: number) => 
    apiService.get<BlogComment[]>(`/blog-comments?postId=${postId}`),

  // Get comment by ID
  getComment: (id: number) => 
    apiService.get<BlogComment>(`/blog-comments/${id}`),

  // Create new comment
  createComment: (data: any) => 
    apiService.post<BlogComment>('/blog-comments', data),

  // Update comment
  updateComment: (id: number, data: Partial<BlogComment>) => 
    apiService.patch<BlogComment>(`/blog-comments/${id}`, data),

  // Delete comment
  deleteComment: (id: number) => 
    apiService.delete<BlogComment>(`/blog-comments/${id}`),
};

// Learning Path Management API
export const learningPathApi = {
  // Get all learning paths
  getPaths: (params?: any) => 
    apiService.get<PaginatedResponse<LearningPath>>('/learning-paths', params),

  // Get path by ID
  getPath: (id: number) => 
    apiService.get<LearningPath>(`/learning-paths/${id}`),

  // Create new path
  createPath: (data: any) => 
    apiService.post<LearningPath>('/learning-paths', data),

  // Update path
  updatePath: (id: number, data: Partial<LearningPath>) => 
    apiService.patch<LearningPath>(`/learning-paths/${id}`, data),

  // Delete path
  deletePath: (id: number) => 
    apiService.delete<LearningPath>(`/learning-paths/${id}`),

  // Get user progress
  getUserProgress: (userId: number) => 
    apiService.get<UserLearningPath[]>(`/user-learning-paths?userId=${userId}`),
};

// Path Step Management API
export const pathStepApi = {
  // Get all path steps
  getSteps: (params?: any) => 
    apiService.get<PaginatedResponse<PathStep>>('/path-steps', params),

  // Get steps by learning path
  getStepsByPath: (pathId: number) => 
    apiService.get<PathStep[]>(`/path-steps?learningPathId=${pathId}`),

  // Get step by ID
  getStep: (id: number) => 
    apiService.get<PathStep>(`/path-steps/${id}`),

  // Create new step
  createStep: (data: any) => 
    apiService.post<PathStep>('/path-steps', data),

  // Update step
  updateStep: (id: number, data: Partial<PathStep>) => 
    apiService.patch<PathStep>(`/path-steps/${id}`, data),

  // Delete step
  deleteStep: (id: number) => 
    apiService.delete<PathStep>(`/path-steps/${id}`),
};

// User Learning Path Progress API
export const userLearningPathApi = {
  // Get all user learning path progress
  getProgress: (params?: any) => 
    apiService.get<PaginatedResponse<UserLearningPath>>('/user-learning-paths', params),

  // Get progress by user
  getUserProgress: (userId: number) => 
    apiService.get<UserLearningPath[]>(`/user-learning-paths?userId=${userId}`),

  // Get progress by learning path
  getPathProgress: (pathId: number) => 
    apiService.get<UserLearningPath[]>(`/user-learning-paths?learningPathId=${pathId}`),

  // Get progress by ID
  getProgressById: (id: number) => 
    apiService.get<UserLearningPath>(`/user-learning-paths/${id}`),

  // Create new progress
  createProgress: (data: any) => 
    apiService.post<UserLearningPath>('/user-learning-paths', data),

  // Update progress
  updateProgress: (id: number, data: Partial<UserLearningPath>) => 
    apiService.patch<UserLearningPath>(`/user-learning-paths/${id}`, data),

  // Delete progress
  deleteProgress: (id: number) => 
    apiService.delete<UserLearningPath>(`/user-learning-paths/${id}`),
};

export default api;
