/**
 * Case Routes
 * Handles case management, arguments, and verdict generation
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// Import services
const geminiService = require('../services/gemini');
const vectordbService = require('../services/vectordb');

// In-memory storage (replace with database in production)
const cases = new Map();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a new case object
 */
function createCase(title, description) {
  return {
    id: uuidv4(),
    title,
    description,
    status: 'active',
    createdAt: new Date().toISOString(),
    sideA: {
      name: 'Side A',
      arguments: [],
      documents: []
    },
    sideB: {
      name: 'Side B',
      arguments: [],
      documents: []
    },
    verdicts: [],
    reevaluationCount: 0,
    maxReevaluations: 5
  };
}

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/cases/start
 * Start a new case
 */
router.post('/start', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('sideAName').optional().isString(),
  body('sideBName').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { title, description, sideAName, sideBName } = req.body;

    const newCase = createCase(title, description || '');
    
    if (sideAName) newCase.sideA.name = sideAName;
    if (sideBName) newCase.sideB.name = sideBName;

    cases.set(newCase.id, newCase);

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:caseId
 * Get case details
 */
router.get('/:caseId', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const caseData = cases.get(caseId);

    if (!caseData) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The specified case does not exist'
      });
    }

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cases/:caseId/argue
 * Submit an argument for a side
 */
router.post('/:caseId/argue', [
  body('side').isIn(['A', 'B']).withMessage('Side must be A or B'),
  body('text').notEmpty().withMessage('Argument text is required'),
  body('documentIds').optional().isArray()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { caseId } = req.params;
    const { side, text, documentIds = [] } = req.body;

    const caseData = cases.get(caseId);
    if (!caseData) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The specified case does not exist'
      });
    }

    // Check if case has reached max reevaluations
    if (caseData.reevaluationCount >= caseData.maxReevaluations) {
      return res.status(400).json({
        error: 'Max reevaluations reached',
        message: `This case has reached the maximum of ${caseData.maxReevaluations} reevaluations`
      });
    }

    const argument = {
      id: uuidv4(),
      text,
      documentIds,
      timestamp: new Date().toISOString(),
      round: caseData.reevaluationCount + 1
    };

    const sideKey = side === 'A' ? 'sideA' : 'sideB';
    caseData[sideKey].arguments.push(argument);

    res.json({
      success: true,
      message: 'Argument submitted successfully',
      data: {
        argument,
        remainingReevaluations: caseData.maxReevaluations - caseData.reevaluationCount
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cases/:caseId/verdict
 * Generate AI verdict for the case
 */
router.post('/:caseId/verdict', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const caseData = cases.get(caseId);

    if (!caseData) {
      return res.status(404).json({
        error: 'Case not found',
        message: 'The specified case does not exist'
      });
    }

    // Retrieve relevant context from vector DB
    const allArguments = [
      ...caseData.sideA.arguments.map(arg => arg.text),
      ...caseData.sideB.arguments.map(arg => arg.text)
    ].join('\n\n');

    let relevantContext = '';
    try {
      const contextResults = await vectordbService.queryRelevantDocuments(allArguments, 5);
      relevantContext = contextResults.map(doc => doc.text).join('\n\n');
    } catch (error) {
      console.warn('Vector DB query failed, proceeding without context:', error.message);
    }

    // Generate verdict using Gemini
    const verdictData = await geminiService.generateVerdict({
      caseTitle: caseData.title,
      caseDescription: caseData.description,
      sideA: caseData.sideA,
      sideB: caseData.sideB,
      context: relevantContext,
      round: caseData.reevaluationCount + 1
    });

    // Store verdict
    const verdict = {
      id: uuidv4(),
      ...verdictData,
      timestamp: new Date().toISOString(),
      round: caseData.reevaluationCount + 1
    };

    caseData.verdicts.push(verdict);
    caseData.reevaluationCount++;

    res.json({
      success: true,
      message: 'Verdict generated successfully',
      data: {
        verdict,
        remainingReevaluations: caseData.maxReevaluations - caseData.reevaluationCount,
        canReevaluate: caseData.reevaluationCount < caseData.maxReevaluations
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases
 * Get all cases
 */
router.get('/', async (req, res, next) => {
  try {
    const allCases = Array.from(cases.values()).map(c => ({
      id: c.id,
      title: c.title,
      status: c.status,
      createdAt: c.createdAt,
      reevaluationCount: c.reevaluationCount,
      latestVerdict: c.verdicts[c.verdicts.length - 1] || null
    }));

    res.json({
      success: true,
      data: allCases,
      count: allCases.length
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
