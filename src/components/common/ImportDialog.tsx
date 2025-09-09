import React, { useState } from 'react';
import type { VocabularyTopic } from '@/types';
import { Button } from '@/components/ui/button';
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
import { FileUpload } from './FileUpload';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File, options: any) => Promise<void>;
  importType: 'vocabulary' | 'exam' | 'user';
  topics?: VocabularyTopic[];
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function ImportDialog({ 
  open, 
  onOpenChange, 
  onImport, 
  importType,
  topics = []
}: ImportDialogProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [, setLoading] = useState(false);

  const handleFileUpload = async (file: File, options: any) => {
    setLoading(true);
    try {
      const uploadOptions = {
        ...options,
        topicId: selectedTopicId,
      };
      
      await onImport(file, uploadOptions);
      setShowFileUpload(false);
      
      // Mock result for demo - in real app this would come from the import response
      setImportResult({
        success: Math.floor(Math.random() * 20) + 5,
        failed: Math.floor(Math.random() * 3),
        errors: [
          'Dòng 5: Thiếu trường bắt buộc "vietnameseMeaning"',
          'Dòng 8: Định dạng email không hợp lệ',
        ].slice(0, Math.floor(Math.random() * 3))
      });
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleFile = () => {
    let content = '';
    let filename = '';
    
    switch (importType) {
      case 'vocabulary':
        content = 'englishWord,vietnameseMeaning,pronunciation,wordType,difficultyLevel,image,audioFile\n' +
                 'hello,xin chào,/həˈloʊ/,Interjection,Easy,,\n' +
                 'beautiful,đẹp,/ˈbjuːtɪfəl/,Adjective,Medium,,\n' +
                 'computer,máy tính,/kəmˈpjuːtər/,Noun,Easy,,\n' +
                 'study,học,/ˈstʌdi/,Verb,Easy,,\n' +
                 'quickly,nhanh chóng,/ˈkwɪkli/,Adverb,Medium,,';
        filename = 'vocabulary_sample.csv';
        break;
      case 'exam':
        content = 'title,description,duration,difficulty\n' +
                 'Basic English Test,Test for beginners,30,Easy\n' +
                 'Intermediate Grammar,Grammar test for intermediate level,45,Medium\n' +
                 'Advanced Vocabulary,Advanced vocabulary assessment,60,Hard';
        filename = 'exam_sample.csv';
        break;
      case 'user':
        content = 'email,fullName,roleId,phoneNumber,address\n' +
                 'student1@example.com,Nguyễn Văn A,3,0123456789,Hà Nội\n' +
                 'teacher1@example.com,Trần Thị B,2,0987654321,TP.HCM\n' +
                 'student2@example.com,Lê Văn C,3,0111222333,Đà Nẵng';
        filename = 'user_sample.csv';
        break;
    }
    
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetDialog = () => {
    setSelectedTopicId(undefined);
    setShowFileUpload(false);
    setImportResult(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (importType) {
      case 'vocabulary': return 'Import từ vựng';
      case 'exam': return 'Import bài kiểm tra';
      case 'user': return 'Import người dùng';
      default: return 'Import dữ liệu';
    }
  };

  const getDescription = () => {
    switch (importType) {
      case 'vocabulary': return 'Import từ vựng từ file CSV hoặc Excel';
      case 'exam': return 'Import bài kiểm tra từ file CSV hoặc Excel';
      case 'user': return 'Import danh sách người dùng từ file CSV hoặc Excel';
      default: return 'Import dữ liệu từ file';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!showFileUpload && !importResult && (
            <>
              {/* Topic Selection for Vocabulary */}
              {importType === 'vocabulary' && (
                <div className="space-y-2">
                  <Label>Chủ đề từ vựng</Label>
                  <Select
                    value={selectedTopicId?.toString() || ''}
                    onValueChange={(value) => setSelectedTopicId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề để import từ vựng" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.topicName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedTopicId && (
                    <p className="text-sm text-muted-foreground">
                      Bạn cần chọn chủ đề trước khi import từ vựng
                    </p>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-medium">Hướng dẫn import:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Tải file mẫu để xem định dạng chính xác</li>
                  <li>Chuẩn bị dữ liệu theo đúng định dạng</li>
                  <li>Upload file và chờ hệ thống xử lý</li>
                </ol>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSampleFile}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tải file mẫu
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Định dạng CSV chuẩn
                  </span>
                </div>
              </div>
            </>
          )}

          {/* File Upload */}
          {showFileUpload && (
            <FileUpload
              open={true}
              onOpenChange={setShowFileUpload}
              onUpload={handleFileUpload}
              title="Chọn file import"
              description="Upload file dữ liệu để import"
              uploadTypes={[{ value: importType, label: getTitle() }]}
              acceptedTypes={['.csv', '.xlsx', '.json']}
            />
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Kết quả import</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="text-sm font-medium text-green-800">Thành công</div>
                  <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="text-sm font-medium text-red-800">Thất bại</div>
                  <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Chi tiết lỗi:</span>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3 max-h-32 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-orange-800">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!showFileUpload && !importResult && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button 
                onClick={() => setShowFileUpload(true)}
                disabled={importType === 'vocabulary' && !selectedTopicId}
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn file
              </Button>
            </>
          )}
          
          {importResult && (
            <Button onClick={handleClose}>
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
