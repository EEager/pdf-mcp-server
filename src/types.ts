export interface PDFParseResult {
  numpages: number;
  numrender: number;
  info: PDFInfo;
  metadata: PDFMetadata;
  text: string;
  version: string;
}

export interface PDFInfo {
  PDFFormatVersion?: string;
  IsAcroFormPresent?: boolean;
  IsXFAPresent?: boolean;
  Title?: string;
  Author?: string;
  Subject?: string;
  Keywords?: string;
  Creator?: string;
  Producer?: string;
  CreationDate?: Date;
  ModDate?: Date;
}

export interface PDFMetadata {
  [key: string]: any;
}

export interface PDFTextExtractOptions {
  filePath: string;
  pageNumbers?: number[];
  startPage?: number;
  endPage?: number;
}

export interface PDFTextExtractResult {
  text: string;
  pageCount: number;
  metadata: PDFInfo;
}

export interface ParsedPDFContent {
  text: string;
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
} 