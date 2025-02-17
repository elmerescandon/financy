export interface FinancyResponse {
  message: string;
  entries?: FinancyEntry[];
}

export interface FinancyEntry {
  id?: string;
  user_id?: string;
  time: number;
  amount: number;
  type: string;
  note?: string | null;
  finance_type?: "expense" | "income";
}


export interface FinancyFilter {
  startDate: number;
  endDate: number;
  expenseTypes: string[];
}