/**
 * Tests for API Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import api from '../services/api';

// Mock axios
vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startCase', () => {
    it('should create a new case', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 'case-123',
            title: 'Test Case',
            status: 'active'
          }
        }
      };

      axios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      });

      const result = await api.startCase({
        title: 'Test Case',
        description: 'Test Description'
      });

      expect(result.data.id).toBe('case-123');
      expect(result.data.title).toBe('Test Case');
    });
  });

  describe('submitArgument', () => {
    it('should submit an argument successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            argument: {
              id: 'arg-123',
              text: 'Test argument',
              side: 'A'
            }
          }
        }
      };

      axios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      });

      const result = await api.submitArgument('case-123', {
        side: 'A',
        text: 'Test argument'
      });

      expect(result.data.argument.text).toBe('Test argument');
    });
  });
});
