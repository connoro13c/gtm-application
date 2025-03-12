/**
 * Insights routes for the GTM Application
 * Handles all predictive insights-related API endpoints
 */

import express from 'express';
import prisma from '../prisma.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/insights/dashboard
 * @desc Get dashboard insights
 * @access Private
 */
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    // Get total accounts
    const totalAccounts = await prisma.account.count();
    
    // Get accounts by segment
    const segmentDistribution = await prisma.segment.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: { accounts: true }
        }
      }
    });
    
    // Get accounts by territory
    const territoryDistribution = await prisma.territory.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { accounts: true }
        }
      }
    });
    
    // Get recent account scores
    const recentScores = await prisma.accountScore.findMany({
      take: 10,
      orderBy: {
        date: 'desc'
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            industry: true
          }
        }
      }
    });
    
    // Get score trends over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const scoreTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "date") as month,
        AVG("score") as average_score,
        COUNT(*) as count
      FROM "AccountScore"
      WHERE "date" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "date")
      ORDER BY month ASC
    `;
    
    // Get top performing accounts
    const topAccounts = await prisma.account.findMany({
      take: 5,
      include: {
        scores: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        },
        segment: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        scores: {
          score: 'desc'
        }
      }
    });
    
    res.json({
      totalAccounts,
      segmentDistribution: segmentDistribution.map(segment => ({
        id: segment.id,
        name: segment.name,
        color: segment.color,
        count: segment._count.accounts,
        percentage: totalAccounts > 0 ? (segment._count.accounts / totalAccounts) * 100 : 0
      })),
      territoryDistribution: territoryDistribution.map(territory => ({
        id: territory.id,
        name: territory.name,
        count: territory._count.accounts,
        percentage: totalAccounts > 0 ? (territory._count.accounts / totalAccounts) * 100 : 0
      })),
      recentScores,
      scoreTrends,
      topAccounts
    });
  } catch (error) {
    console.error('Error fetching dashboard insights:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard insights' });
  }
});

/**
 * @route GET /api/insights/predictions/:accountId
 * @desc Get predictive insights for a specific account
 * @access Private
 */
router.get('/predictions/:accountId', authenticateJWT, async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Get account data
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        scores: {
          orderBy: {
            date: 'desc'
          },
          take: 12
        },
        segment: true,
        territory: true
      }
    });
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // TODO: Implement actual ML prediction logic
    // This is a placeholder for the ML model integration
    
    // Generate mock predictions based on account data
    const currentDate = new Date();
    const predictions = [];
    
    // Use existing score trend to project future scores
    const scoreHistory = account.scores.reverse(); // Oldest first
    
    // If we have score history, use it to predict future trend
    let baseScore = 50; // Default starting point
    let trend = 0.05; // Default upward trend
    
    if (scoreHistory.length > 0) {
      baseScore = scoreHistory[scoreHistory.length - 1].score;
      
      if (scoreHistory.length > 1) {
        // Calculate average trend from history
        let totalChange = 0;
        for (let i = 1; i < scoreHistory.length; i++) {
          totalChange += scoreHistory[i].score - scoreHistory[i-1].score;
        }
        trend = totalChange / (scoreHistory.length - 1) / 100; // Normalize trend
      }
    }
    
    // Generate 6 months of predictions
    for (let i = 1; i <= 6; i++) {
      const predictionDate = new Date(currentDate);
      predictionDate.setMonth(currentDate.getMonth() + i);
      
      // Add some randomness to the trend
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const adjustedTrend = trend * randomFactor;
      
      // Calculate predicted score
      baseScore = Math.min(100, Math.max(0, baseScore + (baseScore * adjustedTrend)));
      
      predictions.push({
        date: predictionDate,
        predictedScore: Math.round(baseScore * 10) / 10,
        confidence: 0.9 - (i * 0.1) // Confidence decreases over time
      });
    }
    
    // Generate opportunity insights
    const opportunities = [
      {
        type: 'expansion',
        probability: 0.75,
        estimatedValue: account.revenue ? account.revenue * 0.2 : 50000,
        timeframe: '3 months',
        actions: [
          'Schedule executive briefing',
          'Present case study from similar customer',
          'Offer product demo of new features'
        ]
      },
      {
        type: 'renewal',
        probability: 0.85,
        estimatedValue: account.revenue ? account.revenue * 0.8 : 200000,
        timeframe: '6 months',
        actions: [
          'Begin renewal discussions early',
          'Highlight ROI from current implementation',
          'Introduce customer success manager'
        ]
      }
    ];
    
    // Generate risk insights
    const risks = [
      {
        type: 'competitive threat',
        probability: 0.4,
        impact: 'high',
        indicators: [
          'Decreased product usage in last quarter',
          'New CTO hired from competitor',
          'Delayed response to renewal discussions'
        ]
      }
    ];
    
    res.json({
      accountId,
      predictions,
      opportunities,
      risks,
      recommendedActions: [
        'Schedule quarterly business review',
        'Introduce new analytics capabilities',
        'Connect with executive sponsor',
        'Conduct health check survey'
      ]
    });
  } catch (error) {
    console.error('Error generating account predictions:', error);
    res.status(500).json({ error: 'Failed to generate account predictions' });
  }
});

/**
 * @route GET /api/insights/territory-analysis
 * @desc Get territory analysis insights
 * @access Private
 */
router.get('/territory-analysis', authenticateJWT, async (req, res) => {
  try {
    // Get territories with account counts
    const territories = await prisma.territory.findMany({
      include: {
        accounts: {
          select: {
            id: true,
            revenue: true,
            scores: {
              orderBy: {
                date: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });
    
    // Process territory data for analysis
    const territoryAnalysis = territories.map(territory => {
      // Calculate total revenue
      const totalRevenue = territory.accounts.reduce((sum, account) => {
        return sum + (account.revenue || 0);
      }, 0);
      
      // Calculate average score
      let totalScore = 0;
      let accountsWithScores = 0;
      
      for (const account of territory.accounts) {
        if (account.scores && account.scores.length > 0) {
          totalScore += account.scores[0].score;
          accountsWithScores++;
        }
      }
      
      const averageScore = accountsWithScores > 0 ? totalScore / accountsWithScores : 0;
      
      // Calculate opportunity distribution
      const highValueAccounts = territory.accounts.filter(a => (a.revenue || 0) > 500000).length;
      const midValueAccounts = territory.accounts.filter(a => (a.revenue || 0) <= 500000 && (a.revenue || 0) > 100000).length;
      const lowValueAccounts = territory.accounts.filter(a => (a.revenue || 0) <= 100000).length;
      
      return {
        id: territory.id,
        name: territory.name,
        accountCount: territory.accounts.length,
        totalRevenue,
        averageScore,
        opportunityDistribution: {
          highValue: highValueAccounts,
          midValue: midValueAccounts,
          lowValue: lowValueAccounts
        },
        // Mock growth potential based on account count and average score
        growthPotential: Math.min(1, (territory.accounts.length * averageScore) / 10000),
        // Mock resource allocation recommendation
        recommendedResourceAllocation: {
          sales: Math.round((territory.accounts.length * 0.1) + (totalRevenue / 1000000)),
          marketing: Math.round(totalRevenue / 500000),
          customerSuccess: Math.round(territory.accounts.length * 0.05)
        }
      };
    });
    
    res.json({
      territoryAnalysis,
      overallInsights: {
        topPerformingTerritory: territoryAnalysis.length > 0 ? 
          territoryAnalysis.reduce((prev, current) => 
            (prev.averageScore > current.averageScore) ? prev : current
          ).name : null,
        underperformingTerritories: territoryAnalysis
          .filter(t => t.averageScore < 50)
          .map(t => t.name),
        highestGrowthPotential: territoryAnalysis.length > 0 ?
          territoryAnalysis.reduce((prev, current) => 
            (prev.growthPotential > current.growthPotential) ? prev : current
          ).name : null
      }
    });
  } catch (error) {
    console.error('Error generating territory analysis:', error);
    res.status(500).json({ error: 'Failed to generate territory analysis' });
  }
});

export default router;
