import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionTemplate {
  name: string;
  template: {
    content: string;
    questionType: 'MultipleChoice' | 'TrueFalse' | 'Essay';
    orderIndex: number;
    points: number;
    answerOptions: Array<{
      content: string;
      isCorrect: boolean;
      optionLabel: string;
    }>;
  };
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: QuestionTemplate[];
  onUseTemplate: (template: QuestionTemplate['template'], examId: number) => void;
  currentExamId: number;
}

export default function TemplateModal({
  isOpen,
  onClose,
  templates,
  onUseTemplate,
  currentExamId
}: TemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{template.template.content}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{template.template.questionType}</Badge>
                  <Badge variant="secondary">{template.template.points} pts</Badge>
                </div>
                {template.template.answerOptions.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {template.template.answerOptions.length} answer options
                  </div>
                )}
                <Button
                  onClick={() => onUseTemplate(template.template, currentExamId)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
