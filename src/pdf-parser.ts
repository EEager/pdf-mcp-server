import { existsSync, readFileSync, statSync } from 'fs';
import { extname } from 'path';
import pdfParse from 'pdf-parse';
import { PDFTextExtractOptions, PDFTextExtractResult, ParsedPDFContent } from './types';

export class PDFParser {
  /**
   * Extract text from PDF file
   */
  async extractText(filePath: string): Promise<PDFTextExtractResult> {
    try {
      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileExt = extname(filePath).toLowerCase();
      if (fileExt !== '.pdf') {
        throw new Error(`Invalid file type: ${fileExt}. Only PDF files are supported.`);
      }

      const dataBuffer = readFileSync(filePath);
      const data = await pdfParse(dataBuffer);

      return {
        text: data.text,
        pageCount: data.numpages,
        metadata: data.info || {},
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text from specific pages
   * Note: pdf-parse doesn't support true page-by-page extraction
   * This implementation simulates page selection by text length estimation
   */
  async extractTextFromPages(options: PDFTextExtractOptions): Promise<PDFTextExtractResult> {
    try {
      // 먼저 전체 텍스트 추출
      const fullResult = await this.extractText(options.filePath);
      
      // 페이지별 분할은 대략적인 추정으로 처리
      // 실제 PDF 라이브러리 한계로 인해 완벽한 페이지 분리는 불가능
      const avgCharsPerPage = Math.floor(fullResult.text.length / fullResult.pageCount);
      
      // 페이지 번호가 지정된 경우
      if (options.pageNumbers && options.pageNumbers.length > 0) {
        const validPages = options.pageNumbers.filter(p => p >= 1 && p <= fullResult.pageCount);
        const resultText = validPages.map(pageNum => {
          const startIdx = (pageNum - 1) * avgCharsPerPage;
          const endIdx = pageNum * avgCharsPerPage;
          const pageText = fullResult.text.substring(startIdx, endIdx);
          return `--- 페이지 ${pageNum} (추정) ---\n${pageText}\n`;
        }).join('\n');
        
        return {
          text: resultText,
          pageCount: fullResult.pageCount,
          metadata: fullResult.metadata,
          extractedPages: validPages
        };
      }
      
      // 범위가 지정된 경우
      const startPage = Math.max(1, options.startPage || 1);
      const endPage = Math.min(fullResult.pageCount, options.endPage || fullResult.pageCount);
      
      if (startPage !== 1 || endPage !== fullResult.pageCount) {
        const startIdx = (startPage - 1) * avgCharsPerPage;
        const endIdx = endPage * avgCharsPerPage;
        const rangeText = fullResult.text.substring(startIdx, endIdx);
        
        return {
          text: `--- 페이지 ${startPage}-${endPage} (추정) ---\n${rangeText}`,
          pageCount: fullResult.pageCount,
          metadata: fullResult.metadata,
          extractedPages: Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i)
        };
      }
      
      // 기본: 전체 텍스트 반환
      return fullResult;
      
    } catch (error) {
      throw new Error(`Failed to extract text from pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert date to ISO string safely
   */
  private formatDate(date: any): string | undefined {
    if (!date) return undefined;
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? date : parsed.toISOString();
    }
    return String(date);
  }

  /**
   * Get PDF metadata only (without full text)
   */
  async getMetadata(filePath: string): Promise<ParsedPDFContent> {
    try {
      const result = await this.extractText(filePath);
      
      // 텍스트 미리보기만 포함 (첫 200자)
      const textPreview = result.text.length > 200 
        ? result.text.substring(0, 200) + '...' 
        : result.text;
      
      return {
        text: textPreview,  // 전체 텍스트 대신 미리보기만
        pageCount: result.pageCount,
        title: result.metadata.Title,
        author: result.metadata.Author,
        subject: result.metadata.Subject,
        keywords: result.metadata.Keywords,
        creator: result.metadata.Creator,
        producer: result.metadata.Producer,
        creationDate: this.formatDate(result.metadata.CreationDate),
        modificationDate: this.formatDate(result.metadata.ModDate),
      };
    } catch (error) {
      throw new Error(`Failed to get PDF metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate PDF file
   */
  validatePDF(filePath: string): boolean {
    try {
      if (!existsSync(filePath)) {
        return false;
      }

      const fileExt = extname(filePath).toLowerCase();
      if (fileExt !== '.pdf') {
        return false;
      }

      // Check file size (basic validation)
      const stats = statSync(filePath);
      const maxSize = 100 * 1024 * 1024; // 100MB limit
      if (stats.size > maxSize) {
        throw new Error(`File too large: ${stats.size} bytes. Maximum allowed: ${maxSize} bytes.`);
      }

      return true;
    } catch (error) {
      throw new Error(`PDF validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 