import React, { useEffect, useState } from 'react';
import { Course } from '@/types';
import { coursesService } from '@/services/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from '@/components/courses/CourseForm';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesService.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await coursesService.createCourse(courseData);
      await fetchCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  };

  const handleUpdateCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCourse) return;
    
    try {
      await coursesService.updateCourse(editingCourse.id, courseData);
      await fetchCourses();
      setEditingCourse(undefined);
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await coursesService.deleteCourse(courseId);
      await fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const openEditForm = (course: Course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingCourse(undefined);
    setFormOpen(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return level;
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
          <p className="text-muted-foreground">
            Quản lý các khóa học tiếng Anh
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khóa học
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            {course.thumbnail && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                      course.level
                    )}`}
                  >
                    {getLevelText(course.level)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {course.description}
              </CardDescription>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {course.lessonsCount} bài học
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {course.studentsCount} học viên
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">Chưa có khóa học</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Bắt đầu bằng cách tạo khóa học mới.
          </p>
          <div className="mt-6">
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khóa học
            </Button>
          </div>
        </div>
      )}

      <CourseForm
        course={editingCourse}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
      />
    </div>
  );
}
