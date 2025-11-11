/**
 * Upload Routes
 * Handles file upload, parsing, and indexing endpoints
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

// Import services
const parserService = require('../services/parser');
const vectordbService = require('../services/vectordb');

// ============================================================================
// Multer Configuration
// ============================================================================

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed. Only PDF and DOCX files are accepted.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/upload
 * Upload a document (PDF or DOCX)
 */
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please provide a file to upload'
      });
    }

    const { caseId, side } = req.body;

    if (!caseId || !side) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'caseId and side are required'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        path: req.file.path,
        caseId,
        side
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/upload/parse
 * Parse an uploaded document and extract text
 */
router.post('/parse', [
  body('fileId').notEmpty().withMessage('fileId is required'),
  body('filePath').notEmpty().withMessage('filePath is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { fileId, filePath } = req.body;
    const ext = path.extname(filePath).toLowerCase();

    let parsedText;
    if (ext === '.pdf') {
      parsedText = await parserService.parsePDF(filePath);
    } else if (ext === '.docx') {
      parsedText = await parserService.parseDOCX(filePath);
    } else {
      return res.status(400).json({
        error: 'Unsupported file type',
        message: 'Only PDF and DOCX files can be parsed'
      });
    }

    res.json({
      success: true,
      message: 'Document parsed successfully',
      data: {
        fileId,
        text: parsedText,
        length: parsedText.length,
        wordCount: parsedText.split(/\s+/).length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/upload/index
 * Index parsed document text in vector database
 */
router.post('/index', [
  body('text').notEmpty().withMessage('text is required'),
  body('metadata').isObject().withMessage('metadata must be an object')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { text, metadata } = req.body;

    // Index in vector database
    const result = await vectordbService.indexDocument(text, metadata);

    res.json({
      success: true,
      message: 'Document indexed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/upload/:fileId
 * Delete an uploaded file
 */
router.delete('/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(__dirname, '../../uploads', fileId);

    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: { fileId }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }
    next(error);
  }
});

module.exports = router;
