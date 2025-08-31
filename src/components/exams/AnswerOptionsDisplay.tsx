import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle } from 'lucide-react';
import type { AnswerOption } from '@/types/backend';

interface AnswerOptionsDisplayProps {
  answerOptions: AnswerOption[];
  onAddOption: () => void;
  onEditOption: (option: AnswerOption) => void;
  onDeleteOption: (id: number) => void;
}

export default function AnswerOptionsDisplay({
  answerOptions,
  onAddOption,
  onEditOption,
  onDeleteOption
}: AnswerOptionsDisplayProps) {
  return (
    <div className="ml-8 mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-slate-600">
          Answer Options ({answerOptions.length})
        </h5>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddOption}
          className="text-xs h-7 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
      
      {answerOptions.length > 0 ? (
        <div className="space-y-2">
          {answerOptions.map((option) => (
            <div key={option.id} className="flex items-start gap-3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <Badge variant={option.isCorrect ? 'success' : 'secondary'} className="text-xs">
                {option.optionLabel}
              </Badge>
              <span 
                className="text-sm text-slate-700 flex-1 break-words min-w-0"
                title={option.content}
              >
                {option.content}
              </span>
              <div className="flex items-center gap-2">
                {option.isCorrect && (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditOption(option)}
                  className="text-xs h-6 px-2 text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteOption(option.id)}
                  className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-sm text-slate-500 italic">No options yet</span>
      )}
    </div>
  );
}
