/**
 * API Usage Logging Service
 * Tracks all external API calls for monitoring and debugging
 */

import prisma from '../prisma.js';

/**
 * Log an API call to the database
 * @param {Object} logData - Data about the API call
 * @param {string} logData.endpoint - The API endpoint called
 * @param {string} logData.method - HTTP method used (GET, POST, etc.)
 * @param {Object} [logData.requestBody] - The request body sent to the API
 * @param {Object} [logData.responseBody] - The response received (may be truncated)
 * @param {number} [logData.statusCode] - HTTP status code received
 * @param {boolean} logData.success - Whether the call was successful
 * @param {string} [logData.errorMessage] - Error message if the call failed
 * @param {number} logData.duration - Time taken in milliseconds
 * @returns {Promise<Object>} - The created log entry
 */
export async function logAPICall(logData) {
  try {
    // Convert objects to strings for storage
    const formattedData = {
      ...logData,
      requestBody: logData.requestBody ? JSON.stringify(logData.requestBody) : null,
      // Limit response body size for storage efficiency
      responseBody: logData.responseBody 
        ? JSON.stringify(logData.responseBody).substring(0, 10000) 
        : null,
    };
    
    // Create log entry in database
    const logEntry = await prisma.aPIUsageLog.create({
      data: formattedData
    }).catch(error => {
      // Try API case if first attempt fails
      return prisma.aPIUSageLog.create({
        data: formattedData
      }).catch(innerError => {
        // Try another variant
        return prisma.apiUsageLog.create({
          data: formattedData
        });
      });
    });
    
    console.log(`API call to ${logData.endpoint} logged with ID: ${logEntry.id}`);
    return logEntry;
  } catch (error) {
    // Don't let logging failures impact the application
    console.error('Failed to log API call:', error);
    return null;
  }
}

/**
 * Get recent API usage logs
 * @param {number} limit - Maximum number of logs to return
 * @returns {Promise<Array>} - Array of log entries
 */
export async function getRecentAPILogs(limit = 50) {
  try {
    const logs = await prisma.aPIUsageLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return logs;
  } catch (error) {
    console.error('Failed to retrieve API logs:', error);
    return [];
  }
}

/**
 * Get API usage statistics
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} - Statistics about API usage
 */
export async function getAPIUsageStatistics(days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const logs = await prisma.aPIUsageLog.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });
    
    // Calculate statistics
    const totalCalls = logs.length;
    const successfulCalls = logs.filter(log => log.success).length;
    const failedCalls = totalCalls - successfulCalls;
    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
    
    // Group by endpoint
    const endpointCounts = {};
    logs.forEach(log => {
      endpointCounts[log.endpoint] = (endpointCounts[log.endpoint] || 0) + 1;
    });
    
    // Calculate average duration
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;
    
    return {
      totalCalls,
      successfulCalls,
      failedCalls,
      successRate,
      endpointCounts,
      averageDuration,
      periodDays: days
    };
  } catch (error) {
    console.error('Failed to calculate API usage statistics:', error);
    return {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      successRate: 0,
      endpointCounts: {},
      averageDuration: 0,
      periodDays: days,
      error: error.message
    };
  }
}