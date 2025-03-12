# AI Integration Setup Guide

## Overview

This document explains how to set up the secure AI integration for field categorization in the GTM application. Our implementation ensures that API keys are stored securely on the backend and never exposed in client-side code.

## Security Measures

1. **API Key Storage**: The AI API key is stored in environment variables on the server, not in client-side code
2. **Backend Proxy**: All AI API calls go through our secure backend which handles authentication
3. **Fallback Logic**: The system includes local fallback logic if the AI service is unavailable
4. **Error Handling**: Comprehensive error handling prevents service disruptions

## Environment Variables Setup

1. Create or modify your `.env` file in the project root with the following variables:

```
# AI Service Configuration
AI_API_KEY="your-actual-api-key-here"
AI_API_ENDPOINT="https://api.youraiprovider.com/v1/analyze"
```

2. Never commit the `.env` file to your repository. It should already be in your `.gitignore` file.

## Local Development Setup

1. Copy the `.env.example` file to a new `.env` file
2. Add your actual API key to the `AI_API_KEY` variable
3. Update the `AI_API_ENDPOINT` to point to your AI provider's API endpoint

## Production Deployment

For production environments:

1. Set environment variables securely through your hosting platform's dashboard or configuration system (e.g., environment settings in Vercel, Netlify, or Heroku)
2. Ensure environment variables are encrypted at rest
3. Consider using a secrets management service for enterprise deployments

## Testing the Integration

1. Start the backend server: `cd backend && npm start`
2. Start the frontend development server: `npm run dev`
3. Navigate to the Data Mapping screen and upload a data file
4. The system should automatically generate AI-powered category suggestions
5. If the AI service is unavailable, the system will fall back to local analysis

## Troubleshooting

If AI suggestions aren't working:

1. Check server logs for API-related errors
2. Verify your API key is correctly set in the `.env` file
3. Ensure the backend server is running and accessible from the frontend
4. Check network requests in the browser console for errors

## Additional Security Considerations

- Rotate API keys periodically
- Consider implementing rate limiting on your backend endpoints
- Monitor API usage to detect unusual patterns
- Use the principle of least privilege when setting up API key permissions

## Support

For issues with the AI integration, contact your system administrator or the development team.