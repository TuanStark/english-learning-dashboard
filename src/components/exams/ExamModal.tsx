import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
}

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: ExamFormData;
  onFormChange: (field: string, value: any) => void;
  isEditing?: boolean;
}

export default function ExamModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing = false
}: ExamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isEditing ? 'Edit Exam' : 'Create New Exam'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Tên Đề Thi *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                placeholder="Nhập tên đề thi"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Mô Tả</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                placeholder="Nhập mô tả đề thi"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Thời Gian (phút) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => onFormChange('duration', parseInt(e.target.value) || 60)}
                placeholder="Nhập thời gian đề thi (phút)"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="difficulty">Mức Độ</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => onFormChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Dễ</SelectItem>
                  <SelectItem value="Medium">Trung Bình</SelectItem>
                  <SelectItem value="Hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => onFormChange('isActive', e.target.checked)}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isActive">Hoạt Động</Label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Hủy Bỏ
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isEditing ? 'Cập Nhật Đề Thi' : 'Tạo Đề Thi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
