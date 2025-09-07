import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  Clock,
  FileText,
  Lightbulb,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { grammarApi, grammarExampleApi, questionApi, examApi, answerOptionApi } from '@/services/api';
import { useToast } from '@/components/ui/toast';
import type { Grammar, GrammarExample, Question, Exam } from '@/types/backend';

export default function Grammar() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'rules' | 'examples' | 'exams'>('rules');
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [examples, setExamples] = useState<GrammarExample[]>([]);
  const [grammarExams, setGrammarExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedGrammarId, setSelectedGrammarId] = useState<number | null>(null);
  
  // Modal states
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showBulkQuestionsModal, setShowBulkQuestionsModal] = useState(false);
  const [showGrammarDetailModal, setShowGrammarDetailModal] = useState(false);
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingGrammar, setEditingGrammar] = useState<Grammar | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  
  // Form states
  const [grammarForm, setGrammarForm] = useState({
    title: '',
    content: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: 'Grammar',
    isActive: true
  });

  const [examForm, setExamForm] = useState({
    grammarId: 1,
    title: '',
    description: '',
    duration: 60,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    isActive: true
  });

  const [questionForm, setQuestionForm] = useState({
    examId: 0,
    content: '',
    questionType: 'MultipleChoice' as 'MultipleChoice' | 'FillInBlank' | 'TrueFalse',
    orderIndex: 1,
    points: 1,
    isActive: true,
    answerOptions: [
      { content: '', isCorrect: false, optionLabel: 'A' },
      { content: '', isCorrect: false, optionLabel: 'B' },
      { content: '', isCorrect: false, optionLabel: 'C' },
      { content: '', isCorrect: false, optionLabel: 'D' }
    ]
  });

  const [bulkQuestionsForm, setBulkQuestionsForm] = useState({
    examId: 0,
    questionsText: '',
    questionType: 'MultipleChoice' as 'MultipleChoice' | 'FillInBlank' | 'TrueFalse',
    points: 1,
    isActive: true,
    includeAnswers: true,
    importFormat: 'simple' as 'simple' | 'detailed' // simple: chỉ câu hỏi, detailed: có đáp án
  });

  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadGrammars(),
        loadExamples(),
        loadGrammarExams()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExamples = async () => {
    try {
      const response = await grammarExampleApi.getExamples();
      let examplesData: GrammarExample[] = [];
      
      if (Array.isArray(response)) {
        examplesData = response as unknown as GrammarExample[];
      } else if (response?.data) {
        const responseData = response.data as any;
        examplesData = Array.isArray(responseData) ? responseData as unknown as GrammarExample[] : responseData.data as unknown as GrammarExample[] || [];
      }
      
      setExamples(examplesData);
    } catch (error) {
      console.error('Error loading examples:', error);
      setExamples([]);
    }
  };

  const loadGrammarExams = async () => {
    try {
      const response = await examApi.getExams();
      let allExams: Exam[] = [];
      
      if (Array.isArray(response)) {
        allExams = response as unknown as Exam[];
      } else if (response?.data) {
        const responseData = response.data as any;
        allExams = Array.isArray(responseData) ? responseData as unknown as Exam[] : responseData.data as unknown as Exam[] || [];
      }
      
      // Chỉ lấy những exam có type = GRAMMAR
      const grammarExamsData = allExams.filter(exam => exam.type === 'GRAMMAR');
      
      setGrammarExams(grammarExamsData);
    } catch (error) {
      console.error('Error loading grammar exams:', error);
      setGrammarExams([]);
    }
  };

  const loadGrammars = async () => {
    try {
      setLoading(true);
      const response: any = await grammarApi.getGrammar();
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setGrammars(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setGrammars(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setGrammars(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading grammars:', error);
      setGrammars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrammars = grammars.filter(grammar => {
    const matchesSearch = 
      grammar.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grammar.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || grammar.difficultyLevel === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const filteredExamples = examples.filter(example => {
    const matchesSearch = 
      example.englishSentence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      example.vietnameseSentence?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrammar = selectedGrammarId === null || example.grammarId === selectedGrammarId;
    return matchesSearch && matchesGrammar;
  });

  const filteredGrammarExams = grammarExams.filter(exam => {
    const matchesSearch = 
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrammar = selectedGrammarId === null || exam.grammarId === selectedGrammarId;
    return matchesSearch && matchesGrammar;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };


  const handleCreateExam = () => {
    setEditingExam(null);
    setExamForm({
      grammarId: selectedGrammarId || 1,
      title: '',
      description: '',
      duration: 60,
      difficulty: 'Medium',
      isActive: true
    });
    setShowExamModal(true);
  };

  const handleCreateQuestion = (exam: Exam) => {
    setSelectedExam(exam);
    setEditingQuestion(null);
    setQuestionForm({
      examId: exam.id,
      content: '',
      questionType: 'MultipleChoice',
      orderIndex: 1,
      points: 1,
      isActive: true,
      answerOptions: [
        { content: '', isCorrect: false, optionLabel: 'A' },
        { content: '', isCorrect: false, optionLabel: 'B' },
        { content: '', isCorrect: false, optionLabel: 'C' },
        { content: '', isCorrect: false, optionLabel: 'D' }
      ]
    });
    setShowQuestionModal(true);
  };

  const handleCreateBulkQuestions = (exam: Exam) => {
    setSelectedExam(exam);
    setBulkQuestionsForm({
      examId: exam.id,
      questionsText: '',
      questionType: 'MultipleChoice',
      points: 1,
      isActive: true,
      includeAnswers: true,
      importFormat: 'simple'
    });
    setShowBulkQuestionsModal(true);
  };

  const handleViewGrammarDetail = (grammar: Grammar) => {
    setSelectedGrammar(grammar);
    setShowGrammarDetailModal(true);
  };

  const handleCreateGrammar = () => {
    setEditingGrammar(null);
    setGrammarForm({
      title: '',
      content: '',
      difficulty: 'Easy',
      category: 'Grammar',
      isActive: true
    });
    setShowGrammarModal(true);
  };

  const handleEditGrammar = (grammar: Grammar) => {
    setEditingGrammar(grammar);
    setGrammarForm({
      title: grammar.title,
      content: grammar.content,
      difficulty: grammar.difficultyLevel,
      category: 'Grammar',
      isActive: grammar.isActive
    });
    setShowGrammarModal(true);
  };

  const handleSubmitGrammar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingGrammar) {
        // Update grammar
        await grammarApi.updateGrammar(editingGrammar.id, grammarForm);
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Cập nhật quy tắc ngữ pháp thành công!'
        });
      } else {
        // Create grammar
        await grammarApi.createGrammar(grammarForm);
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Tạo quy tắc ngữ pháp thành công!'
        });
      }
      
      setShowGrammarModal(false);
      loadData(); // Reload data
    } catch (error: any) {
      console.error('Error saving grammar:', error);
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: error.response?.data?.message || error.message
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      
      const examData = {
        ...examForm,
        type: 'GRAMMAR' as const
      };
      
      if (editingExam) {
        // Update exam
        const response = await examApi.updateExam(editingExam.id, examData);
        if (response) {
          addToast({
            type: 'success',
            title: 'Thành công!',
            description: 'Cập nhật bài thi ngữ pháp thành công!'
          });
        }
        await loadGrammarExams();
        setShowExamModal(false);
      } else {
        // Create exam
        const response = await examApi.createExam(examData);
        if (response) {
          addToast({
            type: 'success',
            title: 'Thành công!',
            description: 'Tạo bài thi ngữ pháp thành công!'
          });
        }
        await loadGrammarExams();
        setShowExamModal(false);
      }
    } catch (error: any) {
      console.error('Error saving exam:', error);
      console.error('Error details:', error.response?.data || error.message);
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: `Lỗi lưu bài thi: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      
      if (editingQuestion) {
        // Update question
        const questionData = {
          examId: questionForm.examId,
          content: questionForm.content,
          questionType: questionForm.questionType,
          orderIndex: questionForm.orderIndex,
          points: questionForm.points,
          isActive: questionForm.isActive
        };
        const response = await questionApi.updateQuestion(editingQuestion.id, questionData);
        if (response) {
          addToast({
            type: 'success',
            title: 'Thành công!',
            description: 'Cập nhật câu hỏi thành công!'
          });
        }
        setShowQuestionModal(false);
      } else {
        // Create question
        const questionData = {
          examId: questionForm.examId,
          content: questionForm.content,
          questionType: questionForm.questionType,
          orderIndex: questionForm.orderIndex,
          points: questionForm.points,
          isActive: questionForm.isActive
        };
        
        const response = await questionApi.createQuestion(questionData);
        if (response) {
          addToast({
            type: 'success',
            title: 'Thành công!',
            description: 'Tạo câu hỏi thành công!'
          });
        }
        // Get question ID from response
        const questionId = (response as any)?.id || (response as any)?.data?.id;
        
        if (questionId && questionForm.answerOptions.length > 0) {
          // Create answer options - each option as separate record
          for (const option of questionForm.answerOptions) {
            if (option.content.trim()) {
              try {
                await answerOptionApi.createAnswerOption({
                  content: option.content,
                  isCorrect: option.isCorrect,
                  optionLabel: option.optionLabel,
                  questionId: questionId
                });
              } catch (error) {
                console.error(`Failed to create answer option ${option.optionLabel}:`, error);
              }
            }
          }
        }
        setShowQuestionModal(false);
      }
    } catch (error: any) {
      console.error('Error saving question:', error);
      console.error('Error details:', error.response?.data || error.message);
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: `Lỗi lưu câu hỏi: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Parse detailed questions with answers
  const parseDetailedQuestions = (text: string, examId: number) => {
    const questionBlocks = text.trim().split('---').filter(block => block.trim());
    
    return questionBlocks.map((block, index) => {
      const lines = block.trim().split('\n').filter(line => line.trim());
      
      // First line is the question
      const questionContent = lines[0]?.replace(/^Question \d+:\s*/, '') || '';
      
      // Parse answer options
      const answerOptions = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const isCorrect = line.includes('*');
          const content = line.replace(/\*$/, '').trim();
          
          if (content) {
            answerOptions.push({
              content: content,
              isCorrect: isCorrect,
              optionLabel: String.fromCharCode(65 + answerOptions.length) // A, B, C, D...
            });
          }
        }
      }
      
      return {
        examId: examId,
        content: questionContent,
        questionType: 'MultipleChoice' as const,
        orderIndex: index + 1,
        points: bulkQuestionsForm.points,
        isActive: bulkQuestionsForm.isActive,
        answerOptions: answerOptions
      };
    });
  };

  const handleSubmitBulkQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      
      // Parse questions from text based on format
      let questions: any[] = [];
      
      if (bulkQuestionsForm.importFormat === 'detailed') {
        // Parse detailed format with answers
        questions = parseDetailedQuestions(bulkQuestionsForm.questionsText, bulkQuestionsForm.examId);
      } else {
        // Parse simple format (one question per line)
        questions = bulkQuestionsForm.questionsText
          .split('\n')
          .filter(line => line.trim())
          .map((line, index) => ({
            examId: bulkQuestionsForm.examId,
            content: line.trim(),
            questionType: bulkQuestionsForm.questionType,
            orderIndex: index + 1,
            points: bulkQuestionsForm.points,
            isActive: bulkQuestionsForm.isActive
          }));
      }
      
      
      // Create questions with answer options
      for (const question of questions) {
        const questionData = {
          examId: question.examId,
          content: question.content,
          questionType: question.questionType,
          orderIndex: question.orderIndex,
          points: question.points,
          isActive: question.isActive
        };
        
        const response = await questionApi.createQuestion(questionData);
        const questionId = (response as any)?.id || (response as any)?.data?.id;
        
        if (questionId) {
          // Create answer options - each option as separate record
          if (bulkQuestionsForm.importFormat === 'detailed' && question.answerOptions) {
            // Use parsed answer options - create each option separately
            for (const option of question.answerOptions) {
              try {
                await answerOptionApi.createAnswerOption({
                  content: option.content,
                  isCorrect: option.isCorrect,
                  optionLabel: option.optionLabel,
                  questionId: questionId
                });
              } catch (error) {
                console.error(`Failed to create answer option ${option.optionLabel}:`, error);
              }
            }
          } else if (bulkQuestionsForm.includeAnswers && bulkQuestionsForm.questionType === 'MultipleChoice') {
            // Create default answer options - each option as separate record
            const defaultOptions = [
              { content: 'Option A', isCorrect: true, optionLabel: 'A' },
              { content: 'Option B', isCorrect: false, optionLabel: 'B' },
              { content: 'Option C', isCorrect: false, optionLabel: 'C' },
              { content: 'Option D', isCorrect: false, optionLabel: 'D' }
            ];
            
            for (const option of defaultOptions) {
              try {
                await answerOptionApi.createAnswerOption({
                  content: option.content,
                  isCorrect: option.isCorrect,
                  optionLabel: option.optionLabel,
                  questionId: questionId
                });
              } catch (error) {
                console.error(`Failed to create default answer option ${option.optionLabel}:`, error);
              }
            }
          }
        }
      }
      
      addToast({
        type: 'success',
        title: 'Thành công!',
        description: `Đã tạo thành công ${questions.length} câu hỏi${bulkQuestionsForm.includeAnswers ? ' với đáp án mặc định' : ''}!`
      });
      setShowBulkQuestionsModal(false);
      
    } catch (error: any) {
      console.error('Error saving bulk questions:', error);
      console.error('Error details:', error.response?.data || error.message);
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: `Lỗi lưu câu hỏi: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setFormLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ngữ pháp</h1>
          <p className="text-gray-600">Hệ thống quản lý quy tắc ngữ pháp, ví dụ và bài tập</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'rules', label: 'Quy tắc', icon: FileText, count: grammars.length },
                { id: 'examples', label: 'Ví dụ', icon: Lightbulb, count: examples.length },
                { id: 'exams', label: 'Bài thi ngữ pháp', icon: HelpCircle, count: grammarExams.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'rules' && renderGrammarRulesTab()}
        {activeTab === 'examples' && renderExamplesTab()}
        {activeTab === 'exams' && renderExamsTab()}
      </div>

      {/* Modals */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingExam ? 'Chỉnh sửa bài thi ngữ pháp' : 'Tạo bài thi ngữ pháp mới'}
            </h2>
            
            <form onSubmit={handleSubmitExam} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tên bài thi *</Label>
                  <Input
                    id="title"
                    value={examForm.title}
                    onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tên bài thi ngữ pháp"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                    id="description"
                    value={examForm.description}
                    onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Nhập mô tả bài thi"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="grammarId">Quy tắc ngữ pháp *</Label>
                  <Select
                    value={examForm.grammarId.toString()}
                    onValueChange={(value) => setExamForm(prev => ({ ...prev, grammarId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quy tắc ngữ pháp" />
                    </SelectTrigger>
                    <SelectContent>
                      {grammars.map(grammar => (
                        <SelectItem key={grammar.id} value={grammar.id.toString()}>
                          {grammar.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Thời gian (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={examForm.duration}
                    onChange={(e) => setExamForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    placeholder="Thời gian làm bài"
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select
                    value={examForm.difficulty}
                    onValueChange={(value) => setExamForm(prev => ({ ...prev, difficulty: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Dễ</SelectItem>
                      <SelectItem value="Medium">Trung bình</SelectItem>
                      <SelectItem value="Hard">Khó</SelectItem>
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
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Hoạt động</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Đang lưu...' : (editingExam ? 'Cập nhật bài thi' : 'Tạo bài thi')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuestionModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'} - {selectedExam.title}
            </h2>
            
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="content">Nội dung câu hỏi *</Label>
                  <textarea
                    id="content"
                    value={questionForm.content}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Nhập nội dung câu hỏi..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType">Loại câu hỏi *</Label>
                  <Select
                    value={questionForm.questionType}
                    onValueChange={(value) => setQuestionForm(prev => ({ ...prev, questionType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại câu hỏi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MultipleChoice">Trắc nghiệm</SelectItem>
                      <SelectItem value="FillInBlank">Điền từ</SelectItem>
                      <SelectItem value="TrueFalse">Đúng/Sai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="orderIndex">Thứ tự</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={questionForm.orderIndex}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 1 }))}
                    placeholder="Thứ tự hiển thị"
                  />
                </div>
                
                <div>
                  <Label htmlFor="points">Điểm số</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseFloat(e.target.value) || 1 }))}
                    placeholder="Điểm số"
                  />
                </div>
              </div>
              
              {/* Answer Options Section */}
              {questionForm.questionType === 'MultipleChoice' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Đáp án</h4>
                  {questionForm.answerOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.isCorrect}
                          onChange={() => {
                            setQuestionForm(prev => ({
                              ...prev,
                              answerOptions: prev.answerOptions.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === index
                              }))
                            }));
                          }}
                          className="text-blue-600"
                        />
                        <Label className="font-medium">{option.optionLabel}</Label>
                      </div>
                      <Input
                        value={option.content}
                        onChange={(e) => {
                          setQuestionForm(prev => ({
                            ...prev,
                            answerOptions: prev.answerOptions.map((opt, i) => 
                              i === index ? { ...opt, content: e.target.value } : opt
                            )
                          }));
                        }}
                        placeholder={`Nhập đáp án ${option.optionLabel}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={questionForm.isActive}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Hoạt động</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Đang lưu...' : (editingQuestion ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkQuestionsModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tạo nhiều câu hỏi - {selectedExam.title}
            </h2>
            
            <form onSubmit={handleSubmitBulkQuestions} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="questionsText">Danh sách câu hỏi *</Label>
                  <textarea
                    id="questionsText"
                    value={bulkQuestionsForm.questionsText}
                    onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, questionsText: e.target.value }))}
                    placeholder={bulkQuestionsForm.importFormat === 'detailed' 
                      ? "Question 1: If he ___ harder, he would have passed the exam.&#10;studied&#10;had studied*&#10;was studying&#10;would study&#10;---&#10;Question 2: Hardly ___ the bus when it started to rain.&#10;had I left*&#10;I had left&#10;did I leave&#10;I left"
                      : "Nhập mỗi câu hỏi trên một dòng:&#10;1. What is the present simple tense?&#10;2. When do we use present simple?&#10;3. How do we form negative sentences?"
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bulkQuestionsForm.importFormat === 'detailed' 
                      ? "Format chi tiết: Câu hỏi + đáp án, đáp án đúng có dấu *"
                      : "Mỗi câu hỏi trên một dòng. Hệ thống sẽ tự động đánh số thứ tự."
                    }
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="importFormat">Format nhập liệu *</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="formatSimple"
                        name="importFormat"
                        value="simple"
                        checked={bulkQuestionsForm.importFormat === 'simple'}
                        onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, importFormat: e.target.value as any }))}
                        className="text-blue-600"
                      />
                      <Label htmlFor="formatSimple">Đơn giản (chỉ câu hỏi)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="formatDetailed"
                        name="importFormat"
                        value="detailed"
                        checked={bulkQuestionsForm.importFormat === 'detailed'}
                        onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, importFormat: e.target.value as any }))}
                        className="text-blue-600"
                      />
                      <Label htmlFor="formatDetailed">Chi tiết (câu hỏi + đáp án)</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="questionType">Loại câu hỏi *</Label>
                  <Select
                    value={bulkQuestionsForm.questionType}
                    onValueChange={(value) => setBulkQuestionsForm(prev => ({ ...prev, questionType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại câu hỏi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MultipleChoice">Trắc nghiệm</SelectItem>
                      <SelectItem value="FillInBlank">Điền từ</SelectItem>
                      <SelectItem value="TrueFalse">Đúng/Sai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="points">Điểm số cho mỗi câu</Label>
                  <Input
                    id="points"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={bulkQuestionsForm.points}
                    onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, points: parseFloat(e.target.value) || 1 }))}
                    placeholder="Điểm số"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={bulkQuestionsForm.isActive}
                    onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive">Hoạt động</Label>
                </div>
                
                {bulkQuestionsForm.questionType === 'MultipleChoice' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeAnswers"
                      checked={bulkQuestionsForm.includeAnswers}
                      onChange={(e) => setBulkQuestionsForm(prev => ({ ...prev, includeAnswers: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="includeAnswers">Tạo đáp án mặc định (A, B, C, D)</Label>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn:</h4>
                {bulkQuestionsForm.importFormat === 'detailed' ? (
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Format chi tiết:</strong> Câu hỏi + đáp án, phân cách bằng dấu ---</li>
                    <li>• <strong>Đáp án đúng:</strong> Đánh dấu bằng dấu * ở cuối</li>
                    <li>• <strong>Ví dụ:</strong> Question 1: If he ___ harder, he would have passed the exam.</li>
                    <li>• <strong>Đáp án:</strong> studied, had studied*, was studying, would study</li>
                    <li>• <strong>Phân cách:</strong> Dùng --- để ngăn cách các câu hỏi</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Mỗi câu hỏi trên một dòng riêng biệt</li>
                    <li>• Hệ thống sẽ tự động đánh số thứ tự từ 1</li>
                    <li>• Tất cả câu hỏi sẽ có cùng loại và điểm số</li>
                    <li>• Nếu chọn "Tạo đáp án mặc định", mỗi câu hỏi sẽ có 4 đáp án A, B, C, D</li>
                    <li>• Sau khi tạo, bạn có thể chỉnh sửa từng câu hỏi và đáp án riêng lẻ</li>
                  </ul>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowBulkQuestionsModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Đang tạo...' : 'Tạo nhiều câu hỏi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grammar Modal */}
      {showGrammarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGrammar ? 'Chỉnh sửa quy tắc ngữ pháp' : 'Tạo quy tắc ngữ pháp mới'}
            </h2>
            
            <form onSubmit={handleSubmitGrammar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tiêu đề quy tắc *</Label>
                  <Input
                    id="title"
                    value={grammarForm.title}
                    onChange={(e) => setGrammarForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề quy tắc ngữ pháp"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="content">Nội dung quy tắc *</Label>
                  <textarea
                    id="content"
                    value={grammarForm.content}
                    onChange={(e) => setGrammarForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Nhập nội dung chi tiết của quy tắc ngữ pháp..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Độ khó *</Label>
                  <Select
                    value={grammarForm.difficulty}
                    onValueChange={(value) => setGrammarForm(prev => ({ ...prev, difficulty: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Dễ</SelectItem>
                      <SelectItem value="Medium">Trung bình</SelectItem>
                      <SelectItem value="Hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    value={grammarForm.category}
                    onChange={(e) => setGrammarForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Danh mục quy tắc"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={grammarForm.isActive}
                  onChange={(e) => setGrammarForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Hoạt động</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowGrammarModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Đang lưu...' : (editingGrammar ? 'Cập nhật quy tắc' : 'Tạo quy tắc')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grammar Detail Modal */}
      {showGrammarDetailModal && selectedGrammar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết quy tắc ngữ pháp
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrammarDetailModal(false)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Grammar Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedGrammar.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getDifficultyColor(selectedGrammar.difficultyLevel)}>
                        {selectedGrammar.difficultyLevel}
                      </Badge>
                      <Badge variant="outline">
                        Thứ tự: {selectedGrammar.orderIndex}
                      </Badge>
                      <Badge variant="outline">
                        ID: {selectedGrammar.id}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Nội dung quy tắc:</h4>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedGrammar.content}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Related Examples */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  Ví dụ liên quan
                </h4>
                <div className="space-y-3">
                  {selectedGrammar.examples && selectedGrammar.examples.length > 0 ? (
                    selectedGrammar.examples.map((example, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tiếng Anh:</p>
                            <p className="text-gray-900">{example.englishSentence}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tiếng Việt:</p>
                            <p className="text-gray-900">{example.vietnameseSentence}</p>
                          </div>
                        </div>
                        {example.audioFile && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600 mb-1">Audio:</p>
                            <audio controls className="w-full">
                              <source src={example.audioFile} type="audio/mpeg" />
                              Trình duyệt không hỗ trợ audio.
                            </audio>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có ví dụ nào cho quy tắc này</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Related Questions */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Câu hỏi liên quan
                </h4>
                <div className="space-y-3">
                  {selectedGrammar.questions && selectedGrammar.questions.length > 0 ? (
                    selectedGrammar.questions.map((question, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-900 mb-2">{question.content}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{question.questionType}</Badge>
                              <Badge variant="outline">{question.points} điểm</Badge>
                              <Badge variant={question.isActive ? "default" : "secondary"}>
                                {question.isActive ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có câu hỏi nào cho quy tắc này</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6">
              <Button
                onClick={() => setShowGrammarDetailModal(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render functions for each tab
  function renderGrammarRulesTab() {
    return (
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tổng quy tắc</p>
                  <p className="text-2xl font-bold">{grammars.length}</p>
                </div>
                <BookOpen className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Dễ</p>
                  <p className="text-2xl font-bold">{grammars.filter(g => g.difficultyLevel === 'Easy').length}</p>
                </div>
                <Target className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Trung bình</p>
                  <p className="text-2xl font-bold">{grammars.filter(g => g.difficultyLevel === 'Medium').length}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Khó</p>
                  <p className="text-2xl font-bold">{grammars.filter(g => g.difficultyLevel === 'Hard').length}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm quy tắc ngữ pháp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Easy">Dễ</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="Hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleCreateGrammar}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm quy tắc
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGrammars.map(grammar => (
                <Card key={grammar.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {grammar.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                          {grammar.content}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => handleViewGrammarDetail(grammar)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditGrammar(grammar)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getDifficultyColor(grammar.difficultyLevel)}>
                        {grammar.difficultyLevel}
                      </Badge>
                      <Badge variant="outline">
                        Thứ tự: {grammar.orderIndex}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {grammar.id}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Mới tạo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderExamplesTab() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý ví dụ ngữ pháp</h2>
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm ví dụ
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExamples.map(example => (
            <Card key={example.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {example.englishSentence}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {example.vietnameseSentence}
                    </p>
                    {example.explanation && (
                      <p className="text-gray-500 text-xs">
                        Giải thích: {example.explanation}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Quy tắc ID: {example.grammarId}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderExamsTab() {
    return (
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tổng bài thi ngữ pháp</p>
                  <p className="text-2xl font-bold">{grammarExams.length}</p>
                </div>
                <HelpCircle className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Dễ</p>
                  <p className="text-2xl font-bold">{grammarExams.filter(e => e.difficulty === 'Easy').length}</p>
                </div>
                <Target className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Trung bình</p>
                  <p className="text-2xl font-bold">{grammarExams.filter(e => e.difficulty === 'Medium').length}</p>
                </div>
                <Edit className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Khó</p>
                  <p className="text-2xl font-bold">{grammarExams.filter(e => e.difficulty === 'Hard').length}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm bài thi ngữ pháp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={selectedGrammarId?.toString() || 'all'} 
                  onValueChange={(value) => setSelectedGrammarId(value === 'all' ? null : parseInt(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn quy tắc ngữ pháp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả quy tắc</SelectItem>
                    {grammars.map(grammar => (
                      <SelectItem key={grammar.id} value={grammar.id.toString()}>
                        {grammar.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleCreateExam}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài thi ngữ pháp
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGrammarExams.map(exam => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {exam.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {exam.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">
                            {exam.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {exam.duration} phút
                          </Badge>
                          <Badge variant="outline">
                            {exam.questions?.length || 0} câu hỏi
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleCreateQuestion(exam)}
                          title="Thêm câu hỏi"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => handleCreateBulkQuestions(exam)}
                          title="Tạo nhiều câu hỏi"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Quy tắc: {grammars.find(g => g.id === exam.grammarId)?.title || 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

}
