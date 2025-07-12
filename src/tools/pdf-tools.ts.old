import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PDFParser } from '../pdf-parser';
import { MCPToolResult } from '../types';

export class PDFTools {
  private parser: PDFParser;

  constructor() {
    this.parser = new PDFParser();
  }

  /**
   * Get list of available tools
   */
  getTools(): Tool[] {
    return [
      {
        name: 'extract_pdf_text',
        description: 'Extract text content from a PDF file',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the PDF file to extract text from',
            },
          },
          required: ['filePath'],
        },
      },
      {
        name: 'get_pdf_metadata',
        description: 'Get metadata information from a PDF file',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the PDF file to get metadata from',
            },
          },
          required: ['filePath'],
        },
      },
      {
        name: 'validate_pdf',
        description: 'Validate if a file is a valid PDF',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the file to validate',
            },
          },
          required: ['filePath'],
        },
      },
    ];
  }

  /**
   * Execute a tool by name
   */
  async executeTool(name: string, args: any): Promise<MCPToolResult> {
    try {
      switch (name) {
        case 'extract_pdf_text':
          return await this.extractPDFText(args.filePath);
        case 'get_pdf_metadata':
          return await this.getPDFMetadata(args.filePath);
        case 'validate_pdf':
          return await this.validatePDF(args.filePath);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Extract text from PDF
   */
  private async extractPDFText(filePath: string): Promise<MCPToolResult> {
    const result = await this.parser.extractText(filePath);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            text: result.text,
            pageCount: result.pageCount,
            metadata: result.metadata,
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Get PDF metadata
   */
  private async getPDFMetadata(filePath: string): Promise<MCPToolResult> {
    const result = await this.parser.getMetadata(filePath);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Validate PDF file
   */
  private async validatePDF(filePath: string): Promise<MCPToolResult> {
    const isValid = this.parser.validatePDF(filePath);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            isValid,
            filePath,
            message: isValid ? 'PDF file is valid' : 'PDF file is invalid or not found',
          }, null, 2),
        },
      ],
    };
  }
} 