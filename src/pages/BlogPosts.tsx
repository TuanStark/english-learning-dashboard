import React, { useState, useEffect } from 'react';
import {
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Eye as EyeIcon,
  MessageCircle,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Globe,
  Clock,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { blogApi } from '@/services/api';
import type { BlogPost, BlogCategory } from '@/types/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const BlogPosts: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  
  // CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    authorId: 1,
    categoryId: 1,
    status: 'Draft' as 'Draft' | 'Published' | 'Archived',
    seoKeywords: '',
    seoDescription: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch blog posts
        const postsResponse: any = await blogApi.getPosts();
        console.log('Blog Posts API Response:', postsResponse);
        
        let postsData: BlogPost[] = [];
        
        if (Array.isArray(postsResponse)) {
          postsData = postsResponse as unknown as BlogPost[];
        } else if (postsResponse && typeof postsResponse === 'object' && 'data' in postsResponse) {
          if (Array.isArray(postsResponse.data)) {
            postsData = postsResponse.data as unknown as BlogPost[];
          } else if (postsResponse.data && typeof postsResponse.data === 'object' && 'data' in postsResponse.data && Array.isArray(postsResponse.data.data)) {
            postsData = postsResponse.data.data as unknown as BlogPost[];
          }
        }
        
        // Fetch categories
        const categoriesResponse: any = await blogApi.getCategories();
        console.log('Blog Categories API Response:', categoriesResponse);
        
        let categoriesData: BlogCategory[] = [];
        
        if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse as unknown as BlogCategory[];
        } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'data' in categoriesResponse) {
          if (Array.isArray(categoriesResponse.data)) {
            categoriesData = categoriesResponse.data as unknown as BlogCategory[];
          } else if (categoriesResponse.data && typeof categoriesResponse.data === 'object' && 'data' in categoriesResponse.data && Array.isArray(categoriesResponse.data.data)) {
            categoriesData = categoriesResponse.data.data as unknown as BlogCategory[];
          }
        }
        
        // If no data from API, use fallback mock data
        if (postsData.length === 0) {
          postsData = [
            {
              id: 1,
              title: '10 Essential Tips for TOEIC Success',
              slug: '10-essential-tips-for-toeic-success',
              excerpt: 'Master the TOEIC exam with these proven strategies and techniques that will help you achieve your target score.',
              content: 'Full content here...',
              authorId: 1,
              categoryId: 1,
              status: 'Published',
              viewCount: 1247,
              publishedAt: '2024-08-20T10:00:00Z',
              createdAt: '2024-08-15T14:30:00Z',
              updatedAt: '2024-08-20T10:00:00Z',
              seoDescription: 'Learn the top 10 tips for TOEIC success with proven strategies and techniques.'
            }
          ];
        }
        
        if (categoriesData.length === 0) {
          categoriesData = [
            {
              id: 1,
              categoryName: 'Exam Preparation',
              slug: 'exam-preparation',
              description: 'Tips and strategies for various English exams',
              orderIndex: 1,
              isActive: true,
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ];
        }
        
        setBlogPosts(postsData);
        setCategories(categoriesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data from API, using fallback data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

    const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categoryId.toString() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    const matchesAuthor = selectedAuthor === 'all' || post.authorId.toString() === selectedAuthor;

    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  });

  // CRUD Functions
  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      authorId: 1,
      categoryId: 1,
      status: 'Draft',
      seoKeywords: '',
      seoDescription: ''
    });
    setShowCreateModal(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      authorId: post.authorId,
      categoryId: post.categoryId,
      status: post.status,
      seoKeywords: post.seoKeywords || '',
      seoDescription: post.seoDescription || ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingPost) {
        // Update post
        await blogApi.updatePost(editingPost.id, formData);
        await fetchData(); // Reload data
        setShowCreateModal(false);
      } else {
        // Create post
        await blogApi.createPost(formData);
        await fetchData(); // Reload data
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogApi.deletePost(id);
        setBlogPosts(blogPosts.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch blog posts
      const postsResponse: any = await blogApi.getPosts();
      console.log('Blog Posts API Response:', postsResponse);
      
      let postsData: BlogPost[] = [];
      
      if (Array.isArray(postsResponse)) {
        postsData = postsResponse as unknown as BlogPost[];
      } else if (postsResponse && typeof postsResponse === 'object' && 'data' in postsResponse) {
        if (Array.isArray(postsResponse.data)) {
          postsData = postsResponse.data as unknown as BlogPost[];
        } else if (postsResponse.data && typeof postsResponse.data === 'object' && 'data' in postsResponse.data && Array.isArray(postsResponse.data.data)) {
          postsData = postsResponse.data.data as unknown as BlogPost[];
        }
      }
      
      // Fetch categories
      const categoriesResponse: any = await blogApi.getCategories();
      console.log('Blog Categories API Response:', categoriesResponse);
      
      let categoriesData: BlogCategory[] = [];
      
      if (Array.isArray(categoriesResponse)) {
        categoriesData = categoriesResponse as unknown as BlogCategory[];
      } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'data' in categoriesResponse) {
        if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data as unknown as BlogCategory[];
        } else if (categoriesResponse.data && typeof categoriesResponse.data === 'object' && 'data' in categoriesResponse.data && Array.isArray(categoriesResponse.data.data)) {
          categoriesData = categoriesResponse.data.data as unknown as BlogCategory[];
        }
      }
      
      // If no data from API, use fallback mock data
      if (postsData.length === 0) {
        postsData = [
          {
            id: 1,
            title: '10 Essential Tips for TOEIC Success',
            slug: '10-essential-tips-for-toeic-success',
            excerpt: 'Master the TOEIC exam with these proven strategies and techniques that will help you achieve your target score.',
            content: 'Full content here...',
            authorId: 1,
            categoryId: 1,
            status: 'Published',
            viewCount: 1247,
            publishedAt: '2024-08-20T10:00:00Z',
            createdAt: '2024-08-15T14:30:00Z',
            updatedAt: '2024-08-20T10:00:00Z',
            seoDescription: 'Learn the top 10 tips for TOEIC success with proven strategies and techniques.'
          }
        ];
      }
      
      if (categoriesData.length === 0) {
        categoriesData = [
          {
            id: 1,
            categoryName: 'Exam Preparation',
            slug: 'exam-preparation',
            description: 'Tips and strategies for various English exams',
            orderIndex: 1,
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          }
        ];
      }
      
      setBlogPosts(postsData);
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data from API, using fallback data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Globe className="h-3 w-3" />;
      case 'draft': return <FileText className="h-3 w-3" />;
      case 'archived': return <Clock className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-white/60 backdrop-blur-sm rounded-2xl w-1/3 mb-8"></div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
            <div className="h-10 bg-white/60 backdrop-blur-sm rounded-xl w-1/4 mb-4"></div>
            <div className="h-10 bg-white/60 backdrop-blur-sm rounded-xl w-1/3"></div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/60 backdrop-blur-sm rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="text-center py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Blog Posts</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Quản Lý Bài Viết
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Tạo và quản lý nội dung bài viết hấp dẫn cho người học tiếng Anh
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCreate}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                <span>Bài Viết Mới</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/70 transition-all duration-200 border border-white/30">
                <Settings className="h-4 w-4" />
                <span>Cài Đặt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
            >
                <option value="all">Tất Cả Chủ Đề</option>
              <option value="1">Chuẩn Bị Thi</option>
              <option value="2">Grammar</option>
              <option value="3">Tiếng Anh Kinh Doanh</option>
              <option value="4">Phát Âm</option>
              <option value="5">Phương Pháp Học</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tất Cả Trạng Thái</option>
              <option value="published">Đã Xuất Bản</option>
              <option value="draft">Nháp</option>
              <option value="archived">Đã Lưu</option>
            </select>
          </div>

          {/* Author Filter */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tất Cả Tác Giả</option>
              <option value="1">Sarah Cồn</option>
              <option value="2">Michael Cồn</option>
              <option value="3">Emily Cồn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blog Posts ({filteredBlogPosts.length})</h3>
            <p className="text-gray-500 text-sm">Hiển thị {filteredBlogPosts.length} trên {blogPosts.length} bài viết</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Download className="h-4 w-4" />
              <span className="text-sm">Xuất Dữ Liệu</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Nhập Dữ Liệu</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Làm Mới</span>
            </button>
          </div>
        </div>

        {filteredBlogPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-500">Vui lòng điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogPosts.map((post) => (
              <div key={post.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start space-x-4">
                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">{post.title}</h4>
                          {post.status === 'Published' && (
                            <span className="inline-flex items-center px-2 py-3 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Đã Xuất Bản
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt || 'Không có tóm tắt'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-1 rounded-lg transition-colors ${
                          post.status === 'Published' 
                            ? 'text-green-500 hover:bg-green-100' 
                            : post.status === 'Draft'
                            ? 'text-yellow-500 hover:bg-yellow-100'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}>
                          {getStatusIcon(post.status)}
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* SEO Keywords */}
                    {post.seoKeywords && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.seoKeywords.split(',').slice(0, 4).map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Không được xuất bản'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>5 phút đọc</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EyeIcon className="h-4 w-4" />
                        <span>{post.viewCount} lượt xem</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0} bình luận</span>
                      </div>
                    </div>
                  </div>

                  {/* Author and Actions */}
                  <div className="flex flex-col items-end space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2">
                                              <img
                          src={post.author?.avatar || 'https://via.placeholder.com/32x32?text=U'}
                          alt={post.author?.fullName || 'Tác Giả Không Xác Định'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{post.author?.fullName || 'Tác Giả Không Xác Định'}</p>
                          <p className="text-xs text-gray-500">{post.category?.categoryName || 'Chủ Đề Không Xác Định'}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {getStatusIcon(post.status)}
                      <span className="ml-1 capitalize">{post.status}</span>
                    </span>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(post)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingPost ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Tiêu Đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      handleInputChange('title', e.target.value);
                      if (!editingPost) {
                        handleInputChange('slug', generateSlug(e.target.value));
                      }
                    }}
                    placeholder="Nhập tiêu đề bài viết"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="post-url-slug"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="excerpt">Tóm Tắt</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Tóm tắt ngắn gọn bài viết"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="content">Nội Dung *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Nhập nội dung bài viết"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoryId">Chủ Đề *</Label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Trạng Thái *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'Draft' | 'Published' | 'Archived')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Draft">Nháp</option>
                    <option value="Published">Đã Xuất Bản</option>
                    <option value="Archived">Đã Lưu</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="SEO meta description for search engines"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  {formLoading ? 'Đang Lưu...' : (editingPost ? 'Cập Nhật Bài Viết' : 'Tạo Bài Viết')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2"
                >
                  Hủy Bỏ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
