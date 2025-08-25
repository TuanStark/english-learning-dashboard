import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FolderOpen,
  Book,
  Tag,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { VocabularyTopic, Vocabulary } from '@/types/backend';

export default function VocabularyTopics() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<VocabularyTopic | null>(null);

  // Mock data for development
  const mockTopics: VocabularyTopic[] = [
    {
      id: 1,
      name: "Basic Greetings",
      description: "Essential greetings and common phrases for beginners",
      difficulty: "Beginner",
      color: "#3B82F6",
      icon: "👋",
      vocabularyCount: 15,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    {
      id: 2,
      name: "Food & Dining",
      description: "Vocabulary related to food, restaurants, and dining experiences",
      difficulty: "Intermediate",
      color: "#10B981",
      icon: "🍽️",
      vocabularyCount: 25,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    {
      id: 3,
      name: "Business & Work",
      description: "Professional vocabulary for workplace communication",
      difficulty: "Advanced",
      color: "#8B5CF6",
      icon: "💼",
      vocabularyCount: 30,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    },
    {
      id: 4,
      name: "Travel & Tourism",
      description: "Essential vocabulary for traveling and tourism",
      difficulty: "Intermediate",
      color: "#F59E0B",
      icon: "✈️",
      vocabularyCount: 20,
      createdAt: "2025-01-20T10:00:00Z",
      updatedAt: "2025-01-20T10:00:00Z"
    }
  ];

  const mockVocabularies: Vocabulary[] = [
    { id: 1, topicId: 1, word: "Hello", translation: "Xin chào", difficulty: "Beginner" },
    { id: 2, topicId: 1, word: "Goodbye", translation: "Tạm biệt", difficulty: "Beginner" },
    { id: 3, topicId: 2, word: "Restaurant", translation: "Nhà hàng", difficulty: "Intermediate" }
  ];

  useEffect(() => {
    loadTopics();
    loadVocabularies();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      // const response = await vocabularyTopicApi.getTopics();
      // setTopics(response.data || []);
      setTopics(mockTopics); // Using mock data for now
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics(mockTopics);
    } finally {
      setLoading(false);
    }
  };

  const loadVocabularies = async () => {
    try {
      // const response = await vocabularyApi.getVocabularies();
      // setVocabularies(response.data || []);
      setVocabularies(mockVocabularies); // Using mock data for now
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      setVocabularies(mockVocabularies);
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVocabularyCount = (topicId: number) => {
    return vocabularies.filter(v => v.topicId === topicId).length;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic? This will also remove all associated vocabulary words.')) {
      try {
        // await vocabularyTopicApi.deleteTopic(id);
        setTopics(topics.filter(t => t.id !== id));
        // Show success message
      } catch (error) {
        console.error('Error deleting topic:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (topic: VocabularyTopic) => {
    setEditingTopic(topic);
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
                Vocabulary Topics
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Organize and manage vocabulary learning topics and categories
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Topic
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Topics</p>
                  <p className="text-3xl font-bold text-slate-900">{topics.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Words</p>
                  <p className="text-3xl font-bold text-slate-900">{vocabularies.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Beginner Topics</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {topics.filter(t => t.difficulty === 'Beginner').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Advanced Topics</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {topics.filter(t => t.difficulty === 'Advanced').length}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
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

        {/* Topics Grid */}
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
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: topic.color + '20' }}
                      >
                        {topic.icon}
                      </div>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(topic)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(topic.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    {topic.name}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Book className="h-4 w-4" />
                        Vocabulary Words
                      </span>
                      <span className="font-medium">{getVocabularyCount(topic.id)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Learners
                      </span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {new Date(topic.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(topic.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTopics.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No topics found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first vocabulary topic.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Topic
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
              {editingTopic ? 'Edit Vocabulary Topic' : 'Create New Topic'}
            </h2>
            <p className="text-slate-600 mb-6">
              {editingTopic 
                ? 'Update the topic details below.'
                : 'Fill in the form below to create a new vocabulary topic.'}
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
                {editingTopic ? 'Update Topic' : 'Create Topic'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
