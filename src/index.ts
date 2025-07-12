#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PDFParser } from './pdf-parser.js';

class PDFMCPServer {
  private server: McpServer;
  private pdfParser: PDFParser;

  constructor() {
    this.server = new McpServer({
      name: 'pdf-mcp-server',
      version: '1.0.0',
    });

    this.pdfParser = new PDFParser();
    this.setupTools();
  }

  private setupTools(): void {
    // Extract PDF text tool
    this.server.registerTool(
      'extract_pdf_text',
      {
        description: 'Extract text content from a PDF file',
        inputSchema: {
          filePath: z.string().describe('Path to the PDF file to extract text from'),
        },
      },
      async ({ filePath }) => {
        try {
          const result = await this.pdfParser.extractText(filePath);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify({
                  text: result.text,
                  pageCount: result.pageCount,
                  metadata: result.metadata,
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get PDF metadata tool
    this.server.registerTool(
      'get_pdf_metadata',
      {
        description: 'Get metadata information from a PDF file',
        inputSchema: {
          filePath: z.string().describe('Path to the PDF file to get metadata from'),
        },
      },
      async ({ filePath }) => {
        try {
          const result = await this.pdfParser.getMetadata(filePath);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Validate PDF tool
    this.server.registerTool(
      'validate_pdf',
      {
        description: 'Validate if a file is a valid PDF',
        inputSchema: {
          filePath: z.string().describe('Path to the file to validate'),
        },
      },
      async ({ filePath }) => {
        try {
          const isValid = this.pdfParser.validatePDF(filePath);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify({
                  isValid,
                  filePath,
                  message: isValid ? 'PDF file is valid' : 'PDF file is invalid or not found',
                }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PDF MCP Server running on stdio');
  }
}

// Start the server
const server = new PDFMCPServer();
server.run().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
