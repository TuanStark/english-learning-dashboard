import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Users,
  Crown,
  GraduationCap,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { roleApi } from '@/services/api';
import type { Role } from '@/types/backend';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    roleName: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response: any = await roleApi.getRoles();
      console.log('Roles API Response:', response); // Debug log
      
      // Handle different response structures
      if (Array.isArray(response)) {
        setRoles(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      roleName: '',
      description: ''
    });
    setShowCreateModal(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName || '',
      description: role.description || ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingRole) {
        // Update role
        await roleApi.updateRole(editingRole.id, formData);
        await loadRoles(); // Reload roles
        setShowCreateModal(false);
      } else {
        // Create role
        await roleApi.createRole(formData);
        await loadRoles(); // Reload roles
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving role:', error);
      alert('Error saving role. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        await roleApi.deleteRole(id);
        setRoles(roles.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Error deleting role. Please try again.');
      }
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'teacher':
        return <GraduationCap className="h-5 w-5 text-blue-600" />;
      case 'student':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      default:
        return <Shield className="h-5 w-5 text-slate-600" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'teacher':
        return 'Teacher';
      case 'student':
        return 'Student';
      default:
        return roleName || 'Custom';
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
                Quản Lý Vai Trò
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý vai trò và quyền hạn của hệ thống
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Vai Trò
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Vai Trò</p>
                  <p className="text-3xl font-bold text-slate-900">{roles.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Vai Trò Admin</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {roles.filter(r => r.roleName?.toLowerCase() === 'admin').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Vai Trò Giáo Viên</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {roles.filter(r => r.roleName?.toLowerCase() === 'teacher').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Vai Trò Học Sinh</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {roles.filter(r => r.roleName?.toLowerCase() === 'student').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Filter */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm vai trò theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles List */}
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
        ) : filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                      {getRoleIcon(role.roleName)}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(role)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(role.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        disabled={role.roleName?.toLowerCase() === 'admin'}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-xl">
                        {role.roleName}
                      </h3>
                    </div>

                    {role.description && (
                      <div>
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {role.description}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getRoleColor(role.roleName)} border`}
                      >
                        {getRoleBadge(role.roleName)}
                      </Badge>
                      
                      {role.roleName?.toLowerCase() === 'admin' && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Protected
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Role #{role.id}
                      </span>
                      
                                             <span className="flex items-center gap-1">
                         <Users className="h-3 w-3" />
                         {Math.floor(Math.random() * 10) + 1} users
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
              <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No roles found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first role.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
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
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="roleName">Tên Vai Trò *</Label>
                <Input
                  id="roleName"
                  value={formData.roleName}
                  onChange={(e) => handleInputChange('roleName', e.target.value)}
                  placeholder="Nhập tên vai trò (ví dụ: Admin, Giáo Viên, Học Sinh)"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Mô Tả</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả vai trò..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
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
                  {formLoading ? 'Đang Lưu...' : (editingRole ? 'Cập Nhật Vai Trò' : 'Tạo Vai Trò')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
