/**
 * API Service
 * Handles all backend API communications
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// ============================================================================
// Case Management
// ============================================================================

/**
 * Start a new case
 */
export const startCase = async (caseData) => {
  return await apiClient.post('/api/cases/start', caseData);
};

/**
 * Get case details
 */
export const getCase = async (caseId) => {
  return await apiClient.get(`/api/cases/${caseId}`);
};

/**
 * Get all cases
 */
export const getAllCases = async () => {
  return await apiClient.get('/api/cases');
};

/**
 * Submit an argument
 */
export const submitArgument = async (caseId, argumentData) => {
  return await apiClient.post(`/api/cases/${caseId}/argue`, argumentData);
};

/**
 * Request a verdict
 */
export const requestVerdict = async (caseId) => {
  return await apiClient.post(`/api/cases/${caseId}/verdict`);
};

// ============================================================================
// File Upload
// ============================================================================

/**
 * Upload a file
 */
export const uploadFile = async (file, caseId, side) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caseId', caseId);
  formData.append('side', side);

  return await apiClient.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Parse an uploaded document
 */
export const parseDocument = async (fileId, filePath) => {
  return await apiClient.post('/api/upload/parse', {
    fileId,
    filePath,
  });
};

/**
 * Index a document in vector DB
 */
export const indexDocument = async (text, metadata) => {
  return await apiClient.post('/api/upload/index', {
    text,
    metadata,
  });
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId) => {
  return await apiClient.delete(`/api/upload/${fileId}`);
};

// ============================================================================
// Health Check
// ============================================================================

/**
 * Check API health
 */
export const checkHealth = async () => {
  return await apiClient.get('/health');
};

export default {
  startCase,
  getCase,
  getAllCases,
  submitArgument,
  requestVerdict,
  uploadFile,
  parseDocument,
  indexDocument,
  deleteFile,
  checkHealth,
};
