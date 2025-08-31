import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Question } from '@/types/backend';
import AnswerOptionsDisplay from './AnswerOptionsDisplay';

interface QuestionDisplayProps {
  question: Question;
  examId: number;
  isExpanded: boolean;
  answerOptions: any[];
  onToggleExpansion: (questionId: number) => void;
  onEditQuestion: (question: Question) => void;
  onDuplicateQuestion: (question: Question, examId: number) => void;
  onAddAnswerOption: (questionId: number) => void;
  onEditAnswerOption: (option: any) => void;
  onDeleteAnswerOption: (id: number) => void;
}

export default function QuestionDisplay({
  question,
  examId,
  isExpanded,
  answerOptions,
  onToggleExpansion,
  onEditQuestion,
  onDuplicateQuestion,
  onAddAnswerOption,
  onEditAnswerOption,
  onDeleteAnswerOption
}: QuestionDisplayProps) {
  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MultipleChoice': return 'info';
      case 'TrueFalse': return 'success';
      case 'Essay': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpansion(question.id)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEditQuestion(question)}
            className="text-xs h-7 px-2"
          >
            Chỉnh Sửa
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDuplicateQuestion(question, examId)}
            className="text-xs h-7 px-2 text-green-600 hover:text-green-700"
          >
            Sao Chép
          </Button>
          
          <Badge variant={getQuestionTypeColor(question.questionType)}>
            {question.questionType}
          </Badge>
          
          <span className="text-sm text-slate-600">
            Điểm: {question.points}
          </span>
        </div>
      </div>
      
      <p className="text-slate-800 ml-8">{question.content}</p>
      
      {/* Answer Options Display */}
      {isExpanded && (
        <AnswerOptionsDisplay
          answerOptions={answerOptions}
          onAddOption={() => onAddAnswerOption(question.id)}
          onEditOption={onEditAnswerOption}
          onDeleteOption={onDeleteAnswerOption}
        />
      )}
    </div>
  );
}
