import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Clock,
  Target,
  Users,
  BarChart3,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Award,
  Zap,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  description: string;
  examType: 'TOEIC' | 'IELTS' | 'General' | 'Business';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  attemptsCount: number;
  averageScore: number;
  passRate: number;
  tags: string[];
}

export const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        // Mock data for now
        const mockExams: Exam[] = [
          {
            id: 1,
            title: 'TOEIC Practice Test - Reading & Listening',
            description: 'Comprehensive TOEIC practice test covering all reading and listening sections with real-world scenarios.',
            examType: 'TOEIC',
            difficulty: 'Medium',
            duration: 120,
            totalQuestions: 100,
            totalPoints: 200,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-08-24T08:30:00Z',
            isActive: true,
            attemptsCount: 156,
            averageScore: 78.5,
            passRate: 85.2,
            tags: ['TOEIC', 'Reading', 'Listening', 'Business English']
          },
          {
            id: 2,
            title: 'IELTS Academic Writing Task 1 & 2',
            description: 'Focused practice on IELTS Academic Writing with detailed feedback and scoring criteria.',
            examType: 'IELTS',
            difficulty: 'Hard',
            duration: 60,
            totalQuestions: 2,
            totalPoints: 100,
            createdAt: '2024-02-20T14:30:00Z',
            updatedAt: '2024-08-23T16:45:00Z',
            isActive: true,
            attemptsCount: 89,
            averageScore: 72.3,
            passRate: 78.9,
            tags: ['IELTS', 'Writing', 'Academic', 'Essay']
          },
          {
            id: 3,
            title: 'Business English Vocabulary Quiz',
            description: 'Test your knowledge of essential business English vocabulary and phrases.',
            examType: 'Business',
            difficulty: 'Easy',
            duration: 30,
            totalQuestions: 25,
            totalPoints: 50,
            createdAt: '2024-03-10T09:15:00Z',
            updatedAt: '2024-08-22T11:20:00Z',
            isActive: true,
            attemptsCount: 234,
            averageScore: 85.7,
            passRate: 92.1,
            tags: ['Business', 'Vocabulary', 'Beginner', 'Corporate']
          },
          {
            id: 4,
            title: 'Advanced Grammar Challenge',
            description: 'Advanced English grammar concepts including complex sentence structures and advanced tenses.',
            examType: 'General',
            difficulty: 'Hard',
            duration: 45,
            totalQuestions: 40,
            totalPoints: 80,
            createdAt: '2024-04-05T16:45:00Z',
            updatedAt: '2024-08-15T13:10:00Z',
            isActive: true,
            attemptsCount: 67,
            averageScore: 68.9,
            passRate: 74.3,
            tags: ['Grammar', 'Advanced', 'Tenses', 'Complex Sentences']
          },
          {
            id: 5,
            title: 'TOEIC Speaking Practice',
            description: 'Practice TOEIC speaking section with AI-powered pronunciation feedback.',
            examType: 'TOEIC',
            difficulty: 'Medium',
            duration: 20,
            totalQuestions: 6,
            totalPoints: 60,
            createdAt: '2024-05-12T11:30:00Z',
            updatedAt: '2024-08-24T07:15:00Z',
            isActive: true,
            attemptsCount: 123,
            averageScore: 81.2,
            passRate: 88.7,
            tags: ['TOEIC', 'Speaking', 'Pronunciation', 'AI Feedback']
          },
          {
            id: 6,
            title: 'IELTS Listening Comprehension',
            description: 'IELTS listening practice with various accents and question types.',
            examType: 'IELTS',
            difficulty: 'Medium',
            duration: 30,
            totalQuestions: 40,
            totalPoints: 80,
            createdAt: '2024-06-18T13:20:00Z',
            updatedAt: '2024-08-21T15:30:00Z',
            isActive: false,
            attemptsCount: 45,
            averageScore: 75.6,
            passRate: 82.1,
            tags: ['IELTS', 'Listening', 'Accents', 'Comprehension']
          }
        ];
        setExams(mockExams);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to load exams');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || exam.examType === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && exam.isActive) ||
      (selectedStatus === 'inactive' && !exam.isActive);
    
    return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TOEIC': return 'bg-blue-100 text-blue-800';
      case 'IELTS': return 'bg-purple-100 text-purple-800';
      case 'Business': return 'bg-indigo-100 text-indigo-800';
      case 'General': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-white/60 backdrop-blur-sm rounded-2xl w-1/3 mb-8"></div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
            <div className="h-10 bg-white/60 backdrop-blur-sm rounded-xl w-1/4 mb-4"></div>
            <div className="h-10 bg-white/60 backdrop-blur-sm rounded-xl w-1/3"></div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-white/60 backdrop-blur-sm rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="text-center py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exams</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Exam Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Create and manage comprehensive English learning exams
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                <span>Create Exam</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/70 transition-all duration-200 border border-white/30">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="TOEIC">TOEIC</option>
              <option value="IELTS">IELTS</option>
              <option value="Business">Business</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exams ({filteredExams.length})</h3>
            <p className="text-gray-500 text-sm">Showing {filteredExams.length} of {exams.length} exams</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Import</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
                {/* Exam Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{exam.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exam.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-1 rounded-lg transition-colors ${
                      exam.isActive 
                        ? 'text-green-500 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}>
                      <Zap className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {exam.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{exam.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Exam Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.examType)}`}>
                      {exam.examType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(exam.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{exam.totalQuestions} Q</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Attempts</p>
                    <p className="text-lg font-semibold text-gray-900">{exam.attemptsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Score</p>
                    <p className="text-lg font-semibold text-gray-900">{exam.averageScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{exam.passRate}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {exam.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
