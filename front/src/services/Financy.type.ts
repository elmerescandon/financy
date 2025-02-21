export interface FinancyResponse {
  message: string;
  entries?: FinancyEntry[];
}

export interface FinancyEntry {
  id?: string;
  user_id?: string;
  time: number; // Same as fromTime
  amount: number;
  type: string; // Same as frequency
  note?: string | null;
  finance_type?: "expense" | "income";
  toTime?: number;
}

export interface FinancySetIncome {
  id?: string;
  user_id?: string;
  fromTime: number;
  toTime: number;
  amount: number;
  frequency: string;
  finance_type: string;
}


export interface FinancyFilter {
  startDate: number;
  endDate: number;
  expenseTypes: string[];
}