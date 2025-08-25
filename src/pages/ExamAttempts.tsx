import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  Target,
  Star,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examAttemptApi, examApi, userApi } from '@/services/api';
import type { ExamAttempt, Exam, User } from '@/types/backend';

export default function ExamAttempts() {
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<ExamAttempt | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    userId: 1,
    examId: 1,
    score: 0,
    totalQuestions: 20,
    correctAnswers: 0,
    timeSpent: 0,
    status: 'InProgress' as 'InProgress' | 'Completed' | 'Abandoned',
    detailedResult: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadExamAttempts();
    loadExams();
    loadUsers();
  }, []);

  const loadExamAttempts = async () => {
    try {
      setLoading(true);
      const response: any = await examAttemptApi.getExamAttempts();
      console.log('Exam Attempts API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setExamAttempts(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setExamAttempts(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setExamAttempts(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading exam attempts:', error);
      setExamAttempts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      const response: any = await examApi.getExams();
      // Handle different response structures
      if (Array.isArray(response)) {
        setExams(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setExams(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setExams(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setExams([]);
    }
  };

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



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'InProgress': return 'warning';
      case 'Completed': return 'success';
      case 'Abandoned': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'InProgress': return <Clock className="h-3 w-3" />;
      case 'Completed': return <CheckCircle className="h-3 w-3" />;
      case 'Abandoned': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getExamTitle = (examId: number) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Unknown User';
  };

  const getUserEmail = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown Email';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  const filteredAttempts = examAttempts.filter(attempt => {
    const matchesSearch = 
      getUserName(attempt.userId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getExamTitle(attempt.examId)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || attempt.examId?.toString() === selectedExam;
    const matchesUser = selectedUser === 'all' || attempt.userId?.toString() === selectedUser;
    const matchesStatus = selectedStatus === 'all' || attempt.status === selectedStatus;

    return matchesSearch && matchesExam && matchesUser && matchesStatus;
  });

  const handleCreate = () => {
    setEditingAttempt(null);
    setFormData({
      userId: users.length > 0 ? users[0].id : 1,
      examId: exams.length > 0 ? exams[0].id : 1,
      score: 0,
      totalQuestions: 20,
      correctAnswers: 0,
      timeSpent: 0,
      status: 'InProgress',
      detailedResult: ''
    });
    setShowCreateModal(true);
  };

  const handleEdit = (attempt: ExamAttempt) => {
    setEditingAttempt(attempt);
    setFormData({
      userId: attempt.userId || 1,
      examId: attempt.examId || 1,
      score: attempt.score || 0,
      totalQuestions: attempt.totalQuestions || 20,
      correctAnswers: attempt.correctAnswers || 0,
      timeSpent: attempt.timeSpent || 0,
      status: attempt.status || 'InProgress',
      detailedResult: attempt.detailedResult ? JSON.stringify(attempt.detailedResult) : ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const submitData = {
        ...formData,
        detailedResult: formData.detailedResult ? JSON.parse(formData.detailedResult) : null
      };

      if (editingAttempt) {
        // Update attempt
        await examAttemptApi.updateExamAttempt(editingAttempt.id, submitData);
        await loadExamAttempts(); // Reload attempts
        setShowCreateModal(false);
      } else {
        // Create attempt
        await examAttemptApi.createExamAttempt(submitData);
        await loadExamAttempts(); // Reload attempts
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving exam attempt:', error);
      alert('Error saving exam attempt. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam attempt?')) {
      try {
        await examAttemptApi.deleteExamAttempt(id);
        setExamAttempts(examAttempts.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting exam attempt:', error);
        alert('Error deleting exam attempt. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Exam Attempts Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage exam attempts, results, and student performance
              </p>
            </div>
            <Button
              onClick={handleCreate}
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
                  <p className="text-3xl font-bold text-slate-900">{examAttempts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
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
                    {examAttempts.filter(a => a.status === 'InProgress').length}
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
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {examAttempts.filter(a => a.status === 'Completed').length}
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
                  <p className="text-sm font-medium text-slate-600">Average Score</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {examAttempts.length > 0 
                      ? formatScore(examAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / examAttempts.length)
                      : '0.0'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search by user or exam..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Exams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id.toString()}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Abandoned">Abandoned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Attempts List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAttempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttempts.map((attempt) => (
              <Card key={attempt.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {getUserName(attempt.userId)?.charAt(0) || 'U'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {getUserName(attempt.userId)}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {getUserEmail(attempt.userId)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-700 font-medium">
                        {getExamTitle(attempt.examId)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getStatusColor(attempt.status || 'InProgress')}>
                        {getStatusIcon(attempt.status || 'InProgress')}
                        {attempt.status || 'InProgress'}
                      </Badge>
                      
                      {attempt.score !== undefined && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {formatScore(attempt.score || 0)} pts
                        </Badge>
                      )}
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {attempt.correctAnswers || 0}/{attempt.totalQuestions || 0}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(attempt.timeSpent || 0)}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Attempt #{attempt.id}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No exam attempts found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedExam !== 'all' || selectedUser !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first exam attempt.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Attempt
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingAttempt ? 'Edit Exam Attempt' : 'Create New Exam Attempt'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userId">User *</Label>
                  <Select
                    value={formData.userId.toString()}
                    onValueChange={(value) => handleInputChange('userId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="examId">Exam *</Label>
                  <Select
                    value={formData.examId.toString()}
                    onValueChange={(value) => handleInputChange('examId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="totalQuestions">Total Questions *</Label>
                  <Input
                    id="totalQuestions"
                    type="number"
                    min="1"
                    value={formData.totalQuestions}
                    onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value) || 20)}
                    placeholder="Enter total questions"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="correctAnswers">Correct Answers</Label>
                  <Input
                    id="correctAnswers"
                    type="number"
                    min="0"
                    value={formData.correctAnswers}
                    onChange={(e) => handleInputChange('correctAnswers', parseInt(e.target.value) || 0)}
                    placeholder="Enter correct answers"
                  />
                </div>
                
                <div>
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.score}
                    onChange={(e) => handleInputChange('score', parseFloat(e.target.value) || 0)}
                    placeholder="Enter score"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeSpent">Time Spent (seconds)</Label>
                  <Input
                    id="timeSpent"
                    type="number"
                    min="0"
                    value={formData.timeSpent}
                    onChange={(e) => handleInputChange('timeSpent', parseInt(e.target.value) || 0)}
                    placeholder="Enter time in seconds"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Abandoned">Abandoned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="detailedResult">Detailed Result (JSON)</Label>
                <textarea
                  id="detailedResult"
                  value={formData.detailedResult}
                  onChange={(e) => handleInputChange('detailedResult', e.target.value)}
                  placeholder='{"answers": [{"questionId": 1, "selectedOption": "A", "isCorrect": true}]}'
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter detailed results in JSON format (optional)
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : (editingAttempt ? 'Update Attempt' : 'Create Attempt')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
