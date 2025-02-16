export interface SaveEntryFormData {
  amount: number;
  type: string;
  time: number;
  finance_type: "expense" | "income";
  note?: string;
}

export interface SaveEntryActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof SaveEntryFormData]?: string[];
  };
}
