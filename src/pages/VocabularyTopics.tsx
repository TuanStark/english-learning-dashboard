import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
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
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { vocabularyTopicApi, vocabularyApi } from '@/services/api';
import type { VocabularyTopic, Vocabulary } from '@/types/backend';

export default function VocabularyTopics() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkVocabModal, setShowBulkVocabModal] = useState(false);
  const [showVocabListModal, setShowVocabListModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<VocabularyTopic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<VocabularyTopic | null>(null);
  const [topicVocabularies, setTopicVocabularies] = useState<Vocabulary[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    topicName: '',
    description: '',
    image: '',
    orderIndex: 0,
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Bulk vocabulary form state
  const [bulkVocabData, setBulkVocabData] = useState('');
  const [bulkVocabLoading, setBulkVocabLoading] = useState(false);
  
  // Vocabulary list modal state
  const [vocabSearchTerm, setVocabSearchTerm] = useState('');
  const [vocabLoading, setVocabLoading] = useState(false);

  useEffect(() => {
    loadTopics();
    loadVocabularies();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const loadVocabularies = async () => {
    try {
      const response: any = await vocabularyApi.getVocabularies();
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
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = 
      topic.topicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getVocabularyCount = (topicId: number) => {
    return vocabularies.filter(v => v.topicId === topicId).length;
  };



  const handleCreate = () => {
    setEditingTopic(null);
    setFormData({
      topicName: '',
      description: '',
      image: '',
      orderIndex: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEdit = (topic: VocabularyTopic) => {
    setEditingTopic(topic);
    setFormData({
      topicName: topic.topicName || '',
      description: topic.description || '',
      image: topic.image || '',
      orderIndex: topic.orderIndex || 0,
      isActive: topic.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingTopic) {
        // Update topic
        await vocabularyTopicApi.updateTopic(editingTopic.id, formData);
        await loadTopics(); // Reload topics
        setShowCreateModal(false);
      } else {
        // Create topic
        await vocabularyTopicApi.createTopic(formData);
        await loadTopics(); // Reload topics
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving topic:', error);
      alert('Error saving topic. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this topic? This will also delete all associated vocabularies.')) {
      try {
        await vocabularyTopicApi.deleteTopic(id);
        setTopics(topics.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Error deleting topic. Please try again.');
      }
    }
  };

  const handleBulkVocabularies = (topic: VocabularyTopic) => {
    setSelectedTopic(topic);
    setBulkVocabData('');
    setShowBulkVocabModal(true);
  };

  const handleViewVocabularies = async (topic: VocabularyTopic) => {
    setSelectedTopic(topic);
    setVocabSearchTerm('');
    setShowVocabListModal(true);
    
    // Load vocabularies for this topic
    setVocabLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/vocabularies/topic/${topic.id}`);
      const result = await response.json();
      
      if (response.ok) {
        setTopicVocabularies(result.data || []);
      } else {
        console.error('Error loading vocabularies:', result);
        setTopicVocabularies([]);
      }
    } catch (error) {
      console.error('Error loading vocabularies:', error);
      setTopicVocabularies([]);
    } finally {
      setVocabLoading(false);
    }
  };

  const handleBulkVocabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !bulkVocabData.trim()) return;

    setBulkVocabLoading(true);
    
    try {
      // Parse the bulk data (expecting format: "word1|meaning1|type1|difficulty1\nword2|meaning2|type2|difficulty2")
      const lines = bulkVocabData.trim().split('\n').filter(line => line.trim());
      const vocabularies = lines.map(line => {
        const parts = line.split('|').map(part => part.trim());
        return {
          englishWord: parts[0] || '',
          vietnameseMeaning: parts[1] || '',
          wordType: parts[2] || null,
          difficultyLevel: parts[3] || 'Easy',
          pronunciation: parts[4] || null,
          image: parts[5] || null,
          audioFile: parts[6] || null,
        };
      });

      // Call the bulk create API
      const response = await fetch(`http://localhost:8001/vocabulary-topics/${selectedTopic.id}/vocabularies/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vocabularies }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Đã thêm thành công ${result.data.created} từ vựng. Bỏ qua ${result.data.skipped} từ trùng lặp.`);
        setShowBulkVocabModal(false);
        setBulkVocabData('');
        await loadVocabularies(); // Reload vocabularies
      } else {
        alert('Lỗi khi thêm từ vựng: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding bulk vocabularies:', error);
      alert('Lỗi khi thêm từ vựng. Vui lòng thử lại.');
    } finally {
      setBulkVocabLoading(false);
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
                Quản Lý Chủ Đề Từ Vựng
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý chủ đề từ vựng và danh mục
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Chủ Đề
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Chủ Đề</p>
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
                  <p className="text-sm font-medium text-slate-600">Tổng Từ Vựng</p>
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
                  <p className="text-sm font-medium text-slate-600">Chủ Đề Hoạt Động</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {topics.filter(t => t.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Tag className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Từ Vựng/Chủ Đề Trung Bình</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {topics.length > 0 ? Math.round(vocabularies.length / topics.length) : 0}
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topics List */}
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
        ) : filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {topic.topicName?.charAt(0) || 'T'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewVocabularies(topic)}
                        className="h-8 w-8 p-0 hover:bg-purple-50"
                        title="Xem tất cả từ vựng"
                      >
                        <Book className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBulkVocabularies(topic)}
                        className="h-8 w-8 p-0 hover:bg-green-50"
                        title="Thêm từ vựng hàng loạt"
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(topic)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        title="Chỉnh sửa chủ đề"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(topic.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        title="Xóa chủ đề"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {topic.topicName}
                      </h3>
                      {topic.description && (
                        <p className="text-slate-600 text-sm mt-1">
                          {topic.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={topic.isActive ? 'success' : 'secondary'}>
                        {topic.isActive ? 'Hoạt Động' : 'Không Hoạt Động'}
                      </Badge>
                      
                      <Badge variant="outline">
                        Thứ Tự: {topic.orderIndex}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Book className="h-4 w-4" />
                        {getVocabularyCount(topic.id)} từ vựng
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Topic #{topic.id}
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
              <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy chủ đề</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? 'Hãy điều chỉnh tiêu chí tìm kiếm của bạn.'
                  : 'Get started by creating your first vocabulary topic.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo Chủ Đề
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
              {editingTopic ? 'Chỉnh Sửa Chủ Đề' : 'Tạo Chủ Đề Mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="topicName">Tên Chủ Đề *</Label>
                  <Input
                    id="topicName"
                    value={formData.topicName}
                    onChange={(e) => handleInputChange('topicName', e.target.value)}
                    placeholder="Nhập tên chủ đề"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Mô Tả</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Nhập mô tả chủ đề"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">URL Hình Ảnh</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Nhập URL hình ảnh"
                  />
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
                  {formLoading ? 'Đang Lưu...' : (editingTopic ? 'Cập Nhật Chủ Đề' : 'Tạo Chủ Đề')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Vocabulary Modal */}
      {showBulkVocabModal && selectedTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Thêm từ vựng hàng loạt - {selectedTopic.topicName}
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn nhập dữ liệu:</h3>
              <p className="text-blue-800 text-sm mb-2">
                Mỗi dòng là một từ vựng, các thông tin cách nhau bằng dấu "|"
              </p>
              <p className="text-blue-800 text-sm">
                <strong>Định dạng:</strong> Từ tiếng Anh | Nghĩa tiếng Việt | Loại từ | Độ khó | Phát âm | Hình ảnh | Audio
              </p>
              <p className="text-blue-800 text-sm mt-2">
                <strong>Ví dụ:</strong><br/>
                hello | xin chào | Noun | Easy | /həˈloʊ/ | | |<br/>
                beautiful | đẹp | Adjective | Medium | /ˈbjuːtɪfəl/ | | |
              </p>
            </div>
            
            <form onSubmit={handleBulkVocabSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bulkVocabData">Dữ liệu từ vựng *</Label>
                <textarea
                  id="bulkVocabData"
                  value={bulkVocabData}
                  onChange={(e) => setBulkVocabData(e.target.value)}
                  placeholder="Nhập từ vựng theo định dạng trên..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  rows={12}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowBulkVocabModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy Bỏ
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                  disabled={bulkVocabLoading || !bulkVocabData.trim()}
                >
                  {bulkVocabLoading ? 'Đang thêm...' : 'Thêm từ vựng'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vocabulary List Modal */}
      {showVocabListModal && selectedTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Từ vựng - {selectedTopic.topicName}
              </h2>
              <Button
                onClick={() => setShowVocabListModal(false)}
                variant="outline"
                size="sm"
              >
                Đóng
              </Button>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm từ vựng..."
                  value={vocabSearchTerm}
                  onChange={(e) => setVocabSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Vocabulary List */}
            {vocabLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {topicVocabularies
                  .filter(vocab => 
                    vocab.englishWord?.toLowerCase().includes(vocabSearchTerm.toLowerCase()) ||
                    vocab.vietnameseMeaning?.toLowerCase().includes(vocabSearchTerm.toLowerCase())
                  )
                  .map((vocab) => (
                    <Card key={vocab.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {vocab.englishWord}
                            </h3>
                            {vocab.pronunciation && (
                              <p className="text-slate-600 text-sm italic">
                                /{vocab.pronunciation}/
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={vocab.difficultyLevel === 'Easy' ? 'success' : 
                                   vocab.difficultyLevel === 'Medium' ? 'warning' : 'destructive'}
                            className="text-xs"
                          >
                            {vocab.difficultyLevel}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-700 mb-2">
                          {vocab.vietnameseMeaning}
                        </p>
                        
                        {vocab.wordType && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Tag className="h-3 w-3" />
                            <span>{vocab.wordType}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Empty State */}
            {!vocabLoading && topicVocabularies.length === 0 && (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  Chưa có từ vựng nào
                </h3>
                <p className="text-slate-500 mb-6">
                  Hãy thêm từ vựng cho chủ đề này
                </p>
                <Button
                  onClick={() => {
                    setShowVocabListModal(false);
                    handleBulkVocabularies(selectedTopic);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm từ vựng
                </Button>
              </div>
            )}

            {/* Stats */}
            {topicVocabularies.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>
                    Tổng: {topicVocabularies.length} từ vựng
                  </span>
                  <div className="flex items-center gap-4">
                    <span>Dễ: {topicVocabularies.filter(v => v.difficultyLevel === 'Easy').length}</span>
                    <span>Trung bình: {topicVocabularies.filter(v => v.difficultyLevel === 'Medium').length}</span>
                    <span>Khó: {topicVocabularies.filter(v => v.difficultyLevel === 'Hard').length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
