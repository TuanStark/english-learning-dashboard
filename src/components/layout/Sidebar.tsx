import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  HelpCircle,
  Settings,
  X,
  Book,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Upload,
  Shield,
  Target,
  MessageSquare,
  Brain,
  BarChart3,
  Lightbulb,
  BookOpenCheck,
  MessageCircle,
  Route,
  GitBranch,
  Bot,
  TrendingUp,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
  badge?: string;
  roles?: string[]; // Roles that can access this menu item
}

// Single navigation with role-based access control
const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    badge: 'Overview',
    roles: ['admin', 'teacher', 'student'] // All roles can access dashboard
  },
  
  // User Management - Admin only
  {
    name: 'User Management',
    icon: Users,
    roles: ['admin'],
    children: [
      { name: 'Users', href: '/users', icon: Users, badge: 'Manage', roles: ['admin'] },
      { name: 'Roles', href: '/roles', icon: Shield, badge: 'Permissions', roles: ['admin'] },
      { name: 'User Progress', href: '/user-progress', icon: TrendingUp, badge: 'Analytics', roles: ['admin'] },
    ]
  },

  // Student Management - Admin & Teacher
  // {
  //   name: 'Student Management',
  //   icon: Users,
  //   roles: ['admin', 'teacher'],
  //   children: [
  //     { name: 'All Students', href: '/users', icon: Users, badge: 'Manage', roles: ['admin'] },
  //     { name: 'My Students', href: '/my-students', icon: Users, badge: 'Students', roles: ['teacher'] },
  //     { name: 'Student Progress', href: '/student-progress', icon: TrendingUp, badge: 'Analytics', roles: ['admin', 'teacher'] },
  //   ]
  // },

  // Vocabulary - Admin & Teacher can manage, Student can learn
  {
    name: 'Vocabulary',
    icon: Book,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Vocabulary Words', href: '/vocabulary', icon: Book, badge: 'Words', roles: ['admin', 'teacher', 'student'] },
      { name: 'Vocabulary Topics', href: '/vocabulary-topics', icon: FolderOpen, badge: 'Categories', roles: ['admin', 'teacher'] },
      // { name: 'Vocabulary Examples', href: '/vocabulary-examples', icon: BookOpenCheck, badge: 'Usage', roles: ['admin', 'teacher'] },
    ]
  },

  // Exam System - Admin & Teacher can manage, Student can take
  {
    name: 'Exam System',
    icon: FileText,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Exams', href: '/exams', icon: FileText, badge: 'Tests', roles: ['admin', 'teacher', 'student'] },
      { name: 'Questions', href: '/questions', icon: HelpCircle, badge: 'Items', roles: ['admin', 'teacher'] },
      { name: 'Answer Options', href: '/answer-options', icon: CheckSquare, badge: 'Answers', roles: ['admin', 'teacher'] },
      { name: 'Exam Attempts', href: '/exam-attempts', icon: Target, badge: 'Results', roles: ['admin', 'teacher', 'student'] },
    ]
  },

  // Grammar - Admin & Teacher can manage, Student can learn
  {
    name: 'Grammar',
    icon: BookOpen,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Grammar Rules', href: '/grammar', icon: BookOpen, badge: 'Rules', roles: ['admin', 'teacher', 'student'] },
      // { name: 'Grammar Examples', href: '/grammar-examples', icon: Lightbulb, badge: 'Examples', roles: ['admin', 'teacher'] },
    ]
  },

  // Content Management - Admin & Teacher
  {
    name: 'Blog Management',
    icon: MessageSquare,
    roles: ['admin', 'teacher'],
    children: [
      { name: 'Blog Posts', href: '/blog-posts', icon: FileText, badge: 'Articles', roles: ['admin', 'teacher', 'student'] },
      { name: 'Blog Categories', href: '/blog-categories', icon: FolderOpen, badge: 'Topics', roles: ['admin', 'teacher'] },
      { name: 'Blog Comments', href: '/blog-comments', icon: MessageCircle, badge: 'Feedback', roles: ['admin', 'teacher'] },
    ]
  },

  // Learning Paths - All roles but different access levels
  {
    name: 'Learning Paths',
    icon: Route,
    roles: ['admin', 'teacher', 'student'],
    children: [
      { name: 'Learning Paths', href: '/learning-paths', icon: Route, badge: 'Paths', roles: ['admin', 'teacher', 'student'] },
      { name: 'Path Steps', href: '/path-steps', icon: GitBranch, badge: 'Steps', roles: ['admin', 'teacher'] },
      { name: 'Create Path', href: '/create-path', icon: GitBranch, badge: 'New', roles: ['admin', 'teacher'] },
    ]
  },

  // AI & Analytics - Admin & Teacher
  {
    name: 'AI & Analytics',
    icon: Brain,
    roles: ['admin', 'teacher'],
    children: [
      { name: 'AI Explanations', href: '/ai-explanations', icon: Bot, badge: 'AI', roles: ['admin', 'teacher', 'student'] },
      { name: 'Dashboard Stats', href: '/dashboard-stats', icon: BarChart3, badge: 'Analytics', roles: ['admin', 'teacher'] },
    ]
  },

  // System Tools - Admin only
  {
    name: 'System Tools',
    icon: Settings,
    roles: ['admin'],
    children: [
      { name: 'Import Demo', href: '/import-demo', icon: Upload, badge: 'Demo', roles: ['admin'] },
      { name: 'Settings', href: '/settings', icon: Settings, badge: 'Config', roles: ['admin'] },
    ]
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get user role
  const getUserRole = () => {
    if (!user?.role) return 'admin'; // Default to admin if no role
    const roleStr = typeof user.role === 'string' ? user.role : (user.role as any)?.roleName || '';
    return roleStr.toLowerCase();
  };

  const userRole = getUserRole();
  
  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true; // If no roles specified, show to all
    return item.roles.includes(userRole);
  }).map(item => ({
    ...item,
    children: item.children ? item.children.filter(child => {
      if (!child.roles) return true;
      return child.roles.includes(userRole);
    }) : undefined
  })).filter(item => {
    // Hide parent items that have no visible children
    if (item.children && item.children.length === 0) return false;
    return true;
  });
  
  // Set default expanded items based on role
  const getDefaultExpanded = () => {
    switch (userRole) {
      case 'admin':
        return ['User Management', 'Vocabulary', 'Exam System'];
      case 'teacher':
        return ['Student Management', 'Vocabulary', 'Exam System'];
      case 'student':
        return ['Vocabulary', 'Exam System', 'Learning Paths'];
      default:
        return ['Vocabulary', 'Exam System'];
    }
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(getDefaultExpanded());

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child: NavigationItem) => location.pathname === child.href);
    }
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">English Learning</span>
              <p className="text-xs text-slate-400">
                {(() => {
                  const roleStr = typeof user?.role === 'string' ? user?.role : (user?.role as any)?.roleName || 'Admin';
                  return `${roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase()} Dashboard`;
                })()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 pb-6">
          <ul className="space-y-1">
            {filteredNavigation.map((item: NavigationItem) => {
              const isActive = isItemActive(item);
              return (
                <li key={item.name}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <item.icon className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      )} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-700 text-slate-300'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full group',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        )}
                      >
                        <item.icon className={cn(
                          'h-5 w-5 transition-transform duration-200',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        )} />
                        <span className="flex-1 text-left">{item.name}</span>
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown className="ml-auto h-4 w-4 text-slate-400 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4 text-slate-400 transition-transform duration-200" />
                        )}
                      </button>
                      {expandedItems.includes(item.name) && item.children && (
                        <ul className="ml-6 mt-2 space-y-1">
                          {item.children.map((child: NavigationItem) => (
                            <li key={child.name}>
                              <Link
                                to={child.href!}
                                className={cn(
                                  'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                                  location.pathname === child.href
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border border-blue-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                                )}
                                onClick={() => {
                                  if (window.innerWidth < 1024) {
                                    onToggle();
                                  }
                                }}
                              >
                                <child.icon className={cn(
                                  'h-4 w-4 transition-transform duration-200',
                                  location.pathname === child.href 
                                    ? 'text-blue-300' 
                                    : 'text-slate-500 group-hover:text-slate-300'
                                )} />
                                <span className="flex-1">{child.name}</span>
                                {child.badge && (
                                  <span className={cn(
                                    'px-2 py-0.5 text-xs font-medium rounded-full',
                                    location.pathname === child.href
                                      ? 'bg-blue-500/30 text-blue-200'
                                      : 'bg-slate-600 text-slate-400'
                                  )}>
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
      </div>
    </>
  );
}
