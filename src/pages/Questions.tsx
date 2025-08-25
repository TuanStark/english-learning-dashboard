import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  HelpCircle,
  Target,
  TrendingUp,
  Star,
  FileText,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  
  // Form state
  const [formData, setFormData] = useState({
    examId: 1,
    content: '',
    questionType: 'MultipleChoice',
    orderIndex: 1,
    points: 1.0
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
    loadExams();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response: any = await questionApi.getQuestions();
      console.log('Questions API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setQuestions(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setQuestions(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
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

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || question.examId?.toString() === selectedExam;
    const matchesType = selectedType === 'all' || question.questionType === selectedType;

    return matchesSearch && matchesExam && matchesType;
  });

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return 'success';
      case 'TrueFalse': return 'warning';
      case 'FillInTheBlank': return 'info';
      case 'Essay': return 'destructive';
      default: return 'secondary';
    }
  };

  const getExamTitle = (examId: number) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setFormData({
      examId: exams.length > 0 ? exams[0].id : 1,
      content: '',
      questionType: 'MultipleChoice',
      orderIndex: 1,
      points: 1.0
    });
    setShowCreateModal(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      examId: question.examId || 1,
      content: question.content || '',
      questionType: question.questionType || 'MultipleChoice',
      orderIndex: question.orderIndex || 1,
      points: question.points || 1.0
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingQuestion) {
        // Update question
        await questionApi.updateQuestion(editingQuestion.id, formData);
        await loadQuestions(); // Reload questions
        setShowCreateModal(false);
      } else {
        // Create question
        await questionApi.createQuestion(formData);
        await loadQuestions(); // Reload questions
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionApi.deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question. Please try again.');
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
                Question Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage questions, answers, and exam content
              </p>
            </div>
            <Button
              onClick={handleCreate}
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
                  <p className="text-sm font-medium text-slate-600">Multiple Choice</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {questions.filter(q => q.questionType === 'MultipleChoice').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">True/False</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {questions.filter(q => q.questionType === 'TrueFalse').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
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
                    {questions.reduce((sum, q) => sum + (q.points || 0), 0).toFixed(1)}
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
                    placeholder="Search questions..."
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

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                    <SelectItem value="TrueFalse">True/False</SelectItem>
                    <SelectItem value="FillInTheBlank">Fill in the Blank</SelectItem>
                    <SelectItem value="Essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
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
        ) : filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {question.content?.charAt(0) || 'Q'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg line-clamp-2">
                        {question.content}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getQuestionTypeColor(question.questionType || 'MultipleChoice')}>
                        {question.questionType || 'MultipleChoice'}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Order: {question.orderIndex}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {question.points || 1.0} pts
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {getExamTitle(question.examId || 1)}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        Question #{question.id}
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
              <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No questions found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedExam !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first question.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Question
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
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="content">Question Content *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter your question here..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
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
                  <Label htmlFor="questionType">Question Type *</Label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(value) => handleInputChange('questionType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                      <SelectItem value="TrueFalse">True/False</SelectItem>
                      <SelectItem value="FillInTheBlank">Fill in the Blank</SelectItem>
                      <SelectItem value="Essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="orderIndex">Order Index *</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={formData.orderIndex}
                    onChange={(e) => handleInputChange('orderIndex', parseInt(e.target.value) || 1)}
                    placeholder="Enter order index"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="points">Points *</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', parseFloat(e.target.value) || 1.0)}
                    placeholder="Enter points"
                    required
                  />
                </div>
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
                  {formLoading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Create Question')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
