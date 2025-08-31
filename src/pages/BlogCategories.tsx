import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  Tag,
  TrendingUp,
  FileText,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogCategoryApi } from '@/services/api';
import type { BlogCategory } from '@/types/backend';

export const BlogCategories: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    description: '',
    isActive: true,
    orderIndex: 0
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response: any = await blogCategoryApi.getCategories();
      console.log('Blog Categories API Response:', response);
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use fallback mock data if API fails
      setCategories([
        {
          id: 1,
          categoryName: 'Exam Preparation',
          slug: 'exam-preparation',
          description: 'Tips and strategies for various English exams',
          isActive: true,
          orderIndex: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
          const matchesSearch = 
        category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || category.isActive === (selectedStatus === 'active');

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      slug: '',
      description: '',
      isActive: true,
      orderIndex: 0
    });
    setShowCreateModal(true);
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName || '',
      slug: category.slug || '',
      description: category.description || '',
      isActive: category.isActive,
      orderIndex: category.orderIndex || 0
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingCategory) {
        // Update category
        await blogCategoryApi.updateCategory(editingCategory.id, formData);
        await loadCategories();
        setShowCreateModal(false);
      } else {
        // Create category
        await blogCategoryApi.createCategory(formData);
        await loadCategories();
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await blogCategoryApi.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Quản Lý Chủ Đề Bài Viết
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý chủ đề bài viết và danh mục
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
                  <p className="text-3xl font-bold text-slate-900">{categories.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Chủ Đề Hoạt Động</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {categories.filter(c => c.isActive).length}
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
                  <p className="text-sm font-medium text-slate-600">Tổng Bài Viết</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {categories.reduce((sum, c) => sum + (c.blogPosts?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Trung Bình Bài Viết/Chủ Đề</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + (c.blogPosts?.length || 0), 0) / categories.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
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
              
              <div className="flex gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tất Cả Trạng Thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                    <SelectItem value="active">Hoạt Động</SelectItem>
                    <SelectItem value="inactive">Không Hoạt Động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
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
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    >
                      {category.categoryName?.charAt(0) || 'Cồn Chủ Đề'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(category.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                                <h3 className="font-semibold text-slate-900 text-lg">
            {category.categoryName}
          </h3>
                      <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {category.slug}
                      </Badge>
                      
                      <Badge variant={category.isActive ? 'success' : 'secondary'}>
                        {category.isActive ? 'Hoạt Động' : 'Không Hoạt Động'}
                      </Badge>
                      
                      <Badge variant="outline">
                        Thứ Tự: {category.orderIndex}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {category.blogPosts?.length || 0} bài viết
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(category.createdAt).toLocaleDateString()}
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
                {searchTerm || selectedStatus !== 'all'
                  ? 'Vui lòng điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.'
                  : 'Bắt đầu bằng cách tạo chủ đề đầu tiên.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Chủ Đề
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
              {editingCategory ? 'Chỉnh Sửa Chủ Đề' : 'Tạo Chủ Đề Mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="categoryName">Tên Chủ Đề *</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => {
                      handleInputChange('categoryName', e.target.value);
                      if (!editingCategory) {
                        handleInputChange('slug', generateSlug(e.target.value));
                      }
                    }}
                    placeholder="Nhập tên chủ đề"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="category-slug"
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
                  {formLoading ? 'Đang Lưu...' : (editingCategory ? 'Cập Nhật Chủ Đề' : 'Tạo Chủ Đề')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
