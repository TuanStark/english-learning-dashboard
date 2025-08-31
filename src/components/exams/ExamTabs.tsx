import { Button } from '@/components/ui/button';
import { FileText, BarChart3 } from 'lucide-react';

interface ExamTabsProps {
  activeTab: 'exams' | 'attempts';
  onTabChange: (tab: 'exams' | 'attempts') => void;
}

export default function ExamTabs({ activeTab, onTabChange }: ExamTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
        <Button
          variant={activeTab === 'exams' ? 'default' : 'ghost'}
          onClick={() => onTabChange('exams')}
          className={`flex-1 ${activeTab === 'exams' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
        >
          <FileText className="h-4 w-4 mr-2" />
          Đề Thi
        </Button>
        <Button
          variant={activeTab === 'attempts' ? 'default' : 'ghost'}
          onClick={() => onTabChange('attempts')}
          className={`flex-1 ${activeTab === 'attempts' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Làm Bài Thi
        </Button>
      </div>
    </div>
  );
}
