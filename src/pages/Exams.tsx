import { useState, useEffect } from 'react';
import { Plus, Search, Clock, Target, TrendingUp, Star, FileText, CheckCircle, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examApi, questionApi, answerOptionApi, examAttemptApi, userApi } from '@/services/api';
import type { Exam, Question, AnswerOption, ExamAttempt, User } from '@/types/backend';

type TabType = 'exams' | 'attempts';

export default function Exams() {
  const [activeTab, setActiveTab] = useState<TabType>('exams');
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
 
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedExams, setExpandedExams] = useState<Set<number>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Modal states
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerOptionModal, setShowAnswerOptionModal] = useState(false);
  
  // Form states
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    isActive: true
  });
  
  const [questionForm, setQuestionForm] = useState({
    content: '',
    questionType: 'MultipleChoice',
    orderIndex: 1,
    points: 1.0,
    examId: 0
  });

  const [answerOptionForm, setAnswerOptionForm] = useState({
    content: '',
    isCorrect: false,
    optionLabel: 'A'
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingAnswerOption, setEditingAnswerOption] = useState<AnswerOption | null>(null);
  const [currentExamId, setCurrentExamId] = useState<number>(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  


  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadExams(), loadUsers()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      const response: any = await examApi.getExams();
      if (Array.isArray(response)) {
        setExams(response);
      } else if (response?.data) {
        setExams(Array.isArray(response.data) ? response.data : response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setExams([]);
    }
  };

  const loadQuestions = async (examId: number) => {
    try {
      const response: any = await questionApi.getQuestions();
      let allQuestions = [];
      if (Array.isArray(response)) {
        allQuestions = response;
      } else if (response?.data) {
        allQuestions = Array.isArray(response.data) ? response.data : response.data.data || [];
      }
      const examQuestions = allQuestions.filter((q: any) => q.examId === examId);
      setQuestions(examQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
    }
  };

  const loadAnswerOptions = async (questionId: number) => {
    try {
      const response: any = await answerOptionApi.getAnswerOptions();
      let allOptions = [];
      if (Array.isArray(response)) {
        allOptions = response;
      } else if (response?.data) {
        allOptions = Array.isArray(response.data) ? response.data : response.data.data || [];
      }
      const questionOptions = allOptions.filter((opt: any) => opt.questionId === questionId);
      setAnswerOptions(questionOptions);
    } catch (error) {
      console.error('Error loading answer options:', error);
      setAnswerOptions([]);
    }
  };



  const loadExamAttempts = async () => {
    try {
      const response: any = await examAttemptApi.getExamAttempts();
      let allAttempts = [];
      if (Array.isArray(response)) {
        allAttempts = response;
      } else if (response?.data) {
        allAttempts = Array.isArray(response.data) ? response.data : response.data.data || [];
      }
      setExamAttempts(allAttempts);
    } catch (error) {
      console.error('Error loading exam attempts:', error);
      setExamAttempts([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response: any = await userApi.getUsers();
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response?.data) {
        setUsers(Array.isArray(response.data) ? response.data : response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'attempts') {
      loadExamAttempts();
    }
  };

  const toggleExamExpansion = (examId: number) => {
    const newExpanded = new Set(expandedExams);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
      loadQuestions(examId);
    }
    setExpandedExams(newExpanded);
  };

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
      loadAnswerOptions(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleCreateExam = () => {
    setExamForm({
      title: '',
      description: '',
      duration: 60,
      difficulty: 'Easy',
      isActive: true
    });
    setShowExamModal(true);
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await examApi.createExam(examForm);
      await loadExams();
      setShowExamModal(false);
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Error saving exam. Please try again.');
    }
  };

  const handleCreateQuestion = (examId: number) => {
    setCurrentExamId(examId);
    setEditingQuestion(null);
    setQuestionForm({
      content: '',
      questionType: 'MultipleChoice',
      orderIndex: 1,
      points: 1.0,
      examId: examId
    });
    setShowQuestionModal(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        // Update question
        await questionApi.updateQuestion(editingQuestion.id, questionForm);
        await loadQuestions(currentExamId);
      } else {
        // Create question
        await questionApi.createQuestion({
          ...questionForm,
          examId: currentExamId
        });
        await loadQuestions(currentExamId);
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    }
  };

  // Answer Option CRUD functions
  const handleCreateAnswerOption = (questionId: number) => {
    setCurrentQuestionId(questionId);
    setEditingAnswerOption(null);
    setAnswerOptionForm({
      content: '',
      isCorrect: false,
      optionLabel: 'A'
    });
    setShowAnswerOptionModal(true);
  };

  const handleEditAnswerOption = (answerOption: AnswerOption) => {
    setEditingAnswerOption(answerOption);
    setAnswerOptionForm({
      content: answerOption.content,
      isCorrect: answerOption.isCorrect,
      optionLabel: answerOption.optionLabel
    });
    setShowAnswerOptionModal(true);
  };

  const handleSubmitAnswerOption = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnswerOption) {
        // Update answer option
        await answerOptionApi.updateAnswerOption(editingAnswerOption.id, {
          ...answerOptionForm,
          questionId: currentQuestionId
        });
        await loadAnswerOptions(currentQuestionId);
      } else {
        // Create answer option
        await answerOptionApi.createAnswerOption({
          ...answerOptionForm,
          questionId: currentQuestionId
        });
        await loadAnswerOptions(currentQuestionId);
      }
      setShowAnswerOptionModal(false);
      setEditingAnswerOption(null);
    } catch (error) {
      console.error('Error saving answer option:', error);
      alert('Error saving answer option. Please try again.');
    }
  };

  const handleDeleteAnswerOption = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this answer option?')) {
      try {
        await answerOptionApi.deleteAnswerOption(id);
        await loadAnswerOptions(currentQuestionId);
      } catch (error) {
        console.error('Error deleting answer option:', error);
        alert('Error deleting answer option. Please try again.');
      }
    }
  };



  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return 'info';
      case 'TrueFalse': return 'success';
      case 'Essay': return 'warning';
      default: return 'secondary';
    }
  };

  const renderExamsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Exams</p>
                <p className="text-3xl font-bold text-slate-900">{exams.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Easy Level</p>
                <p className="text-3xl font-bold text-slate-900">
                  {exams.filter(e => e.difficulty === 'Easy').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Medium Level</p>
                <p className="text-3xl font-bold text-slate-900">
                  {exams.filter(e => e.difficulty === 'Medium').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hard Level</p>
                <p className="text-3xl font-bold text-slate-900">
                  {exams.filter(e => e.difficulty === 'Hard').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Star className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExamExpansion(exam.id)}
                    className="p-1"
                  >
                    {expandedExams.has(exam.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {exam.title?.charAt(0) || 'E'}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{exam.title}</h3>
                    {exam.description && (
                      <p className="text-slate-600 text-sm">{exam.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getDifficultyColor(exam.difficulty || 'Easy')}>
                    {exam.difficulty || 'Easy'}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(exam.duration || 60)}
                  </Badge>
                  
                  <Badge variant={exam.isActive ? 'success' : 'secondary'}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Expanded Questions Section */}
              {expandedExams.has(exam.id) && (
                <div className="ml-16 space-y-4 border-l-2 border-slate-200 pl-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-700">Questions ({questions.length})</h4>
                    <Button
                      size="sm"
                      onClick={() => handleCreateQuestion(exam.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  
                  {questions.map((question) => (
                    <div key={question.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleQuestionExpansion(question.id)}
                            className="p-1"
                          >
                            {expandedQuestions.has(question.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingQuestion(question);
                              setQuestionForm({
                                content: question.content,
                                questionType: question.questionType,
                                orderIndex: question.orderIndex,
                                points: question.points,
                                examId: question.examId
                              });
                              setShowQuestionModal(true);
                            }}
                            className="text-xs h-7 px-2"
                          >
                            Edit
                          </Button>
                          
                          <Badge variant={getQuestionTypeColor(question.questionType)}>
                            {question.questionType}
                          </Badge>
                          
                          <span className="text-sm text-slate-600">
                            Points: {question.points}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-800 ml-8">{question.content}</p>
                      
                      {/* Answer Options Display */}
                      {expandedQuestions.has(question.id) && (
                        <div className="ml-8 mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-slate-600">Answer Options ({answerOptions.length})</h5>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCreateAnswerOption(question.id)}
                              className="text-xs h-7 px-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          {answerOptions.length > 0 ? (
                            <div className="space-y-2">
                              {answerOptions.map((option) => (
                                <div key={option.id} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                                  <Badge variant={option.isCorrect ? 'success' : 'secondary'} className="text-xs">
                                    {option.optionLabel}
                                  </Badge>
                                  <span className="text-sm text-slate-700 flex-1">
                                    {option.content}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {option.isCorrect && (
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditAnswerOption(option)}
                                      className="text-xs h-6 px-2 text-blue-600 hover:text-blue-700"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteAnswerOption(option.id)}
                                      className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500 italic">No options yet</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAttemptsTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Exam Attempts Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {examAttempts.filter(a => a.status === 'Completed').length}
              </div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {examAttempts.filter(a => a.status === 'InProgress').length}
              </div>
              <div className="text-sm text-slate-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {examAttempts.filter(a => a.status === 'Abandoned').length}
              </div>
              <div className="text-sm text-slate-600">Abandoned</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {examAttempts.map((attempt) => {
              const user = users.find(u => u.id === attempt.userId);
              const exam = exams.find(e => e.id === attempt.examId);
              
              return (
                <div key={attempt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.fullName || 'Unknown User'}</div>
                      <div className="text-sm text-slate-600">{exam?.title || 'Unknown Exam'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={attempt.status === 'Completed' ? 'success' : attempt.status === 'InProgress' ? 'warning' : 'destructive'}>
                      {attempt.status}
                    </Badge>
                    
                    {attempt.status === 'Completed' && (
                      <div className="text-right">
                        <div className="font-medium">{attempt.score}/{attempt.totalQuestions}</div>
                        <div className="text-sm text-slate-600">
                          {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-slate-500">
                      {attempt.timeSpent ? `${attempt.timeSpent}m` : 'N/A'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Exam Management System
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Unified interface for managing exams, questions, and attempts
              </p>
            </div>
            <Button
              onClick={handleCreateExam}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Exam
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            <Button
              variant={activeTab === 'exams' ? 'default' : 'ghost'}
              onClick={() => handleTabChange('exams')}
              className={`flex-1 ${activeTab === 'exams' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exams
            </Button>
            <Button
              variant={activeTab === 'attempts' ? 'default' : 'ghost'}
              onClick={() => handleTabChange('attempts')}
              className={`flex-1 ${activeTab === 'attempts' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Attempts
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'exams' && renderExamsTab()}
        {activeTab === 'attempts' && renderAttemptsTab()}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Exam</h2>
            
            <form onSubmit={handleSubmitExam} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={examForm.title}
                    onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter exam title"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={examForm.description}
                    onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter exam description"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={examForm.duration}
                    onChange={(e) => setExamForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    placeholder="Enter duration in minutes"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={examForm.difficulty}
                    onValueChange={(value) => setExamForm(prev => ({ ...prev, difficulty: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={examForm.isActive}
                  onChange={(e) => setExamForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Create Exam
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h2>
            
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <Label htmlFor="content">Question Content *</Label>
                <textarea
                  id="content"
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter question content"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={questionForm.questionType}
                    onValueChange={(value) => setQuestionForm(prev => ({ ...prev, questionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                      <SelectItem value="TrueFalse">True/False</SelectItem>
                      <SelectItem value="Essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="orderIndex">Order Index</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={questionForm.orderIndex}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 1 }))}
                    placeholder="Order"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0"
                    step="0.1"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseFloat(e.target.value) || 1.0 }))}
                    placeholder="Points"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answer Option Modal */}
      {showAnswerOptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAnswerOption ? 'Edit Answer Option' : 'Create New Answer Option'}
            </h2>
            
            <form onSubmit={handleSubmitAnswerOption} className="space-y-6">
              <div>
                <Label htmlFor="content">Answer Content *</Label>
                <Input
                  id="content"
                  value={answerOptionForm.content}
                  onChange={(e) => setAnswerOptionForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter answer option content"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionLabel">Option Label *</Label>
                  <Select
                    value={answerOptionForm.optionLabel}
                    onValueChange={(value) => setAnswerOptionForm(prev => ({ ...prev, optionLabel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCorrect"
                    checked={answerOptionForm.isCorrect}
                    onChange={(e) => setAnswerOptionForm(prev => ({ ...prev, isCorrect: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isCorrect">Correct Answer</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  {editingAnswerOption ? 'Update Option' : 'Create Option'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAnswerOptionModal(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
