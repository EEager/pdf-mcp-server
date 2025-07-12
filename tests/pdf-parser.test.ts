import { PDFParser } from '../src/pdf-parser';
import * as fs from 'fs';
import * as path from 'path';

// Mock pdf-parse
jest.mock('pdf-parse', () => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      text: 'Sample PDF text content',
      numpages: 1,
      info: {
        Title: 'Test PDF',
        Author: 'Test Author',
        Subject: 'Test Subject',
        Keywords: 'test, pdf',
        Creator: 'Test Creator',
        Producer: 'Test Producer',
        CreationDate: new Date('2023-01-01'),
        ModDate: new Date('2023-01-02'),
      },
    })
  );
});

// Mock fs module at the top level
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  statSync: jest.fn(),
}));

describe('PDFParser', () => {
  let parser: PDFParser;
  const mockFilePath = path.join(__dirname, 'fixtures', 'sample.pdf');

  // Cast the mocked functions for type safety
  const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
  const mockReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
  const mockStatSync = fs.statSync as jest.MockedFunction<typeof fs.statSync>;

  beforeEach(() => {
    parser = new PDFParser();
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set default mock implementations
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(Buffer.from('mock pdf content'));
    mockStatSync.mockReturnValue({ size: 1000 } as fs.Stats);
  });

  describe('extractText', () => {
    it('should extract text from PDF successfully', async () => {
      const result = await parser.extractText(mockFilePath);

      expect(result).toEqual({
        text: 'Sample PDF text content',
        pageCount: 1,
        metadata: {
          Title: 'Test PDF',
          Author: 'Test Author',
          Subject: 'Test Subject',
          Keywords: 'test, pdf',
          Creator: 'Test Creator',
          Producer: 'Test Producer',
          CreationDate: new Date('2023-01-01'),
          ModDate: new Date('2023-01-02'),
        },
      });
    });

    it('should throw error if file does not exist', async () => {
      mockExistsSync.mockReturnValue(false);

      await expect(parser.extractText(mockFilePath)).rejects.toThrow(
        'File not found:'
      );
    });

    it('should throw error for non-PDF files', async () => {
      const txtFilePath = mockFilePath.replace('.pdf', '.txt');

      await expect(parser.extractText(txtFilePath)).rejects.toThrow(
        'Invalid file type: .txt. Only PDF files are supported.'
      );
    });
  });

  describe('getMetadata', () => {
    it('should return formatted metadata', async () => {
      const result = await parser.getMetadata(mockFilePath);

      expect(result).toEqual({
        text: 'Sample PDF text content',
        pageCount: 1,
        title: 'Test PDF',
        author: 'Test Author',
        subject: 'Test Subject',
        keywords: 'test, pdf',
        creator: 'Test Creator',
        producer: 'Test Producer',
        creationDate: '2023-01-01T00:00:00.000Z',
        modificationDate: '2023-01-02T00:00:00.000Z',
      });
    });
  });

  describe('validatePDF', () => {
    it('should return true for valid PDF', () => {
      const result = parser.validatePDF(mockFilePath);
      expect(result).toBe(true);
    });

    it('should return false for non-existent file', () => {
      mockExistsSync.mockReturnValue(false);

      const result = parser.validatePDF(mockFilePath);
      expect(result).toBe(false);
    });

    it('should return false for non-PDF files', () => {
      const txtFilePath = mockFilePath.replace('.pdf', '.txt');

      const result = parser.validatePDF(txtFilePath);
      expect(result).toBe(false);
    });

    it('should throw error for files that are too large', () => {
      mockStatSync.mockReturnValue({ size: 200 * 1024 * 1024 } as fs.Stats);

      expect(() => parser.validatePDF(mockFilePath)).toThrow(
        'File too large:'
      );
    });
  });
});
