/**
 * Gemini API Service
 * Handles interactions with Google's Gemini LLM API
 */

const axios = require('axios');

// ============================================================================
// Configuration
// ============================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL || 
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// ============================================================================
// API Client
// ============================================================================

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The generated response
 */
async function callGemini(prompt, options = {}) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxOutputTokens || 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]) {
      const content = response.data.candidates[0].content;
      if (content && content.parts && content.parts[0]) {
        return content.parts[0].text;
      }
    }

    throw new Error('Unexpected response format from Gemini API');
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(`Gemini API call failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

// ============================================================================
// Verdict Generation
// ============================================================================

/**
 * Generate a verdict for a case
 * @param {Object} caseData - The case data
 * @returns {Promise<Object>} - Verdict with decision, reasoning, and confidence
 */
async function generateVerdict(caseData) {
  const { caseTitle, caseDescription, sideA, sideB, context, round } = caseData;

  // Build the prompt
  const prompt = `
You are an impartial AI judge tasked with evaluating a dispute and providing a fair verdict.

CASE INFORMATION:
Title: ${caseTitle}
Description: ${caseDescription}
Round: ${round}

SIDE A (${sideA.name}):
Arguments:
${sideA.arguments.map((arg, i) => `${i + 1}. ${arg.text}`).join('\n')}

SIDE B (${sideB.name}):
Arguments:
${sideB.arguments.map((arg, i) => `${i + 1}. ${arg.text}`).join('\n')}

${context ? `RELEVANT CONTEXT FROM DOCUMENTS:\n${context}\n` : ''}

INSTRUCTIONS:
1. Carefully analyze the arguments from both sides
2. Consider the evidence and reasoning presented
3. Provide a fair and impartial verdict
4. Assign a confidence score (0-100) to your decision
5. Explain your reasoning clearly

Please respond in the following JSON format:
{
  "decision": "Side A" or "Side B" or "Neutral",
  "confidence": <number between 0 and 100>,
  "reasoning": "<detailed explanation of your decision>",
  "keyPoints": [
    "<important point 1>",
    "<important point 2>",
    "<important point 3>"
  ],
  "suggestions": "<suggestions for further arguments or clarifications if needed>"
}

Provide only the JSON response, no additional text.
`;

  try {
    const response = await callGemini(prompt, {
      temperature: 0.5, // Lower temperature for more consistent reasoning
      maxOutputTokens: 2048
    });

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const verdictData = JSON.parse(jsonMatch[0]);

    // Validate verdict structure
    if (!verdictData.decision || typeof verdictData.confidence !== 'number') {
      throw new Error('Invalid verdict format from Gemini');
    }

    return verdictData;
  } catch (error) {
    console.error('Verdict generation error:', error);
    
    // Fallback verdict if Gemini fails
    return {
      decision: 'Neutral',
      confidence: 0,
      reasoning: 'Unable to generate verdict due to technical error. Please try again.',
      keyPoints: ['Technical error occurred', 'Unable to analyze arguments'],
      suggestions: 'Please resubmit the case for evaluation.',
      error: error.message
    };
  }
}

// ============================================================================
// Summarization
// ============================================================================

/**
 * Summarize a long text
 * @param {string} text - Text to summarize
 * @param {number} maxLength - Maximum summary length
 * @returns {Promise<string>} - Summary
 */
async function summarizeText(text, maxLength = 500) {
  const prompt = `
Please provide a concise summary of the following text in no more than ${maxLength} characters:

${text}

Summary:
`;

  const response = await callGemini(prompt, {
    temperature: 0.3,
    maxOutputTokens: Math.ceil(maxLength / 2)
  });

  return response.trim();
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  callGemini,
  generateVerdict,
  summarizeText
};
