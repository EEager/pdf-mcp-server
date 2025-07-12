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
   */
  async extractTextFromPages(options: PDFTextExtractOptions): Promise<PDFTextExtractResult> {
    try {
      const result = await this.extractText(options.filePath);
      
      // Note: pdf-parse doesn't support page-specific extraction directly
      // This is a placeholder for future implementation
      if (options.pageNumbers || options.startPage || options.endPage) {
        console.warn('Page-specific extraction is not yet implemented. Returning full text.');
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to extract text from pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get PDF metadata
   */
  async getMetadata(filePath: string): Promise<ParsedPDFContent> {
    try {
      const result = await this.extractText(filePath);
      
      return {
        text: result.text,
        pageCount: result.pageCount,
        title: result.metadata.Title,
        author: result.metadata.Author,
        subject: result.metadata.Subject,
        keywords: result.metadata.Keywords,
        creator: result.metadata.Creator,
        producer: result.metadata.Producer,
        creationDate: result.metadata.CreationDate?.toISOString(),
        modificationDate: result.metadata.ModDate?.toISOString(),
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