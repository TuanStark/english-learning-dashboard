import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  UserPlus,
  Settings,
  Clock
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Mock data for now
        const mockUsers: User[] = [
          {
            id: 1,
            email: 'admin@englishlearning.com',
            fullName: 'Admin User',
            roleId: 1,
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            lastLogin: '2024-08-24T08:30:00Z',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 2,
            email: 'john.doe@example.com',
            fullName: 'John Doe',
            roleId: 2,
            isActive: true,
            createdAt: '2024-02-20T14:30:00Z',
            lastLogin: '2024-08-23T16:45:00Z',
            status: 'active',
            phone: '+84 123 456 789',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 3,
            email: 'jane.smith@example.com',
            fullName: 'Jane Smith',
            roleId: 2,
            isActive: true,
            createdAt: '2024-03-10T09:15:00Z',
            lastLogin: '2024-08-22T11:20:00Z',
            status: 'active',
            phone: '+84 987 654 321',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 4,
            email: 'mike.wilson@example.com',
            fullName: 'Mike Wilson',
            roleId: 2,
            isActive: false,
            createdAt: '2024-04-05T16:45:00Z',
            lastLogin: '2024-08-15T13:10:00Z',
            status: 'inactive',
            phone: '+84 555 123 456',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 5,
            email: 'sarah.johnson@example.com',
            fullName: 'Sarah Johnson',
            roleId: 2,
            isActive: true,
            createdAt: '2024-05-12T11:30:00Z',
            lastLogin: '2024-08-24T07:15:00Z',
            status: 'active',
            phone: '+84 777 888 999',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: 6,
            email: 'david.brown@example.com',
            fullName: 'David Brown',
            roleId: 2,
            isActive: true,
            createdAt: '2024-06-18T13:20:00Z',
            lastLogin: '2024-08-21T15:30:00Z',
            status: 'pending',
            phone: '+84 333 444 555',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }
        ];
        setUsers(mockUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.roleId.toString() === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'created':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'lastLogin':
        aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
        bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
        break;
      default:
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'User';
      case 3: return 'Moderator';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
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
                <div key={i} className="h-20 bg-white/60 backdrop-blur-sm rounded-xl"></div>
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
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Users</h3>
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
                User Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Manage your platform users, roles, and permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="1">Admin</option>
              <option value="2">User</option>
              <option value="3">Moderator</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="lastLogin-desc">Last Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Users ({sortedUsers.length})</h3>
            <p className="text-gray-500 text-sm">Showing {sortedUsers.length} of {users.length} users</p>
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

        {sortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUsers.map((user) => (
              <div key={user.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{user.fullName}</h4>
                      <p className="text-xs text-gray-500">{getRoleName(user.roleId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(user.status)}
                    <button className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {user.id}
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
