import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetDirectiveService {
    generateBudgetPlanningPrompt(itineraryContent: any, inputs: any): string {
        const { number_of_people, Budget_type, starting_location } = inputs

        return `You are an expert travel financial planner and budget consultant. Generate a precise, professional, and intuitively structured budget plan based on the user's travel details and itinerary. Follow the instructions strictly and output ONLY in the specified JSON format.

### User Travel Details:  
- **From:** ${starting_location}  
- **Number of Travelers:** ${number_of_people}  
- **Budget Type:** ${Budget_type} (Low / Standard / Luxury)  

**Budget Breakdown Sections:**
For each of the following categories:
- Include the total cost in local currency and its USD equivalent.
- Provide a formal, clear 4–5 line description of what expenses this category covers within the context of this specific trip.
- If no cost applies, write 'NA' (do not use '0' or currency formats for zero values).

Categories:
- Getting There
- Accommodations
- Food and Drink
- Transportation
- Activities
- Miscellaneous

**Response Format:**  
Return the result in this exact JSON structure without any extra explanation or text:

{
  "user_travel_location": "[Destination Name (e.g., \"Bali, Indonesia\")]",
  "currency": "[Currency Symbol and Code (e.g., \"₹ INR\")]",
  "currency_conversion": "[Conversion Rate (e.g., \"1 USD = ₹83.5\")]",
  "total_travelers": "[Number (e.g., \"2\")]",
  "budget_type": "[Low / Standard / Luxury (e.g., \"Standard\")]",
  "total_budget_estimate": "[Total trip budget in local currency and USD (e.g., \"₹2,30,000 (2750 USD)\")]",
  "budget_breakdown": {
    "Getting There": {
      "cost": "[e.g., \"₹45000 (530 USD)\"]",
      "description": "[4–5 line summary]"
    },
    "Accommodations": {
      "cost": "[e.g., \"₹50000 (600 USD)\"]",
      "description": "[4–5 line summary]"
    },
    "Food and Drink": {
      "cost": "[e.g., \"₹18000 (220 USD)\"]",
      "description": "[4–5 line summary]"
    },
    "Transportation": {
      "cost": "[e.g., \"₹8000 (100 USD)\"]",
      "description": "[4–5 line summary]"
    },
    "Activities": {
      "cost": "[e.g., \"₹12000 (145 USD)\"]",
      "description": "[4–5 line summary]"
    },
    "Miscellaneous": {
      "cost": "[e.g., \"₹5000 (60 USD)\"]",
      "description": "[4–5 line summary]"
    }
  },
  "per_day_summary": [
    {
      "day": "[Day Number (e.g., \"1\")]",
      "total_cost": "[e.g., \"₹18000 (210 USD)\"]",
      "breakdown": {
        "Accommodations": "[e.g., \"₹5000 (60 USD)\"]",
        "Food and Drink": "[e.g., \"₹2500 (30 USD)\"]",
        "Transportation": "[e.g., \"₹300 (3.5 USD)\"]",
        "Activities": "[e.g., \"₹200 (2.4 USD)\"]",
        "Miscellaneous": "[e.g., \"NA\"]"
      },
      "description": "[2–3 line highlight in Future Continuous Tense (e.g., \"Will be arriving in Bali and checking into a boutique villa. Most of the day's budget will go into airfare and accommodations. Will be enjoying a sunset dinner by the beach.\")]"
    }
  ]
}

### Instructions (Strictly Follow):
1. **Carefully analyze each day’s itinerary** and assign realistic costs for:
   - Accommodations  
   - Food and Drink  
   - Transportation  
   - Activities  
   - Miscellaneous  

2. **Adjust costs dynamically** based on:
   - Number of travelers  
   - Selected budget type  
   - Local price trends and seasonal demand  

3. **Ensure financial consistency and accuracy**:
   - Sum of daily breakdown costs **must equal** the total_cost for each day.
   - Sum of per_day_summary total_costs **must match** total_budget_estimate.
   - Sum of all individual budget_breakdown category costs must also reconcile precisely with total_budget_estimate.
   - Budget_breakdown costs should logically align with the totals from per-day breakdowns (for Accommodations, Food, etc.)
   - Use sensible, rounded amounts (e.g., ₹100, ₹1500 / 1 USD increments).  

4. **No category should contain unrealistic or inconsistent values**:
   - Avoid impractical gaps like a zero cost for meals or 'NA' for accommodations unless it's clearly justified in itinerary context.
   - 'NA' is only allowed when the category genuinely has no expense for that situation/day.

5. **Include services explicitly where applicable**:
   - If accommodation includes breakfast, mention it.
   - If a full-day tour includes transport and lunch, account for that within Activities or Food as appropriate.

6. **Round costs sensibly** to maintain a clean, practical budget presentation.

7. **Do not include extra text, notes, or explanations outside the JSON structure.**

**IMPORTANT VALIDATION RULES:**

- Each per_day_summary's total_cost must be equal to the sum of its breakdown values.
- Each category in breakdown must be either a valid formatted value like '₹5000 (60 USD)' or 'NA' (never ₹0 or 0 USD).
- Sum of all per_day_summary total_cost values must be exactly equal to the sum of all budget_breakdown category costs plus Getting There.
- Miscellaneous should always be 'NA' if not applicable.
- Ensure per-day budgets are practically distributed. Avoid impossible situations like a ₹6000 hotel with a ₹3500 total daily budget.
- Return 'NA' for unused categories, never zero or currency zero.


**Here is the itinerary content to base your budget plan on:**
${itineraryContent}

### FINAL INSTRUCTION:
Generate the budget plan strictly in the JSON format above, respecting all these instructions.`

    }
} 

