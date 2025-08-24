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
    id: 2,
    title: 'Kiểm tra ngữ pháp trung cấp',
    description: 'Bài kiểm tra ngữ pháp tiếng Anh trình độ trung cấp',
    duration: 45,
    difficulty: 'Medium',
    isActive: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 3,
    title: 'Kiểm tra tổng hợp nâng cao',
    description: 'Bài kiểm tra tổng hợp các kỹ năng tiếng Anh nâng cao',
    duration: 60,
    difficulty: 'Hard',
    isActive: true,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
];

// Mock data cho Questions
const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    examId: 1,
    content: 'Từ nào sau đây có nghĩa là "gia đình"?',
    questionType: 'MultipleChoice',
    orderIndex: 1,
    points: 1,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    examId: 1,
    content: 'Cách phát âm của từ "water" là gì?',
    questionType: 'MultipleChoice',
    orderIndex: 2,
    points: 1,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 3,
    examId: 2,
    content: 'Chọn câu đúng ngữ pháp:',
    questionType: 'MultipleChoice',
    orderIndex: 1,
    points: 2,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
];

// Mock data cho Answer Options
const MOCK_ANSWER_OPTIONS: AnswerOption[] = [
  // Question 1 options
  { id: 1, questionId: 1, content: 'family', isCorrect: true, optionLabel: 'A', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 2, questionId: 1, content: 'house', isCorrect: false, optionLabel: 'B', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 3, questionId: 1, content: 'school', isCorrect: false, optionLabel: 'C', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 4, questionId: 1, content: 'work', isCorrect: false, optionLabel: 'D', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  
  // Question 2 options
  { id: 5, questionId: 2, content: '/ˈwɔːtər/', isCorrect: true, optionLabel: 'A', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 6, questionId: 2, content: '/ˈweɪtər/', isCorrect: false, optionLabel: 'B', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 7, questionId: 2, content: '/ˈwɪtər/', isCorrect: false, optionLabel: 'C', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 8, questionId: 2, content: '/ˈwʌtər/', isCorrect: false, optionLabel: 'D', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  
  // Question 3 options
  { id: 9, questionId: 3, content: 'She goes to school every day.', isCorrect: true, optionLabel: 'A', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
  { id: 10, questionId: 3, content: 'She go to school every day.', isCorrect: false, optionLabel: 'B', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
  { id: 11, questionId: 3, content: 'She going to school every day.', isCorrect: false, optionLabel: 'C', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
  { id: 12, questionId: 3, content: 'She is go to school every day.', isCorrect: false, optionLabel: 'D', createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
];

export const examsService = {
  // ================== EXAMS ==================
  async getExams(params: PaginationParams): Promise<PaginatedResponse<Exam>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let exams = MOCK_EXAMS.filter(exam => exam.isActive);
    
    // Search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      exams = exams.filter(exam => 
        exam.title.toLowerCase().includes(searchLower) ||
        exam.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    if (params.sortBy) {
      exams.sort((a, b) => {
        const aValue = (a as any)[params.sortBy!];
        const bValue = (b as any)[params.sortBy!];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aValue > bValue ? order : -order;
      });
    }
    
    // Pagination
    const total = exams.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedData = exams.slice(startIndex, endIndex);
    
    // Add questions count
    const dataWithQuestions = paginatedData.map(exam => ({
      ...exam,
      questions: MOCK_QUESTIONS.filter(q => q.examId === exam.id)
    }));
    
    return {
      data: dataWithQuestions,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    };
  },

  async getExam(id: number): Promise<ApiResponse<Exam>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const exam = MOCK_EXAMS.find(e => e.id === id);
    if (!exam) {
      throw new Error('Exam not found');
    }

    // Add questions with answer options
    const questions = MOCK_QUESTIONS
      .filter(q => q.examId === id)
      .map(question => ({
        ...question,
        answerOptions: MOCK_ANSWER_OPTIONS.filter(option => option.questionId === question.id)
      }));

    return {
      data: { ...exam, questions },
      message: 'Exam retrieved successfully',
      success: true,
    };
  },

  async createExam(examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Exam>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newExam: Exam = {
      ...examData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_EXAMS.push(newExam);

    return {
      data: newExam,
      message: 'Exam created successfully',
      success: true,
    };
  },

  async updateExam(id: number, examData: Partial<Exam>): Promise<ApiResponse<Exam>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_EXAMS.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exam not found');
    }

    const updatedExam = {
      ...MOCK_EXAMS[index],
      ...examData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_EXAMS[index] = updatedExam;

    return {
      data: updatedExam,
      message: 'Exam updated successfully',
      success: true,
    };
  },

  async deleteExam(id: number): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_EXAMS.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exam not found');
    }

    MOCK_EXAMS.splice(index, 1);

    return {
      data: undefined,
      message: 'Exam deleted successfully',
      success: true,
    };
  },

  // ================== QUESTIONS ==================
  async getQuestions(examId: number): Promise<ApiResponse<Question[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const questions = MOCK_QUESTIONS
      .filter(q => q.examId === examId)
      .map(question => ({
        ...question,
        answerOptions: MOCK_ANSWER_OPTIONS.filter(option => option.questionId === question.id)
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);

    return {
      data: questions,
      message: 'Questions retrieved successfully',
      success: true,
    };
  },

  async createQuestion(questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'> & { answerOptions: Omit<AnswerOption, 'id' | 'questionId' | 'createdAt' | 'updatedAt'>[] }): Promise<ApiResponse<Question>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newQuestion: Question = {
      id: Date.now(),
      examId: questionData.examId,
      content: questionData.content,
      questionType: questionData.questionType,
      orderIndex: questionData.orderIndex,
      points: questionData.points,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_QUESTIONS.push(newQuestion);

    // Add answer options
    questionData.answerOptions.forEach((option, index) => {
      const newOption: AnswerOption = {
        id: Date.now() + index + 1,
        questionId: newQuestion.id,
        content: option.content,
        isCorrect: option.isCorrect,
        optionLabel: option.optionLabel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_ANSWER_OPTIONS.push(newOption);
    });

    return {
      data: newQuestion,
      message: 'Question created successfully',
      success: true,
    };
  },

  async deleteQuestion(id: number): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const questionIndex = MOCK_QUESTIONS.findIndex(q => q.id === id);
    if (questionIndex === -1) {
      throw new Error('Question not found');
    }

    // Remove question
    MOCK_QUESTIONS.splice(questionIndex, 1);

    // Remove associated answer options
    const optionIndexes = MOCK_ANSWER_OPTIONS
      .map((option, index) => option.questionId === id ? index : -1)
      .filter(index => index !== -1)
      .reverse(); // Remove from end to avoid index shifting

    optionIndexes.forEach(index => {
      MOCK_ANSWER_OPTIONS.splice(index, 1);
    });

    return {
      data: undefined,
      message: 'Question deleted successfully',
      success: true,
    };
  },

  // ================== BULK IMPORT ==================
  async importExamFromFile(file: File): Promise<ApiResponse<{ imported: number; failed: number }>> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate file processing
    const mockResult = {
      imported: Math.floor(Math.random() * 10) + 1,
      failed: Math.floor(Math.random() * 2),
    };

    return {
      data: mockResult,
      message: `Đã import thành công ${mockResult.imported} bài kiểm tra, ${mockResult.failed} bài thất bại`,
      success: true,
    };
  },
};
