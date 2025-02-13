import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const analyzeFields = async (fields) => {
  try {
    console.log('🤖 Starting OpenAI field analysis...', fields);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a data analysis assistant specializing in B2B account data. Analyze field names and sample data to categorize them into these specific categories:

1. identifier: Fields that uniquely identify an account (e.g., Account ID, Customer Number)
2. target: Outcome variables to predict (e.g., Deal Status, Churn Risk, Success Score)
3. engagement: Customer interaction metrics (e.g., Last Login Date, Usage Frequency, Activity Score, Session Count)
4. firmographics: Company characteristics (e.g., Industry, Employee Count, Annual Revenue, Location, Company Type)
5. features: Other relevant attributes that don't fit above categories (e.g., Custom Fields, Calculated Metrics)

For each field, consider:
- Field name patterns and common business terminology
- Data type and format
- Sample values and their meaning
- B2B context and typical account data structures

Return a JSON array of objects with format:
{
  field: string, // field name
  category: string, // one of the categories above
  confidence: number, // 0-1 confidence score
  reason: string // detailed explanation for the categorization
}`
        },
        {
          role: "user",
          content: JSON.stringify(fields)
        }
      ],
      temperature: 0.1, // Low temperature for more consistent results
    });

    const result = response.choices[0].message.content;
    console.log('✅ OpenAI Analysis Complete:', result);
    return result;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    return null;
  }
}; 