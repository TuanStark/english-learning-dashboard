import React, { useState, useEffect } from 'react';
import { Lesson, Course } from '@/types';
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
import { coursesService } from '@/services/courses';

interface LessonFormProps {
  lesson?: Lesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function LessonForm({ lesson, open, onOpenChange, onSubmit }: LessonFormProps) {
  const [formData, setFormData] = useState({
    courseId: lesson?.courseId || '',
    title: lesson?.title || '',
    description: lesson?.description || '',
    content: lesson?.content || '',
    order: lesson?.order || 1,
    duration: lesson?.duration || 0,
    videoUrl: lesson?.videoUrl || '',
    audioUrl: lesson?.audioUrl || '',
    imageUrl: lesson?.imageUrl || '',
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesService.getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    if (open) {
      fetchCourses();
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) {
      newErrors.courseId = 'Khóa học là bắt buộc';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung là bắt buộc';
    }

    if (formData.order < 1) {
      newErrors.order = 'Thứ tự phải lớn hơn 0';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'Thời lượng phải lớn hơn 0';
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
        courseId: '',
        title: '',
        description: '',
        content: '',
        order: 1,
        duration: 0,
        videoUrl: '',
        audioUrl: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Failed to save lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
          </DialogTitle>
          <DialogDescription>
            {lesson 
              ? 'Thực hiện thay đổi thông tin bài học tại đây.' 
              : 'Thêm bài học mới vào khóa học.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseId">Khóa học</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khóa học" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-sm text-destructive">{errors.courseId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề bài học"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Thứ tự</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              />
              {errors.order && (
                <p className="text-sm text-destructive">{errors.order}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả bài học"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <textarea
              id="content"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nhập nội dung bài học"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Thời lượng (phút)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="URL video"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input
                id="audioUrl"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                placeholder="URL audio"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Hình ảnh URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="URL hình ảnh"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lesson ? 'Cập nhật' : 'Tạo'} bài học
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
