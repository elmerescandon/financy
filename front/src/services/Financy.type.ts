export interface FinancyResponse {
  message: string;
  entries?: FinancyEntry[];
}

export interface FinancyEntry {
  user_id: string;
  time: number;
  amount: number;
  type: string;
  note?: string;
}
