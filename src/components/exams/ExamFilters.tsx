import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ExamFiltersProps {
  searchTerm: string;
  selectedDifficulty: string;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
}

export default function ExamFilters({ 
  searchTerm, 
  selectedDifficulty, 
  onSearchChange, 
  onDifficultyChange 
}: ExamFiltersProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm đề thi..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tất Cả Mức Độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả Mức Độ</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
