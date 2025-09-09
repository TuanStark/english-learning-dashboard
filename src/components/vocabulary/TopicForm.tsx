import React, { useState, useEffect } from 'react';
import type { VocabularyTopic } from '@/types';
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
import { Loader2 } from 'lucide-react';

interface TopicFormProps {
  topic?: VocabularyTopic;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (topicData: Omit<VocabularyTopic, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function TopicForm({ topic, open, onOpenChange, onSubmit }: TopicFormProps) {
  const [formData, setFormData] = useState({
    topicName: topic?.topicName || '',
    description: topic?.description || '',
    image: topic?.image || '',
    orderIndex: topic?.orderIndex || 0,
    isActive: topic?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (topic) {
      setFormData({
        topicName: topic.topicName,
        description: topic.description || '',
        image: topic.image || '',
        orderIndex: topic.orderIndex,
        isActive: topic.isActive,
      });
    } else {
      setFormData({
        topicName: '',
        description: '',
        image: '',
        orderIndex: 0,
        isActive: true,
      });
    }
  }, [topic, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.topicName.trim()) {
      newErrors.topicName = 'Tên chủ đề là bắt buộc';
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
      console.error('Failed to save topic:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {topic ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
          </DialogTitle>
          <DialogDescription>
            {topic 
              ? 'Thực hiện thay đổi thông tin chủ đề tại đây.' 
              : 'Thêm chủ đề từ vựng mới vào hệ thống.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topicName">Tên chủ đề</Label>
            <Input
              id="topicName"
              value={formData.topicName}
              onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
              placeholder="Nhập tên chủ đề"
            />
            {errors.topicName && (
              <p className="text-sm text-destructive">{errors.topicName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chủ đề"
            />
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
            <Label htmlFor="orderIndex">Thứ tự hiển thị</Label>
            <Input
              id="orderIndex"
              type="number"
              min="0"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {topic ? 'Cập nhật' : 'Thêm'} chủ đề
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
