import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import type { ExamAttempt, User, Exam } from '@/types/backend';

interface ExamAttemptsTabProps {
  examAttempts: ExamAttempt[];
  users: User[];
  exams: Exam[];
}

export default function ExamAttemptsTab({ examAttempts, users, exams }: ExamAttemptsTabProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Exam Attempts Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {examAttempts.filter(a => a.status === 'Completed').length}
              </div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {examAttempts.filter(a => a.status === 'InProgress').length}
              </div>
              <div className="text-sm text-slate-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {examAttempts.filter(a => a.status === 'Abandoned').length}
              </div>
              <div className="text-sm text-slate-600">Abandoned</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {examAttempts.map((attempt) => {
              const user = users.find(u => u.id === attempt.userId);
              const exam = exams.find(e => e.id === attempt.examId);
              
              return (
                <div key={attempt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.fullName || 'Unknown User'}</div>
                      <div className="text-sm text-slate-600">{exam?.title || 'Unknown Exam'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={attempt.status === 'Completed' ? 'success' : attempt.status === 'InProgress' ? 'warning' : 'destructive'}>
                      {attempt.status}
                    </Badge>
                    
                    {attempt.status === 'Completed' && (
                      <div className="text-right">
                        <div className="font-medium">{attempt.score}/{attempt.totalQuestions}</div>
                        <div className="text-sm text-slate-600">
                          {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-slate-500">
                      {attempt.timeSpent ? `${attempt.timeSpent}m` : 'N/A'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
