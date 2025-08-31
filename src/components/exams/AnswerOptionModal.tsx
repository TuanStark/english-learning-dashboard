import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AnswerOption } from '@/types/backend';

interface AnswerOptionFormData {
  content: string;
  isCorrect: boolean;
  optionLabel: string;
}

interface AnswerOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: AnswerOptionFormData;
  onFormChange: (field: string, value: any) => void;
  isEditing?: boolean;
  editingAnswerOption?: AnswerOption | null;
}

export default function AnswerOptionModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing = false,
  editingAnswerOption
}: AnswerOptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Answer Option' : 'Create New Answer Option'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="content">Answer Content *</Label>
            <Input
              id="content"
              value={formData.content}
              onChange={(e) => onFormChange('content', e.target.value)}
              placeholder="Enter answer option content"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="optionLabel">Option Label *</Label>
              <Select
                value={formData.optionLabel}
                onValueChange={(value) => onFormChange('optionLabel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCorrect"
                checked={formData.isCorrect}
                onChange={(e) => onFormChange('isCorrect', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isCorrect">Correct Answer</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {isEditing ? 'Update Option' : 'Create Option'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
