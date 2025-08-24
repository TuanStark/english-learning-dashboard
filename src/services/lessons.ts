import { Lesson, ApiResponse } from '@/types';

// Mock data
const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Chào hỏi cơ bản',
    description: 'Học cách chào hỏi trong tiếng Anh',
    content: 'Nội dung bài học về chào hỏi cơ bản...',
    order: 1,
    duration: 15,
    videoUrl: 'https://example.com/video1.mp4',
    audioUrl: 'https://example.com/audio1.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    courseId: '1',
    title: 'Giới thiệu bản thân',
    description: 'Học cách giới thiệu bản thân bằng tiếng Anh',
    content: 'Nội dung bài học về giới thiệu bản thân...',
    order: 2,
    duration: 20,
    videoUrl: 'https://example.com/video2.mp4',
    audioUrl: 'https://example.com/audio2.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    courseId: '2',
    title: 'Thì hiện tại đơn',
    description: 'Học về thì hiện tại đơn trong tiếng Anh',
    content: 'Nội dung bài học về thì hiện tại đơn...',
    order: 1,
    duration: 25,
    videoUrl: 'https://example.com/video3.mp4',
    audioUrl: 'https://example.com/audio3.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '4',
    courseId: '2',
    title: 'Thì hiện tại tiếp diễn',
    description: 'Học về thì hiện tại tiếp diễn trong tiếng Anh',
    content: 'Nội dung bài học về thì hiện tại tiếp diễn...',
    order: 2,
    duration: 30,
    videoUrl: 'https://example.com/video4.mp4',
    audioUrl: 'https://example.com/audio4.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
];

export const lessonsService = {
  async getLessons(courseId?: string): Promise<ApiResponse<Lesson[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let lessons = MOCK_LESSONS;
    if (courseId) {
      lessons = MOCK_LESSONS.filter(lesson => lesson.courseId === courseId);
    }
    
    return {
      data: lessons.sort((a, b) => a.order - b.order),
      message: 'Lessons retrieved successfully',
      success: true,
    };
  },

  async getLesson(id: string): Promise<ApiResponse<Lesson>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lesson = MOCK_LESSONS.find(l => l.id === id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    return {
      data: lesson,
      message: 'Lesson retrieved successfully',
      success: true,
    };
  },

  async createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lesson>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newLesson: Lesson = {
      ...lessonData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_LESSONS.push(newLesson);

    return {
      data: newLesson,
      message: 'Lesson created successfully',
      success: true,
    };
  },

  async updateLesson(id: string, lessonData: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_LESSONS.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }

    const updatedLesson = {
      ...MOCK_LESSONS[index],
      ...lessonData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_LESSONS[index] = updatedLesson;

    return {
      data: updatedLesson,
      message: 'Lesson updated successfully',
      success: true,
    };
  },

  async deleteLesson(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_LESSONS.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }

    MOCK_LESSONS.splice(index, 1);

    return {
      data: undefined,
      message: 'Lesson deleted successfully',
      success: true,
    };
  },
};
