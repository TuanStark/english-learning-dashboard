import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ExamHeaderProps {
  onCreateExam: () => void;
  onRefreshAll?: () => void;
}

export default function ExamHeader({ onCreateExam, onRefreshAll }: ExamHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Exam Management System
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Unified interface for managing exams, questions, and attempts
          </p>
        </div>
        <div className="flex gap-3">
          {onRefreshAll && (
            <Button
              onClick={onRefreshAll}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh All
            </Button>
          )}
          <Button
            onClick={onCreateExam}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
