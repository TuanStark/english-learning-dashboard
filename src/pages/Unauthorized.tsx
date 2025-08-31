import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft } from 'lucide-react';

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Truy Cập Bị Từ Chối</CardTitle>
          <CardDescription>
            Bạn không có quyền truy cập trang này
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trang này chỉ dành cho quản trị viên. Vui lòng liên hệ quản trị viên hệ thống nếu bạn cho rằng đây là lỗi.
          </p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay Lại Bảng Điều Khiển
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
