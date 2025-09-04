import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  User as UserIcon,
  Shield,
  Mail,
  Phone,
  Calendar,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userApi, roleApi } from '@/services/api';
import type { User, Role } from '@/types/backend';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: 1,
    status: 'active' as 'active' | 'inactive' | 'banned',
    avatar: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response: any = await userApi.getUsers();
      console.log('API Response:', response); // Debug log
      
      // Ensure we always set an array
      let usersData: User[] = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        usersData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          usersData = response.data.data;
        }
      }
      
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error loading users:', error);
      // If 403 error, show appropriate message
      if (error.response?.status === 403) {
        console.error('Access forbidden. Please check your permissions or login again.');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response: any = await roleApi.getRoles();
      console.log('Roles Response:', response); // Debug log
      
      // Ensure we always set an array
      let rolesData: Role[] = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        rolesData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        if (Array.isArray(response.data)) {
          rolesData = response.data;
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          rolesData = response.data.data;
        }
      }
      
      setRoles(rolesData);
    } catch (error: any) {
      console.error('Error loading roles:', error);
      setRoles([]);
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.roleId?.toString() === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleName = (roleId: number) => {
    const role = (Array.isArray(roles) ? roles : []).find(r => r.id === roleId);
    return role ? role.roleName : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'destructive';
      case 'teacher': return 'warning';
      case 'student': return 'info';
      default: return 'secondary';
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        // Show success message
    } catch (error) {
        console.error('Error deleting user:', error);
        // Show error message
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      roleId: user.roleId || 1,
      status: user.status || 'active',
      avatar: user.avatar || ''
    });
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      roleId: 1,
      status: 'active',
      avatar: ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingUser) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) {
          const { password, ...updateDataWithoutPassword } = updateData;
          await userApi.updateUser(editingUser.id, updateDataWithoutPassword);
        } else {
          await userApi.updateUser(editingUser.id, updateData);
        }
        await loadUsers(); // Reload users
        setShowCreateModal(false);
      } else {
        // Create user
        if (!formData.password) {
          alert('Password is required for new users');
          setFormLoading(false);
          return;
        }
        
        console.log('Creating user with data:', formData);
        console.log('Using userApi.createUser endpoint');
        const result = await userApi.createUser(formData);
        console.log('Create user result:', result);
        await loadUsers(); // Reload users
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      alert('Error saving user. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await userApi.updateUser(user.id, { status: newStatus });
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
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
                Quản Lý Người Dùng
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Quản lý người dùng, vai trò và quyền hạn của hệ thống
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Người Dùng
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Người Dùng</p>
                  <p className="text-3xl font-bold text-slate-900">{Array.isArray(users) ? users.length : 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
      <div>
                  <p className="text-sm font-medium text-slate-600">Người Dùng Hoạt Động</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {users.filter(u => u.status === 'active').length}
        </p>
      </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng Vai Trò</p>
                  <p className="text-3xl font-bold text-slate-900">{roles.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Người Dùng Mới Trong Tháng</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {users.filter(u => {
                      const userDate = new Date(u.createdAt);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return userDate > monthAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vai Trò</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất Cả Vai Trò</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.roleName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Trạng Thái</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất Cả Trạng Thái</option>
                  <option value="active">Hoạt Động</option>
                  <option value="inactive">Không Hoạt Động</option>
                  <option value="pending">Chờ Xác Nhận</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('all');
                    setSelectedStatus('all');
                  }}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                    Xóa Bộ Lọc
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{user.fullName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </span>
                          {user.phoneNumber && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phoneNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge variant={getRoleColor(getRoleName(user.roleId || 0))}>
                        {getRoleName(user.roleId || 0)}
                      </Badge>
                      <Badge variant={getStatusColor(user.status || 'active')}>
                        {user.status || 'active'}
                      </Badge>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(user)}
                          className="h-8 w-8 p-0 hover:bg-yellow-50"
                        >
                          <Eye className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <UserIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No users found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by creating your first user.'}
              </p>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-5 mr-2" />
                Create User
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
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">
                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    required={!editingUser}
                  />
                </div>
                
                <div>
                  <Label htmlFor="roleId">Role *</Label>
                  <Select
                    value={formData.roleId.toString()}
                    onValueChange={(value) => handleInputChange('roleId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(roles) && roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.roleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status *</Label>
                    <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as any)}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    placeholder="Enter avatar URL (optional)"
                  />
                </div>
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
                  {formLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </Button>
              </div>
            </form>
      </div>
        </div>
      )}
    </div>
  );
}
