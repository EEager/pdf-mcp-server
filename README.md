# PDF MCP Server

[English](README.md) | [한국어](README.ko.md)

A practical PDF parsing tool wrapped as an MCP (Model Context Protocol) server for Cursor IDE integration. 

## Why This Exists

Cursor IDE's AI can't read PDF files natively, which is frankly annoying when you're trying to analyze documentation, research papers, or any PDF content. This MCP server bridges that gap by providing PDF parsing capabilities through the MCP protocol.

**Reality Check**: This isn't revolutionary. We're essentially wrapping existing PDF parsing libraries into an MCP interface. But sometimes the most practical solutions are the boring ones.

## Current Status

✅ **Completed:**
- Basic MCP server structure with McpServer API
- PDF text extraction using pdf-parse library
- PDF metadata extraction 
- PDF file validation
- Complete test suite (8/8 tests passing)
- TypeScript build system
- Docker-based development environment

🔧 **Next Steps:**
- MCP Inspector integration testing
- Cursor IDE MCP configuration
- Real PDF file testing
- GitHub Actions CI/CD setup

## Features

### Current Implementation
- **extract_pdf_text**: Extract text content from PDF files
- **get_pdf_metadata**: Get PDF metadata (title, author, creation date, etc.)
- **validate_pdf**: Validate PDF file format and size limits

### Planned Features
- [ ] Page-by-page text extraction
- [ ] Table detection and extraction
- [ ] Image extraction capabilities
- [ ] OCR support for scanned PDFs
- [ ] Batch processing

## Tech Stack

- **TypeScript** - Because type safety matters, even for wrapper projects
- **pdf-parse** - Battle-tested PDF parsing library
- **@modelcontextprotocol/sdk** v1.15.1 - Latest MCP SDK
- **zod** - Schema validation for MCP tools
- **Jest** - Testing framework
- **Docker** - Cross-platform development environment

## Installation

### Prerequisites
- Docker (recommended) or Node.js 18+
- Cursor IDE

### Method 1: Docker Setup (Recommended)

This method avoids WSL/Windows path conflicts and npm permission issues.

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/pdf-mcp-server.git
cd pdf-mcp-server
```

2. **Install dependencies:**
```bash
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm install
```

3. **Build the project:**
```bash
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm run build
```

4. **Run tests:**
```bash
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm test
```

### Method 2: Native Node.js Setup

If you prefer native Node.js (may encounter path issues on WSL):

```bash
npm install
npm run build
npm test
```

### Cursor IDE Configuration

Add to your Cursor MCP settings file (`~/.cursor/mcp_servers.json`):

```json
{
  "mcpServers": {
    "pdf-parser": {
      "command": "node",
      "args": ["/path/to/pdf-mcp-server/dist/index.js"]
    }
  }
}
```

## Usage

Once configured, you can use these commands in Cursor IDE:

### Extract Text from PDF
```
Can you read the content of document.pdf?
```

### Get PDF Metadata
```
What's the metadata of this PDF file?
```

### Validate PDF File
```
Is this file a valid PDF?
```

## Development

### Project Structure
```
pdf-mcp-server/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── pdf-parser.ts     # PDF parsing logic
│   └── types.ts          # TypeScript definitions
├── tests/
│   └── pdf-parser.test.ts # Jest test suite
├── dist/                 # Build output
├── package.json
├── tsconfig.json
└── README.md
```

### Development Scripts
```bash
# With Docker (recommended)
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm run dev
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm run build
docker run -it --rm -v ~/workspace/pdf-mcp-server:/app -w /app node:20 npm test

# Native Node.js
npm run dev        # Development mode with hot reload
npm run build      # Build for production  
npm run test       # Run tests
npm run lint       # Lint code
npm run format     # Format code with Prettier
```

### Testing with MCP Inspector

```bash
# Test the MCP server functionality
npx @modelcontextprotocol/inspector node dist/index.js
```

## Implementation Notes

### Environment Challenges Solved
- **WSL/Windows Path Conflicts**: Resolved using Docker containerization
- **npm Permission Issues**: Docker isolation prevents file system conflicts
- **MCP SDK Version Mismatch**: Updated from non-existent 0.2.0 to latest 1.15.1
- **API Changes**: Migrated from legacy Server to new McpServer API

### Architecture Decisions
- **Modular Design**: Separate PDF parsing logic from MCP server logic
- **Comprehensive Testing**: Full test coverage with mocked dependencies
- **Type Safety**: Strict TypeScript configuration with zod validation
- **Error Handling**: Graceful error handling for file operations and PDF parsing

## Troubleshooting

### Common Issues

**npm install fails with UNC path errors:**
- Use Docker method instead of native Node.js
- Ensure you're running from WSL, not Windows Command Prompt

**TypeScript compilation errors:**
- Check Node.js version (requires 18+)
- Verify all dependencies are installed

**MCP server not recognized in Cursor:**
- Verify the path in mcp_servers.json is correct
- Ensure the server builds successfully first

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and ensure tests pass: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

**Note**: All PRs must include tests and pass the existing test suite.

## Limitations

- **File Size**: Large PDFs (>100MB) will be rejected for performance reasons
- **Complex Layouts**: Tables and multi-column layouts may not parse perfectly
- **Scanned PDFs**: OCR support is planned but not yet implemented
- **Security**: No malware scanning or malicious PDF detection

## License

MIT License - because sharing is caring, and this is just a wrapper anyway.

## Acknowledgments

- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - The actual PDF parsing heavy lifting
- [MCP Protocol](https://modelcontextprotocol.io/) - For making this integration possible  
- [Cursor IDE](https://cursor.sh/) - For building an IDE that's actually worth extending
- Docker community - For solving our environment compatibility nightmares

---

**Status**: Early development phase. Basic functionality works, but expect rough edges and breaking changes. This is a learning project disguised as a productivity tool.