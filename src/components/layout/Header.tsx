import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  Search,
  BookOpen,
  Zap,
  ChevronDown,
  Globe,
  Shield,
  Crown
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 shadow-sm">
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
              English Learning
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Management System</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
            <Zap className="h-3 w-3 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">v2.0.0</span>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all modules..."
            className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-600" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        {/* Language Selector */}
        <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          <Globe className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
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
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(user?.role)}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(user?.role)}`}>
                      {typeof user?.role === 'string' ? user.role : (user?.role as any)?.roleName || 'User'}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-72 p-2 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl">
            {/* User Info Header */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-white/50"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user?.name || 'User Name'}</p>
                <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getRoleIcon(user?.role)}
                  <span className={`text-xs px-2 py-1 rounded-full border ${getRoleColor(user?.role)}`}>
                    {typeof user?.role === 'string' ? user.role : (user?.role as any)?.roleName || 'User'}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="my-2" />

            {/* Menu Items */}
            <DropdownMenuItem className="p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
              <User className="mr-3 h-4 w-4 text-blue-600" />
              <div>
                <span className="font-medium text-gray-900">Profile</span>
                <p className="text-xs text-gray-500">View and edit your profile</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">Settings</span>
                <p className="text-xs text-gray-500">Manage your preferences</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem 
              onClick={handleLogout}
              className="p-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="mr-3 h-4 w-4 text-red-600" />
              <div>
                <span className="font-medium text-gray-900">Sign Out</span>
                <p className="text-xs text-gray-500">Logout from your account</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
