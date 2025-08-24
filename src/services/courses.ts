import { Course, ApiResponse } from '@/types';

// Mock data
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Basic English for Beginners',
    description: 'Learn the fundamentals of English language including basic vocabulary, grammar, and pronunciation.',
    level: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    lessonsCount: 12,
    studentsCount: 245,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Intermediate Grammar Mastery',
    description: 'Master intermediate English grammar concepts including tenses, conditionals, and complex sentence structures.',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    lessonsCount: 18,
    studentsCount: 189,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'Advanced Business English',
    description: 'Professional English for business communication, presentations, and formal writing.',
    level: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    lessonsCount: 24,
    studentsCount: 156,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'IELTS Preparation Course',
    description: 'Comprehensive preparation for all four IELTS test sections: Reading, Writing, Listening, and Speaking.',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
    lessonsCount: 30,
    studentsCount: 298,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '5',
    title: 'English Conversation Practice',
    description: 'Improve your speaking skills through interactive conversations and real-life scenarios.',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
    lessonsCount: 15,
    studentsCount: 167,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
];

export const coursesService = {
  async getCourses(): Promise<ApiResponse<Course[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: MOCK_COURSES,
      message: 'Courses retrieved successfully',
      success: true,
    };
  },

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const course = MOCK_COURSES.find(c => c.id === id);
    if (!course) {
      throw new Error('Course not found');
    }

    return {
      data: course,
      message: 'Course retrieved successfully',
      success: true,
    };
  },

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Course>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_COURSES.push(newCourse);

    return {
      data: newCourse,
      message: 'Course created successfully',
      success: true,
    };
  },

  async updateCourse(id: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_COURSES.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }

    const updatedCourse = {
      ...MOCK_COURSES[index],
      ...courseData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_COURSES[index] = updatedCourse;

    return {
      data: updatedCourse,
      message: 'Course updated successfully',
      success: true,
    };
  },

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = MOCK_COURSES.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }

    MOCK_COURSES.splice(index, 1);

    return {
      data: undefined,
      message: 'Course deleted successfully',
      success: true,
    };
  },
};
