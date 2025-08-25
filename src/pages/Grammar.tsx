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
  BookOpenCheck,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { grammarApi } from '@/services/api';
import type { Grammar } from '@/types/backend';

export default function Grammar() {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGrammar, setEditingGrammar] = useState<Grammar | null>(null);

  useEffect(() => {
    loadGrammars();
  }, []);

  const loadGrammars = async () => {
    try {
      setLoading(true);
      const response = await grammarApi.getGrammars();
      if (response.data && Array.isArray(response.data)) {
        setGrammars(response.data);
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        setGrammars(response.data.data || []);
      } else {
        setGrammars([]);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this grammar lesson?')) {
      try {
        await grammarApi.deleteGrammar(id);
        setGrammars(grammars.filter(g => g.id !== id));
        // Show success message
      } catch (error) {
        console.error('Error deleting grammar:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (grammar: Grammar) => {
    setEditingGrammar(grammar);
    setShowCreateModal(true);
  };

  const handleToggleActive = async (grammar: Grammar) => {
    try {
      const newStatus = !grammar.isActive;
      await grammarApi.updateGrammar(grammar.id, { isActive: newStatus });
      setGrammars(grammars.map(g => 
        g.id === grammar.id ? { ...g, isActive: newStatus } : g
      ));
    } catch (error) {
      console.error('Error updating grammar status:', error);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Grammar Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Create and manage grammar lessons and rules
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Grammar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Lessons</p>
                  <p className="text-3xl font-bold text-slate-900">{grammars.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Active Lessons</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {grammars.filter(g => g.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpenCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Easy Lessons</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {grammars.filter(g => g.difficultyLevel === 'Easy').length}
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
                  <p className="text-sm font-medium text-slate-600">Hard Lessons</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {grammars.filter(g => g.difficultyLevel === 'Hard').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Target className="h-6 w-6 text-red-600" />
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
                    placeholder="Search grammar lessons..."
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
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
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

        {/* Grammar Grid */}
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
            {filteredGrammars.map((grammar) => (
              <Card key={grammar.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {grammar.title?.charAt(0) || 'G'}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant={getDifficultyColor(grammar.difficultyLevel || 'Easy')}>
                          {grammar.difficultyLevel || 'Easy'}
                        </Badge>
                        <Badge variant={grammar.isActive ? 'success' : 'destructive'}>
                          {grammar.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(grammar)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(grammar)}
                        className="h-8 w-8 p-0 hover:bg-yellow-50"
                      >
                        <Eye className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(grammar.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    {grammar.title}
                  </h3>

                  <p className="text-slate-600 mb-4 text-sm line-clamp-3">
                    {truncateContent(grammar.content || 'No content available')}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Order
                      </span>
                      <span className="font-medium">#{grammar.orderIndex || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        Examples
                      </span>
                      <span className="font-medium">{grammar.examples?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Progress
                      </span>
                      <span className="font-medium">{grammar.userProgress?.length || 0} learners</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {new Date(grammar.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(grammar.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredGrammars.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No grammar lessons found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first grammar lesson.'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Grammar Lesson
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
              {editingGrammar ? 'Edit Grammar Lesson' : 'Create New Grammar Lesson'}
            </h2>
            <p className="text-slate-600 mb-6">
              {editingGrammar
                ? 'Update the grammar lesson details below.'
                : 'Fill in the form below to create a new grammar lesson.'}
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
                {editingGrammar ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
