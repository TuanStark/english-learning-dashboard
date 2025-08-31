import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Question } from '@/types/backend';

interface QuestionFormData {
  content: string;
  questionType: string;
  orderIndex: number;
  points: number;
  examId: number;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: QuestionFormData;
  onFormChange: (field: string, value: any) => void;
  isEditing?: boolean;
  editingQuestion?: Question | null;
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing = false,
  editingQuestion
}: QuestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isEditing ? 'Edit Question' : 'Create New Question'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Nội Dung Câu Hỏi *</Label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => onFormChange('content', e.target.value)}
              placeholder="Nhập nội dung câu hỏi"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="questionType">Loại Câu Hỏi</Label>
              <Select
                value={formData.questionType}
                onValueChange={(value) => onFormChange('questionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại câu hỏi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                  <SelectItem value="TrueFalse">True/False</SelectItem>
                  <SelectItem value="Essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="orderIndex">Thứ Tự</Label>
              <Input
                id="orderIndex"
                type="number"
                min="1"
                value={formData.orderIndex}
                onChange={(e) => onFormChange('orderIndex', parseInt(e.target.value) || 1)}
                placeholder="Nhập thứ tự"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="points">Điểm</Label>
              <Input
                id="points"
                type="number"
                min="0"
                step="0.1"
                value={formData.points}
                onChange={(e) => onFormChange('points', parseFloat(e.target.value) || 1.0)}
                placeholder="Nhập điểm"
                required
              />
            </div>
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
              {isEditing ? 'Cập Nhật Câu Hỏi' : 'Tạo Câu Hỏi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
