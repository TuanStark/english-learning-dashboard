import React, { useState } from 'react';
import { Course } from '@/types';
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

interface CourseFormProps {
  course?: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function CourseForm({ course, open, onOpenChange, onSubmit }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    level: course?.level || 'beginner' as const,
    thumbnail: course?.thumbnail || '',
    lessonsCount: course?.lessonsCount || 0,
    studentsCount: course?.studentsCount || 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (formData.lessonsCount < 1) {
      newErrors.lessonsCount = 'Phải có ít nhất 1 bài học';
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
      // Reset form
      setFormData({
        title: '',
        description: '',
        level: 'beginner',
        thumbnail: '',
        lessonsCount: 0,
        studentsCount: 0,
      });
    } catch (error) {
      console.error('Failed to save course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
          </DialogTitle>
          <DialogDescription>
            {course
              ? 'Thực hiện thay đổi thông tin khóa học tại đây.'
              : 'Thêm khóa học mới vào hệ thống.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề khóa học"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả khóa học"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value as 'beginner' | 'intermediate' | 'advanced' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="Enter thumbnail URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lessonsCount">Lessons Count</Label>
              <Input
                id="lessonsCount"
                type="number"
                min="1"
                value={formData.lessonsCount}
                onChange={(e) => setFormData({ ...formData, lessonsCount: parseInt(e.target.value) || 0 })}
              />
              {errors.lessonsCount && (
                <p className="text-sm text-destructive">{errors.lessonsCount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentsCount">Students Count</Label>
              <Input
                id="studentsCount"
                type="number"
                min="0"
                value={formData.studentsCount}
                onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {course ? 'Update' : 'Create'} Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
