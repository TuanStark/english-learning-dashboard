import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AnswerOption {
  content: string;
  isCorrect: boolean;
  optionLabel: string;
}

interface QuestionData {
  content: string;
  questionType: 'MultipleChoice' | 'TrueFalse' | 'Essay';
  orderIndex: number;
  points: number;
  answerOptions: AnswerOption[];
}

interface BulkQuestionFormData {
  questions: QuestionData[];
}

interface BulkQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: BulkQuestionFormData;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onUpdateQuestion: (index: number, field: string, value: any) => void;
  onUpdateAnswerOption: (questionIndex: number, optionIndex: number, field: string, value: any) => void;
}

export default function BulkQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateAnswerOption
}: BulkQuestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Create Questions</h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {formData.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="border-2 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
                  {formData.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Question Content *</Label>
                  <textarea
                    value={question.content}
                    onChange={(e) => onUpdateQuestion(questionIndex, 'content', e.target.value)}
                    placeholder="Enter question content"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={question.questionType}
                      onValueChange={(value) => onUpdateQuestion(questionIndex, 'questionType', value)}
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
                    <Label>Order Index</Label>
                    <Input
                      type="number"
                      min="1"
                      value={question.orderIndex}
                      onChange={(e) => onUpdateQuestion(questionIndex, 'orderIndex', parseInt(e.target.value) || 1)}
                      placeholder="Order"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={question.points}
                      onChange={(e) => onUpdateQuestion(questionIndex, 'points', parseFloat(e.target.value) || 1.0)}
                      placeholder="Points"
                      required
                    />
                  </div>
                </div>

                {/* Answer Options */}
                {question.questionType === 'MultipleChoice' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Answer Options</Label>
                    {question.answerOptions.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <div className="w-16">
                          <Select
                            value={option.optionLabel}
                            onValueChange={(value) => onUpdateAnswerOption(questionIndex, optionIndex, 'optionLabel', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
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
                        <Input
                          value={option.content}
                          onChange={(e) => onUpdateAnswerOption(questionIndex, optionIndex, 'content', e.target.value)}
                          placeholder="Answer option content"
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => onUpdateAnswerOption(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label className="text-xs">Correct</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onAddQuestion}
              className="px-6 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Question
            </Button>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              Create {formData.questions.length} Questions
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
