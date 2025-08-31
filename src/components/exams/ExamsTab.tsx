import ExamStats from './ExamStats';
import ExamFilters from './ExamFilters';
import ExamCard from './ExamCard';
import type { Exam, Question } from '@/types/backend';

interface ExamsTabProps {
  exams: Exam[];
  questions: Question[];
  answerOptions: any[];
  searchTerm: string;
  selectedDifficulty: string;
  expandedExams: Set<number>;
  expandedQuestions: Set<number>;
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onToggleExamExpansion: (examId: number) => void;
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

export default function ExamsTab({
  exams,
  questions,
  answerOptions,
  searchTerm,
  selectedDifficulty,
  expandedExams,
  expandedQuestions,
  onSearchChange,
  onDifficultyChange,
  onToggleExamExpansion,
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
}: ExamsTabProps) {
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ExamStats exams={exams} />

      {/* Filters */}
      <ExamFilters
        searchTerm={searchTerm}
        selectedDifficulty={selectedDifficulty}
        onSearchChange={onSearchChange}
        onDifficultyChange={onDifficultyChange}
      />

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            questions={questions.filter(q => q.examId === exam.id)}
            answerOptions={answerOptions}
            isExpanded={expandedExams.has(exam.id)}
            expandedQuestions={expandedQuestions}
            onToggleExpansion={onToggleExamExpansion}
            onToggleQuestionExpansion={onToggleQuestionExpansion}
            onShowTemplateModal={onShowTemplateModal}
            onBulkImport={onBulkImport}
            onBulkCreateQuestions={onBulkCreateQuestions}
            onCreateQuestion={onCreateQuestion}
            onEditQuestion={onEditQuestion}
            onDuplicateQuestion={onDuplicateQuestion}
            onAddAnswerOption={onAddAnswerOption}
            onEditAnswerOption={onEditAnswerOption}
            onDeleteAnswerOption={onDeleteAnswerOption}
            onLoadAnswerOptions={onLoadAnswerOptions}
          />
        ))}
      </div>
    </div>
  );
}
