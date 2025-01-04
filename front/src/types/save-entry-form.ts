export interface SaveEntryFormData {
  amount: number;
  type: string;
}

export interface SaveEntryActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof SaveEntryFormData]?: string[];
  };
}
