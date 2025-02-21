export interface SetIncomeFormData {
    amount: number;
    frequency: string;
    // timeRange: string;
    fromTime: number;
    toTime: number;
    finance_type: "expense" | "income";
}

export interface SetIncomeActionResponse {
    success: boolean;
    message: string;
    errors?: {
        [K in keyof SetIncomeFormData]?: string[];
    };
}
