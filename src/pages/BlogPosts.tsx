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
  Tag,
  Eye as EyeIcon,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Globe,
  Clock,
  BarChart3
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  categoryId: number;
  categoryName: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const BlogPosts: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        // Mock data for now
        const mockBlogPosts: BlogPost[] = [
          {
            id: 1,
            title: '10 Essential Tips for TOEIC Success',
            excerpt: 'Master the TOEIC exam with these proven strategies and techniques that will help you achieve your target score.',
            content: 'Full content here...',
            authorId: 1,
            authorName: 'Sarah Johnson',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            categoryId: 1,
            categoryName: 'Exam Preparation',
            tags: ['TOEIC', 'Exam Tips', 'Study Strategies', 'Success'],
            status: 'published',
            publishedAt: '2024-08-20T10:00:00Z',
            createdAt: '2024-08-15T14:30:00Z',
            updatedAt: '2024-08-20T10:00:00Z',
            readTime: 8,
            views: 1247,
            likes: 89,
            comments: 23,
            featured: true,
            seoTitle: 'TOEIC Success Tips - 10 Essential Strategies',
            seoDescription: 'Learn the top 10 tips for TOEIC success with proven strategies and techniques.'
          },
          {
            id: 2,
            title: 'Understanding English Tenses: A Complete Guide',
            excerpt: 'A comprehensive overview of all English tenses with examples and practice exercises for better understanding.',
            content: 'Full content here...',
            authorId: 2,
            authorName: 'Michael Chen',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            categoryId: 2,
            categoryName: 'Grammar',
            tags: ['Grammar', 'Tenses', 'English Learning', 'Tutorial'],
            status: 'published',
            publishedAt: '2024-08-18T15:45:00Z',
            createdAt: '2024-08-10T11:20:00Z',
            updatedAt: '2024-08-18T15:45:00Z',
            readTime: 12,
            views: 892,
            likes: 67,
            comments: 18,
            featured: false,
            seoTitle: 'English Tenses Complete Guide - Learn All Tenses',
            seoDescription: 'Master all English tenses with our comprehensive guide including examples and exercises.'
          },
          {
            id: 3,
            title: 'Business English Vocabulary for Professionals',
            excerpt: 'Essential business English vocabulary and phrases that every professional should know for workplace communication.',
            content: 'Full content here...',
            authorId: 3,
            authorName: 'Emily Rodriguez',
            authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            categoryId: 3,
            categoryName: 'Business English',
            tags: ['Business English', 'Vocabulary', 'Professional', 'Workplace'],
            status: 'published',
            publishedAt: '2024-08-16T09:30:00Z',
            createdAt: '2024-08-08T16:15:00Z',
            updatedAt: '2024-08-16T09:30:00Z',
            readTime: 6,
            views: 567,
            likes: 45,
            comments: 12,
            featured: false,
            seoTitle: 'Business English Vocabulary - Professional Communication',
            seoDescription: 'Learn essential business English vocabulary for professional workplace communication.'
          },
          {
            id: 4,
            title: 'IELTS Writing Task 2: Essay Structure Guide',
            excerpt: 'Learn the proper structure and format for IELTS Writing Task 2 essays to maximize your score.',
            content: 'Full content here...',
            authorId: 1,
            authorName: 'Sarah Johnson',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            categoryId: 1,
            categoryName: 'Exam Preparation',
            tags: ['IELTS', 'Writing', 'Essay Structure', 'Task 2'],
            status: 'draft',
            publishedAt: undefined,
            createdAt: '2024-08-12T13:45:00Z',
            updatedAt: '2024-08-22T17:20:00Z',
            readTime: 10,
            views: 0,
            likes: 0,
            comments: 0,
            featured: false,
            seoTitle: 'IELTS Writing Task 2 Essay Structure - Complete Guide',
            seoDescription: 'Master IELTS Writing Task 2 with our comprehensive essay structure guide.'
          },
          {
            id: 5,
            title: 'Common English Pronunciation Mistakes and How to Fix Them',
            excerpt: 'Identify and correct the most common English pronunciation mistakes that learners make.',
            content: 'Full content here...',
            authorId: 2,
            authorName: 'Michael Chen',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            categoryId: 4,
            categoryName: 'Pronunciation',
            tags: ['Pronunciation', 'Common Mistakes', 'How to Fix', 'Speaking'],
            status: 'published',
            publishedAt: '2024-08-14T11:15:00Z',
            createdAt: '2024-08-05T10:30:00Z',
            updatedAt: '2024-08-14T11:15:00Z',
            readTime: 7,
            views: 734,
            likes: 52,
            comments: 15,
            featured: false,
            seoTitle: 'English Pronunciation Mistakes - How to Fix Them',
            seoDescription: 'Learn to identify and fix common English pronunciation mistakes with our expert guide.'
          },
          {
            id: 6,
            title: 'Learning English Through Movies: A Fun Approach',
            excerpt: 'Discover how watching English movies can improve your language skills and make learning more enjoyable.',
            content: 'Full content here...',
            authorId: 3,
            authorName: 'Emily Rodriguez',
            authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            categoryId: 5,
            categoryName: 'Learning Methods',
            tags: ['Movies', 'Entertainment', 'Learning Methods', 'Fun Learning'],
            status: 'archived',
            publishedAt: '2024-07-30T14:20:00Z',
            createdAt: '2024-07-25T09:45:00Z',
            updatedAt: '2024-08-01T16:30:00Z',
            readTime: 5,
            views: 423,
            likes: 38,
            comments: 9,
            featured: false,
            seoTitle: 'Learn English Through Movies - Fun Language Learning',
            seoDescription: 'Improve your English skills by watching movies with our fun learning approach.'
          }
        ];
        setBlogPosts(mockBlogPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categoryId.toString() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    const matchesAuthor = selectedAuthor === 'all' || post.authorId.toString() === selectedAuthor;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  });

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exam Preparation': return 'bg-blue-100 text-blue-800';
      case 'Grammar': return 'bg-purple-100 text-purple-800';
      case 'Business English': return 'bg-green-100 text-green-800';
      case 'Pronunciation': return 'bg-yellow-100 text-yellow-800';
      case 'Learning Methods': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
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
                Blog Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Create and manage engaging blog content for English learners
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/70 transition-all duration-200 border border-white/30">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
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
              placeholder="Search blog posts..."
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
              <option value="all">All Categories</option>
              <option value="1">Exam Preparation</option>
              <option value="2">Grammar</option>
              <option value="3">Business English</option>
              <option value="4">Pronunciation</option>
              <option value="5">Learning Methods</option>
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
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
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
              <option value="all">All Authors</option>
              <option value="1">Sarah Johnson</option>
              <option value="2">Michael Chen</option>
              <option value="3">Emily Rodriguez</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blog Posts ({filteredBlogPosts.length})</h3>
            <p className="text-gray-500 text-sm">Showing {filteredBlogPosts.length} of {blogPosts.length} posts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Import</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/70 transition-all duration-200 border border-white/30">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {filteredBlogPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
                          {post.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-1 rounded-lg transition-colors ${
                          post.status === 'published' 
                            ? 'text-green-500 hover:bg-green-100' 
                            : post.status === 'draft'
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

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{post.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Post Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EyeIcon className="h-4 w-4" />
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Author and Actions */}
                  <div className="flex flex-col items-end space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                        <p className="text-xs text-gray-500">{post.categoryName}</p>
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
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
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
    </div>
  );
};
