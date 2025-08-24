import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Eye,
  Filter
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [learningPathProgress, setLearningPathProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Modern mock data with realistic values
        const mockOverallStats = {
          totalUsers: 1247,
          totalGrammars: 89,
          totalVocabulary: 1243,
          totalExams: 52,
          totalBlogPosts: 38,
          activeUsers: 892,
          totalRevenue: 15420
        };
        setOverallStats(mockOverallStats);

        const mockAdminStats = {
          users: {
            newThisWeek: 28,
            newThisMonth: 94,
            active: 892,
            growth: 12.5
          },
          exams: {
            totalAttempts: 2847,
            averageScore: 78.5,
            completionRate: 89.2
          },
          popular: {
            grammars: [
              { name: 'Present Perfect', count: 156 },
              { name: 'Past Continuous', count: 134 },
              { name: 'Future Tenses', count: 98 }
            ],
            vocabulary: [
              { name: 'Business Terms', count: 234 },
              { name: 'Academic Words', count: 187 },
              { name: 'Daily Conversation', count: 156 }
            ]
          }
        };
        setAdminStats(mockAdminStats);

        const mockLearningPaths = [
          {
            pathId: 1,
            pathName: 'Beginner to Intermediate',
            targetLevel: 'B1',
            status: 'In Progress',
            progress: 68,
            totalSteps: 24,
            completedSteps: 16,
            startedAt: new Date('2024-01-15'),
            completedAt: null,
            difficulty: 'Medium',
            estimatedTime: '3 months'
          },
          {
            pathId: 2,
            pathName: 'TOEIC Preparation',
            targetLevel: 'B2',
            status: 'Completed',
            progress: 100,
            totalSteps: 18,
            completedSteps: 18,
            startedAt: new Date('2024-01-01'),
            completedAt: new Date('2024-03-15'),
            difficulty: 'Hard',
            estimatedTime: '2.5 months'
          },
          {
            pathId: 3,
            pathName: 'IELTS Advanced',
            targetLevel: 'C1',
            status: 'Not Started',
            progress: 0,
            totalSteps: 30,
            completedSteps: 0,
            startedAt: null,
            completedAt: null,
            difficulty: 'Expert',
            estimatedTime: '4 months'
          },
          {
            pathId: 4,
            pathName: 'Business English',
            targetLevel: 'B2',
            status: 'In Progress',
            progress: 45,
            totalSteps: 20,
            completedSteps: 9,
            startedAt: new Date('2024-02-01'),
            completedAt: null,
            difficulty: 'Medium',
            estimatedTime: '2 months'
          }
        ];
        setLearningPathProgress(mockLearningPaths);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Enhanced mock data for charts
  const examPerformanceData = [
    { month: 'Jan', completed: 45, averageScore: 78, users: 89 },
    { month: 'Feb', completed: 52, averageScore: 82, users: 94 },
    { month: 'Mar', completed: 48, averageScore: 79, users: 87 },
    { month: 'Apr', completed: 61, averageScore: 85, users: 102 },
    { month: 'May', completed: 55, averageScore: 81, users: 96 },
    { month: 'Jun', completed: 67, averageScore: 87, users: 108 }
  ];

  const vocabularyProgressData = [
    { difficulty: 'Beginner', mastered: 156, inProgress: 23, notStarted: 8 },
    { difficulty: 'Intermediate', mastered: 98, inProgress: 34, notStarted: 15 },
    { difficulty: 'Advanced', mastered: 67, inProgress: 28, notStarted: 22 },
    { difficulty: 'Expert', mastered: 34, inProgress: 19, notStarted: 31 }
  ];

  const userActivityData = [
    { hour: '00:00', users: 12, sessions: 18 },
    { hour: '04:00', users: 8, sessions: 12 },
    { hour: '08:00', users: 45, sessions: 67 },
    { hour: '12:00', users: 78, sessions: 112 },
    { hour: '16:00', users: 92, sessions: 134 },
    { hour: '20:00', users: 65, sessions: 89 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-white/60 backdrop-blur-sm rounded-2xl w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-white/60 backdrop-blur-sm rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="h-96 bg-white/60 backdrop-blur-sm rounded-2xl"></div>
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
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Modern Header with Glassmorphism */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Welcome back! Here's what's happening with your English learning platform.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center space-x-2 bg-yellow-100/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-800">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {overallStats?.totalUsers?.toLocaleString() || 0}
            </p>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{adminStats?.users?.growth || 12}% from last month
          </div>
        </div>

        {/* Total Exams */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Exams</p>
            <p className="text-3xl font-bold text-gray-900">
              {overallStats?.totalExams || 0}
            </p>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8% from last month
          </div>
        </div>

        {/* Total Vocabularies */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Vocabulary</p>
            <p className="text-3xl font-bold text-gray-900">
              {overallStats?.totalVocabulary?.toLocaleString() || 0}
            </p>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15% from last month
          </div>
        </div>

        {/* Total Attempts */}
        <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-900">
              {adminStats?.exams?.totalAttempts?.toLocaleString() || 0}
            </p>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{Math.round((adminStats?.exams?.totalAttempts / 2000) * 100)}% from last month
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Exam Performance Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Exam Performance</h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select className="bg-white/50 backdrop-blur-sm border-0 rounded-lg px-3 py-1 text-sm">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={examPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Exams Completed"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="averageScore" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Average Score"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Vocabulary Progress Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vocabulary Progress</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">By Difficulty</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vocabularyProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="difficulty" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="mastered" fill="#10B981" name="Mastered" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#3B82F6" name="In Progress" radius={[4, 4, 0, 0]} />
              <Bar dataKey="notStarted" fill="#F59E0B" name="Not Started" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activity Chart */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity (24h)</h3>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#8B5CF6" 
                fill="url(#gradient)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Distribution */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Learning Distribution</h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">This Month</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={[
                  { name: 'Vocabulary', value: 40, color: '#10B981' },
                  { name: 'Grammar', value: 25, color: '#3B82F6' },
                  { name: 'Exams', value: 20, color: '#F59E0B' },
                  { name: 'Practice', value: 15, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                                 label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Learning Path Progress */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Learning Path Progress</h3>
            <p className="text-gray-500 text-sm">Track your learning journey across different paths</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Eye className="h-4 w-4" />
            <span>View All Paths</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningPathProgress.map((path) => (
            <div key={path.pathId} className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    path.progress >= 80 ? 'bg-green-500' :
                    path.progress >= 50 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-xs font-medium text-gray-600">{path.difficulty}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  path.progress >= 80 ? 'bg-green-100 text-green-800' :
                  path.progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {path.status}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{path.pathName}</h4>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      path.progress >= 80 ? 'bg-green-500' :
                      path.progress >= 50 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{path.completedSteps}/{path.totalSteps} steps</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {path.estimatedTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
