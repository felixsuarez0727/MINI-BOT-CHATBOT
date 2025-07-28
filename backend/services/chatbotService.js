const { db } = require('../setup/database');
const sanitizeHtml = require('sanitize-html');

class ChatbotService {
  constructor() {
    this.confidenceThreshold = 0.6;
    this.maxResponseTime = 5000;
  }

  // Sanitize user input
  sanitizeInput(input) {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();
  }

  // Calculate similarity between two strings using Levenshtein distance
  calculateSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) return len2;
    if (len2 === 0) return len1;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  }

  // Check if user input matches any pattern
  matchPattern(userInput, patterns) {
    const patternList = patterns.split(',').map(p => p.trim().toLowerCase());
    const inputWords = userInput.toLowerCase().split(/\s+/);
    
    let bestMatch = 0;
    
    for (const pattern of patternList) {
      const patternWords = pattern.split(/\s+/);
      
      // Check exact pattern match
      if (patternWords.length === 1) {
        // Single word pattern
        if (inputWords.includes(patternWords[0])) {
          bestMatch = Math.max(bestMatch, 0.9);
        }
      } else {
        // Multi-word pattern
        let matchCount = 0;
        for (const word of patternWords) {
          if (inputWords.includes(word)) {
            matchCount++;
          }
        }
        const matchRatio = matchCount / patternWords.length;
        bestMatch = Math.max(bestMatch, matchRatio);
      }
      
      // Check similarity for close matches
      const similarity = this.calculateSimilarity(userInput.toLowerCase(), pattern);
      bestMatch = Math.max(bestMatch, similarity);
    }
    
    return bestMatch;
  }

  // Get bot configuration
  async getBotConfig() {
    return new Promise((resolve, reject) => {
      db.all('SELECT key, value FROM bot_config', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const config = {};
          rows.forEach(row => {
            config[row.key] = row.value;
          });
          resolve(config);
        }
      });
    });
  }

  // Get all active queries
  async getQueries() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chatbot_queries WHERE is_active = 1 ORDER BY priority DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Find best matching response
  async findBestResponse(userInput) {
    const startTime = Date.now();
    
    try {
      const queries = await this.getQueries();
      let bestMatch = null;
      let bestScore = 0;

      for (const query of queries) {
        const score = this.matchPattern(userInput, query.patterns);
        
        if (score > bestScore && score >= this.confidenceThreshold) {
          bestScore = score;
          bestMatch = {
            ...query,
            confidence: score
          };
        }
      }

      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        response: bestMatch ? bestMatch.response : null,
        intent: bestMatch ? bestMatch.intent : null,
        confidence: bestMatch ? bestMatch.confidence : 0,
        responseTime,
        fallback: !bestMatch
      };
    } catch (error) {
      return {
        success: false,
        error: 'Internal server error',
        responseTime: Date.now() - startTime
      };
    }
  }

      // Generate fallback response
    generateFallbackResponse(userInput) {
      const fallbackResponses = [
        'Sorry, I don\'t completely understand your query. Could you rephrase it differently?',
        'I\'m not sure what you need. Are you referring to our services, business hours, or contact information?',
        'Sorry, I don\'t have specific information about that. Would you like to know about our services, location, or how to contact us?',
        'I don\'t understand your question. Can you be more specific? For example, you can ask about our services, hours, or location.',
        'Your query is not within my current capabilities. Are you interested in learning about our services, business hours, or contact information?'
      ];

          // Add suggested queries
      const suggestions = [
        'What services do you offer?',
        'What are your business hours?',
        'How can I contact you?',
        'Where are you located?',
        'What is Xumtech?'
      ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      response: randomResponse,
      suggestions,
      intent: 'fallback',
      confidence: 0
    };
  }

  // Log conversation
  async logConversation(sessionId, userMessage, botResponse, intent, confidence, responseTime) {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO conversation_logs 
        (session_id, user_message, bot_response, intent_matched, confidence_score, response_time_ms)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [sessionId, userMessage, botResponse, intent, confidence, responseTime], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Process user message
  async processMessage(userInput, sessionId = null) {
    const startTime = Date.now();
    
    // Sanitize input
    const sanitizedInput = this.sanitizeInput(userInput);
    
    if (!sanitizedInput) {
      return {
        success: false,
        response: 'Please enter a valid message.',
        responseTime: Date.now() - startTime
      };
    }

    try {
      // Find best response
      const result = await this.findBestResponse(sanitizedInput);
      
      let finalResponse;
      let intent = result.intent;
      let confidence = result.confidence;
      let suggestions = [];

      if (result.fallback) {
        // Generate fallback response
        const fallback = this.generateFallbackResponse(sanitizedInput);
        finalResponse = fallback.response;
        suggestions = fallback.suggestions;
        intent = fallback.intent;
        confidence = fallback.confidence;
      } else {
        finalResponse = result.response;
      }

      const responseTime = Date.now() - startTime;

      // Log conversation if session ID is provided
      if (sessionId) {
        try {
          await this.logConversation(sessionId, sanitizedInput, finalResponse, intent, confidence, responseTime);
        } catch (error) {
          // Error logging conversation
        }
      }

      return {
        success: true,
        response: finalResponse,
        intent,
        confidence,
        responseTime,
        suggestions,
        fallback: result.fallback
      };

    } catch (error) {
      return {
        success: false,
        response: 'Sorry, I\'m experiencing technical issues. Please try again.',
        responseTime: Date.now() - startTime
      };
    }
  }

  // Get conversation statistics
  async getStats() {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_conversations,
          AVG(response_time_ms) as avg_response_time,
          AVG(confidence_score) as avg_confidence
        FROM conversation_logs
      `, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  }

  // Get recent conversations
  async getRecentConversations(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM conversation_logs 
        ORDER BY created_at DESC 
        LIMIT ?
      `, [limit], (err, conversations) => {
        if (err) {
          reject(err);
        } else {
          resolve(conversations);
        }
      });
    });
  }
}

module.exports = new ChatbotService(); 