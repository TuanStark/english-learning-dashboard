import { useState, useEffect } from 'react';
import { examApi, questionApi, answerOptionApi, examAttemptApi, userApi } from '@/services/api';
import type { Exam, Question, AnswerOption, ExamAttempt, User } from '@/types/backend';

// Import components
import ExamHeader from '@/components/exams/ExamHeader';
import ExamTabs from '@/components/exams/ExamTabs';
import ExamsTab from '@/components/exams/ExamsTab';
import ExamAttemptsTab from '@/components/exams/ExamAttemptsTab';
import LoadingSpinner from '@/components/exams/LoadingSpinner';

// Import modal components
import ExamModal from '@/components/exams/ExamModal';
import QuestionModal from '@/components/exams/QuestionModal';
import AnswerOptionModal from '@/components/exams/AnswerOptionModal';
import TemplateModal from '@/components/exams/TemplateModal';
import BulkQuestionModal from '@/components/exams/BulkQuestionModal';
import BulkImportModal from '@/components/exams/BulkImportModal';



type TabType = 'exams' | 'attempts';

export default function Exams() {
  const [activeTab, setActiveTab] = useState<TabType>('exams');
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
 
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('📊 currentExamQuestions changed:', currentExamQuestions.length, 'questions');
  }, [currentExamQuestions]);
  
  useEffect(() => {
    console.log('📊 answerOptions changed:', answerOptions.length, 'options');
  }, [answerOptions]);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedExams, setExpandedExams] = useState<Set<number>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Modal states
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerOptionModal, setShowAnswerOptionModal] = useState(false);
  const [showBulkQuestionModal, setShowBulkQuestionModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  
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

  const [bulkQuestionForm, setBulkQuestionForm] = useState({
    questions: [
      {
        content: '',
        questionType: 'MultipleChoice' as 'MultipleChoice' | 'TrueFalse' | 'Essay',
        orderIndex: 1,
        points: 1.0,
        answerOptions: [
          { content: '', isCorrect: false, optionLabel: 'A' },
          { content: '', isCorrect: false, optionLabel: 'B' },
          { content: '', isCorrect: false, optionLabel: 'C' },
          { content: '', isCorrect: false, optionLabel: 'D' }
        ]
      }
    ]
  });

  const [bulkImportForm, setBulkImportForm] = useState({
    importText: '',
    questionType: 'MultipleChoice' as 'MultipleChoice' | 'TrueFalse' | 'Essay',
    points: 1.0,
    separator: '---'
  });

  const [questionTemplates] = useState([
    {
      name: 'Basic Multiple Choice',
      template: {
        content: 'What is the capital of France?',
        questionType: 'MultipleChoice' as 'MultipleChoice' | 'TrueFalse' | 'Essay',
        orderIndex: 1,
        points: 1.0,
        answerOptions: [
          { content: 'London', isCorrect: false, optionLabel: 'A' },
          { content: 'Paris', isCorrect: true, optionLabel: 'B' },
          { content: 'Berlin', isCorrect: false, optionLabel: 'C' },
          { content: 'Madrid', isCorrect: false, optionLabel: 'D' }
        ]
      }
    },
    {
      name: 'True/False Question',
      template: {
        content: 'The Earth is round.',
        questionType: 'TrueFalse' as 'MultipleChoice' | 'TrueFalse' | 'Essay',
        orderIndex: 1,
        points: 1.0,
        answerOptions: [
          { content: 'True', isCorrect: true, optionLabel: 'A' },
          { content: 'False', isCorrect: false, optionLabel: 'B' }
        ]
      }
    },
    {
      name: 'Essay Question',
      template: {
        content: 'Explain the benefits of renewable energy.',
        questionType: 'Essay' as 'MultipleChoice' | 'TrueFalse' | 'Essay',
        orderIndex: 1,
        points: 5.0,
        answerOptions: []
      }
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingAnswerOption, setEditingAnswerOption] = useState<AnswerOption | null>(null);
  const [currentExamId, setCurrentExamId] = useState<number>(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  


  useEffect(() => {
    console.log('🚀 Exams component mounted, loading all data...');
    loadAllData();
  }, []);

  const loadAllData = async () => {
    console.log('🔄 loadAllData called');
    try {
      setLoading(true);
      console.log('⏳ Loading exams, users, and answer options...');
      await Promise.all([
        loadExams(), 
        loadUsers(),
        loadAllAnswerOptions() // Pre-load all answer options
      ]);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('❌ Error in loadAllData:', error);
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
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
      setExams([]);
    }
  };

  const loadQuestions = async (examId: number) => {
    console.log('📚 loadQuestions called with examId:', examId);
    try {
      // Use the specific API to get questions for this exam
      const examQuestionsResponse: any = await questionApi.getQuestionsByExam(examId);
      console.log('📡 getQuestionsByExam API Response:', examQuestionsResponse);
      
      let examQuestions: any[] = [];
      if (Array.isArray(examQuestionsResponse)) {
        examQuestions = examQuestionsResponse;
        console.log('✅ Response is array, length:', examQuestions.length);
      } else if (examQuestionsResponse?.data) {
        examQuestions = Array.isArray(examQuestionsResponse.data) ? examQuestionsResponse.data : examQuestionsResponse.data.data || [];
        console.log('✅ Response has data, length:', examQuestions.length);
      } else {
        console.log('⚠️ Unexpected response format');
      }
      
      console.log('🔍 Questions for exam', examId, ':', examQuestions);
      console.log('📝 Question details:', examQuestions.map((q: any) => ({ id: q.id, content: q.content?.substring(0, 50), examId: q.examId })));
      
      setCurrentExamQuestions(examQuestions);
      console.log('💾 Set currentExamQuestions, length:', examQuestions.length);
      
    } catch (error) {
      console.error('❌ Error loading questions for exam', examId, ':', error);
      setCurrentExamQuestions([]);
    }
  };

  // Optimized answer options loading with caching
  const [answerOptionsCache, setAnswerOptionsCache] = useState<Map<number, AnswerOption[]>>(new Map());
  
  // Load all answer options once and cache them
  const loadAllAnswerOptions = async () => {
    console.log('🔄 loadAllAnswerOptions called');
    try {
      const response: any = await answerOptionApi.getAnswerOptions();
      console.log('📡 Answer Options API Response:', response);
      
      let allOptions = [];
      if (Array.isArray(response)) {
        allOptions = response;
        console.log('✅ Response is array, length:', allOptions.length);
      } else if (response?.data) {
        allOptions = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log('✅ Response has data, length:', allOptions.length);
      } else {
        console.log('⚠️ Unexpected response format');
      }
      
      // Group answer options by questionId
      const questionOptionsMap = new Map<number, AnswerOption[]>();
      allOptions.forEach((opt: any) => {
        if (!questionOptionsMap.has(opt.questionId)) {
          questionOptionsMap.set(opt.questionId, []);
        }
        questionOptionsMap.get(opt.questionId)!.push(opt);
      });
      
      console.log('🗂️ Grouped answer options by questionId:');
      questionOptionsMap.forEach((options, qId) => {
        console.log(`  Question ${qId}: ${options.length} options`);
      });
      
      // Update cache
      setAnswerOptionsCache(questionOptionsMap);
      console.log('💾 Updated answerOptionsCache, size:', questionOptionsMap.size);
    } catch (error) {
      console.error('❌ Error loading all answer options:', error);
    }
  };
  
  // Clear cache when needed (e.g., when switching exams)
  const clearAnswerOptionsCache = () => {
    console.log('🧹 clearAnswerOptionsCache called');
    setAnswerOptionsCache(new Map());
    console.log('💾 Cleared answerOptionsCache');
  };
  
  // Refresh cache when needed
  const refreshAnswerOptionsCache = async () => {
    console.log('🔄 refreshAnswerOptionsCache called');
    await loadAllAnswerOptions();
    console.log('✅ Refreshed answerOptionsCache');
  };
  
  // Force refresh answer options for a specific question
  const forceRefreshAnswerOptions = async (questionId: number) => {
    console.log('🔄 forceRefreshAnswerOptions called for questionId:', questionId);
    
    // Clear cache for this question
    setAnswerOptionsCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(questionId);
      return newCache;
    });
    
    // Reload fresh data
    await loadAnswerOptions(questionId);
    console.log('✅ Force refreshed answer options for question:', questionId);
  };
  
  // Force refresh questions and answer options for an exam
  const forceRefreshExamData = async (examId: number) => {
    console.log('🔄 forceRefreshExamData called for examId:', examId);
    
    // Clear questions cache
    setCurrentExamQuestions([]);
    
    // Reload questions
    await loadQuestions(examId);
    console.log('✅ Force refreshed exam data for exam:', examId);
  };
  
  // Force refresh all data (exams, questions, answer options)
  const forceRefreshAllData = async () => {
    console.log('🔄 forceRefreshAllData called');
    
    // Clear all caches
    setCurrentExamQuestions([]);
    setAnswerOptionsCache(new Map());
    setAnswerOptions([]);
    
    // Reload all data
    await loadExams();
    console.log('✅ Force refreshed all data');
  };
  

  
  const loadAnswerOptions = async (questionId: number) => {
    console.log('🔍 loadAnswerOptions called with questionId:', questionId);
    try {
      // Check cache first
      if (answerOptionsCache.has(questionId)) {
        const questionOptions = answerOptionsCache.get(questionId) || [];
        console.log('💾 Found in cache for question', questionId, ':', questionOptions);
        setAnswerOptions(questionOptions);
        return;
      }
      
      console.log('🔄 Not in cache, loading answer options for question', questionId);
      // Use the specific API to get answer options for this question
      const response: any = await answerOptionApi.getAnswerOptionsByQuestion(questionId);
      console.log('📡 getAnswerOptionsByQuestion API Response:', response);
      
      let questionOptions: any[] = [];
      if (Array.isArray(response)) {
        questionOptions = response;
        console.log('✅ Response is array, length:', questionOptions.length);
      } else if (response?.data) {
        questionOptions = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log('✅ Response has data, length:', questionOptions.length);
      } else {
        console.log('⚠️ Unexpected response format');
      }
      
      console.log('📝 Answer options for question', questionId, ':', questionOptions);
      console.log('🔍 Option details:', questionOptions.map((opt: any) => ({ id: opt.id, content: opt.content?.substring(0, 30), isCorrect: opt.isCorrect, questionId: opt.questionId })));
      
      // Update cache for this question
      setAnswerOptionsCache(prev => new Map(prev).set(questionId, questionOptions));
      console.log('💾 Updated cache for question', questionId);
      
      setAnswerOptions(questionOptions);
      console.log('💾 Set answerOptions, length:', questionOptions.length);
    } catch (error) {
      console.error('❌ Error loading answer options for question', questionId, ':', error);
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
    console.log('🔍 toggleExamExpansion called with examId:', examId);
    const newExpanded = new Set(expandedExams);
    if (newExpanded.has(examId)) {
      console.log('📁 Collapsing exam:', examId);
      newExpanded.delete(examId);
      // Clear cache when collapsing to save memory
      clearAnswerOptionsCache();
      setCurrentExamQuestions([]);
      console.log('🧹 Cleared questions and cache for exam:', examId);
    } else {
      console.log('📂 Expanding exam:', examId);
      newExpanded.add(examId);
      // Load questions for this specific exam
      loadQuestions(examId);
    }
    setExpandedExams(newExpanded);
    console.log('📊 New expanded exams:', Array.from(newExpanded));
  };

  const toggleQuestionExpansion = (questionId: number) => {
    console.log('🔍 toggleQuestionExpansion called with questionId:', questionId);
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      console.log('📁 Collapsing question:', questionId);
      newExpanded.delete(questionId);
      // Clear answer options when collapsing
      setAnswerOptions([]);
      console.log('🧹 Cleared answer options for question:', questionId);
    } else {
      console.log('📂 Expanding question:', questionId);
      newExpanded.add(questionId);
      // Load answer options for this specific question
      loadAnswerOptions(questionId);
    }
    setExpandedQuestions(newExpanded);
    console.log('📊 New expanded questions:', Array.from(newExpanded));
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
    console.log('🔄 handleSubmitExam called');
    console.log('📋 examForm:', examForm);
    
    try {
      console.log('➕ Creating new exam');
      const response = await examApi.createExam(examForm);
      console.log('✅ Create response:', response);
      
      // Force refresh all data
      await forceRefreshAllData();
      console.log('✅ Exam created and all data refreshed');
      
      setShowExamModal(false);
      
      // Reset form
      setExamForm({
        title: '',
        description: '',
        duration: 60,
        difficulty: 'Easy',
        isActive: true
      });
      
      console.log('🎉 Exam operation completed successfully');
      
    } catch (error: any) {
      console.error('❌ Error in handleSubmitExam:', error);
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
    console.log('🔄 handleSubmitQuestion called');
    console.log('📝 editingQuestion:', editingQuestion);
    console.log('🔍 currentExamId:', currentExamId);
    console.log('📋 questionForm:', questionForm);
    
    try {
      if (editingQuestion) {
        console.log('✏️ Updating question:', editingQuestion.id);
        // Update question
        const response = await questionApi.updateQuestion(editingQuestion.id, questionForm);
        console.log('✅ Update response:', response);
        
        // Force refresh exam data
        await forceRefreshExamData(currentExamId);
        console.log('✅ Question updated and data refreshed');
      } else {
        console.log('➕ Creating new question');
        // Create question
        const response = await questionApi.createQuestion({
          ...questionForm,
          examId: currentExamId
        });
        console.log('✅ Create response:', response);
        
        // Force refresh exam data
        await forceRefreshExamData(currentExamId);
        console.log('✅ Question created and data refreshed');
      }
      
      setShowQuestionModal(false);
      setEditingQuestion(null);
      
      // Reset form
      setQuestionForm({
        content: '',
        questionType: 'MultipleChoice',
        orderIndex: 1,
        points: 1.0,
        examId: currentExamId
      });
      
      console.log('🎉 Question operation completed successfully');
      
    } catch (error: any) {
      console.error('❌ Error in handleSubmitQuestion:', error);
      alert('Error saving question. Please try again.');
    }
  };

  // Answer Option CRUD functions
  const handleCreateAnswerOption = (questionId: number) => {
    console.log('➕ handleCreateAnswerOption called for questionId:', questionId);
    setCurrentQuestionId(questionId);
    setEditingAnswerOption(null);
    
    // Reset form to default values
    setAnswerOptionForm({
      content: '',
      isCorrect: false,
      optionLabel: 'A'
    });
    
    setShowAnswerOptionModal(true);
    console.log('✅ Modal opened for creating answer option');
    console.log('🔄 Form reset to default values');
  };

  const handleEditAnswerOption = (answerOption: AnswerOption) => {
    console.log('✏️ handleEditAnswerOption called for answer option:', answerOption);
    console.log('🔍 Setting currentQuestionId to:', answerOption.questionId);
    
    setEditingAnswerOption(answerOption);
    setCurrentQuestionId(answerOption.questionId); // Set currentQuestionId from the answer option
    setAnswerOptionForm({
      content: answerOption.content,
      isCorrect: answerOption.isCorrect,
      optionLabel: answerOption.optionLabel
    });
    setShowAnswerOptionModal(true);
    console.log('✅ Modal opened for editing answer option');
    console.log('🔄 Form populated with answer option data');
  };

  const handleSubmitAnswerOption = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!answerOptionForm.content.trim()) {
      alert('Answer option content cannot be empty');
      return;
    }
    
    console.log('🔄 handleSubmitAnswerOption called');
    console.log('📝 editingAnswerOption:', editingAnswerOption);
    console.log('🔍 currentQuestionId:', currentQuestionId);
    console.log('📋 answerOptionForm:', answerOptionForm);
    
    try {
      if (editingAnswerOption) {
        console.log('✏️ Updating answer option:', editingAnswerOption.id);
        // Update answer option
        const updateData = {
          ...answerOptionForm,
          questionId: currentQuestionId
        };
        console.log('📤 Update data:', updateData);
        
        const response = await answerOptionApi.updateAnswerOption(editingAnswerOption.id, updateData);
        console.log('✅ Update response:', response);
        
        // Force refresh data immediately
        console.log('🔄 Reloading data after update...');
        await forceRefreshAnswerOptions(currentQuestionId);
        
        // Also refresh exam data to ensure UI is updated
        if (expandedExams.size > 0) {
          const firstExamId = Array.from(expandedExams)[0];
          await forceRefreshExamData(firstExamId);
        }
        
        console.log('✅ Data reloaded successfully');
      } else {
        console.log('➕ Creating new answer option');
        // Create answer option
        const createData = {
          ...answerOptionForm,
          questionId: currentQuestionId
        };
        console.log('📤 Create data:', createData);
        
        const response = await answerOptionApi.createAnswerOption(createData);
        console.log('✅ Create response:', response);
        
        // Force refresh data immediately
        console.log('🔄 Reloading data after create...');
        await forceRefreshAnswerOptions(currentQuestionId);
        
        // Also refresh exam data to ensure UI is updated
        if (expandedExams.size > 0) {
          const firstExamId = Array.from(expandedExams)[0];
          await forceRefreshExamData(firstExamId);
        }
        
        console.log('✅ Data reloaded successfully');
      }
      
      setShowAnswerOptionModal(false);
      setEditingAnswerOption(null);
      
      // Reset form
      setAnswerOptionForm({
        content: '',
        isCorrect: false,
        optionLabel: 'A'
      });
      
      console.log('🎉 Answer option operation completed successfully');
      console.log('🔄 Form reset and modal closed');
      
    } catch (error: any) {
      console.error('❌ Error in handleSubmitAnswerOption:', error);
      
      // Reset form on error
      setAnswerOptionForm({
        content: '',
        isCorrect: false,
        optionLabel: 'A'
      });
      
      alert('Error saving answer option. Please try again.');
    }
  };

  const handleDeleteAnswerOption = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this answer option?')) {
      console.log('🗑️ handleDeleteAnswerOption called for id:', id);
      console.log('🔍 currentQuestionId:', currentQuestionId);
      
      try {
        console.log('📤 Deleting answer option:', id);
        const response = await answerOptionApi.deleteAnswerOption(id);
        console.log('✅ Delete response:', response);
        
        // Force refresh data immediately
        console.log('🔄 Reloading data after delete...');
        await forceRefreshAnswerOptions(currentQuestionId);
        
        // Also refresh exam data to ensure UI is updated
        if (expandedExams.size > 0) {
          const firstExamId = Array.from(expandedExams)[0];
          await forceRefreshExamData(firstExamId);
        }
        
        console.log('✅ Data reloaded successfully after delete');
        
        // Reset form after successful delete
        setAnswerOptionForm({
          content: '',
          isCorrect: false,
          optionLabel: 'A'
        });
        
      } catch (error) {
        console.error('❌ Error deleting answer option:', error);
        
        // Reset form on error
        setAnswerOptionForm({
          content: '',
          isCorrect: false,
          optionLabel: 'A'
        });
        
        alert('Error deleting answer option. Please try again.');
      }
    }
  };

  // Bulk operations functions
  const handleBulkCreateQuestions = (examId: number) => {
    setCurrentExamId(examId);
    setBulkQuestionForm({
      questions: [
        {
          content: '',
          questionType: 'MultipleChoice',
          orderIndex: 1,
          points: 1.0,
          answerOptions: [
            { content: '', isCorrect: false, optionLabel: 'A' },
            { content: '', isCorrect: false, optionLabel: 'B' },
            { content: '', isCorrect: false, optionLabel: 'C' },
            { content: '', isCorrect: false, optionLabel: 'D' }
          ]
        }
      ]
    });
    setShowBulkQuestionModal(true);
  };

  const addQuestionToBulk = () => {
    const newOrderIndex = bulkQuestionForm.questions.length + 1;
    setBulkQuestionForm(prev => ({
      questions: [
        ...prev.questions,
        {
          content: '',
          questionType: 'MultipleChoice',
          orderIndex: newOrderIndex,
          points: 1.0,
          answerOptions: [
            { content: '', isCorrect: false, optionLabel: 'A' },
            { content: '', isCorrect: false, optionLabel: 'B' },
            { content: '', isCorrect: false, optionLabel: 'C' },
            { content: '', isCorrect: false, optionLabel: 'D' }
          ]
        }
      ]
    }));
  };

  const removeQuestionFromBulk = (index: number) => {
    setBulkQuestionForm(prev => ({
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateBulkQuestion = (index: number, field: string, value: any) => {
    setBulkQuestionForm(prev => ({
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateBulkAnswerOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    setBulkQuestionForm(prev => ({
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          answerOptions: q.answerOptions.map((opt, j) => 
            j === optionIndex ? { ...opt, [field]: value } : opt
          )
        } : q
      )
    }));
  };

  const handleSubmitBulkQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      for (const questionData of bulkQuestionForm.questions) {
              // Create question
      const questionResponse: any = await questionApi.createQuestion({
        content: questionData.content,
        questionType: questionData.questionType,
        orderIndex: questionData.orderIndex,
        points: questionData.points,
        examId: currentExamId
      });

      const questionId = questionResponse?.id || questionResponse?.data?.id;
      if (!questionId) {
        throw new Error('Failed to get question ID from response');
      }

      // Create answer options if they exist
      if (questionData.answerOptions.length > 0) {
        for (const optionData of questionData.answerOptions) {
          if (optionData.content.trim()) {
            await answerOptionApi.createAnswerOption({
              content: optionData.content,
              isCorrect: optionData.isCorrect,
              optionLabel: optionData.optionLabel,
              questionId: questionId
            });
          }
        }
      }
      }

      await loadQuestions(currentExamId);
      setShowBulkQuestionModal(false);
      alert(`Successfully created ${bulkQuestionForm.questions.length} questions with answer options!`);
    } catch (error) {
      alert('Error creating bulk questions. Please try again.');
    }
  };

  const useQuestionTemplate = (template: any, examId: number) => {
    setCurrentExamId(examId);
    setBulkQuestionForm({
      questions: [{
        ...template,
        orderIndex: 1
      }]
    });
    setShowBulkQuestionModal(true);
    setShowTemplateModal(false);
  };

  const duplicateQuestion = async (question: Question, examId: number) => {
    try {
      // Create new question
      const newQuestionResponse: any = await questionApi.createQuestion({
        content: question.content + ' (Copy)',
        questionType: question.questionType,
        orderIndex: question.orderIndex + 1,
        points: question.points,
        examId: examId
      });

      const newQuestionId = newQuestionResponse?.id || newQuestionResponse?.data?.id;
      if (!newQuestionId) {
        throw new Error('Failed to get question ID from response');
      }

      // Get answer options for the original question
      const response: any = await answerOptionApi.getAnswerOptions();
      let allOptions = [];
      if (Array.isArray(response)) {
        allOptions = response;
      } else if (response?.data) {
        allOptions = Array.isArray(response.data) ? response.data : response.data.data || [];
      }
      const questionOptions = allOptions.filter((opt: any) => opt.questionId === question.id);

      // Duplicate answer options
      for (const option of questionOptions) {
        await answerOptionApi.createAnswerOption({
          content: option.content,
          isCorrect: option.isCorrect,
          optionLabel: option.optionLabel,
          questionId: newQuestionId
        });
      }

      // Update cache and reload
      await loadAllAnswerOptions();
      await loadQuestions(examId);
      alert('Question duplicated successfully!');
    } catch (error) {
      alert('Error duplicating question. Please try again.');
    }
  };

  // Bulk import functions
  const handleBulkImport = (examId: number) => {
    setCurrentExamId(examId);
    setBulkImportForm({
      importText: '',
      questionType: 'MultipleChoice',
      points: 1.0,
      separator: '---'
    });
    setShowBulkImportModal(true);
  };

  const parseBulkImportText = (text: string, separator: string) => {
    // Split by separator and filter out empty questions
    const questionBlocks = text.trim().split(separator).filter(block => block.trim());
    
    const parsedQuestions = questionBlocks.map((questionBlock, index) => {
      // Split into lines and filter out empty lines
      const lines = questionBlock.trim().split('\n').filter(line => line.trim());
      
      // First line is the question content
      const questionContent = lines[0] || '';
      
      let answerOptions: any[] = [];
      if (bulkImportForm.questionType === 'MultipleChoice') {
        // Parse answer options from lines 2 onwards
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line && !line.startsWith('Question')) {
            const isCorrect = line.includes('*') || line.includes('✓') || line.includes('(correct)');
            const cleanContent = line.replace(/[\*✓]/g, '').replace(/\(correct\)/g, '').trim();
            
            if (cleanContent && cleanContent.length > 0) {
              answerOptions.push({
                content: cleanContent,
                isCorrect: isCorrect,
                optionLabel: String.fromCharCode(65 + answerOptions.length) // A, B, C, D...
              });
            }
          }
        }
        
        // Ensure at least 2 options for multiple choice
        if (answerOptions.length < 2) {
          answerOptions = [
            { content: 'Option A', isCorrect: false, optionLabel: 'A' },
            { content: 'Option B', isCorrect: false, optionLabel: 'B' }
          ];
        }
      }

      return {
        content: questionContent,
        questionType: bulkImportForm.questionType,
        orderIndex: index + 1,
        points: bulkImportForm.points,
        answerOptions: answerOptions
      };
    });

    return parsedQuestions;
  };



  const handleSubmitBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!bulkImportForm.importText.trim()) {
      alert('Please enter some questions to import.');
      return;
    }

    const parsedQuestions = parseBulkImportText(bulkImportForm.importText, bulkImportForm.separator);
    
    if (parsedQuestions.length === 0) {
      alert('No valid questions found. Please check your format.');
      return;
    }

        // Confirm with user
    if (!confirm(`Are you sure you want to create ${parsedQuestions.length} questions?`)) {
      return;
    }

    try {
      // Create all questions and answer options
      for (const questionData of parsedQuestions) {
        // Create question
        const questionResponse: any = await questionApi.createQuestion({
          content: questionData.content,
          questionType: questionData.questionType,
          orderIndex: questionData.orderIndex,
          points: questionData.points,
          examId: currentExamId
        });

        const questionId = questionResponse?.id || questionResponse?.data?.id;
        if (!questionId) {
          throw new Error('Failed to get question ID from response');
        }

        // Create answer options if they exist
        if (questionData.answerOptions.length > 0) {
          for (const optionData of questionData.answerOptions) {
            if (optionData.content.trim()) {
              await answerOptionApi.createAnswerOption({
                content: optionData.content,
                isCorrect: optionData.isCorrect,
                optionLabel: optionData.optionLabel,
                questionId: questionId
              });
            }
          }
        }
      }

      // Update cache and reload
      await loadAllAnswerOptions();
      await loadQuestions(currentExamId);
      setShowBulkImportModal(false);
      alert(`Successfully imported ${parsedQuestions.length} questions!`);
    } catch (error) {
      alert('Error importing questions. Please try again.');
    }
  };





  const renderExamsTab = () => (
    <ExamsTab
      exams={exams}
      questions={currentExamQuestions}
      answerOptions={answerOptions}
      searchTerm={searchTerm}
      selectedDifficulty={selectedDifficulty}
      expandedExams={expandedExams}
      expandedQuestions={expandedQuestions}
      onSearchChange={setSearchTerm}
      onDifficultyChange={setSelectedDifficulty}
      onToggleExamExpansion={toggleExamExpansion}
      onToggleQuestionExpansion={toggleQuestionExpansion}
      onShowTemplateModal={() => setShowTemplateModal(true)}
      onBulkImport={handleBulkImport}
      onBulkCreateQuestions={handleBulkCreateQuestions}
      onCreateQuestion={handleCreateQuestion}
      onEditQuestion={(question) => {
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
      onDuplicateQuestion={duplicateQuestion}
      onAddAnswerOption={handleCreateAnswerOption}
      onEditAnswerOption={handleEditAnswerOption}
      onDeleteAnswerOption={handleDeleteAnswerOption}
      onLoadAnswerOptions={loadAnswerOptions}
    />
  );

  const renderAttemptsTab = () => (
    <ExamAttemptsTab
      examAttempts={examAttempts}
      users={users}
      exams={exams}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ExamHeader onCreateExam={handleCreateExam} onRefreshAll={forceRefreshAllData} />

        {/* Tabs */}
        <ExamTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === 'exams' && renderExamsTab()}
        {activeTab === 'attempts' && renderAttemptsTab()}

        {/* Loading State */}
        <LoadingSpinner loading={loading} />
      </div>

      {/* Exam Modal */}
      <ExamModal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        onSubmit={handleSubmitExam}
        formData={examForm}
        onFormChange={(field, value) => setExamForm(prev => ({ ...prev, [field]: value }))}
        isEditing={false}
      />

      {/* Question Modal */}
      <QuestionModal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        onSubmit={handleSubmitQuestion}
        formData={questionForm}
        onFormChange={(field, value) => setQuestionForm(prev => ({ ...prev, [field]: value }))}
        isEditing={!!editingQuestion}
        editingQuestion={editingQuestion}
      />

      {/* Answer Option Modal */}
      <AnswerOptionModal
        isOpen={showAnswerOptionModal}
        onClose={() => setShowAnswerOptionModal(false)}
        onSubmit={handleSubmitAnswerOption}
        formData={answerOptionForm}
        onFormChange={(field, value) => setAnswerOptionForm(prev => ({ ...prev, [field]: value }))}
        isEditing={!!editingAnswerOption}
        editingAnswerOption={editingAnswerOption}
      />

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={questionTemplates}
        onUseTemplate={useQuestionTemplate}
        currentExamId={currentExamId}
      />

      {/* Bulk Question Modal */}
      <BulkQuestionModal
        isOpen={showBulkQuestionModal}
        onClose={() => setShowBulkQuestionModal(false)}
        onSubmit={handleSubmitBulkQuestions}
        formData={bulkQuestionForm}
        onAddQuestion={addQuestionToBulk}
        onRemoveQuestion={removeQuestionFromBulk}
        onUpdateQuestion={updateBulkQuestion}
        onUpdateAnswerOption={updateBulkAnswerOption}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onSubmit={handleSubmitBulkImport}
        formData={bulkImportForm}
        onFormChange={(field, value) => setBulkImportForm(prev => ({ ...prev, [field]: value }))}
      />

    </div>
  );
}
