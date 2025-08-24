import { Vocabulary, VocabularyTopic, VocabularyExample, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import { fileImportService } from './fileImport';

// Mock data cho Vocabulary Topics
const MOCK_VOCABULARY_TOPICS: VocabularyTopic[] = [
  {
    id: 1,
    topicName: 'Gia đình',
    description: 'Từ vựng về các thành viên trong gia đình',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=200&fit=crop',
    orderIndex: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    topicName: 'Thức ăn và đồ uống',
    description: 'Từ vựng về thức ăn, đồ uống và nhà hàng',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
    orderIndex: 2,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    topicName: 'Giao thông',
    description: 'Từ vựng về phương tiện giao thông và đi lại',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
    orderIndex: 3,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// Mock data cho Vocabulary
const MOCK_VOCABULARIES: Vocabulary[] = [
  {
    id: 1,
    topicId: 1,
    englishWord: 'father',
    pronunciation: '/ˈfɑːðər/',
    vietnameseMeaning: 'bố, cha',
    wordType: 'Noun',
    difficultyLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    audioFile: '/audio/father.mp3',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    topicId: 1,
    englishWord: 'mother',
    pronunciation: '/ˈmʌðər/',
    vietnameseMeaning: 'mẹ',
    wordType: 'Noun',
    difficultyLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
    audioFile: '/audio/mother.mp3',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    topicId: 2,
    englishWord: 'apple',
    pronunciation: '/ˈæpəl/',
    vietnameseMeaning: 'quả táo',
    wordType: 'Noun',
    difficultyLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&h=150&fit=crop',
    audioFile: '/audio/apple.mp3',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 4,
    topicId: 2,
    englishWord: 'water',
    pronunciation: '/ˈwɔːtər/',
    vietnameseMeaning: 'nước',
    wordType: 'Noun',
    difficultyLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=150&h=150&fit=crop',
    audioFile: '/audio/water.mp3',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 5,
    topicId: 3,
    englishWord: 'car',
    pronunciation: '/kɑːr/',
    vietnameseMeaning: 'ô tô, xe hơi',
    wordType: 'Noun',
    difficultyLevel: 'Easy',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=150&h=150&fit=crop',
    audioFile: '/audio/car.mp3',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const vocabularyService = {
  // ================== VOCABULARY TOPICS ==================
  async getVocabularyTopics(): Promise<ApiResponse<VocabularyTopic[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: MOCK_VOCABULARY_TOPICS.filter(topic => topic.isActive),
      message: 'Vocabulary topics retrieved successfully',
      success: true,
    };
  },

  async createVocabularyTopic(topicData: Omit<VocabularyTopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<VocabularyTopic>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newTopic: VocabularyTopic = {
      ...topicData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_VOCABULARY_TOPICS.push(newTopic);

    return {
      data: newTopic,
      message: 'Vocabulary topic created successfully',
      success: true,
    };
  },

  async updateVocabularyTopic(id: number, topicData: Partial<VocabularyTopic>): Promise<ApiResponse<VocabularyTopic>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_VOCABULARY_TOPICS.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Vocabulary topic not found');
    }

    const updatedTopic = {
      ...MOCK_VOCABULARY_TOPICS[index],
      ...topicData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_VOCABULARY_TOPICS[index] = updatedTopic;

    return {
      data: updatedTopic,
      message: 'Vocabulary topic updated successfully',
      success: true,
    };
  },

  async deleteVocabularyTopic(id: number): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_VOCABULARY_TOPICS.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Vocabulary topic not found');
    }

    MOCK_VOCABULARY_TOPICS.splice(index, 1);

    return {
      data: undefined,
      message: 'Vocabulary topic deleted successfully',
      success: true,
    };
  },

  // ================== VOCABULARIES ==================
  async getVocabularies(params: PaginationParams & { topicId?: number }): Promise<PaginatedResponse<Vocabulary>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let vocabularies = MOCK_VOCABULARIES.filter(v => v.isActive);
    
    // Filter by topic
    if (params.topicId) {
      vocabularies = vocabularies.filter(v => v.topicId === params.topicId);
    }
    
    // Search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      vocabularies = vocabularies.filter(v => 
        v.englishWord.toLowerCase().includes(searchLower) ||
        v.vietnameseMeaning.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    if (params.sortBy) {
      vocabularies.sort((a, b) => {
        const aValue = (a as any)[params.sortBy!];
        const bValue = (b as any)[params.sortBy!];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aValue > bValue ? order : -order;
      });
    }
    
    // Pagination
    const total = vocabularies.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedData = vocabularies.slice(startIndex, endIndex);
    
    // Add topic info
    const dataWithTopics = paginatedData.map(vocab => ({
      ...vocab,
      topic: MOCK_VOCABULARY_TOPICS.find(t => t.id === vocab.topicId)
    }));
    
    return {
      data: dataWithTopics,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    };
  },

  async createVocabulary(vocabularyData: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Vocabulary>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newVocabulary: Vocabulary = {
      ...vocabularyData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_VOCABULARIES.push(newVocabulary);

    return {
      data: newVocabulary,
      message: 'Vocabulary created successfully',
      success: true,
    };
  },

  async updateVocabulary(id: number, vocabularyData: Partial<Vocabulary>): Promise<ApiResponse<Vocabulary>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_VOCABULARIES.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vocabulary not found');
    }

    const updatedVocabulary = {
      ...MOCK_VOCABULARIES[index],
      ...vocabularyData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_VOCABULARIES[index] = updatedVocabulary;

    return {
      data: updatedVocabulary,
      message: 'Vocabulary updated successfully',
      success: true,
    };
  },

  async deleteVocabulary(id: number): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_VOCABULARIES.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Vocabulary not found');
    }

    MOCK_VOCABULARIES.splice(index, 1);

    return {
      data: undefined,
      message: 'Vocabulary deleted successfully',
      success: true,
    };
  },

  // ================== BULK IMPORT ==================
  async importVocabulariesFromFile(file: File, topicId: number): Promise<ApiResponse<{ imported: number; failed: number; errors?: string[] }>> {
    try {
      // Process file using fileImportService
      const importResult = await fileImportService.processVocabularyImport(file, topicId);

      // Simulate saving to database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add imported vocabularies to mock data
      importResult.data.forEach((vocabData: any) => {
        const newVocabulary: Vocabulary = {
          ...vocabData,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_VOCABULARIES.push(newVocabulary);
      });

      return {
        data: {
          imported: importResult.success,
          failed: importResult.failed,
          errors: importResult.errors,
        },
        message: importResult.errors.length > 0
          ? `Import hoàn tất: ${importResult.success} thành công, ${importResult.failed} thất bại. Xem chi tiết lỗi bên dưới.`
          : `Đã import thành công ${importResult.success} từ vựng`,
        success: true,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi import file');
    }
  },
};
