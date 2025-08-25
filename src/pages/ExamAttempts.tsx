import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FileText,
  Target,
  Clock,
  User as UserIcon,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ExamAttempt, Exam, User } from '@/types/backend';

export default function ExamAttempts() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<ExamAttempt | null>(null);

  // Mock data for development
  const mockAttempts: ExamAttempt[] = [
    {
      id: 1,
      userId: 1,
      examId: 1,
      totalQuestions: 20,
      correctAnswers: 16,
      score: 80,
      status: "Completed",
      timeSpent: 90,
      startedAt: "2025-01-20T09:00:00Z",
      completedAt: "2025-01-20T10:30:00Z",
      createdAt: "2025-01-20T09:00:00Z",
      updatedAt: "2025-01-20T10:30:00Z"
    },
    {
      id: 2,
      userId: 2,
      examId: 1,
      totalQuestions: 20,
      correctAnswers: 0,
      score: 0,
      status: "InProgress",
      timeSpent: 45,
      startedAt: "2025-01-20T11:00:00Z",
      createdAt: "2025-01-20T11:00:00Z",
      updatedAt: "2025-01-20T11:00:00Z"
    },
    {
      id: 3,
      userId: 1,
      examId: 2,
      totalQuestions: 15,
      correctAnswers: 12,
      score: 80,
      status: "Completed",
      timeSpent: 75,
      startedAt: "2025-01-19T14:00:00Z",
      completedAt: "2025-01-19T15:15:00Z",
      createdAt: "2025-01-19T14:00:00Z",
      updatedAt: "2025-01-19T15:15:00Z"
    }
  ];

  const mockExams: Exam[] = [
    { 
      id: 1, 
      title: "Basic Grammar Test", 
      description: "Test basic grammar knowledge",
      duration: 60,
      difficulty: "Easy",
      type: "CUSTOM",
      isActive: true,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    { 
      id: 2, 
      title: "Vocabulary Quiz", 
      description: "Test vocabulary skills",
      duration: 45,
      difficulty: "Medium",
      type: "CUSTOM",
      isActive: true,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    }
  ];

  const mockUsers: User[] = [
    { 
      id: 1, 
      email: "john@example.com", 
      fullName: "John Doe",
      roleId: 1,
      isActive: true,
      emailVerified: true,
      status: "active",
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    { 
      id: 2, 
      email: "jane@example.com", 
      fullName: "Jane Smith",
      roleId: 1,
      isActive: true,
      emailVerified: true,
      status: "active",
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    }
  ];

  useEffect(() => {
    loadAttempts();
    loadExams();
    loadUsers();
  }, []);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      // const response = await examAttemptApi.getExamAttempts();
      // setAttempts(response.data || []);
      setAttempts(mockAttempts); // Using mock data for now
    } catch (error) {
      console.error('Error loading attempts:', error);
      setAttempts(mockAttempts);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      // const response = await examApi.getExams();
      // setExams(response.data || []);
      setExams(mockExams); // Using mock data for now
    } catch (error) {
      console.error('Error loading exams:', error);
      setExams(mockExams);
    }
  };

  const loadUsers = async () => {
    try {
      // const response = await userApi.getUsers();
      // setUsers(response.data || []);
      setUsers(mockUsers); // Using mock data for now
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(mockUsers);
    }
  };

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = 
      users.find(u => u.id === attempt.userId)?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users.find(u => u.id === attempt.userId)?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || attempt.examId.toString() === selectedExam;
    const matchesStatus = selectedStatus === 'all' || attempt.status === selectedStatus;
    const matchesUser = selectedUser === 'all' || attempt.userId.toString() === selectedUser;
    
    return matchesSearch && matchesExam && matchesStatus && matchesUser;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Abandoned': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'InProgress': return <Clock className="h-4 w-4" />;
      case 'Abandoned': return <XCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this attempt?')) {
      try {
        // await examAttemptApi.deleteExamAttempt(id);
        setAttempts(attempts.filter(a => a.id !== id));
        // Show success message
      } catch (error) {
        console.error('Error deleting attempt:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (attempt: ExamAttempt) => {
    setEditingAttempt(attempt);
    setShowCreateModal(true);
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Unknown User';
  };

  const getExamTitle = (examId: number) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Exam Attempts
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Monitor and manage student exam attempts and results
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Attempt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Attempts</p>
                  <p className="text-3xl font-bold text-slate-900">{attempts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {attempts.filter(a => a.status === 'Completed').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Progress</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {attempts.filter(a => a.status === 'InProgress').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Score</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {attempts.filter(a => a.status === 'Completed').length > 0
                      ? Math.round(attempts.filter(a => a.status === 'Completed').reduce((sum, a) => sum + (a.score || 0), 0) / attempts.filter(a => a.status === 'Completed').length)
                      : 0}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by user name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Abandoned">Abandoned</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedExam('all');
                    setSelectedStatus('all');
                    setSelectedUser('all');
                  }}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attempts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttempts.map((attempt) => (
              <Card key={attempt.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getStatusColor(attempt.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(attempt.status)}
                        {attempt.status}
                      </div>
                    </Badge>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(attempt)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(attempt.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium">{getUserName(attempt.userId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{getExamTitle(attempt.examId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{attempt.totalQuestions} questions</span>
                  </div>
                </div>

                {attempt.status === 'Completed' && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Score</span>
                      <span className={`text-lg font-bold ${getScoreColor(attempt.score || 0)}`}>
                        {attempt.score || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Correct: {attempt.correctAnswers || 0}/{attempt.totalQuestions}</span>
                      <span>Time: {formatDuration(attempt.timeSpent || 0)}</span>
                    </div>
                  </div>
                )}

                {attempt.status === 'InProgress' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Time Spent: {formatDuration(attempt.timeSpent || 0)}</span>
                      <span>Progress: {attempt.correctAnswers || 0}/{attempt.totalQuestions}</span>
                    </div>
                  </div>
                )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Started: {new Date(attempt.startedAt).toLocaleDateString()}</span>
                    {attempt.completedAt && (
                      <span>Ended: {new Date(attempt.completedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredAttempts.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No attempts found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedExam !== 'all' || selectedStatus !== 'all' || selectedUser !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No exam attempts have been recorded yet.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Attempt
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingAttempt ? 'Edit Exam Attempt' : 'Create New Attempt'}
            </h2>
            <p className="text-slate-600 mb-6">
              {editingAttempt 
                ? 'Update the attempt details below.'
                : 'Fill in the form below to create a new exam attempt.'}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                {editingAttempt ? 'Update Attempt' : 'Create Attempt'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
