import Papa from 'papaparse';

export const loadAccountData = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const accounts = results.data;
          
          // Get field information from the first row
          const fields = Object.keys(accounts[0] || {}).map(fieldName => {
            // Determine field type based on the data
            const sampleValue = accounts[0][fieldName];
            let type = 'string';
            if (typeof sampleValue === 'number' || !isNaN(sampleValue)) {
              type = 'number';
            } else if (sampleValue === 'true' || sampleValue === 'false') {
              type = 'boolean';
            }

            return {
              name: fieldName,
              type,
              sampleValues: accounts.slice(0, 5).map(a => a[fieldName]), // Get first 5 values as samples
            };
          });
          
          // Calculate metrics
          const totalAccounts = accounts.length;
          const scoredAccounts = accounts.filter(a => a.score !== undefined && a.score !== '').length;
          const coverage = Math.round((scoredAccounts / totalAccounts) * 100);
          
          // Calculate segments
          const segments = [
            { name: 'Very High', range: '90-100', min: 90, max: 100 },
            { name: 'High', range: '70-89', min: 70, max: 89 },
            { name: 'Medium', range: '50-69', min: 50, max: 69 },
            { name: 'Low', range: '30-49', min: 30, max: 49 },
            { name: 'No Fit', range: '0-29', min: 0, max: 29 }
          ].map(segment => {
            const count = accounts.filter(a => {
              const score = parseFloat(a.score);
              return score >= segment.min && score <= segment.max;
            }).length;
            return {
              ...segment,
              count,
              percentage: Math.round((count / scoredAccounts) * 100)
            };
          });

          // Calculate top factors
          const factors = [
            { name: 'Industry Fit', field: 'industry_score' },
            { name: 'Growth Rate', field: 'growth_score' },
            { name: 'Customer Engagement', field: 'engagement_score' }
          ].map(factor => {
            const total = accounts.reduce((sum, account) => 
              sum + (parseFloat(account[factor.field]) || 0), 0
            );
            const impact = Math.round((total / accounts.length) * 100);
            return { name: factor.name, impact };
          });

          resolve({
            totalAccounts,
            lastRun: {
              date: new Date().toLocaleString(),
              user: 'System'
            },
            accuracy: 85, // This would come from model validation
            coverage,
            topFactors: factors,
            segments,
            fields, // Add the fields information
            accounts: accounts.map(account => ({
              id: account.account_id || account.id,
              name: account.account_name || account.name,
              score: parseFloat(account.score),
              industry: account.industry,
              growthRate: account.growth_rate || account.growthRate,
              engagement: account.engagement_level || account.engagement,
              repOwner: account.sales_rep || account.repOwner,
              lastUpdated: account.last_updated || account.lastUpdated
            }))
          });
        },
        error: (error) => {
          reject(new Error('Failed to parse CSV: ' + error.message));
        }
      });
    });
  } catch (error) {
    throw new Error('Failed to load account data: ' + error.message);
  }
}; 