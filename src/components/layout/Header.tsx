import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

import { 
  Menu, 
  LogOut, 
  User, 
  BookOpen,
  ChevronDown,
  Shield,
  Crown
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getRoleIcon = (role?: any) => {
    // Handle both string and object role types
    let roleStr = '';
    if (typeof role === 'string') {
      roleStr = role.toLowerCase();
    } else if (role && typeof role === 'object' && 'roleName' in role) {
      roleStr = String(role.roleName || '').toLowerCase();
    } else {
      roleStr = '';
    }
    
    switch (roleStr) {
      case 'admin':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const getRoleColor = (role?: any) => {
    // Handle both string and object role types
    let roleStr = '';
    if (typeof role === 'string') {
      roleStr = role.toLowerCase();
    } else if (role && typeof role === 'object' && 'roleName' in role) {
      roleStr = String(role.roleName || '').toLowerCase();
    } else {
      roleStr = '';
    }
    
    switch (roleStr) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 shadow-sm relative z-[9998]">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              English Learning System
            </h1>
            <p className="text-xs text-gray-500 -mt-1">System management</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        
        {/* Language Selector */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          <Globe className="h-5 w-5 text-gray-600" />
        </Button> */}

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="relative h-10 px-3 py-2 rounded-xl hover:bg-white/50 transition-all duration-200 border border-white/30"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-white/50"
                    src={user.avatar}
                    alt={user.fullName}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Người Dùng'}</p>
                <div className="flex items-center space-x-1">
                  {getRoleIcon(user?.role)}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(user?.role)}`}>
                    {(() => {
                      const roleStr = typeof user?.role === 'string' ? user.role : (user?.role as any)?.roleName || 'User';
                      return roleStr === 'admin' ? 'Quản Trị Viên' : roleStr === 'teacher' ? 'Giáo Viên' : roleStr === 'student' ? 'Học Sinh' : 'Người Dùng';
                    })()}
                  </span>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </Button>
          
          {/* Custom Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-50">
              {/* User Info Header */}
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover border-2 border-white/50"
                      src={user.avatar}
                      alt={user.fullName}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user?.fullName || 'Tên Người Dùng'}</p>
                  <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getRoleIcon(user?.role)}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRoleColor(user?.role)}`}>
                      {(() => {
                        const roleStr = typeof user?.role === 'string' ? user.role : (user?.role as any)?.roleName || 'User';
                        return roleStr === 'admin' ? 'Quản Trị Viên' : roleStr === 'teacher' ? 'Giáo Viên' : roleStr === 'student' ? 'Học Sinh' : 'Người Dùng';
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-2 border-t border-gray-200"></div>

              {/* Menu Items */}
              <div className="p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <User className="mr-3 h-4 w-4 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-900">Hồ sơ cá nhân</span>
                    <p className="text-xs text-gray-500">Xem và chỉnh sửa hồ sơ cá nhân</p>
                  </div>
                </div>
              </div>

              {/* <div className="p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <Settings className="mr-3 h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Settings</span>
                    <p className="text-xs text-gray-500">Manage your preferences</p>
                  </div>
                </div>
              </div> */}

              <div className="my-2 border-t border-gray-200"></div>

              <div 
                onClick={handleLogout}
                className="p-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-4 w-4 text-red-600" />
                  <div>
                    <span className="font-medium text-gray-900">Đăng xuất</span>
                    <p className="text-xs text-gray-500">Đăng xuất khỏi tài khoản</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
