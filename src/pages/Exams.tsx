import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  Target,
  TrendingUp,
  Star,
  FileText,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examApi } from '@/services/api';
import type { Exam } from '@/types/backend';

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const response: any = await examApi.getExams();
      console.log('Exams API Response:', response); // Debug log
      
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
    } finally {
      setLoading(false);
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

  const handleCreate = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      description: '',
      duration: 60,
      difficulty: 'Easy',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title || '',
      description: exam.description || '',
      duration: exam.duration || 60,
      difficulty: exam.difficulty || 'Easy',
      isActive: exam.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingExam) {
        // Update exam
        await examApi.updateExam(editingExam.id, formData);
        await loadExams(); // Reload exams
        setShowCreateModal(false);
      } else {
        // Create exam
        await examApi.createExam(formData);
        await loadExams(); // Reload exams
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving exam:', error);
      alert('Error saving exam. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examApi.deleteExam(id);
        setExams(exams.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Error deleting exam. Please try again.');
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
                Exam Management
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Manage exams, tests, and assessments
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Exam
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
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

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
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

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
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

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
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
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {exam.title?.charAt(0) || 'E'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(exam)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(exam.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {exam.title}
                      </h3>
                      {exam.description && (
                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                          {exam.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getDifficultyColor(exam.difficulty || 'Easy')}>
                        {exam.difficulty || 'Easy'}
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(exam.duration || 60)}
                      </Badge>
                      
                      <Badge variant={exam.isActive ? 'success' : 'secondary'}>
                        {exam.isActive ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Exam #{exam.id}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {exam.examAttempts?.length || 0} attempts
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
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No exams found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first exam.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
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
              {editingExam ? 'Edit Exam' : 'Create New Exam'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter exam title"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                    placeholder="Enter duration in minutes"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange('difficulty', value as any)}
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
                  {formLoading ? 'Saving...' : (editingExam ? 'Update Exam' : 'Create Exam')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
