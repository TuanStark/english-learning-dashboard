import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Plus, Clock } from 'lucide-react';
import type { Exam, Question } from '@/types/backend';
import QuestionDisplay from './QuestionDisplay';

interface ExamCardProps {
  exam: Exam;
  questions: Question[];
  answerOptions: any[];
  isExpanded: boolean;
  expandedQuestions: Set<number>;
  onToggleExpansion: (examId: number) => void;
  onToggleQuestionExpansion: (questionId: number) => void;
  onShowTemplateModal: () => void;
  onBulkImport: (examId: number) => void;
  onBulkCreateQuestions: (examId: number) => void;
  onCreateQuestion: (examId: number) => void;
  onEditQuestion: (question: Question) => void;
  onDuplicateQuestion: (question: Question, examId: number) => void;
  onAddAnswerOption: (questionId: number) => void;
  onEditAnswerOption: (option: any) => void;
  onDeleteAnswerOption: (id: number) => void;
  onLoadAnswerOptions: (questionId: number) => void;
}

export default function ExamCard({
  exam,
  questions,
  answerOptions,
  isExpanded,
  expandedQuestions,
  onToggleExpansion,
  onToggleQuestionExpansion,
  onShowTemplateModal,
  onBulkImport,
  onBulkCreateQuestions,
  onCreateQuestion,
  onEditQuestion,
  onDuplicateQuestion,
  onAddAnswerOption,
  onEditAnswerOption,
  onDeleteAnswerOption,
  onLoadAnswerOptions
}: ExamCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpansion(exam.id)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {exam.title?.charAt(0) || 'E'}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{exam.title}</h3>
              {exam.description && (
                <p className="text-slate-600 text-sm">{exam.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getDifficultyColor(exam.difficulty || 'Easy')}>
              {exam.difficulty || 'Easy'}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(exam.duration || 60)}
            </Badge>
            
            <Badge variant={exam.isActive ? 'success' : 'secondary'}>
              {exam.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Expanded Questions Section */}
        {isExpanded && (
          <div className="ml-16 space-y-4 border-l-2 border-slate-200 pl-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Questions ({questions.length})</h4>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onShowTemplateModal}
                  className="text-xs"
                >
                  Templates
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkImport(exam.id)}
                  className="text-xs"
                >
                  Bulk Import
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkCreateQuestions(exam.id)}
                  className="text-xs"
                >
                  Bulk Create
                </Button>
                <Button
                  size="sm"
                  onClick={() => onCreateQuestion(exam.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>
            
            {questions.map((question) => (
              <QuestionDisplay
                key={question.id}
                question={question}
                examId={exam.id}
                isExpanded={expandedQuestions.has(question.id)}
                answerOptions={answerOptions.filter(opt => opt.questionId === question.id)}
                onToggleExpansion={onToggleQuestionExpansion}
                onEditQuestion={onEditQuestion}
                onDuplicateQuestion={onDuplicateQuestion}
                onAddAnswerOption={onAddAnswerOption}
                onEditAnswerOption={onEditAnswerOption}
                onDeleteAnswerOption={onDeleteAnswerOption}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
