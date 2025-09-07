import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Users, HelpCircle, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ImportDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const mockTopics = [
    { id: 1, topicName: 'Gia đình', description: 'Từ vựng về gia đình', color: 'bg-blue-100 text-blue-800' },
    { id: 2, topicName: 'Thức ăn', description: 'Từ vựng về thức ăn', color: 'bg-green-100 text-green-800' },
    { id: 3, topicName: 'Giao thông', description: 'Từ vựng về giao thông', color: 'bg-purple-100 text-purple-800' },
    { id: 4, topicName: 'Công việc', description: 'Từ vựng về công việc', color: 'bg-orange-100 text-orange-800' },
    { id: 5, topicName: 'Du lịch', description: 'Từ vựng về du lịch', color: 'bg-pink-100 text-pink-800' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus('idle');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file để import!');
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus('idle');
            setImportProgress(0);
            setSelectedFile(null);
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing time
    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  const downloadTemplate = () => {
    // Simulate download template
    const templates = {
      vocabulary: 'englishWord,vietnameseMeaning,pronunciation,wordType,difficultyLevel\nhello,xin chào,/həˈloʊ/,Interjection,Easy\nbeautiful,đẹp,/ˈbjuːtɪfəl/,Adjective,Medium',
      exam: 'title,description,duration,difficulty,isActive\nBasic Grammar Test,Test basic grammar knowledge,60,Medium,true\nAdvanced Vocabulary,Advanced vocabulary test,90,Hard,true',
      user: 'email,fullName,roleId,phoneNumber,address\njohn@example.com,John Doe,2,+1234567890,123 Main St\njane@example.com,Jane Smith,1,+1234567891,456 Oak Ave'
    };

    const blob = new Blob([templates.vocabulary], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ImportCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color, 
    importType, 
    format, 
    example 
  }: {
    title: string;
    description: string;
    icon: any;
    color: string;
    importType: string;
    format: string;
    example: string;
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {importType === 'vocabulary' ? 'TỪ VỰNG' : importType === 'exam' ? 'BÀI KIỂM TRA' : 'NGƯỜI DÙNG'}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-3">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-${importType}`}
            />
            <label htmlFor={`file-${importType}`} className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Nhấp để chọn file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                CSV, Excel, hoặc JSON (tối đa 10MB)
              </p>
            </label>
          </div>

          {/* Import Progress */}
          {importStatus === 'importing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Đang import...</span>
                <span>{importProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Import Status */}
          {importStatus === 'success' && (
            <div className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-700">Import thành công!</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="flex items-center justify-center p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-700">Có lỗi xảy ra!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadTemplate()}
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Mẫu file
            </Button>
            <Button 
              onClick={() => handleImport()}
              disabled={!selectedFile || importStatus === 'importing'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        {/* Format Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Info className="h-4 w-4 mr-1 text-blue-600" />
            Định dạng yêu cầu:
          </h4>
          <p className="text-xs text-gray-600 mb-2">{format}</p>
          <div className="bg-white p-2 rounded border text-xs font-mono">
            {example}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Hệ Thống Import Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống demo import dữ liệu với giao diện hiện đại và dễ sử dụng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <FileText className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold">150+</div>
            <div className="text-blue-100">Từ vựng</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <HelpCircle className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold">25+</div>
            <div className="text-green-100">Bài kiểm tra</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Users className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-purple-100">Người dùng</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Upload className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold">99%</div>
            <div className="text-orange-100">Tỷ lệ thành công</div>
          </Card>
        </div>

        {/* Import Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          <ImportCard
            title="Import Từ Vựng"
            description="Import danh sách từ vựng từ file CSV, Excel hoặc JSON"
            icon={FileText}
            color="bg-blue-100 text-blue-800"
            importType="vocabulary"
            format="englishWord, vietnameseMeaning, pronunciation, wordType, difficultyLevel"
            example="hello,xin chào,/həˈloʊ/,Interjection,Easy"
          />

          <ImportCard
            title="Import Bài Kiểm Tra"
            description="Import danh sách bài kiểm tra với câu hỏi và đáp án"
            icon={HelpCircle}
            color="bg-green-100 text-green-800"
            importType="exam"
            format="title, description, duration, difficulty, isActive"
            example="Basic Grammar Test,Test basic grammar knowledge,60,Medium,true"
          />

          <ImportCard
            title="Import Người Dùng"
            description="Import danh sách người dùng với thông tin chi tiết"
            icon={Users}
            color="bg-purple-100 text-purple-800"
            importType="user"
            format="email, fullName, roleId, phoneNumber, address"
            example="john@example.com,John Doe,2,+1234567890,123 Main St"
          />
        </div>

        {/* Topics Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Chủ đề từ vựng có sẵn
            </CardTitle>
            <CardDescription>
              Các chủ đề từ vựng đã được tạo sẵn trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {mockTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-3 rounded-lg border-2 ${topic.color} text-center hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div className="font-medium text-sm">{topic.topicName}</div>
                  <div className="text-xs opacity-75 mt-1">{topic.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Info className="mr-2 h-5 w-5" />
              Hướng dẫn sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-blue-800">📋 Các bước import dữ liệu:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>Chọn loại dữ liệu muốn import</li>
                  <li>Tải file mẫu để xem định dạng chính xác</li>
                  <li>Chuẩn bị dữ liệu theo đúng định dạng</li>
                  <li>Upload file và chờ hệ thống xử lý</li>
                  <li>Xem kết quả import và xử lý lỗi nếu có</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-blue-800">⚠️ Lưu ý quan trọng:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                  <li>File phải có định dạng CSV, Excel hoặc JSON</li>
                  <li>Dòng đầu tiên phải là header (tên cột)</li>
                  <li>Các trường bắt buộc không được để trống</li>
                  <li>Email phải có định dạng hợp lệ</li>
                  <li>Kích thước file tối đa 10MB</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2 text-blue-800">💡 Mẹo sử dụng:</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Sử dụng template có sẵn để đảm bảo định dạng đúng</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Kiểm tra dữ liệu trước khi import để tránh lỗi</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Backup dữ liệu cũ trước khi import dữ liệu mới</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
