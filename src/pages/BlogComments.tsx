import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Reply,
  Shield,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogCommentApi } from '@/services/api';
import type { BlogComment } from '@/types/backend';

export const BlogComments: React.FC = () => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<BlogComment | null>(null);
  
  // Form state
  const [replyForm, setReplyForm] = useState({
    content: '',
    isApproved: true
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response: any = await blogCommentApi.getComments();
      console.log('Blog Comments API Response:', response);
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setComments(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setComments(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setComments(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      // Use mock data if API fails
      setComments([
        {
          id: 1,
          blogPostId: 1,
          userId: 1,
          content: 'This is really helpful! I especially liked the tip about time management.',
          parentCommentId: undefined,
          isActive: true,
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          blogPostId: 1,
          userId: 2,
          content: 'Great article! I would add that practice tests are also very important.',
          parentCommentId: 1,
          isActive: true,
          createdAt: '2024-01-21T09:15:00Z',
          updatedAt: '2024-01-21T09:15:00Z'
        },
        {
          id: 3,
          blogPostId: 2,
          userId: 3,
          content: 'This guide is comprehensive but could use more examples.',
          parentCommentId: undefined,
          isActive: false,
          createdAt: '2024-01-22T16:45:00Z',
          updatedAt: '2024-01-22T16:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = comments.filter(comment => {
            const matchesSearch = 
          comment.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || comment.isActive === (selectedStatus === 'active');
        const matchesPost = selectedPost === 'all' || comment.blogPostId?.toString() === selectedPost;

    return matchesSearch && matchesStatus && matchesPost;
  });

  const handleReply = (comment: BlogComment) => {
    setSelectedComment(comment);
    setReplyForm({
      content: '',
      isApproved: true
    });
    setShowReplyModal(true);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComment) return;
    
    setFormLoading(true);
    try {
      // Create reply comment
      const replyData = {
        blogPostId: selectedComment.blogPostId,
        userId: 1, // Current user ID
        content: replyForm.content,
        parentCommentId: selectedComment.id,
        isActive: replyForm.isApproved
      };
      
      await blogCommentApi.createComment(replyData);
      await loadComments();
      setShowReplyModal(false);
      setReplyForm({ content: '', isApproved: true });
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Error creating reply. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async (commentId: number) => {
    try {
      await blogCommentApi.updateComment(commentId, { isActive: true });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, isActive: true } : c
      ));
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await blogCommentApi.deleteComment(id);
        setComments(comments.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error deleting comment. Please try again.');
      }
    }
  };

  const uniquePosts = Array.from(new Set(comments.map(c => ({ id: c.blogPostId, title: `Post ${c.blogPostId}` }))));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Quản Lý Bình Luận
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý và kiểm duyệt bình luận bài viết
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Công Cụ Kiểm Duyệt
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Bình Luận</p>
                  <p className="text-3xl font-bold text-slate-900">{comments.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Đã Duyệt</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {comments.filter(c => c.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Chờ Duyệt</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {comments.filter(c => !c.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Từ Chối</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {comments.filter(c => !c.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
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
                    placeholder="Tìm kiếm bình luận, tác giả, hoặc bài viết..."
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

                <Select value={selectedPost} onValueChange={setSelectedPost}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tất Cả Bài Viết" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả Bài Viết</SelectItem>
                    {uniquePosts.map(post => (
                      <SelectItem key={post.id} value={post.id?.toString() || ''}>
                        {post.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.userId?.toString().charAt(0) || 'Người Dùng'}
                    </div>
                                              <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900">Người Dùng #{comment.userId}</h4>
                            <Badge variant={comment.isActive ? 'success' : 'secondary'} className="text-xs">
                              {comment.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              <span className="ml-1">{comment.isActive ? 'Hoạt Động' : 'Không Hoạt Động'}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">Người Dùng ID: {comment.userId}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!comment.isActive && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(comment.id)}
                            className="h-8 px-3 hover:bg-green-50 text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Kích Hoạt
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(comment.id)}
                        className="h-8 px-3 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReply(comment)}
                        className="h-8 px-3 hover:bg-blue-50 text-blue-600"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Trả Lời
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(comment.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">Bài Viết ID:</span> {comment.blogPostId}
                    </div>
                    <p className="text-slate-800 bg-slate-50 rounded-lg p-3 border-l-4 border-blue-200">
                      {comment.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      

                    </div>
                    
                    {comment.parentCommentId && (
                      <Badge variant="outline" className="text-xs">
                        Reply to #{comment.parentCommentId}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Không tìm thấy bình luận</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedStatus !== 'all' || selectedPost !== 'all'
                  ? 'Vui lòng điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.'
                  : 'Không có bình luận nào đã được đăng.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedComment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Trả Lời Bình Luận
            </h2>
            
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-medium">Bình Luận Gốc Của Người Dùng #{selectedComment.userId}:</span>
              </p>
              <p className="text-slate-800">{selectedComment.content}</p>
            </div>
            
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <Label htmlFor="replyContent">Trả Lời Của Bạn *</Label>
                <textarea
                  id="replyContent"
                  value={replyForm.content}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Viết trả lời của bạn..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={replyForm.isApproved}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, isApproved: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="isApproved">Tự Động Duyệt Trả Lời</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
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
                  {formLoading ? 'Đang Gửi Trả Lời...' : 'Gửi Trả Lời'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
