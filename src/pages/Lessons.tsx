import React, { useEffect, useState } from 'react';
import { Lesson, Course } from '@/types';
import { lessonsService } from '@/services/lessons';
import { coursesService } from '@/services/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonForm } from '@/components/lessons/LessonForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, FileText, Play, Clock, Image } from 'lucide-react';

export function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const response = await coursesService.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const courseId = selectedCourseId === 'all' ? undefined : selectedCourseId;
      const response = await lessonsService.getLessons(courseId);
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await lessonsService.createLesson(lessonData);
      await fetchLessons();
    } catch (error) {
      console.error('Failed to create lesson:', error);
      throw error;
    }
  };

  const handleUpdateLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingLesson) return;

    try {
      await lessonsService.updateLesson(editingLesson.id, lessonData);
      await fetchLessons();
      setEditingLesson(undefined);
    } catch (error) {
      console.error('Failed to update lesson:', error);
      throw error;
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      return;
    }

    try {
      await lessonsService.deleteLesson(lessonId);
      await fetchLessons();
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const openEditForm = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingLesson(undefined);
    setFormOpen(true);
  };

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Không xác định';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bài học</h1>
          <p className="text-muted-foreground">
            Quản lý bài học và tài liệu học tập
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bài học
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-64">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo khóa học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khóa học</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="overflow-hidden">
            {lesson.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {getCourseTitle(lesson.courseId)} • Bài {lesson.order}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(lesson)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {lesson.description}
              </CardDescription>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {lesson.duration} phút
                </div>
                {lesson.videoUrl && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Play className="mr-2 h-4 w-4" />
                    Có video
                  </div>
                )}
                {lesson.audioUrl && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Có audio
                  </div>
                )}
                {lesson.imageUrl && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Image className="mr-2 h-4 w-4" />
                    Có hình ảnh
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">Chưa có bài học</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedCourseId === 'all'
              ? 'Bắt đầu bằng cách tạo bài học mới.'
              : 'Khóa học này chưa có bài học nào.'
            }
          </p>
          <div className="mt-6">
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm bài học
            </Button>
          </div>
        </div>
      )}

      <LessonForm
        lesson={editingLesson}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
      />
    </div>
  );
}
