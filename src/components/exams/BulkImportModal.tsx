import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkImportFormData {
  importText: string;
  questionType: 'MultipleChoice' | 'TrueFalse' | 'Essay';
  points: number;
  separator: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: BulkImportFormData;
  onFormChange: (field: string, value: any) => void;
}

export default function BulkImportModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange
}: BulkImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Import Questions</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Format Instructions:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Multiple Choice:</strong> Question text<br/>Option A<br/>Option B* (correct)<br/>Option C<br/>Option D</p>
            <p><strong>True/False:</strong> Question text<br/>True* (correct)<br/>False</p>
            <p><strong>Essay:</strong> Question text</p>
            <p><strong>Separator:</strong> Use "---" to separate multiple questions</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">🔍 Debug Info:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Database Schema:</strong> Content fields are TEXT (unlimited length)</p>
            <p><strong>If content appears truncated:</strong> Check API response, encoding, or backend processing</p>
            <p><strong>Debug:</strong> Use "Test DB" button to see console logs</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Question Type</Label>
              <Select
                value={formData.questionType}
                onValueChange={(value) => onFormChange('questionType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                  <SelectItem value="TrueFalse">True/False</SelectItem>
                  <SelectItem value="Essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Points per Question</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.points}
                onChange={(e) => onFormChange('points', parseFloat(e.target.value) || 1.0)}
                placeholder="Points"
                required
              />
            </div>

            <div>
              <Label>Question Separator</Label>
              <Input
                value={formData.separator}
                onChange={(e) => onFormChange('separator', e.target.value)}
                placeholder="---"
                required
              />
            </div>
          </div>

          <div>
            <Label>Questions Text *</Label>
            <textarea
              value={formData.importText}
              onChange={(e) => onFormChange('importText', e.target.value)}
              placeholder={`What is the capital of France?
London
Paris*
Berlin
Madrid
---
What is 2 + 2?
3
4*
5
6`}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              rows={15}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {formData.separator} to separate questions. Mark correct answers with * or ✓
            </p>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Import Questions
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
