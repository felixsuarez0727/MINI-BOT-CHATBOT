const express = require('express');
const { body, validationResult } = require('express-validator');
const chatbotService = require('../services/chatbotService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
    .escape(),
  body('sessionId')
    .optional()
    .isUUID(4)
    .withMessage('Session ID must be a valid UUID')
];

// Process user message
router.post('/message', validateMessage, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { message, sessionId } = req.body;
    
    // Process message
    const result = await chatbotService.processMessage(message, sessionId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    // Check response time
    if (result.responseTime > 5000) {
      // Response time exceeded 5 seconds
    }

    res.json({
      success: true,
      data: {
        response: result.response,
        intent: result.intent,
        confidence: result.confidence,
        responseTime: result.responseTime,
        suggestions: result.suggestions,
        fallback: result.fallback
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Could not process your message'
    });
  }
});

// Get bot configuration
router.get('/config', async (req, res) => {
  try {
    const config = await chatbotService.getBotConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get available queries (admin only)
router.get('/queries', authenticateToken, async (req, res) => {
  try {
    const queries = await chatbotService.getQueries();
    res.json({
      success: true,
      data: queries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get conversation statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await chatbotService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get recent conversations (admin only)
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const conversations = await chatbotService.getRecentConversations(limit);
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check for chatbot service
router.get('/health', async (req, res) => {
  try {
    const config = await chatbotService.getBotConfig();
    const queries = await chatbotService.getQueries();
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        configLoaded: !!config,
        queriesCount: queries.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Service unavailable',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router; 