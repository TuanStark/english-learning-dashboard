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
            Quản Lý Đề Thi
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Quản lý đề thi, câu hỏi và làm bài thi
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onCreateExam}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm Đề Thi
          </Button>
        </div>
      </div>
    </div>
  );
}
