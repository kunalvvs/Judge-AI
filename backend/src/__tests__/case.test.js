/**
 * Tests for Case Routes
 */

const request = require('supertest');
const app = require('../index');

describe('Case Routes', () => {
  let caseId;

  describe('POST /api/cases/start', () => {
    it('should create a new case', async () => {
      const response = await request(app)
        .post('/api/cases/start')
        .send({
          title: 'Test Case',
          description: 'This is a test case'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Case');
      
      caseId = response.body.data.id;
    });

    it('should reject case without title', async () => {
      const response = await request(app)
        .post('/api/cases/start')
        .send({
          description: 'No title provided'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/cases/:caseId', () => {
    it('should retrieve case details', async () => {
      const response = await request(app)
        .get(`/api/cases/${caseId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(caseId);
    });

    it('should return 404 for non-existent case', async () => {
      const response = await request(app)
        .get('/api/cases/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Case not found');
    });
  });

  describe('POST /api/cases/:caseId/argue', () => {
    it('should submit an argument for Side A', async () => {
      const response = await request(app)
        .post(`/api/cases/${caseId}/argue`)
        .send({
          side: 'A',
          text: 'This is Side A\'s argument'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.argument.text).toBe('This is Side A\'s argument');
    });

    it('should submit an argument for Side B', async () => {
      const response = await request(app)
        .post(`/api/cases/${caseId}/argue`)
        .send({
          side: 'B',
          text: 'This is Side B\'s argument'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid side', async () => {
      const response = await request(app)
        .post(`/api/cases/${caseId}/argue`)
        .send({
          side: 'C',
          text: 'Invalid side'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject empty argument text', async () => {
      const response = await request(app)
        .post(`/api/cases/${caseId}/argue`)
        .send({
          side: 'A',
          text: ''
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cases', () => {
    it('should list all cases', async () => {
      const response = await request(app)
        .get('/api/cases');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
