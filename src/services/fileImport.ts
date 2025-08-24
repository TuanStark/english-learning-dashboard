import { Vocabulary as VocabularyType, Exam, User } from '@/types';

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  data: any[];
}

export interface VocabularyImportData {
  englishWord: string;
  vietnameseMeaning: string;
  pronunciation?: string;
  wordType?: string;
  difficultyLevel?: string;
  image?: string;
  audioFile?: string;
}

export interface ExamImportData {
  title: string;
  description?: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions?: {
    content: string;
    questionType: string;
    points: number;
    answerOptions: {
      content: string;
      isCorrect: boolean;
      optionLabel: string;
    }[];
  }[];
}

export interface UserImportData {
  email: string;
  fullName: string;
  roleId: number;
  phoneNumber?: string;
  address?: string;
}

export const fileImportService = {
  // Parse CSV content
  parseCSV(content: string): string[][] {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      values.push(current.trim());
      return values;
    });
  },

  // Parse JSON content
  parseJSON(content: string): any[] {
    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  },

  // Read file content
  async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Validate vocabulary data
  validateVocabularyData(data: any): VocabularyImportData | null {
    if (!data.englishWord || !data.vietnameseMeaning) {
      return null;
    }

    return {
      englishWord: String(data.englishWord).trim(),
      vietnameseMeaning: String(data.vietnameseMeaning).trim(),
      pronunciation: data.pronunciation ? String(data.pronunciation).trim() : undefined,
      wordType: data.wordType ? String(data.wordType).trim() : undefined,
      difficultyLevel: data.difficultyLevel || 'Easy',
      image: data.image ? String(data.image).trim() : undefined,
      audioFile: data.audioFile ? String(data.audioFile).trim() : undefined,
    };
  },

  // Validate exam data
  validateExamData(data: any): ExamImportData | null {
    if (!data.title || !data.duration) {
      return null;
    }

    return {
      title: String(data.title).trim(),
      description: data.description ? String(data.description).trim() : undefined,
      duration: Number(data.duration) || 30,
      difficulty: ['Easy', 'Medium', 'Hard'].includes(data.difficulty) ? data.difficulty : 'Easy',
    };
  },

  // Validate user data
  validateUserData(data: any): UserImportData | null {
    if (!data.email || !data.fullName) {
      return null;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return null;
    }

    return {
      email: String(data.email).trim().toLowerCase(),
      fullName: String(data.fullName).trim(),
      roleId: Number(data.roleId) || 3, // Default to student role
      phoneNumber: data.phoneNumber ? String(data.phoneNumber).trim() : undefined,
      address: data.address ? String(data.address).trim() : undefined,
    };
  },

  // Process vocabulary import
  async processVocabularyImport(file: File, topicId: number): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let rawData: any[] = [];
      
      if (fileExtension === 'csv') {
        const csvData = this.parseCSV(content);
        if (csvData.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }
        
        const headers = csvData[0];
        rawData = csvData.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
      } else if (fileExtension === 'json') {
        rawData = this.parseJSON(content);
      } else {
        throw new Error('Unsupported file format');
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        data: []
      };

      rawData.forEach((item, index) => {
        const validatedData = this.validateVocabularyData(item);
        if (validatedData) {
          result.data.push({
            ...validatedData,
            topicId,
            isActive: true
          });
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`Row ${index + 1}: Missing required fields (englishWord, vietnameseMeaning)`);
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Process exam import
  async processExamImport(file: File): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let rawData: any[] = [];
      
      if (fileExtension === 'csv') {
        const csvData = this.parseCSV(content);
        if (csvData.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }
        
        const headers = csvData[0];
        rawData = csvData.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
      } else if (fileExtension === 'json') {
        rawData = this.parseJSON(content);
      } else {
        throw new Error('Unsupported file format');
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        data: []
      };

      rawData.forEach((item, index) => {
        const validatedData = this.validateExamData(item);
        if (validatedData) {
          result.data.push({
            ...validatedData,
            isActive: true
          });
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`Row ${index + 1}: Missing required fields (title, duration)`);
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Process user import
  async processUserImport(file: File): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let rawData: any[] = [];
      
      if (fileExtension === 'csv') {
        const csvData = this.parseCSV(content);
        if (csvData.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }
        
        const headers = csvData[0];
        rawData = csvData.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
      } else if (fileExtension === 'json') {
        rawData = this.parseJSON(content);
      } else {
        throw new Error('Unsupported file format');
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        data: []
      };

      rawData.forEach((item, index) => {
        const validatedData = this.validateUserData(item);
        if (validatedData) {
          result.data.push({
            ...validatedData,
            password: 'password123', // Default password
            isActive: true,
            emailVerified: false,
            status: 'active'
          });
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`Row ${index + 1}: Missing or invalid required fields (email, fullName)`);
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Generate sample CSV templates
  generateVocabularySampleCSV(): string {
    const headers = ['englishWord', 'vietnameseMeaning', 'pronunciation', 'wordType', 'difficultyLevel', 'image', 'audioFile'];
    const sampleData = [
      ['hello', 'xin chào', '/həˈloʊ/', 'Interjection', 'Easy', '', ''],
      ['beautiful', 'đẹp', '/ˈbjuːtɪfəl/', 'Adjective', 'Medium', '', ''],
      ['computer', 'máy tính', '/kəmˈpjuːtər/', 'Noun', 'Easy', '', '']
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  },

  generateExamSampleCSV(): string {
    const headers = ['title', 'description', 'duration', 'difficulty'];
    const sampleData = [
      ['Basic English Test', 'Test for beginners', '30', 'Easy'],
      ['Intermediate Grammar', 'Grammar test for intermediate level', '45', 'Medium'],
      ['Advanced Vocabulary', 'Advanced vocabulary assessment', '60', 'Hard']
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  },

  generateUserSampleCSV(): string {
    const headers = ['email', 'fullName', 'roleId', 'phoneNumber', 'address'];
    const sampleData = [
      ['student1@example.com', 'Nguyễn Văn A', '3', '0123456789', 'Hà Nội'],
      ['teacher1@example.com', 'Trần Thị B', '2', '0987654321', 'TP.HCM'],
      ['student2@example.com', 'Lê Văn C', '3', '0111222333', 'Đà Nẵng']
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  }
};
