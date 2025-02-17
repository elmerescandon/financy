import { FinancyEntry, FinancyFilter, FinancyResponse } from "./Financy.type";

export class FinancyService {
  private static instance: FinancyService;

  private constructor() {
    // Initialization code here
  }

  public static getInstance(): FinancyService {
    if (!FinancyService.instance) {
      FinancyService.instance = new FinancyService();
    }
    return FinancyService.instance;
  }

  // Method to get financial data from an API
  async getExpenses(userId: string): Promise<FinancyResponse> {
    try {
      const url = process.env.NEXT_PUBLIC_PANDORA_API_ENDPOINT;
      const response = await fetch(`${url}/get-expenses/${userId}`);
      const data = await response.json();

      if (data.entries) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  async saveEntry(entry: FinancyEntry): Promise<FinancyResponse> {
    try {
      const url = process.env.NEXT_PUBLIC_PANDORA_API_ENDPOINT;
      const response = await fetch(`${url}/save-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
      if (response.status !== 201) {
        throw new Error("Failed to save entry");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getExpensesFilter(userId: string, expenseFilter: FinancyFilter) {
    try {
      const url = process.env.NEXT_PUBLIC_PANDORA_API_ENDPOINT;
      const response = await fetch(`${url}/get-expenses-range/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseFilter),
      });
      const data = await response.json();
      if (data.entries) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }

  }
}
