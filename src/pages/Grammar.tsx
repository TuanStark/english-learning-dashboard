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
  Eye,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { grammarApi, grammarExampleApi } from '@/services/api';
import type { Grammar, GrammarExample } from '@/types/backend';

export default function Grammar() {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [examples, setExamples] = useState<GrammarExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGrammar, setEditingGrammar] = useState<Grammar | null>(null);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    difficultyLevel: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    orderIndex: 0,
    isActive: true,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: 'Grammar'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadGrammars();
  }, []);

  const loadExamples = async (grammarId: number) => {
    try {
      const response = await grammarApi.getGrammarExamples(grammarId);
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

  const loadGrammars = async () => {
    try {
      setLoading(true);
      const response: any = await grammarApi.getGrammar();
      console.log('Grammar API Response:', response); // Debug log
      
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleCreate = () => {
    setEditingGrammar(null);
    setFormData({
      title: '',
      content: '',
      difficultyLevel: 'Easy',
      orderIndex: 0,
      isActive: true,
      difficulty: 'Easy',
      category: 'Grammar'
    });
    setShowCreateModal(true);
  };

  const handleEdit = (grammar: Grammar) => {
    setEditingGrammar(grammar);
    setFormData({
      title: grammar.title || '',
      content: grammar.content || '',
      difficultyLevel: grammar.difficultyLevel || 'Easy',
      orderIndex: grammar.orderIndex || 0,
      isActive: grammar.isActive,
      difficulty: grammar.difficultyLevel || 'Easy',
      category: 'Grammar'
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingGrammar) {
        // Update grammar
        await grammarApi.updateGrammar(editingGrammar.id, formData);
        await loadGrammars(); // Reload grammars
        setShowCreateModal(false);
      } else {
        // Create grammar
        await grammarApi.createGrammar(formData);
        await loadGrammars(); // Reload grammars
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving grammar:', error);
      alert('Error saving grammar. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this grammar lesson?')) {
      try {
        await grammarApi.deleteGrammar(id);
        setGrammars(grammars.filter(g => g.id !== id));
      } catch (error) {
        console.error('Error deleting grammar:', error);
        alert('Error deleting grammar. Please try again.');
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
                Quản Lý Ngữ Pháp
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý bài học ngữ pháp, quy tắc và ví dụ
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Ngữ Pháp
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Bài Học</p>
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
                  <p className="text-sm font-medium text-slate-600">Mức Độ Dễ</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {grammars.filter(g => g.difficultyLevel === 'Easy').length}
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
                    {grammars.filter(g => g.difficultyLevel === 'Medium').length}
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
                    {grammars.filter(g => g.difficultyLevel === 'Hard').length}
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
                    placeholder="Tìm kiếm bài học ngữ pháp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
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

        {/* Grammar List */}
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
        ) : filteredGrammars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrammars.map((grammar) => (
              <Card key={grammar.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {grammar.title?.charAt(0) || 'G'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedGrammar(grammar);
                          loadExamples(grammar.id);
                          setShowExamplesModal(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-green-50"
                        title="Xem Ví Dụ"
                      >
                        <BookOpen className="h-4 w-4 text-green-600" />
                      </Button>
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
                        onClick={() => handleDelete(grammar.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {grammar.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1 line-clamp-3">
                        {grammar.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getDifficultyColor(grammar.difficultyLevel || 'Easy')}>
                        {grammar.difficultyLevel || 'Easy'}
                      </Badge>
                      
                      <Badge variant="outline">
                        Thứ Tự: {grammar.orderIndex}
                      </Badge>
                      
                      <Badge variant={grammar.isActive ? 'success' : 'secondary'}>
                        {grammar.isActive ? 'Hoạt Động' : 'Không Hoạt Động'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Bài Học #{grammar.id}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {grammar.examples?.length || 0} ví dụ
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
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy bài học ngữ pháp</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedDifficulty !== 'all'
                  ? 'Vui lòng điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.'
                  : 'Bắt đầu bằng cách tạo bài học ngữ pháp đầu tiên.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Ngữ Pháp
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
              {editingGrammar ? 'Chỉnh Sửa Bài Học Ngữ Pháp' : 'Tạo Bài Học Ngữ Pháp Mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tiêu Đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề bài học ngữ pháp"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="content">Nội Dung *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Nhập nội dung bài học ngữ pháp với quy tắc và giải thích"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                    required
                  />
                </div>
                
                <div>
                    <Label htmlFor="difficultyLevel">Mức Độ</Label>
                  <Select
                    value={formData.difficultyLevel}
                    onValueChange={(value) => handleInputChange('difficultyLevel', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="orderIndex">Thứ Tự</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="0"
                    value={formData.orderIndex}
                    onChange={(e) => handleInputChange('orderIndex', parseInt(e.target.value) || 0)}
                    placeholder="Nhập thứ tự"
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
                <Label htmlFor="isActive">Hoạt Động</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy Bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={formLoading}
                >
                  {formLoading ? 'Đang Lưu...' : (editingGrammar ? 'Cập Nhật Ngữ Pháp' : 'Tạo Ngữ Pháp')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Examples Modal */}
      {showExamplesModal && selectedGrammar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Ví Dụ Cho "{selectedGrammar.title}"
                </h2>
                <p className="text-slate-600 mt-1">
                  {selectedGrammar.content}
                </p>
              </div>
              <Button
                onClick={() => setShowExamplesModal(false)}
                variant="outline"
                size="sm"
              >
                Đóng
              </Button>
            </div>

            {examples.length > 0 ? (
              <div className="space-y-4">
                {examples.map((example) => (
                  <Card key={example.id} className="bg-slate-50 border border-slate-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Tiếng Anh:</p>
                          <p className="text-slate-800 bg-white rounded-lg p-3 text-sm border">
                            {example.englishSentence}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Tiếng Việt:</p>
                          <p className="text-slate-800 bg-white rounded-lg p-3 text-sm border">
                            {example.vietnameseSentence}
                          </p>
                        </div>
                        
                        {example.explanation && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Giải Thích:</p>
                            <p className="text-slate-700 bg-green-50 rounded-lg p-3 text-sm border-l-4 border-green-200">
                              {example.explanation}
                            </p>
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
                <h3 className="text-lg font-medium text-slate-600 mb-2">Không có ví dụ</h3>
                <p className="text-slate-500 mb-6">
                  Bài học ngữ pháp này không có ví dụ.
                </p>
                <Button
                  onClick={() => setShowExamplesModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Đóng
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
