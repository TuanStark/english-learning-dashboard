import { Card, CardContent } from '@/components/ui/card';
import { FileText, Target, TrendingUp, Star } from 'lucide-react';

interface ExamStatsProps {
  exams: any[];
}

export default function ExamStats({ exams }: ExamStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng Đề Thi</p>
              <p className="text-3xl font-bold text-slate-900">{exams.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Mức Độ Dễ</p>
              <p className="text-3xl font-bold text-slate-900">
                {exams.filter(e => e.difficulty === 'Easy').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Mức Độ Trung Bình</p>
              <p className="text-3xl font-bold text-slate-900">
                {exams.filter(e => e.difficulty === 'Medium').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Mức Độ Khó</p>
              <p className="text-3xl font-bold text-slate-900">
                {exams.filter(e => e.difficulty === 'Hard').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Star className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
