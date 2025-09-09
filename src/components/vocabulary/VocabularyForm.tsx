import React, { useState, useEffect } from 'react';
import type { Vocabulary as VocabularyType, VocabularyTopic } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { vocabularyApi } from '@/services/api';

interface VocabularyFormProps {
  vocabulary?: VocabularyType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vocabularyData: Omit<VocabularyType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function VocabularyForm({ vocabulary, open, onOpenChange, onSubmit }: VocabularyFormProps) {
  const [formData, setFormData] = useState({
    topicId: vocabulary?.topicId || 0,
    englishWord: vocabulary?.englishWord || '',
    pronunciation: vocabulary?.pronunciation || '',
    vietnameseMeaning: vocabulary?.vietnameseMeaning || '',
    wordType: vocabulary?.wordType || '',
    difficultyLevel: vocabulary?.difficultyLevel || 'Easy',
    image: vocabulary?.image || '',
    audioFile: vocabulary?.audioFile || '',
    isActive: vocabulary?.isActive ?? true,
  });
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await vocabularyApi.getTopics();
        const topics = Array.isArray(response.data) && !Array.isArray(response.data[0]) 
          ? response.data as VocabularyTopic[] 
          : [];
        setTopics(topics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };

    if (open) {
      fetchTopics();
    }
  }, [open]);

  useEffect(() => {
    if (vocabulary) {
      setFormData({
        topicId: vocabulary.topicId,
        englishWord: vocabulary.englishWord,
        pronunciation: vocabulary.pronunciation || '',
        vietnameseMeaning: vocabulary.vietnameseMeaning,
        wordType: vocabulary.wordType || '',
        difficultyLevel: vocabulary.difficultyLevel,
        image: vocabulary.image || '',
        audioFile: vocabulary.audioFile || '',
        isActive: vocabulary.isActive,
      });
    } else {
      setFormData({
        topicId: 0,
        englishWord: '',
        pronunciation: '',
        vietnameseMeaning: '',
        wordType: '',
        difficultyLevel: 'Easy',
        image: '',
        audioFile: '',
        isActive: true,
      });
    }
  }, [vocabulary, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.topicId) {
      newErrors.topicId = 'Chủ đề là bắt buộc';
    }

    if (!formData.englishWord.trim()) {
      newErrors.englishWord = 'Từ tiếng Anh là bắt buộc';
    }

    if (!formData.vietnameseMeaning.trim()) {
      newErrors.vietnameseMeaning = 'Nghĩa tiếng Việt là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const wordTypes = [
    { value: 'Noun', label: 'Danh từ' },
    { value: 'Verb', label: 'Động từ' },
    { value: 'Adjective', label: 'Tính từ' },
    { value: 'Adverb', label: 'Trạng từ' },
    { value: 'Preposition', label: 'Giới từ' },
    { value: 'Conjunction', label: 'Liên từ' },
    { value: 'Interjection', label: 'Thán từ' },
  ];

  const difficultyLevels = [
    { value: 'Easy', label: 'Dễ' },
    { value: 'Medium', label: 'Trung bình' },
    { value: 'Hard', label: 'Khó' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vocabulary ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
          </DialogTitle>
          <DialogDescription>
            {vocabulary 
              ? 'Thực hiện thay đổi thông tin từ vựng tại đây.' 
              : 'Thêm từ vựng mới vào hệ thống.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topicId">Chủ đề</Label>
            <Select
              value={formData.topicId.toString()}
              onValueChange={(value) => setFormData({ ...formData, topicId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.topicName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.topicId && (
              <p className="text-sm text-destructive">{errors.topicId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="englishWord">Từ tiếng Anh</Label>
              <Input
                id="englishWord"
                value={formData.englishWord}
                onChange={(e) => setFormData({ ...formData, englishWord: e.target.value })}
                placeholder="Nhập từ tiếng Anh"
              />
              {errors.englishWord && (
                <p className="text-sm text-destructive">{errors.englishWord}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronunciation">Phát âm</Label>
              <Input
                id="pronunciation"
                value={formData.pronunciation}
                onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                placeholder="/ˈeksəmpl/"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vietnameseMeaning">Nghĩa tiếng Việt</Label>
            <Input
              id="vietnameseMeaning"
              value={formData.vietnameseMeaning}
              onChange={(e) => setFormData({ ...formData, vietnameseMeaning: e.target.value })}
              placeholder="Nhập nghĩa tiếng Việt"
            />
            {errors.vietnameseMeaning && (
              <p className="text-sm text-destructive">{errors.vietnameseMeaning}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wordType">Loại từ</Label>
              <Select
                value={formData.wordType}
                onValueChange={(value) => setFormData({ ...formData, wordType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại từ" />
                </SelectTrigger>
                <SelectContent>
                  {wordTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Độ khó</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL hình ảnh</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioFile">URL file âm thanh</Label>
            <Input
              id="audioFile"
              value={formData.audioFile}
              onChange={(e) => setFormData({ ...formData, audioFile: e.target.value })}
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {vocabulary ? 'Cập nhật' : 'Thêm'} từ vựng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
