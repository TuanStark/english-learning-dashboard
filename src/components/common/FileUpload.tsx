import React, { useState, useRef } from 'react';
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
import { Upload, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';

interface FileUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, options: UploadOptions) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  title?: string;
  description?: string;
  uploadTypes?: { value: string; label: string }[];
}

interface UploadOptions {
  type: string;
  topicId?: number;
  [key: string]: any;
}

export function FileUpload({
  open,
  onOpenChange,
  onUpload,
  acceptedTypes = ['.csv', '.xlsx', '.json'],
  maxSize = 10,
  title = 'Upload File',
  description = 'Chọn file để import dữ liệu',
  uploadTypes = [
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'exam', label: 'Bài kiểm tra' },
    { value: 'user', label: 'Người dùng' },
  ],
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError('');
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) {
      setError('Vui lòng chọn file và loại import');
      return;
    }

    setLoading(true);
    setError('');
    setProgress('Đang xử lý file...');

    try {
      setProgress('Đang upload và xử lý dữ liệu...');
      await onUpload(selectedFile, { type: uploadType });

      setProgress('Hoàn thành!');

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setUploadType('');
        setProgress('');
        onOpenChange(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi upload file');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleFile = (type: string) => {
    let content = '';
    let filename = '';

    switch (type) {
      case 'vocabulary':
        content = 'englishWord,vietnameseMeaning,pronunciation,wordType,difficultyLevel,image,audioFile\n' +
                 'hello,xin chào,/həˈloʊ/,Interjection,Easy,,\n' +
                 'beautiful,đẹp,/ˈbjuːtɪfəl/,Adjective,Medium,,\n' +
                 'computer,máy tính,/kəmˈpjuːtər/,Noun,Easy,,';
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
      default:
        return;
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Type Selection */}
          <div className="space-y-2">
            <Label>Loại dữ liệu</Label>
            <Select value={uploadType} onValueChange={setUploadType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại dữ liệu cần import" />
              </SelectTrigger>
              <SelectContent>
                {uploadTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File dữ liệu</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Chọn file khác
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Kéo thả file vào đây hoặc{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        chọn file
                      </Button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hỗ trợ: {acceptedTypes.join(', ')} (tối đa {maxSize}MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Progress */}
          {progress && (
            <div className="text-sm text-blue-600 font-medium">
              {progress}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          {/* File Format Info & Sample Download */}
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Định dạng file CSV:</strong></p>
              <p>• Từ vựng: englishWord,vietnameseMeaning,pronunciation,wordType,difficultyLevel</p>
              <p>• Bài kiểm tra: title,description,duration,difficulty</p>
              <p>• Người dùng: email,fullName,roleId,phoneNumber,address</p>
            </div>

            {uploadType && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSampleFile(uploadType)}
                  className="text-xs"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Tải file mẫu
                </Button>
                <span className="text-xs text-muted-foreground">
                  Tải file mẫu để xem định dạng chính xác
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={loading || !selectedFile || !uploadType}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
