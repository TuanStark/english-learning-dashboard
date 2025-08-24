import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportDialog } from '@/components/common/ImportDialog';
import { Upload, FileText, Users, HelpCircle } from 'lucide-react';

export function ImportDemo() {
  const [vocabularyImportOpen, setVocabularyImportOpen] = useState(false);
  const [examImportOpen, setExamImportOpen] = useState(false);
  const [userImportOpen, setUserImportOpen] = useState(false);

  const mockTopics = [
    { id: 1, topicName: 'Gia đình', description: 'Từ vựng về gia đình', image: '', orderIndex: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 2, topicName: 'Thức ăn', description: 'Từ vựng về thức ăn', image: '', orderIndex: 2, isActive: true, createdAt: '', updatedAt: '' },
    { id: 3, topicName: 'Giao thông', description: 'Từ vựng về giao thông', image: '', orderIndex: 3, isActive: true, createdAt: '', updatedAt: '' },
  ];

  const handleImport = async (file: File, options: any) => {
    console.log('Importing file:', file.name, 'with options:', options);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success
    console.log('Import completed successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Demo Import File</h1>
        <p className="text-muted-foreground">
          Kiểm tra tính năng import dữ liệu từ file
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Vocabulary Import */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setVocabularyImportOpen(true)}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Import từ vựng
            </CardTitle>
            <CardDescription>
              Import danh sách từ vựng từ file CSV hoặc Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Chọn file từ vựng
            </Button>
            <div className="mt-3 text-xs text-muted-foreground">
              <p><strong>Định dạng:</strong> englishWord, vietnameseMeaning, pronunciation, wordType, difficultyLevel</p>
            </div>
          </CardContent>
        </Card>

        {/* Exam Import */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setExamImportOpen(true)}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-green-500" />
              Import bài kiểm tra
            </CardTitle>
            <CardDescription>
              Import danh sách bài kiểm tra từ file CSV hoặc Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Chọn file bài kiểm tra
            </Button>
            <div className="mt-3 text-xs text-muted-foreground">
              <p><strong>Định dạng:</strong> title, description, duration, difficulty</p>
            </div>
          </CardContent>
        </Card>

        {/* User Import */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUserImportOpen(true)}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-500" />
              Import người dùng
            </CardTitle>
            <CardDescription>
              Import danh sách người dùng từ file CSV hoặc Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Chọn file người dùng
            </Button>
            <div className="mt-3 text-xs text-muted-foreground">
              <p><strong>Định dạng:</strong> email, fullName, roleId, phoneNumber, address</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Các bước import dữ liệu:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Chọn loại dữ liệu muốn import (từ vựng, bài kiểm tra, hoặc người dùng)</li>
              <li>Tải file mẫu để xem định dạng chính xác</li>
              <li>Chuẩn bị dữ liệu theo đúng định dạng trong file CSV hoặc Excel</li>
              <li>Upload file và chờ hệ thống xử lý</li>
              <li>Xem kết quả import và xử lý các lỗi nếu có</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">Lưu ý quan trọng:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>File phải có định dạng CSV, Excel (.xlsx) hoặc JSON</li>
              <li>Dòng đầu tiên phải là header (tên cột)</li>
              <li>Các trường bắt buộc không được để trống</li>
              <li>Email phải có định dạng hợp lệ</li>
              <li>Kích thước file tối đa 10MB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Ví dụ dữ liệu từ vựng:</h4>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              englishWord,vietnameseMeaning,pronunciation,wordType,difficultyLevel<br/>
              hello,xin chào,/həˈloʊ/,Interjection,Easy<br/>
              beautiful,đẹp,/ˈbjuːtɪfəl/,Adjective,Medium<br/>
              computer,máy tính,/kəmˈpjuːtər/,Noun,Easy
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Dialogs */}
      <ImportDialog
        open={vocabularyImportOpen}
        onOpenChange={setVocabularyImportOpen}
        onImport={handleImport}
        importType="vocabulary"
        topics={mockTopics}
      />

      <ImportDialog
        open={examImportOpen}
        onOpenChange={setExamImportOpen}
        onImport={handleImport}
        importType="exam"
      />

      <ImportDialog
        open={userImportOpen}
        onOpenChange={setUserImportOpen}
        onImport={handleImport}
        importType="user"
      />
    </div>
  );
}
