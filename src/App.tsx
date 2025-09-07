import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { ToastProvider } from '@/components/ui/toast';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Layout } from '@/components/layout/Layout';
import Login from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import  Users  from '@/pages/Users';
import  Roles  from '@/pages/Roles';
import  Vocabulary  from '@/pages/Vocabulary';
import VocabularyTopics from './pages/VocabularyTopics';
import  Exams  from '@/pages/Exams';
import Questions from '@/pages/Questions';
import AnswerOptions from '@/pages/AnswerOptions';
import ExamAttempts from '@/pages/ExamAttempts';
import  Grammar from '@/pages/Grammar';
import { BlogPosts } from '@/pages/BlogPosts';
import { BlogCategories } from '@/pages/BlogCategories';
import { BlogComments } from '@/pages/BlogComments';
import { LearningPaths } from '@/pages/LearningPaths';
import { AIExplanations } from '@/pages/AIExplanations';
import  UserProgress  from '@/pages/UserProgress';
import { Settings } from '@/pages/Settings';
import { Unauthorized } from '@/pages/Unauthorized';
import { ImportDemo } from '@/pages/ImportDemo';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/*"
              element={
                <AuthWrapper>
                  <Layout />
                </AuthWrapper>
              }
            >
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />

              {/* User Management */}
              <Route path="users" element={<Users />} />
              <Route path="roles" element={<Roles />} />

              {/* Vocabulary Management */}
              <Route path="vocabulary" element={<Vocabulary />} />
              <Route path="vocabulary-topics" element={<VocabularyTopics />} />

              {/* Exam Management */}
              <Route path="exams" element={<Exams />} />
              <Route path="questions" element={<Questions />} />
              <Route path="answer-options" element={<AnswerOptions />} />
              <Route path="exam-attempts" element={<ExamAttempts />} />

              {/* Grammar Management */}
              <Route path="grammar" element={<Grammar />} />

              {/* Blog Management */}
              <Route path="blog-posts" element={<BlogPosts />} />
              <Route path="blog-categories" element={<BlogCategories />} />
              <Route path="blog-comments" element={<BlogComments />} />

              {/* Learning Path Management */}
              <Route path="learning-paths" element={<LearningPaths />} />

              {/* AI & Analytics */}
              <Route path="ai-explanations" element={<AIExplanations />} />
              <Route path="user-progress" element={<UserProgress />} />

              {/* Settings */}
              <Route path="settings" element={<Settings />} />

              {/* Import Demo */}
              <Route path="import-demo" element={<ImportDemo />} />
            </Route>
          </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
