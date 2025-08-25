import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Hash,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { answerOptionApi, questionApi } from '@/services/api';
import type { AnswerOption, Question } from '@/types/backend';

export default function AnswerOptions() {
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all');
  const [selectedCorrectness, setSelectedCorrectness] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOption, setEditingOption] = useState<AnswerOption | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    questionId: 1,
    content: '',
    isCorrect: false,
    optionLabel: 'A'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadAnswerOptions();
    loadQuestions();
  }, []);

  const loadAnswerOptions = async () => {
    try {
      setLoading(true);
      const response: any = await answerOptionApi.getAnswerOptions();
      console.log('Answer Options API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setAnswerOptions(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setAnswerOptions(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setAnswerOptions(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading answer options:', error);
      setAnswerOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const response: any = await questionApi.getQuestions();
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
    }
  };

  const getQuestionContent = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.content : 'Unknown Question';
  };

  const getQuestionContentPreview = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return 'Unknown Question';
    return question.content?.length > 50 
      ? question.content.substring(0, 50) + '...' 
      : question.content;
  };

  const filteredOptions = answerOptions.filter(option => {
    const matchesSearch = 
      option.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.optionLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getQuestionContent(option.questionId)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuestion = selectedQuestion === 'all' || option.questionId?.toString() === selectedQuestion;
    const matchesCorrectness = selectedCorrectness === 'all' || 
      (selectedCorrectness === 'correct' && option.isCorrect) ||
      (selectedCorrectness === 'incorrect' && !option.isCorrect);

    return matchesSearch && matchesQuestion && matchesCorrectness;
  });

  const handleCreate = () => {
    setEditingOption(null);
    setFormData({
      questionId: questions.length > 0 ? questions[0].id : 1,
      content: '',
      isCorrect: false,
      optionLabel: 'A'
    });
    setShowCreateModal(true);
  };

  const handleEdit = (option: AnswerOption) => {
    setEditingOption(option);
    setFormData({
      questionId: option.questionId || 1,
      content: option.content || '',
      isCorrect: option.isCorrect || false,
      optionLabel: option.optionLabel || 'A'
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingOption) {
        // Update answer option
        await answerOptionApi.updateAnswerOption(editingOption.id, formData);
        await loadAnswerOptions(); // Reload options
        setShowCreateModal(false);
      } else {
        // Create answer option
        await answerOptionApi.createAnswerOption(formData);
        await loadAnswerOptions(); // Reload options
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving answer option:', error);
      alert('Error saving answer option. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this answer option?')) {
      try {
        await answerOptionApi.deleteAnswerOption(id);
        setAnswerOptions(answerOptions.filter(o => o.id !== id));
      } catch (error) {
        console.error('Error deleting answer option:', error);
        alert('Error deleting answer option. Please try again.');
      }
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Answer Options Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage answer options for questions and assessments
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Answer Option
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Options</p>
                  <p className="text-3xl font-bold text-slate-900">{answerOptions.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Correct Answers</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {answerOptions.filter(o => o.isCorrect).length}
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
                  <p className="text-sm font-medium text-slate-600">Incorrect Answers</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {answerOptions.filter(o => !o.isCorrect).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Unique Questions</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {new Set(answerOptions.map(o => o.questionId)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
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
                    placeholder="Search by content, label, or question..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    {questions.map((question) => (
                      <SelectItem key={question.id} value={question.id.toString()}>
                        {getQuestionContentPreview(question.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCorrectness} onValueChange={setSelectedCorrectness}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Answers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Answers</SelectItem>
                    <SelectItem value="correct">Correct Only</SelectItem>
                    <SelectItem value="incorrect">Incorrect Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options List */}
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
        ) : filteredOptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptions.map((option) => (
              <Card key={option.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {option.optionLabel || 'A'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(option)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(option.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg line-clamp-2">
                        {option.content}
                      </h3>
                    </div>

                    <div>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        <strong>Question:</strong> {getQuestionContentPreview(option.questionId)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={option.isCorrect ? 'success' : 'secondary'}>
                        {option.isCorrect ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {option.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {option.optionLabel}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Option #{option.id}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        Q#{option.questionId}
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
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No answer options found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedQuestion !== 'all' || selectedCorrectness !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first answer option.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Answer Option
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
              {editingOption ? 'Edit Answer Option' : 'Create New Answer Option'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="content">Answer Content *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter the answer option content..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionId">Question *</Label>
                  <Select
                    value={formData.questionId.toString()}
                    onValueChange={(value) => handleInputChange('questionId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions.map((question) => (
                        <SelectItem key={question.id} value={question.id.toString()}>
                          {getQuestionContentPreview(question.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="optionLabel">Option Label *</Label>
                  <Select
                    value={formData.optionLabel}
                    onValueChange={(value) => handleInputChange('optionLabel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionLabels.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCorrect"
                  checked={formData.isCorrect}
                  onChange={(e) => handleInputChange('isCorrect', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="isCorrect">This is the correct answer</Label>
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
                  {formLoading ? 'Saving...' : (editingOption ? 'Update Answer Option' : 'Create Answer Option')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
