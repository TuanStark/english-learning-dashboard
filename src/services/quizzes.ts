import { Exam, Question, AnswerOption, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

// Mock data cho Exams
const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    title: 'Kiểm tra từ vựng cơ bản',
    description: 'Bài kiểm tra từ vựng tiếng Anh cơ bản cho người mới bắt đầu',
    duration: 30,
    difficulty: 'Easy',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    lessonId: '2',
    title: 'Kiểm tra giới thiệu bản thân',
    description: 'Bài kiểm tra về cách giới thiệu bản thân bằng tiếng Anh',
    questions: [
      {
        id: '3',
        quizId: '2',
        question: 'Câu nào sau đây dùng để giới thiệu tên của bạn?',
        options: ['My name is John', 'I am fine', 'How are you?', 'Where are you from?'],
        correctAnswer: 0,
        explanation: 'My name is... được sử dụng để giới thiệu tên.',
        order: 1,
      },
      {
        id: '4',
        quizId: '2',
        question: 'Khi ai đó hỏi "Where are you from?", bạn trả lời như thế nào?',
        options: ['I am 25 years old', 'I am from Vietnam', 'I am a teacher', 'I am fine'],
        correctAnswer: 1,
        explanation: 'I am from... được sử dụng để nói về quê quán.',
        order: 2,
      },
    ],
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    lessonId: '3',
    title: 'Kiểm tra thì hiện tại đơn',
    description: 'Bài kiểm tra về thì hiện tại đơn trong tiếng Anh',
    questions: [
      {
        id: '5',
        quizId: '3',
        question: 'Câu nào sau đây sử dụng đúng thì hiện tại đơn?',
        options: ['He go to school', 'He goes to school', 'He going to school', 'He is go to school'],
        correctAnswer: 1,
        explanation: 'Với chủ ngữ số ít ngôi thứ 3, động từ phải thêm s/es.',
        order: 1,
      },
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

export const quizzesService = {
  async getQuizzes(lessonId?: string): Promise<ApiResponse<Quiz[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let quizzes = MOCK_QUIZZES;
    if (lessonId) {
      quizzes = MOCK_QUIZZES.filter(quiz => quiz.lessonId === lessonId);
    }
    
    return {
      data: quizzes,
      message: 'Quizzes retrieved successfully',
      success: true,
    };
  },

  async getQuiz(id: string): Promise<ApiResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quiz = MOCK_QUIZZES.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return {
      data: quiz,
      message: 'Quiz retrieved successfully',
      success: true,
    };
  },

  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_QUIZZES.push(newQuiz);

    return {
      data: newQuiz,
      message: 'Quiz created successfully',
      success: true,
    };
  },

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_QUIZZES.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }

    const updatedQuiz = {
      ...MOCK_QUIZZES[index],
      ...quizData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_QUIZZES[index] = updatedQuiz;

    return {
      data: updatedQuiz,
      message: 'Quiz updated successfully',
      success: true,
    };
  },

  async deleteQuiz(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_QUIZZES.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }

    MOCK_QUIZZES.splice(index, 1);

    return {
      data: undefined,
      message: 'Quiz deleted successfully',
      success: true,
    };
  },
};
