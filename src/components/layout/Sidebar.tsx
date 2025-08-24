import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  GraduationCap,
  BarChart3,
  Star,
  Lightbulb,
  Database,
  UserCheck,
  BookOpenCheck,
  MessageCircle,
  Route,
  GitBranch,
  Bot,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Zap
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
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    badge: 'Overview'
  },
  
  // User Management
  {
    name: 'User Management',
    icon: Users,
    children: [
      { name: 'Users', href: '/users', icon: Users, badge: 'Manage' },
      { name: 'Roles', href: '/roles', icon: Shield, badge: 'Permissions' },
      { name: 'User Progress', href: '/user-progress', icon: TrendingUp, badge: 'Analytics' },
    ]
  },

  // Vocabulary Management
  {
    name: 'Vocabulary',
    icon: Book,
    children: [
      { name: 'Vocabulary Words', href: '/vocabulary', icon: Book, badge: 'Words' },
      { name: 'Vocabulary Topics', href: '/vocabulary-topics', icon: FolderOpen, badge: 'Categories' },
      { name: 'Vocabulary Examples', href: '/vocabulary-examples', icon: BookOpenCheck, badge: 'Usage' },
    ]
  },

  // Exam Management
  {
    name: 'Exam System',
    icon: FileText,
    children: [
      { name: 'Exams', href: '/exams', icon: FileText, badge: 'Tests' },
      { name: 'Questions', href: '/questions', icon: HelpCircle, badge: 'Items' },
      { name: 'Exam Attempts', href: '/exam-attempts', icon: Target, badge: 'Results' },
    ]
  },

  // Grammar Management
  {
    name: 'Grammar',
    icon: BookOpen,
    children: [
      { name: 'Grammar Rules', href: '/grammar', icon: BookOpen, badge: 'Rules' },
      { name: 'Grammar Examples', href: '/grammar-examples', icon: Lightbulb, badge: 'Examples' },
    ]
  },

  // Blog Management
  {
    name: 'Content Management',
    icon: MessageSquare,
    children: [
      { name: 'Blog Posts', href: '/blog-posts', icon: FileText, badge: 'Articles' },
      { name: 'Blog Categories', href: '/blog-categories', icon: FolderOpen, badge: 'Topics' },
      { name: 'Blog Comments', href: '/blog-comments', icon: MessageCircle, badge: 'Feedback' },
    ]
  },

  // Learning Paths
  {
    name: 'Learning Paths',
    icon: Route,
    children: [
      { name: 'Learning Paths', href: '/learning-paths', icon: Route, badge: 'Paths' },
      { name: 'Path Steps', href: '/path-steps', icon: GitBranch, badge: 'Steps' },
    ]
  },

  // AI & Analytics
  {
    name: 'AI & Analytics',
    icon: Brain,
    children: [
      { name: 'AI Explanations', href: '/ai-explanations', icon: Bot, badge: 'AI' },
      { name: 'Dashboard Stats', href: '/dashboard-stats', icon: BarChart3, badge: 'Analytics' },
    ]
  },

  // System Tools
  {
    name: 'System Tools',
    icon: Settings,
    children: [
      { name: 'Import Demo', href: '/import-demo', icon: Upload, badge: 'Demo' },
      { name: 'Settings', href: '/settings', icon: Settings, badge: 'Config' },
    ]
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['User Management', 'Vocabulary', 'Exam System']);

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
      return item.children.some(child => location.pathname === child.href);
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
              <p className="text-xs text-slate-400">Management System</p>
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
            {navigation.map((item) => {
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
                          {item.children.map((child) => (
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
