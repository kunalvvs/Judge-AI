/**
 * Tests for Parser Service
 */

const parser = require('../services/parser');
const fs = require('fs').promises;
const path = require('path');

describe('Parser Service', () => {
  describe('cleanText', () => {
    it('should remove extra whitespace', () => {
      const input = 'Hello    world   test';
      const expected = 'Hello world test';
      expect(parser.cleanText(input)).toBe(expected);
    });

    it('should trim leading and trailing spaces', () => {
      const input = '   Hello world   ';
      const expected = 'Hello world';
      expect(parser.cleanText(input)).toBe(expected);
    });

    it('should normalize multiple newlines', () => {
      const input = 'Line 1\n\n\n\nLine 2';
      const expected = 'Line 1\n\nLine 2';
      expect(parser.cleanText(input)).toBe(expected);
    });
  });

  describe('splitTextIntoChunks', () => {
    it('should split text into chunks with default size', () => {
      const text = 'a'.repeat(2500);
      const chunks = parser.splitTextIntoChunks(text, 1000, 200);
      
      expect(chunks.length).toBeGreaterThan(2);
      expect(chunks[0].length).toBeLessThanOrEqual(1000);
    });

    it('should handle text shorter than chunk size', () => {
      const text = 'Short text';
      const chunks = parser.splitTextIntoChunks(text, 1000, 200);
      
      expect(chunks.length).toBe(1);
      expect(chunks[0]).toBe(text);
    });

    it('should create overlapping chunks', () => {
      const text = 'a'.repeat(1500);
      const chunks = parser.splitTextIntoChunks(text, 1000, 200);
      
      expect(chunks.length).toBeGreaterThan(1);
      // Check that chunks overlap
      expect(chunks[0].slice(-100)).toBe(chunks[1].slice(0, 100));
    });

    it('should filter out empty chunks', () => {
      const text = '   ';
      const chunks = parser.splitTextIntoChunks(text, 1000, 200);
      
      expect(chunks.length).toBe(0);
    });
  });

  describe('parseDocument error handling', () => {
    it('should throw error for unsupported file type', async () => {
      await expect(parser.parseDocument('file.txt'))
        .rejects.toThrow('Unsupported file type');
    });

    it('should throw error for non-existent file', async () => {
      await expect(parser.parsePDF('nonexistent.pdf'))
        .rejects.toThrow();
    });
  });
});
