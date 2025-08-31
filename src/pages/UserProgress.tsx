import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Book,
  BookOpen,
  Route,
  Target,
  Clock,
  Star,
  BarChart3,
  Users,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userApi } from '@/services/api';
import type { User } from '@/types/backend';

interface ProgressData {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  vocabularyProgress: {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    needsReviewWords: number;
    completionRate: number;
  };
  grammarProgress: {
    totalLessons: number;
    completedLessons: number;
    inProgressLessons: number;
    completionRate: number;
  };
  learningPathProgress: {
    totalPaths: number;
    completedPaths: number;
    inProgressPaths: number;
    averageScore: number;
  };
  examProgress: {
    totalExams: number;
    completedExams: number;
    averageScore: number;
    totalTimeSpent: number;
  };
  lastActivity: string;
  overallProgress: number;
}

export default function UserProgress() {
  const [users, setUsers] = useState<User[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedProgressType, setSelectedProgressType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('overallProgress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadUsers();
    generateMockProgressData();
  }, []);

  const loadUsers = async () => {
    try {
      const response: any = await userApi.getUsers();
      // Handle different response structures
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const generateMockProgressData = () => {
    // Generate mock progress data for demonstration
    const mockData: ProgressData[] = users.map((user) => ({
      id: user.id,
      userId: user.id,
      userName: user.fullName || 'Unknown User',
      userEmail: user.email || 'unknown@example.com',
      vocabularyProgress: {
        totalWords: 150 + Math.floor(Math.random() * 100),
        masteredWords: 80 + Math.floor(Math.random() * 40),
        learningWords: 30 + Math.floor(Math.random() * 20),
        needsReviewWords: 10 + Math.floor(Math.random() * 15),
        completionRate: 0.6 + Math.random() * 0.4
      },
      grammarProgress: {
        totalLessons: 25 + Math.floor(Math.random() * 15),
        completedLessons: 15 + Math.floor(Math.random() * 10),
        inProgressLessons: 5 + Math.floor(Math.random() * 5),
        completionRate: 0.5 + Math.random() * 0.5
      },
      learningPathProgress: {
        totalPaths: 8 + Math.floor(Math.random() * 5),
        completedPaths: 3 + Math.floor(Math.random() * 4),
        inProgressPaths: 2 + Math.floor(Math.random() * 3),
        averageScore: 75 + Math.random() * 25
      },
      examProgress: {
        totalExams: 12 + Math.floor(Math.random() * 8),
        completedExams: 8 + Math.floor(Math.random() * 4),
        averageScore: 80 + Math.random() * 20,
        totalTimeSpent: 120 + Math.floor(Math.random() * 180)
      },
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      overallProgress: 0.6 + Math.random() * 0.4
    }));

    setProgressData(mockData);
    setLoading(false);
  };

  const filteredProgress = progressData.filter(progress => {
    const matchesSearch = 
      progress.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === 'all' || progress.userId.toString() === selectedUser;
    const matchesType = selectedProgressType === 'all' || 
      (selectedProgressType === 'vocabulary' && progress.vocabularyProgress.completionRate > 0.5) ||
      (selectedProgressType === 'grammar' && progress.grammarProgress.completionRate > 0.5) ||
      (selectedProgressType === 'learning' && progress.learningPathProgress.completedPaths > 0) ||
      (selectedProgressType === 'exam' && progress.examProgress.completedExams > 0);

    return matchesSearch && matchesUser && matchesType;
  });

  const sortedProgress = [...filteredProgress].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'overallProgress':
        aValue = a.overallProgress;
        bValue = b.overallProgress;
        break;
      case 'vocabularyProgress':
        aValue = a.vocabularyProgress.completionRate;
        bValue = b.vocabularyProgress.completionRate;
        break;
      case 'grammarProgress':
        aValue = a.grammarProgress.completionRate;
        bValue = b.grammarProgress.completionRate;
        break;
      case 'learningPathProgress':
        aValue = a.learningPathProgress.averageScore;
        bValue = b.learningPathProgress.averageScore;
        break;
      case 'examProgress':
        aValue = a.examProgress.averageScore;
        bValue = b.examProgress.averageScore;
        break;
      default:
        aValue = a.overallProgress;
        bValue = b.overallProgress;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 0.8) return 'text-green-600';
    if (progress >= 0.6) return 'text-blue-600';
    if (progress >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 0.8) return 'bg-green-500';
    if (progress >= 0.6) return 'bg-blue-500';
    if (progress >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };



  const exportProgressData = () => {
    const csvContent = [
      ['User Name', 'Email', 'Overall Progress', 'Vocabulary Progress', 'Grammar Progress', 'Learning Path Progress', 'Exam Progress', 'Last Activity'],
      ...sortedProgress.map(progress => [
        progress.userName,
        progress.userEmail,
        `${(progress.overallProgress * 100).toFixed(1)}%`,
        `${(progress.vocabularyProgress.completionRate * 100).toFixed(1)}%`,
        `${(progress.grammarProgress.completionRate * 100).toFixed(1)}%`,
        `${(progress.learningPathProgress.averageScore).toFixed(1)}%`,
        `${(progress.examProgress.averageScore).toFixed(1)}%`,
        progress.lastActivity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-progress-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Phân Tích Tiến Độ Học Tập
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Theo dõi và phân tích tiến độ học tập của người dùng trên tất cả các mô-đun
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={generateMockProgressData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Làm Mới Dữ Liệu
              </Button>
              <Button
                onClick={exportProgressData}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất Báo Cáo
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Người Dùng</p>
                  <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Người Dùng Hoạt Động</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {progressData.filter(p => p.overallProgress > 0.3).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tiến Độ Trung Bình</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / progressData.length * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Người Dùng Thành Tích Cao</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {progressData.filter(p => p.overallProgress > 0.8).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tất Cả Người Dùng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Người Dùng</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedProgressType} onValueChange={setSelectedProgressType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tất Cả Tiến Độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="learning">Learning Paths</SelectItem>
                    <SelectItem value="exam">Exams</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overallProgress">Overall Progress</SelectItem>
                    <SelectItem value="vocabularyProgress">Vocabulary</SelectItem>
                    <SelectItem value="grammarProgress">Grammar</SelectItem>
                    <SelectItem value="learningPathProgress">Learning Paths</SelectItem>
                    <SelectItem value="examProgress">Exams</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-4 w-1/3"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedProgress.length > 0 ? (
          <div className="space-y-4">
            {sortedProgress.map((progress) => (
              <Card key={progress.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {progress.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{progress.userName}</h3>
                          <p className="text-slate-600 text-sm">{progress.userEmail}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          <Clock className="h-3 w-3 mr-1" />
                          {progress.lastActivity}
                        </Badge>
                      </div>

                      {/* Overall Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                          <span className={`text-sm font-bold ${getProgressColor(progress.overallProgress)}`}>
                            {(progress.overallProgress * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(progress.overallProgress)}`}
                            style={{ width: `${progress.overallProgress * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:w-96">
                      {/* Vocabulary Progress */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Book className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-xs font-medium text-slate-600">Vocabulary</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {(progress.vocabularyProgress.completionRate * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {progress.vocabularyProgress.masteredWords}/{progress.vocabularyProgress.totalWords} words
                        </div>
                      </div>

                      {/* Grammar Progress */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <BookOpen className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs font-medium text-slate-600">Grammar</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {(progress.grammarProgress.completionRate * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {progress.grammarProgress.completedLessons}/{progress.grammarProgress.totalLessons} lessons
                        </div>
                      </div>

                      {/* Learning Path Progress */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Route className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="text-xs font-medium text-slate-600">Paths</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {progress.learningPathProgress.averageScore.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {progress.learningPathProgress.completedPaths}/{progress.learningPathProgress.totalPaths} completed
                        </div>
                      </div>

                      {/* Exam Progress */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Target className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-xs font-medium text-slate-600">Exams</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {progress.examProgress.averageScore.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {progress.examProgress.completedExams}/{progress.examProgress.totalExams} exams
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No progress data found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedUser !== 'all' || selectedProgressType !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No user progress data available yet.'}
              </p>
              <Button
                onClick={generateMockProgressData}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Sample Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
