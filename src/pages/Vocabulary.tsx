import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { vocabularyApi, vocabularyTopicApi } from '@/services/api';
import type { Vocabulary, VocabularyTopic } from '@/types/backend';

export default function Vocabulary() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);

  useEffect(() => {
    loadVocabularies();
    loadTopics();
  }, []);

  const loadVocabularies = async () => {
    try {
      setLoading(true);
      const response = await vocabularyApi.getVocabularies();
      if (response.data && Array.isArray(response.data)) {
        setVocabularies(response.data);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        setVocabularies(response.data.data || []);
      } else {
        setVocabularies([]);
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
      const response = await vocabularyTopicApi.getTopics();
      if (response.data && Array.isArray(response.data)) {
        setTopics(response.data);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        setTopics(response.data.data || []);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics([]);
    }
  };

  const filteredVocabularies = vocabularies.filter(vocabulary => {
    const matchesSearch = 
      vocabulary.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vocabulary.meaning?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || vocabulary.topicId?.toString() === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'all' || vocabulary.difficulty === selectedDifficulty;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'Unknown Topic';
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
      case 'adverb': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vocabulary word?')) {
      try {
        await vocabularyApi.deleteVocabulary(id);
        setVocabularies(vocabularies.filter(v => v.id !== id));
        // Show success message
      } catch (error) {
        console.error('Error deleting vocabulary:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (vocabulary: Vocabulary) => {
    setEditingVocabulary(vocabulary);
    setShowCreateModal(true);
  };

  const handleToggleActive = async (vocabulary: Vocabulary) => {
    try {
      const newStatus = !vocabulary.isActive;
      await vocabularyApi.updateVocabulary(vocabulary.id, { isActive: newStatus });
      setVocabularies(vocabularies.map(v => 
        v.id === vocabulary.id ? { ...v, isActive: newStatus } : v
      ));
    } catch (error) {
      console.error('Error updating vocabulary status:', error);
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
                Vocabulary Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage and organize vocabulary words across all topics
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Vocabulary
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Words</p>
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
                  <p className="text-sm font-medium text-slate-600">Active Topics</p>
                  <p className="text-3xl font-bold text-slate-900">{topics.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Easy Words</p>
                  <p className="text-3xl font-bold text-slate-900">
                                         {vocabularies.filter(v => v.difficulty === 'Easy').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hard Words</p>
                  <p className="text-3xl font-bold text-slate-900">
                                         {vocabularies.filter(v => v.difficulty === 'Hard').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-600" />
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
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Topics</option>
                                       {topics.map(topic => (
                       <option key={topic.id} value={topic.id}>{topic.name}</option>
                     ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTopic('all');
                    setSelectedDifficulty('all');
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

        {/* Vocabulary Grid */}
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
            {filteredVocabularies.map((vocabulary) => (
              <Card key={vocabulary.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                                             <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                         {vocabulary.word?.charAt(0) || 'V'}
                       </div>
                      <div className="flex flex-col gap-1">
                                                 <Badge variant={getDifficultyColor(vocabulary.difficulty || 'Easy')}>
                           {vocabulary.difficulty || 'Easy'}
                         </Badge>
                         {vocabulary.partOfSpeech && (
                           <Badge variant={getWordTypeColor(vocabulary.partOfSpeech)}>
                             {vocabulary.partOfSpeech}
                           </Badge>
                         )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                        onClick={() => handleToggleActive(vocabulary)}
                        className="h-8 w-8 p-0 hover:bg-yellow-50"
                      >
                        <Eye className="h-4 w-4 text-yellow-600" />
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

                                     <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                     {vocabulary.word}
                   </h3>

                   <p className="text-slate-600 mb-4 text-sm">
                     {vocabulary.meaning}
                   </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Topic
                      </span>
                      <span className="font-medium">{getTopicName(vocabulary.topicId || 0)}</span>
                    </div>
                    {vocabulary.pronunciation && (
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Volume2 className="h-4 w-4" />
                          Pronunciation
                        </span>
                        <span className="font-medium">{vocabulary.pronunciation}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Status
                      </span>
                      <Badge variant={vocabulary.isActive ? 'success' : 'destructive'}>
                        {vocabulary.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {new Date(vocabulary.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(vocabulary.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredVocabularies.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No vocabulary found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedTopic !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first vocabulary word.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Vocabulary
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
              {editingVocabulary ? 'Edit Vocabulary' : 'Create New Vocabulary'}
            </h2>
            <p className="text-slate-600 mb-6">
              {editingVocabulary
                ? 'Update the vocabulary details below.'
                : 'Fill in the form below to create a new vocabulary word.'}
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
                {editingVocabulary ? 'Update Vocabulary' : 'Create Vocabulary'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
