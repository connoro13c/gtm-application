✅ Simple Account Scoring (5-Minute MVP)

Goal: Quickly generate a basic propensity-to-buy (PTB) score for each account (0–100) using simple, rules-based scoring—no manual entry on every account and no external integrations required.

This foundational process is fast and intuitive, enabling more advanced future enhancements such as ML models, usage signals, or intent data.

🧭 Step-by-Step Scoring Workflow

STEP 1: Upload Account List

Upload your account list as a CSV or Excel file.

Required columns:

Account ID

Account Name

Recommended columns (optional but useful):

Industry

Annual Revenue

Employee Count

Buyer Persona

Recent Engagement Score

💬 “Upload your list of accounts. Just Account ID and Name are required; additional data helps automate scoring.”

STEP 2: Select Key Criteria (Scoring Factors)

Choose 3–5 criteria to evaluate accounts. These criteria will drive automatic scoring—no manual entry per account needed.

Examples:

Industry fit

Annual Revenue

Buyer persona match

Employee Count

Recent engagement

Timing / urgency

Strategic interest

💬 “What signals matter most to your current strategy? Choose up to 5 that strongly indicate an account’s likelihood to buy.”

STEP 3: Define Automated Scoring Rules

Create simple rules to auto-score each account based on your chosen criteria.

Example Numeric Rule (Annual Revenue):

Revenue Range

Assigned Level

$0–$50M

High (100 pts)

$51M–$100M

Medium (50 pts)

$100M+

Low (10 pts)

Example Categorical Rule (Industry Fit):

Industry

Assigned Level

Tech, SaaS

High (100 pts)

Healthcare, Finance

Medium (50 pts)

Others

Low (10 pts)

Use prefilled defaults or fully customize your scoring bands.

💬 “Define clear rules for scoring automatically. Set numeric bands or categories and assign Low/Medium/High points.”

STEP 4: Assign Criterion Weights

Assign a weight to each criterion to determine its impact on the total score.

Example:

Criterion

Weight (%)

Annual Revenue

30%

Industry Fit

40%

Engagement

30%

💬 “How important is each criterion? Assign weights to reflect your priorities clearly.”

STEP 5: Auto-Score Accounts & Review

Your criteria rules and weights are applied automatically, generating account scores from 0–100 instantly.

Scores are bucketed into simple tiers:

🔴 0–49 = Low

🟡 50–79 = Medium

🟢 80–100 = High

Quickly review your results.

💬 “Your scoring model is complete. Instantly see prioritized accounts—no manual scoring needed.”

STEP 6: Export or Sync Results

Next, you can:

✅ Export scored accounts as CSV

✅ Push scores to Salesforce, HubSpot, etc.

✅ Automatically tag accounts by score tier (e.g., "High Priority")

💬 “Ready to take action? Export your scores or integrate directly into your CRM.”

🧱 Future Enhancements This Enables

Advanced automated workflows

Data enrichment and intent-based scoring

Product usage signals

Statistical & ML-driven scoring

Territory and segment mapping

🛠️ UI Summary (Simple Screens)

Upload Account List

Select Scoring Criteria

Define Automated Scoring Rules (numeric bands or categories)

Set Criterion Weights

Auto-score Accounts & Review Results

Export or Integrate Scores

🧪 Example Output

Account Name

Annual Revenue

Industry Fit

Buyer Persona

Engagement

Total Score

ZoomInfo

High (100)

High (100)

Medium (50)

Low (10)

81

Snowflake

Medium (50)

High (100)

High (100)

Medium (50)

79

Acme Co

Low (10)

Low (10)

Low (10)

Low (10)

10

