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
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vocabularyApi, vocabularyTopicApi, vocabularyExampleApi } from '@/services/api';
import type { Vocabulary, VocabularyTopic, VocabularyExample } from '@/types/backend';

export default function Vocabulary() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [examples, setExamples] = useState<VocabularyExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    topicId: 1,
    englishWord: '',
    pronunciation: '',
    vietnameseMeaning: '',
    wordType: '',
    difficultyLevel: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    image: '',
    audioFile: '',
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadVocabularies();
    loadTopics();
  }, []);

  const loadExamples = async (vocabularyId: number) => {
    try {
      console.log('Loading examples for vocabulary ID:', vocabularyId);
      const response = await vocabularyExampleApi.getExamplesByVocabulary(vocabularyId);
      console.log('Examples API Response:', response);
      
      let examplesData: VocabularyExample[] = [];
      
      if (Array.isArray(response)) {
        examplesData = response as unknown as VocabularyExample[];
      } else if (response?.data) {
        const responseData = response.data as any;
        if (Array.isArray(responseData)) {
          examplesData = responseData as unknown as VocabularyExample[];
        } else if (responseData.data && Array.isArray(responseData.data)) {
          examplesData = responseData.data as unknown as VocabularyExample[];
        }
      }
      
      console.log('Processed examples data:', examplesData);
      setExamples(examplesData);
    } catch (error) {
      console.error('Error loading examples:', error);
      setExamples([]);
    }
  };

  const loadVocabularies = async () => {
    try {
      setLoading(true);
      const response: any = await vocabularyApi.getVocabularies();
      console.log('Vocabularies API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setVocabularies(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setVocabularies(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setVocabularies(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      setVocabularies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      const response: any = await vocabularyTopicApi.getTopics();
      console.log('Topics API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setTopics(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setTopics(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setTopics(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics([]);
    }
  };

  const filteredVocabularies = vocabularies.filter(vocabulary => {
    const matchesSearch = 
      vocabulary.englishWord?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vocabulary.vietnameseMeaning?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || vocabulary.topicId?.toString() === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'all' || vocabulary.difficultyLevel === selectedDifficulty;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.topicName : 'Unknown Topic';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const getWordTypeColor = (wordType: string) => {
    switch (wordType?.toLowerCase()) {
      case 'noun': return 'info';
      case 'verb': return 'warning';
      case 'adjective': return 'success';
      case 'adverb': return 'secondary';
      default: return 'outline';
    }
  };

  const handleCreate = () => {
    setEditingVocabulary(null);
    setFormData({
      topicId: 1,
      englishWord: '',
      pronunciation: '',
      vietnameseMeaning: '',
      wordType: '',
      difficultyLevel: 'Easy',
      image: '',
      audioFile: '',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEdit = (vocabulary: Vocabulary) => {
    setEditingVocabulary(vocabulary);
    setFormData({
      topicId: vocabulary.topicId,
      englishWord: vocabulary.englishWord || '',
      pronunciation: vocabulary.pronunciation || '',
      vietnameseMeaning: vocabulary.vietnameseMeaning || '',
      wordType: vocabulary.wordType || '',
      difficultyLevel: vocabulary.difficultyLevel || 'Easy',
      image: vocabulary.image || '',
      audioFile: vocabulary.audioFile || '',
      isActive: vocabulary.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingVocabulary) {
        // Update vocabulary
        await vocabularyApi.updateVocabulary(editingVocabulary.id, formData);
        await loadVocabularies(); // Reload vocabularies
        setShowCreateModal(false);
      } else {
        // Create vocabulary
        await vocabularyApi.createVocabulary(formData);
        await loadVocabularies(); // Reload vocabularies
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving vocabulary:', error);
      alert('Error saving vocabulary. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this vocabulary?')) {
      try {
        await vocabularyApi.deleteVocabulary(id);
        setVocabularies(vocabularies.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
        alert('Error deleting vocabulary. Please try again.');
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
                Quản Lý Từ Vựng
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý từ vựng, chủ đề và mức độ khó dễ
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Từ Vựng
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Từ Vựng</p>
                  <p className="text-3xl font-bold text-slate-900">{vocabularies.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Mức Độ Dễ</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {vocabularies.filter(v => v.difficultyLevel === 'Easy').length}
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
                  <p className="text-sm font-medium text-slate-600">Mức Độ Trung Bình</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {vocabularies.filter(v => v.difficultyLevel === 'Medium').length}
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
                  <p className="text-sm font-medium text-slate-600">Mức Độ Khó</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {vocabularies.filter(v => v.difficultyLevel === 'Hard').length}
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm từ vựng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tất Cả Chủ Đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Chủ Đề</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.topicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tất Cả Mức Độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Mức Độ</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary List */}
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
        ) : filteredVocabularies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocabularies.map((vocabulary) => (
              <Card key={vocabulary.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {vocabulary.englishWord?.charAt(0) || 'V'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedVocabulary(vocabulary);
                          loadExamples(vocabulary.id);
                          setShowExamplesModal(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        title="View Examples"
                      >
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(vocabulary)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(vocabulary.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {vocabulary.englishWord}
                      </h3>
                      {vocabulary.pronunciation && (
                        <p className="text-slate-500 text-sm flex items-center">
                          <Volume2 className="h-3 w-3 mr-1" />
                          {vocabulary.pronunciation}
                        </p>
                      )}
                    </div>

                    <p className="text-slate-700">
                      {vocabulary.vietnameseMeaning}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getDifficultyColor(vocabulary.difficultyLevel || 'Easy')}>
                        {vocabulary.difficultyLevel || 'Easy'}
                      </Badge>
                      
                      {vocabulary.wordType && (
                        <Badge variant={getWordTypeColor(vocabulary.wordType)}>
                          {vocabulary.wordType}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-slate-500">
                      Topic: {getTopicName(vocabulary.topicId)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No vocabularies found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedTopic !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first vocabulary word.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Vocabulary
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingVocabulary ? 'Edit Vocabulary' : 'Create New Vocabulary'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="englishWord">English Word *</Label>
                  <Input
                    id="englishWord"
                    value={formData.englishWord}
                    onChange={(e) => handleInputChange('englishWord', e.target.value)}
                    placeholder="Enter English word"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="vietnameseMeaning">Vietnamese Meaning *</Label>
                  <Input
                    id="vietnameseMeaning"
                    value={formData.vietnameseMeaning}
                    onChange={(e) => handleInputChange('vietnameseMeaning', e.target.value)}
                    placeholder="Enter Vietnamese meaning"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pronunciation">Pronunciation</Label>
                  <Input
                    id="pronunciation"
                    value={formData.pronunciation}
                    onChange={(e) => handleInputChange('pronunciation', e.target.value)}
                    placeholder="e.g., /ˈfæməli/"
                  />
                </div>
                
                <div>
                  <Label htmlFor="wordType">Word Type</Label>
                  <Input
                    id="wordType"
                    value={formData.wordType}
                    onChange={(e) => handleInputChange('wordType', e.target.value)}
                    placeholder="e.g., Noun, Verb, Adjective"
                  />
                </div>
                
                <div>
                  <Label htmlFor="topicId">Topic *</Label>
                  <Select
                    value={formData.topicId.toString()}
                    onValueChange={(value) => handleInputChange('topicId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.topicName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select
                    value={formData.difficultyLevel}
                    onValueChange={(value) => handleInputChange('difficultyLevel', value as any)}
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
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audioFile">Audio File URL</Label>
                  <Input
                    id="audioFile"
                    value={formData.audioFile}
                    onChange={(e) => handleInputChange('audioFile', e.target.value)}
                    placeholder="Enter audio file URL"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="isActive">Active</Label>
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
                  {formLoading ? 'Saving...' : (editingVocabulary ? 'Update Vocabulary' : 'Create Vocabulary')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Examples Modal */}
      {showExamplesModal && selectedVocabulary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Examples for "{selectedVocabulary.englishWord}"
                </h2>
                <p className="text-slate-600 mt-1">
                  {selectedVocabulary.vietnameseMeaning}
                </p>
              </div>
              <Button
                onClick={() => setShowExamplesModal(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>

            {examples.length > 0 ? (
              <div className="space-y-4">
                {examples.map((example) => (
                  <Card key={example.id} className="bg-slate-50 border border-slate-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">English:</p>
                          <p className="text-slate-800 bg-white rounded-lg p-3 text-sm border">
                            {example.englishSentence}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Vietnamese:</p>
                          <p className="text-slate-800 bg-white rounded-lg p-3 text-sm border">
                            {example.vietnameseSentence}
                          </p>
                        </div>
                        
                        {example.audioFile && (
                          <div className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-slate-600">{example.audioFile}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No examples yet</h3>
                <p className="text-slate-500 mb-6">
                  This vocabulary word doesn't have any examples yet.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
                    API Response: {JSON.stringify(examples)}
                  </p>
                  <Button
                    onClick={() => setShowExamplesModal(false)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
