/**
 * AI Service for generating intelligent field categorization suggestions
 * Securely handles API calls to AI provider
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { logAPICall } from './logService.js';

dotenv.config();

// Get API key from environment variables - NEVER hardcode this
const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_ENDPOINT = process.env.AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

/**
 * Parse the AI response into a structured format that our application can use
 * @param {string} aiResponse - The text response from the AI
 * @param {Array} fieldData - The original field data sent to the AI
 * @returns {Object} - Mapping of field IDs to category suggestions
 */
function parseAIResponse(aiResponse, fieldData) {
  const suggestions = {};
  const validCategories = ['identification', 'firmographic', 'engagement', 'health', 'product', 'marketing', 'other'];
  
  try {
    // First try to parse as JSON if the AI returned JSON format
    if (aiResponse.includes('{') && aiResponse.includes('}')) {
      // Extract JSON-like content if embedded in text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        
        // If we got a properly structured object mapping field IDs to categories
        for (const [fieldId, category] of Object.entries(parsedData)) {
          if (validCategories.includes(category.toLowerCase())) {
            suggestions[fieldId] = category.toLowerCase();
          }
        }
        
        if (Object.keys(suggestions).length > 0) {
          return suggestions;
        }
      }
    }
    
    // If JSON parsing didn't work, try line-by-line text parsing
    const lines = aiResponse.split('\n');
    
    // Look for patterns like "fieldname: category" or "fieldId - category"
    for (const field of fieldData) {
      const fieldId = field.id;
      const fieldName = field.name.toLowerCase();
      
      // Look for this field in the AI response
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes(fieldName) || lowerLine.includes(fieldId)) {
          // Find which category is mentioned in this line
          for (const category of validCategories) {
            if (lowerLine.includes(category)) {
              suggestions[fieldId] = category;
              break;
            }
          }
        }
      }
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {}; // Return empty object if parsing fails
  }
}

/**
 * Generate category suggestions for data fields
 * @param {Array} fields - Array of field objects containing name, dataType, example values
 * @returns {Object} - Object mapping field IDs to suggested categories
 */
export async function generateFieldCategorySuggestions(fields) {
  if (!AI_API_KEY) {
    console.warn('AI_API_KEY not found in environment variables. Using fallback local analysis.');
    return generateLocalSuggestions(fields);
  }

  try {
    // Prepare the data for the AI API
    const fieldData = fields.map(field => ({
      id: field.id,
      name: field.name || field.sourceHeader || '',
      dataType: field.dataType || 'string',
      example: field.example || '',
      description: field.description || ''
    }));

    // Log the request details (without the actual API key)
    console.log('Making OpenAI API request to:', AI_API_ENDPOINT);
    console.log('Request data:', JSON.stringify(fieldData, null, 2));
    
    // For OpenAI, we need to format the request properly
    const openAIRequest = {
      model: 'gpt-4o-mini', // Using GPT-4o-mini for cost efficiency
      messages: [
        {
          role: 'system',
          content: 'You are a data classification expert. Classify each field into one of these categories: identification, firmographic, engagement, health, product, marketing, or other.'
        },
        {
          role: 'user',
          content: `Classify these data fields into appropriate categories. Return your answer as a JSON object mapping field id to category name. The fields are: ${JSON.stringify(fieldData)}`
        }
      ]
    };
    
    // Make secure API call with API key in headers, not in the URL or body
    console.log('Sending request to OpenAI...');
    
    const startTime = Date.now();
    let response;
    let success = false;
    let errorMessage = null;
    let apiErrorDetails = null;
    
    try {
      response = await axios.post(
        'https://api.openai.com/v1/chat/completions', // Using the chat completions endpoint
        openAIRequest,
        {
          headers: {
            'Authorization': `Bearer ${AI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 120 second timeout (2 minutes)
        }
      );
      
      success = true;
      
      // Log the response (without sensitive information)
      console.log('Response received from OpenAI');
      console.log('Response status:', response.status);
      console.log('Response data structure:', Object.keys(response.data).join(', '));
    } catch (error) {
      errorMessage = error.message;
      if (error.response) {
        console.error('API error status:', error.response.status);
        console.error('API error data:', error.response.data);
        apiErrorDetails = {
          status: error.response.status,
          data: error.response.data
        };
      } else {
        console.error('API error:', error.message);
      }
      throw error; // Re-throw to be caught by the outer try/catch
    } finally {
      const duration = Date.now() - startTime;
      
      try {
        // Log the API call regardless of success or failure
        await logAPICall({
          endpoint: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          requestBody: { 
            model: openAIRequest.model, 
            messageCount: openAIRequest.messages.length 
          }, // Avoid logging the full messages content
          responseBody: success ? { 
            model: response.data.model,
            usage: response.data.usage,
            choices_count: response.data.choices?.length
          } : apiErrorDetails,
          statusCode: success ? response.status : (apiErrorDetails?.status || 0),
          success,
          errorMessage,
          duration
        });
      } catch (logError) {
        console.error('Error logging API call:', logError.message);
      }
    }

    // Process and validate the response from OpenAI API
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      // Extract the assistant's message content
      const aiSuggestion = response.data.choices[0].message.content;
      console.log('AI response content:', aiSuggestion);
      
      // Parse the response into field category suggestions
      const suggestions = {};
      
      try {
        // Attempt to parse the AI-provided categorization
        // This assumes the AI returns something we can parse (might need adjustment)
        const fieldCategories = parseAIResponse(aiSuggestion, fieldData);
        Object.assign(suggestions, fieldCategories);
        
        console.log('Successfully extracted suggestions from AI response');
        return suggestions;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Falling back to local suggestions');
        return generateLocalSuggestions(fields);
      }
    } else {
      console.error('Invalid response format from OpenAI API:', response.data);
      return generateLocalSuggestions(fields);
    }
  } catch (error) {
    console.error('Error calling AI API for field categorization:', error.message);
    if (error.response) {
      console.error('API response error data:', error.response.data);
      console.error('API response error status:', error.response.status);
    }
    // Fallback to local analysis if API call fails
    return generateLocalSuggestions(fields);
  }
}

/**
 * Local fallback function for generating category suggestions based on field names and types
 * Used when API key is missing or API call fails
 * @param {Array} fields - Array of field objects
 * @returns {Object} - Object mapping field IDs to suggested categories
 */
function generateLocalSuggestions(fields) {
  const suggestions = {};
  
  fields.forEach(field => {
    const fieldName = (field.name || field.sourceHeader || '').toLowerCase();
    const fieldId = field.id;
    const dataType = field.dataType || '';
    
    // Identification fields
    if (fieldName.includes('id') || fieldName.includes('identifier') || fieldName.includes('key') || 
        fieldName.includes('name') || fieldName.includes('company') || fieldName.includes('account')) {
      suggestions[fieldId] = 'identification';
    }
    // Firmographic fields
    else if (fieldName.includes('industry') || fieldName.includes('revenue') || fieldName.includes('employee') || 
             fieldName.includes('size') || fieldName.includes('country') || fieldName.includes('region') || 
             fieldName.includes('sector') || fieldName.includes('founded') || fieldName.includes('created')) {
      suggestions[fieldId] = 'firmographic';
    }
    // Engagement fields
    else if (fieldName.includes('engage') || fieldName.includes('visit') || fieldName.includes('click') || 
             fieldName.includes('open') || fieldName.includes('conversion') || fieldName.includes('activity')) {
      suggestions[fieldId] = 'engagement';
    }
    // Health fields
    else if (fieldName.includes('health') || fieldName.includes('score') || fieldName.includes('nps') || 
             fieldName.includes('satisfaction') || fieldName.includes('ticket') || fieldName.includes('support')) {
      suggestions[fieldId] = 'health';
    }
    // Product usage fields
    else if (fieldName.includes('usage') || fieldName.includes('login') || fieldName.includes('user') || 
             fieldName.includes('active') || fieldName.includes('session') || fieldName.includes('feature')) {
      suggestions[fieldId] = 'product';
    }
    // Marketing fields
    else if (fieldName.includes('campaign') || fieldName.includes('marketing') || fieldName.includes('event') || 
             fieldName.includes('webinar') || fieldName.includes('download') || fieldName.includes('lead')) {
      suggestions[fieldId] = 'marketing';
    }
    // Use data type as a fallback
    else if (dataType === 'date') {
      suggestions[fieldId] = 'firmographic';
    } else if (dataType === 'number' && (fieldName.includes('count') || fieldName.includes('total'))) {
      suggestions[fieldId] = 'engagement';
    } else {
      suggestions[fieldId] = 'other';
    }
  });
  
  return suggestions;
}