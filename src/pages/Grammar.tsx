import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Clock,
  Target,
  Users,
  BarChart3,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Award,
  Zap,
  BookOpenCheck,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Grammar {
  id: number;
  title: string;
  description: string;
  category: 'Tenses' | 'Parts of Speech' | 'Sentence Structure' | 'Punctuation' | 'Advanced Grammar';
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  content: string;
  examples: string[];
  rules: string[];
  exceptions: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  masteryLevel: number;
  practiceCount: number;
  successRate: number;
  tags: string[];
}

export const Grammar: React.FC = () => {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMastery, setSelectedMastery] = useState('all');

  useEffect(() => {
    const fetchGrammars = async () => {
      try {
        setIsLoading(true);
        // Mock data for now
        const mockGrammars: Grammar[] = [
          {
            id: 1,
            title: 'Present Perfect Tense',
            description: 'Learn how to use the present perfect tense to express actions that happened at an unspecified time in the past.',
            category: 'Tenses',
            difficultyLevel: 'Intermediate',
            content: 'The present perfect tense is used to express actions that have been completed at some point in the past, but the exact time is not specified.',
            examples: [
              'I have visited Paris three times.',
              'She has never been to Asia.',
              'They have already finished their homework.'
            ],
            rules: [
              'Use have/has + past participle',
              'Express indefinite past time',
              'Show connection to present'
            ],
            exceptions: [
              'Some verbs have irregular past participles',
              'Time expressions can limit usage'
            ],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-08-24T08:30:00Z',
            isActive: true,
            masteryLevel: 85,
            practiceCount: 234,
            successRate: 78.5,
            tags: ['Present Perfect', 'Tenses', 'Intermediate', 'Past Actions']
          },
          {
            id: 2,
            title: 'Conditional Sentences (Type 2)',
            description: 'Master the second conditional to express hypothetical or unlikely situations in the present or future.',
            category: 'Sentence Structure',
            difficultyLevel: 'Advanced',
            content: 'Second conditional sentences express hypothetical or unlikely situations in the present or future using if + past simple, would + base form.',
            examples: [
              'If I had a million dollars, I would travel the world.',
              'If she studied harder, she would pass the exam.',
              'If it rained tomorrow, we would stay at home.'
            ],
            rules: [
              'If clause: past simple tense',
              'Main clause: would + base form',
              'Express hypothetical situations'
            ],
            exceptions: [
              'Could and might can replace would',
              'Were is used for all persons in formal English'
            ],
            createdAt: '2024-02-20T14:30:00Z',
            updatedAt: '2024-08-23T16:45:00Z',
            isActive: true,
            masteryLevel: 72,
            practiceCount: 156,
            successRate: 68.9,
            tags: ['Conditionals', 'Hypothetical', 'Advanced', 'If Clauses']
          },
          {
            id: 3,
            title: 'Relative Clauses',
            description: 'Learn to use relative clauses to provide additional information about nouns in a sentence.',
            category: 'Sentence Structure',
            difficultyLevel: 'Intermediate',
            content: 'Relative clauses are dependent clauses that modify nouns and provide additional information about them.',
            examples: [
              'The book that I bought yesterday is very interesting.',
              'The woman who lives next door is a doctor.',
              'The city where I was born is beautiful.'
            ],
            rules: [
              'Use relative pronouns: who, which, that, where, when',
              'Essential vs. non-essential clauses',
              'Punctuation rules for non-essential clauses'
            ],
            exceptions: [
              'That cannot be used in non-essential clauses',
              'Whom is used for objects in formal English'
            ],
            createdAt: '2024-03-10T09:15:00Z',
            updatedAt: '2024-08-22T11:20:00Z',
            isActive: true,
            masteryLevel: 91,
            practiceCount: 189,
            successRate: 85.2,
            tags: ['Relative Clauses', 'Sentence Structure', 'Intermediate', 'Modifiers']
          },
          {
            id: 4,
            title: 'Gerunds and Infinitives',
            description: 'Understand when to use gerunds (-ing form) and infinitives (to + base form) in different contexts.',
            category: 'Parts of Speech',
            difficultyLevel: 'Advanced',
            content: 'Gerunds and infinitives are verb forms that function as nouns in sentences, but they are used in different contexts.',
            examples: [
              'I enjoy reading books. (gerund)',
              'I want to read that book. (infinitive)',
              'Reading is my hobby. (gerund as subject)'
            ],
            rules: [
              'Some verbs take only gerunds',
              'Some verbs take only infinitives',
              'Some verbs can take both with different meanings'
            ],
            exceptions: [
              'Stop + gerund vs. stop + infinitive',
              'Remember + gerund vs. remember + infinitive'
            ],
            createdAt: '2024-04-05T16:45:00Z',
            updatedAt: '2024-08-15T13:10:00Z',
            isActive: true,
            masteryLevel: 63,
            practiceCount: 98,
            successRate: 71.4,
            tags: ['Gerunds', 'Infinitives', 'Verb Forms', 'Advanced']
          },
          {
            id: 5,
            title: 'Passive Voice',
            description: 'Learn to form and use passive voice sentences to emphasize the action rather than the doer.',
            category: 'Sentence Structure',
            difficultyLevel: 'Intermediate',
            content: 'Passive voice is used when the focus is on the action or the object that receives the action, rather than the person or thing performing the action.',
            examples: [
              'The letter was written by John. (passive)',
              'John wrote the letter. (active)',
              'The house is being built by workers.'
            ],
            rules: [
              'Use be + past participle',
              'Object becomes subject',
              'Agent can be omitted if unknown or obvious'
            ],
            exceptions: [
              'Some verbs cannot be used in passive voice',
              'Get passive is more informal than be passive'
            ],
            createdAt: '2024-05-12T11:30:00Z',
            updatedAt: '2024-08-24T07:15:00Z',
            isActive: true,
            masteryLevel: 88,
            practiceCount: 167,
            successRate: 82.1,
            tags: ['Passive Voice', 'Sentence Structure', 'Intermediate', 'Formality']
          },
          {
            id: 6,
            title: 'Subjunctive Mood',
            description: 'Master the subjunctive mood to express wishes, suggestions, and hypothetical situations.',
            category: 'Advanced Grammar',
            difficultyLevel: 'Expert',
            content: 'The subjunctive mood is used to express wishes, suggestions, demands, and hypothetical situations that are contrary to fact.',
            examples: [
              'I wish I were rich. (subjunctive)',
              'If I were you, I would study harder.',
              'It is important that he be on time.'
            ],
            rules: [
              'Use were for all persons in hypothetical situations',
              'Use base form after certain expressions',
              'Common in formal and academic English'
            ],
            exceptions: [
              'Modern English often uses indicative mood',
              'Subjunctive is more common in American English'
            ],
            createdAt: '2024-06-18T13:20:00Z',
            updatedAt: '2024-08-21T15:30:00Z',
            isActive: false,
            masteryLevel: 45,
            practiceCount: 34,
            successRate: 58.7,
            tags: ['Subjunctive', 'Advanced Grammar', 'Expert', 'Formal English']
          }
        ];
        setGrammars(mockGrammars);
      } catch (err) {
        console.error('Error fetching grammars:', err);
        setError('Failed to load grammar rules');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrammars();
  }, []);

  const filteredGrammars = grammars.filter(grammar => {
    const matchesSearch = grammar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grammar.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || grammar.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || grammar.difficultyLevel === selectedDifficulty;
    const matchesMastery = selectedMastery === 'all' || 
      (selectedMastery === 'mastered' && grammar.masteryLevel >= 90) ||
      (selectedMastery === 'learning' && grammar.masteryLevel >= 50 && grammar.masteryLevel < 90) ||
      (selectedMastery === 'beginner' && grammar.masteryLevel < 50);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesMastery;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tenses': return 'bg-red-100 text-red-800';
      case 'Parts of Speech': return 'bg-blue-100 text-blue-800';
      case 'Sentence Structure': return 'bg-green-100 text-green-800';
      case 'Punctuation': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced Grammar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 90) return 'bg-green-500';
    if (mastery >= 70) return 'bg-blue-500';
    if (mastery >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMasteryText = (mastery: number) => {
    if (mastery >= 90) return 'Mastered';
    if (mastery >= 70) return 'Advanced';
    if (mastery >= 50) return 'Learning';
    return 'Beginner';
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-56 bg-white/60 backdrop-blur-sm rounded-xl"></div>
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
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Grammar</h3>
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
                Grammar Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Master English grammar with comprehensive rules and examples
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                <span>Add Rule</span>
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
              placeholder="Search grammar rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="Tenses">Tenses</option>
              <option value="Parts of Speech">Parts of Speech</option>
              <option value="Sentence Structure">Sentence Structure</option>
              <option value="Punctuation">Punctuation</option>
              <option value="Advanced Grammar">Advanced Grammar</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Mastery Filter */}
          <div className="relative">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedMastery}
              onChange={(e) => setSelectedMastery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Mastery</option>
              <option value="mastered">Mastered (90%+)</option>
              <option value="learning">Learning (50-89%)</option>
              <option value="beginner">Beginner (0-49%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grammar Grid */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grammar Rules ({filteredGrammars.length})</h3>
            <p className="text-gray-500 text-sm">Showing {filteredGrammars.length} of {grammars.length} rules</p>
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

        {filteredGrammars.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grammar rules found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrammars.map((grammar) => (
              <div key={grammar.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
                {/* Grammar Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{grammar.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{grammar.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-1 rounded-lg transition-colors ${
                      grammar.isActive 
                        ? 'text-green-500 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}>
                      <Zap className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {grammar.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {grammar.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{grammar.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Grammar Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(grammar.category)}`}>
                      {grammar.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(grammar.difficultyLevel)}`}>
                      {grammar.difficultyLevel}
                    </span>
                  </div>
                </div>

                {/* Examples Preview */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Examples:</p>
                  <div className="space-y-1">
                    {grammar.examples.slice(0, 2).map((example, index) => (
                      <p key={index} className="text-xs text-gray-600 italic">"{example}"</p>
                    ))}
                  </div>
                </div>

                {/* Mastery Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{getMasteryText(grammar.masteryLevel)}</span>
                    <span>{grammar.masteryLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getMasteryColor(grammar.masteryLevel)}`}
                      style={{ width: `${grammar.masteryLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Practice</p>
                    <p className="text-sm font-semibold text-gray-900">{grammar.practiceCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <p className="text-sm font-semibold text-gray-900">{grammar.successRate}%</p>
                  </div>
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
                    <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {grammar.id}
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
