/**
 * Document Parser Service
 * Handles parsing of PDF and DOCX files
 */

const fs = require('fs').promises;
const path = require('path');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

// ============================================================================
// PDF Parser
// ============================================================================

/**
 * Parse PDF file and extract text
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
async function parsePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfParser = new PDFParse({ data: dataBuffer });
    const result = await pdfParser.getText();
    
    return result.text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

// ============================================================================
// DOCX Parser
// ============================================================================

/**
 * Parse DOCX file and extract text
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
async function parseDOCX(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }
    
    return result.value.trim();
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

// ============================================================================
// Generic Parser
// ============================================================================

/**
 * Parse document based on file extension
 * @param {string} filePath - Path to the document
 * @returns {Promise<string>} - Extracted text content
 */
async function parseDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return await parsePDF(filePath);
    case '.docx':
      return await parseDOCX(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

// ============================================================================
// Text Processing Utilities
// ============================================================================

/**
 * Split text into chunks for vector indexing
 * @param {string} text - Text to split
 * @param {number} chunkSize - Maximum chunk size in characters
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<string>} - Array of text chunks
 */
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start = end - overlap;
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Clean and normalize text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newline
    .trim();
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  parsePDF,
  parseDOCX,
  parseDocument,
  splitTextIntoChunks,
  cleanText
};
