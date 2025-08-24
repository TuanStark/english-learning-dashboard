import { DashboardStats } from '@/types';

// Mock data for dashboard
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalUsers: 1247,
      totalExams: 24,
      totalVocabulary: 2340,
      totalGrammar: 186,
      averageScore: 78.5,
    };
  },

  async getMonthlyLearners(): Promise<{ month: string; learners: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
      { month: 'Jan', learners: 120 },
      { month: 'Feb', learners: 145 },
      { month: 'Mar', learners: 180 },
      { month: 'Apr', learners: 220 },
      { month: 'May', learners: 280 },
      { month: 'Jun', learners: 350 },
      { month: 'Jul', learners: 420 },
      { month: 'Aug', learners: 480 },
      { month: 'Sep', learners: 520 },
      { month: 'Oct', learners: 580 },
      { month: 'Nov', learners: 620 },
      { month: 'Dec', learners: 680 },
    ];
  },

  async getCompletionRates(): Promise<{ course: string; completion: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
      { course: 'Basic English', completion: 85 },
      { course: 'Intermediate Grammar', completion: 72 },
      { course: 'Advanced Conversation', completion: 68 },
      { course: 'Business English', completion: 79 },
      { course: 'IELTS Preparation', completion: 81 },
      { course: 'TOEFL Preparation', completion: 76 },
    ];
  },
};
