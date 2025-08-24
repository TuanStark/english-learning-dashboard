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
  Volume2, 
  Star,
  Clock,
  Target,
  TrendingUp,
  Bookmark,
  Download,
  Upload,
  RefreshCw,
  BookOpenCheck,
  Settings,
  Globe,
  Lightbulb,
  Zap,
  Award
} from 'lucide-react';

interface Vocabulary {
  id: number;
  englishWord: string;
  vietnameseMeaning: string;
  phonetic: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  topicId: number;
  topicName: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  createdAt: string;
  updatedAt: string;
  masteryLevel: number;
  isBookmarked: boolean;
  audioUrl?: string;
}

export const Vocabulary: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMastery, setSelectedMastery] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        setIsLoading(true);
        // Mock data for now
        const mockVocabularies: Vocabulary[] = [
          {
            id: 1,
            englishWord: 'Serendipity',
            vietnameseMeaning: 'Sự tình cờ may mắn',
            phonetic: '/ˌserənˈdɪpəti/',
            difficultyLevel: 'Advanced',
            topicId: 1,
            topicName: 'Advanced Vocabulary',
            examples: [
              'Finding this book was pure serendipity.',
              'Their meeting was a serendipitous event.'
            ],
            synonyms: ['chance', 'fortune', 'luck'],
            antonyms: ['misfortune', 'bad luck'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-08-24T08:30:00Z',
            masteryLevel: 85,
            isBookmarked: true,
            audioUrl: 'https://example.com/audio/serendipity.mp3'
          },
          {
            id: 2,
            englishWord: 'Perseverance',
            vietnameseMeaning: 'Sự kiên trì, bền bỉ',
            phonetic: '/ˌpɜːrsɪˈvɪərəns/',
            difficultyLevel: 'Intermediate',
            topicId: 2,
            topicName: 'Character Traits',
            examples: [
              'His perseverance in learning English paid off.',
              'Success comes through perseverance.'
            ],
            synonyms: ['persistence', 'determination', 'tenacity'],
            antonyms: ['laziness', 'giving up'],
            createdAt: '2024-02-20T14:30:00Z',
            updatedAt: '2024-08-23T16:45:00Z',
            masteryLevel: 92,
            isBookmarked: false
          },
          {
            id: 3,
            englishWord: 'Eloquent',
            vietnameseMeaning: 'Hùng hồn, có tài ăn nói',
            phonetic: '/ˈeləkwənt/',
            difficultyLevel: 'Advanced',
            topicId: 1,
            topicName: 'Advanced Vocabulary',
            examples: [
              'She gave an eloquent speech.',
              'His writing is always eloquent.'
            ],
            synonyms: ['articulate', 'fluent', 'persuasive'],
            antonyms: ['inarticulate', 'mumbling'],
            createdAt: '2024-03-10T09:15:00Z',
            updatedAt: '2024-08-22T11:20:00Z',
            masteryLevel: 78,
            isBookmarked: true
          },
          {
            id: 4,
            englishWord: 'Resilient',
            vietnameseMeaning: 'Kiên cường, dẻo dai',
            phonetic: '/rɪˈzɪliənt/',
            difficultyLevel: 'Intermediate',
            topicId: 2,
            topicName: 'Character Traits',
            examples: [
              'She is remarkably resilient in the face of adversity.',
              'The company showed resilient growth.'
            ],
            synonyms: ['tough', 'flexible', 'adaptable'],
            antonyms: ['fragile', 'weak'],
            createdAt: '2024-04-05T16:45:00Z',
            updatedAt: '2024-08-15T13:10:00Z',
            masteryLevel: 65,
            isBookmarked: false
          },
          {
            id: 5,
            englishWord: 'Ubiquitous',
            vietnameseMeaning: 'Phổ biến, có mặt khắp nơi',
            phonetic: '/juːˈbɪkwɪtəs/',
            difficultyLevel: 'Expert',
            topicId: 1,
            topicName: 'Advanced Vocabulary',
            examples: [
              'Smartphones are ubiquitous in modern society.',
              'The ubiquitous presence of social media.'
            ],
            synonyms: ['omnipresent', 'widespread', 'pervasive'],
            antonyms: ['rare', 'scarce'],
            createdAt: '2024-05-12T11:30:00Z',
            updatedAt: '2024-08-24T07:15:00Z',
            masteryLevel: 45,
            isBookmarked: true
          },
          {
            id: 6,
            englishWord: 'Empathy',
            vietnameseMeaning: 'Sự đồng cảm, thấu hiểu',
            phonetic: '/ˈempəθi/',
            difficultyLevel: 'Intermediate',
            topicId: 3,
            topicName: 'Emotional Intelligence',
            examples: [
              'She showed great empathy towards the patient.',
              'Empathy is essential in leadership.'
            ],
            synonyms: ['compassion', 'understanding', 'sympathy'],
            antonyms: ['apathy', 'indifference'],
            createdAt: '2024-06-18T13:20:00Z',
            updatedAt: '2024-08-21T15:30:00Z',
            masteryLevel: 88,
            isBookmarked: false
          }
        ];
        setVocabularies(mockVocabularies);
      } catch (err) {
        console.error('Error fetching vocabularies:', err);
        setError('Failed to load vocabularies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabularies();
  }, []);

  const filteredVocabularies = vocabularies.filter(vocab => {
    const matchesSearch = vocab.englishWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vocab.vietnameseMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || vocab.topicId.toString() === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'all' || vocab.difficultyLevel === selectedDifficulty;
    const matchesMastery = selectedMastery === 'all' || 
      (selectedMastery === 'mastered' && vocab.masteryLevel >= 90) ||
      (selectedMastery === 'learning' && vocab.masteryLevel >= 50 && vocab.masteryLevel < 90) ||
      (selectedMastery === 'beginner' && vocab.masteryLevel < 50);
    
    return matchesSearch && matchesTopic && matchesDifficulty && matchesMastery;
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
                <div key={i} className="h-48 bg-white/60 backdrop-blur-sm rounded-xl"></div>
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
            <BookOpen className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Vocabulary</h3>
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
                Vocabulary Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Build and manage your English vocabulary collection
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                <span>Add Word</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Topic Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Topics</option>
              <option value="1">Advanced Vocabulary</option>
              <option value="2">Character Traits</option>
              <option value="3">Emotional Intelligence</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
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
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Mastery</option>
              <option value="mastered">Mastered (90%+)</option>
              <option value="learning">Learning (50-89%)</option>
              <option value="beginner">Beginner (0-49%)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid/List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Vocabulary Words ({filteredVocabularies.length})</h3>
            <p className="text-gray-500 text-sm">Showing {filteredVocabularies.length} of {vocabularies.length} words</p>
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

        {filteredVocabularies.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vocabulary words found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocabularies.map((vocab) => (
              <div key={vocab.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-lg">
                {/* Word Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{vocab.englishWord}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vocab.vietnameseMeaning}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500 font-mono">{vocab.phonetic}</span>
                      {vocab.audioUrl && (
                        <button className="p-1 hover:bg-green-100 rounded-lg transition-colors text-green-600">
                          <Volume2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-1 rounded-lg transition-colors ${
                      vocab.isBookmarked 
                        ? 'text-yellow-500 hover:bg-yellow-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}>
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Difficulty and Topic */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(vocab.difficultyLevel)}`}>
                    {vocab.difficultyLevel}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {vocab.topicName}
                  </span>
                </div>

                {/* Mastery Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{getMasteryText(vocab.masteryLevel)}</span>
                    <span>{vocab.masteryLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getMasteryColor(vocab.masteryLevel)}`}
                      style={{ width: `${vocab.masteryLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Examples:</p>
                  <div className="space-y-1">
                    {vocab.examples.slice(0, 2).map((example, index) => (
                      <p key={index} className="text-xs text-gray-600 italic">"{example}"</p>
                    ))}
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
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {vocab.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVocabularies.map((vocab) => (
              <div key={vocab.id} className="group bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/70 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">{vocab.englishWord}</h4>
                      <span className="text-sm text-gray-600">{vocab.vietnameseMeaning}</span>
                      <span className="text-xs text-gray-500 font-mono">{vocab.phonetic}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(vocab.difficultyLevel)}`}>
                        {vocab.difficultyLevel}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vocab.topicName}
                      </span>
                      <span className="text-xs text-gray-500">Mastery: {vocab.masteryLevel}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      vocab.isBookmarked 
                        ? 'text-yellow-500 hover:bg-yellow-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}>
                      <Bookmark className="h-4 w-4" />
                    </button>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
