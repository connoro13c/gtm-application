/**
 * Prisma seed script for GTM Application
 * Populates the database with initial test data
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.$transaction([
    prisma.scenarioResult.deleteMany(),
    prisma.scenarioParameter.deleteMany(),
    prisma.scenario.deleteMany(),
    prisma.accountScore.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.account.deleteMany(),
    prisma.segment.deleteMany(),
    prisma.territory.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('Cleared existing data');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In production, use proper password hashing
      role: 'ADMIN',
    },
  });

  console.log('Created admin user');

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123', // In production, use proper password hashing
      role: 'USER',
    },
  });

  console.log('Created regular user');

  // Create segments
  const segments = await Promise.all([
    prisma.segment.create({
      data: {
        name: 'Enterprise',
        description: 'Large enterprise accounts with 1000+ employees',
        criteria: { employees: { gte: 1000 } },
        color: '#36B37E',
      },
    }),
    prisma.segment.create({
      data: {
        name: 'Mid-Market',
        description: 'Mid-sized businesses with 100-999 employees',
        criteria: { employees: { gte: 100, lt: 1000 } },
        color: '#FFAB00',
      },
    }),
    prisma.segment.create({
      data: {
        name: 'SMB',
        description: 'Small businesses with <100 employees',
        criteria: { employees: { lt: 100 } },
        color: '#FF5630',
      },
    }),
  ]);

  console.log('Created segments');

  // Create territories
  const territories = await Promise.all([
    prisma.territory.create({
      data: {
        name: 'North America',
        region: 'Americas',
        description: 'United States and Canada',
      },
    }),
    prisma.territory.create({
      data: {
        name: 'EMEA',
        region: 'Europe/Middle East',
        description: 'Europe, Middle East, and Africa',
      },
    }),
    prisma.territory.create({
      data: {
        name: 'APAC',
        region: 'Asia Pacific',
        description: 'Asia Pacific region',
      },
    }),
  ]);

  console.log('Created territories');

  // Sample company data
  const companies = [
    {
      name: 'Acme Corporation',
      industry: 'Technology',
      revenue: 5000000,
      employees: 500,
      website: 'https://www.acme.example.com',
      description: 'Leading technology provider',
      segmentId: segments[1].id, // Mid-Market
      territoryId: territories[0].id, // North America
    },
    {
      name: 'Global Enterprises',
      industry: 'Manufacturing',
      revenue: 50000000,
      employees: 2500,
      website: 'https://www.globalent.example.com',
      description: 'Global manufacturing leader',
      segmentId: segments[0].id, // Enterprise
      territoryId: territories[1].id, // EMEA
    },
    {
      name: 'Local Shop',
      industry: 'Retail',
      revenue: 500000,
      employees: 25,
      website: 'https://www.localshop.example.com',
      description: 'Local retail business',
      segmentId: segments[2].id, // SMB
      territoryId: territories[0].id, // North America
    },
    {
      name: 'Tech Innovators',
      industry: 'Technology',
      revenue: 2000000,
      employees: 150,
      website: 'https://www.techinnovators.example.com',
      description: 'Innovative tech startup',
      segmentId: segments[1].id, // Mid-Market
      territoryId: territories[2].id, // APAC
    },
    {
      name: 'Mega Corp',
      industry: 'Financial Services',
      revenue: 100000000,
      employees: 5000,
      website: 'https://www.megacorp.example.com',
      description: 'Global financial services provider',
      segmentId: segments[0].id, // Enterprise
      territoryId: territories[0].id, // North America
    },
  ];

  // Create accounts with contacts and scores
  for (const company of companies) {
    const account = await prisma.account.create({
      data: {
        name: company.name,
        industry: company.industry,
        revenue: company.revenue,
        employees: company.employees,
        website: company.website,
        description: company.description,
        segmentId: company.segmentId,
        territoryId: company.territoryId,
      },
    });

    // Add 2-3 contacts per account
    const contactCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < contactCount; i++) {
      await prisma.contact.create({
        data: {
          firstName: `Contact${i + 1}`,
          lastName: `${account.name.split(' ')[0]}`,
          email: `contact${i + 1}@${account.name.toLowerCase().replace(/\s+/g, '')}.example.com`,
          phone: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
          title: i === 0 ? 'CEO' : i === 1 ? 'CTO' : 'Manager',
          isDecisionMaker: i < 2, // First two contacts are decision makers
          accountId: account.id,
        },
      });
    }

    // Add 6-12 months of account scores
    const scoreCount = 6 + Math.floor(Math.random() * 7);
    const baseScore = 30 + Math.floor(Math.random() * 40);
    const scoreVariance = 5;
    const scoreIncrement = (100 - baseScore) / scoreCount / 2;

    for (let i = 0; i < scoreCount; i++) {
      const scoreDate = new Date();
      scoreDate.setMonth(scoreDate.getMonth() - (scoreCount - i));
      
      const randomVariance = Math.random() * scoreVariance * 2 - scoreVariance;
      const calculatedScore = Math.min(100, Math.max(1, baseScore + (i * scoreIncrement) + randomVariance));
      
      await prisma.accountScore.create({
        data: {
          accountId: account.id,
          score: calculatedScore,
          date: scoreDate,
          notes: `Monthly account review for ${scoreDate.toLocaleString('default', { month: 'long' })}`,
        },
      });
    }
  }

  console.log('Created accounts with contacts and scores');

  // Create scenarios
  const scenario1 = await prisma.scenario.create({
    data: {
      name: 'Q1 2025 Enterprise Expansion',
      description: 'Targeting enterprise accounts for expansion in Q1 2025',
      status: 'ACTIVE',
      createdById: adminUser.id,
      parameters: {
        create: [
          {
            name: 'targetSegment',
            value: { segmentId: segments[0].id, name: 'Enterprise' },
            description: 'Target segment for the scenario',
          },
          {
            name: 'timeframe',
            value: { months: 3, startDate: '2025-01-01' },
            description: 'Timeframe for the scenario',
          },
          {
            name: 'budget',
            value: { amount: 500000, currency: 'USD' },
            description: 'Available budget for the campaign',
          },
        ],
      },
    },
  });

  // Add scenario result
  await prisma.scenarioResult.create({
    data: {
      scenarioId: scenario1.id,
      runById: adminUser.id,
      results: {
        totalAccounts: 250,
        predictedRevenue: 7500000,
        conversionRate: 0.15,
        timeframe: '3 months',
        segments: [
          { name: 'Enterprise', count: 250, revenue: 7500000 },
        ],
        timestamp: new Date().toISOString(),
      },
    },
  });

  const scenario2 = await prisma.scenario.create({
    data: {
      name: 'Mid-Market Expansion Strategy',
      description: 'Strategy for expanding into mid-market segment',
      status: 'DRAFT',
      createdById: regularUser.id,
      parameters: {
        create: [
          {
            name: 'targetSegment',
            value: { segmentId: segments[1].id, name: 'Mid-Market' },
            description: 'Target segment for the scenario',
          },
          {
            name: 'timeframe',
            value: { months: 6, startDate: '2025-01-01' },
            description: 'Timeframe for the scenario',
          },
          {
            name: 'budget',
            value: { amount: 250000, currency: 'USD' },
            description: 'Available budget for the campaign',
          },
        ],
      },
    },
  });

  console.log('Created scenarios with parameters and results');

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
