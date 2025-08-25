import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  HelpCircle,
  Target,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { questionApi, examApi } from '@/services/api';
import type { Question, Exam } from '@/types/backend';

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Mock data for development
  const mockQuestions: Question[] = [
    {
      id: 1,
      examId: 1,
      content: "What is the correct form of the verb 'to be' in this sentence: 'I ___ a student'?",
      questionType: "MultipleChoice",
      orderIndex: 1,
      points: 1,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    {
      id: 2,
      examId: 1,
      content: "Choose the correct preposition: 'She is interested ___ learning English'",
      questionType: "MultipleChoice",
      orderIndex: 2,
      points: 1,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    {
      id: 3,
      examId: 2,
      content: "Fill in the blank: 'The weather ___ beautiful today'",
      questionType: "FillInBlank",
      orderIndex: 1,
      points: 2,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    }
  ];

  const mockExams: Exam[] = [
    { id: 1, title: "Basic Grammar Test", description: "Test basic grammar knowledge" },
    { id: 2, title: "Vocabulary Quiz", description: "Test vocabulary skills" }
  ];

  useEffect(() => {
    loadQuestions();
    loadExams();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      // const response = await questionApi.getQuestions();
      // setQuestions(response.data || []);
      setQuestions(mockQuestions); // Using mock data for now
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions(mockQuestions);
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

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || question.examId.toString() === selectedExam;
    const matchesType = selectedType === 'all' || question.questionType === selectedType;
    
    return matchesSearch && matchesExam && matchesType;
  });

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return 'bg-blue-100 text-blue-800';
      case 'FillInBlank': return 'bg-green-100 text-green-800';
      case 'TrueFalse': return 'bg-purple-100 text-purple-800';
      case 'Essay': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return <Target className="h-4 w-4" />;
      case 'FillInBlank': return <Edit className="h-4 w-4" />;
      case 'TrueFalse': return <HelpCircle className="h-4 w-4" />;
      case 'Essay': return <FileText className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        // await questionApi.deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
        // Show success message
      } catch (error) {
        console.error('Error deleting question:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Question Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage and organize exam questions across all tests
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Questions</p>
                  <p className="text-3xl font-bold text-slate-900">{questions.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Exams</p>
                  <p className="text-3xl font-bold text-slate-900">{exams.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Multiple Choice</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {questions.filter(q => q.questionType === 'MultipleChoice').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Points</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {questions.reduce((sum, q) => sum + q.points, 0)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search questions..."
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="MultipleChoice">Multiple Choice</option>
                  <option value="FillInBlank">Fill in Blank</option>
                  <option value="TrueFalse">True/False</option>
                  <option value="Essay">Essay</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedExam('all');
                    setSelectedType('all');
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

        {/* Questions Grid */}
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
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getQuestionTypeColor(question.questionType)}>
                      <div className="flex items-center gap-1">
                        {getQuestionTypeIcon(question.questionType)}
                        {question.questionType}
                      </div>
                    </Badge>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(question)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(question.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-3">
                    {question.content}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Exam:</span>
                      <span className="font-medium">
                        {exams.find(e => e.id === question.examId)?.title || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Order:</span>
                      <span className="font-medium">#{question.orderIndex}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Points:</span>
                      <span className="font-medium">{question.points} pt</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(question.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No questions found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedExam !== 'all' || selectedType !== 'all' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first question.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Question
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
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h2>
            <p className="text-slate-600 mb-6">
              {editingQuestion 
                ? 'Update the question details below.'
                : 'Fill in the form below to create a new question.'}
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
                {editingQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
