import { financeOptions } from '@/lib/constants';
import { FinancyService } from '@/services/Financy.service';
import { FinancyEntry, FinancyFilter } from '@/services/Financy.type';
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeFilter = { dateRange: DateRange | undefined, type: "calendar" | "fixed" } | undefined;
type ComparisonType = "none" | "date" | "month";

interface TableState {
    dateRangeFilter: DateRangeFilter
    typeFilter: string[] | null;
    tableData: FinancyEntry[];
    comparisonType: ComparisonType;
    comparisonData: FinancyEntry[];
    comparisonDateRange: DateRange | undefined;
}

type Action =
    | { type: 'SET_DATE_RANGE_FILTER'; payload: DateRangeFilter }
    | { type: 'SET_TYPE_FILTER'; payload: string[] | null }
    | { type: 'SET_TABLE_DATA'; payload: any[] }
    | { type: 'SET_COMPARISON_TYPE'; payload: ComparisonType }
    | { type: 'SET_COMPARISON_DATA'; payload: any[] }
    | { type: 'SET_COMPARISON_DATE_RANGE'; payload: DateRange | undefined };

const initialState: TableState = {
    dateRangeFilter: undefined,
    typeFilter: Object.entries(financeOptions).map(([key, value]) => (key)),
    tableData: [],
    comparisonType: "none",
    comparisonData: [],
    comparisonDateRange: undefined
};

const TableContext = createContext<{
    state: TableState;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

const tableReducer = (state: TableState, action: Action): TableState => {
    switch (action.type) {
        case 'SET_DATE_RANGE_FILTER':
            return { ...state, dateRangeFilter: action.payload };
        case 'SET_TYPE_FILTER':
            return { ...state, typeFilter: action.payload };
        case 'SET_TABLE_DATA':
            return { ...state, tableData: action.payload };
        case 'SET_COMPARISON_TYPE':
            return { ...state, comparisonType: action.payload };
        case 'SET_COMPARISON_DATA':
            return { ...state, comparisonData: action.payload };
        case 'SET_COMPARISON_DATE_RANGE':
            return { ...state, comparisonDateRange: action.payload };
        default:
            return state;
    }
};

export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tableReducer, initialState);

    return (
        <TableContext.Provider value={{ state, dispatch }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }

    const service = FinancyService.getInstance()
    const [loadingChart, setLoadingChart] = useState<boolean>(false);

    const { state, dispatch } = context;
    const { dateRangeFilter, typeFilter, tableData, comparisonType, comparisonData, comparisonDateRange } = state;

    const setDateRangeFilter = (DateRange: DateRange, type: "calendar" | "fixed") => {
        dispatch({ type: 'SET_DATE_RANGE_FILTER', payload: { dateRange: DateRange, type: type } });
    }

    const setTypeFilter = (type: string[] | null) => {
        dispatch({ type: 'SET_TYPE_FILTER', payload: type });
    }

    const setTableData = (data: any[]) => {
        dispatch({ type: 'SET_TABLE_DATA', payload: data });
    }

    const setComparisonType = (type: ComparisonType) => {
        dispatch({ type: 'SET_COMPARISON_TYPE', payload: type });
    }

    const setComparisonData = (data: any[]) => {
        dispatch({ type: 'SET_COMPARISON_DATA', payload: data });
    }

    const setComparisonDateRange = (dateRange: DateRange | undefined) => {
        dispatch({ type: 'SET_COMPARISON_DATE_RANGE', payload: dateRange });
    }

    const updateTable = async () => {
        try {
            setLoadingChart(true);
            if (!dateRangeFilter?.dateRange?.from || !dateRangeFilter?.dateRange?.to || !typeFilter) {
                return;
            }

            const expenseFilter = {
                end_date: +dateRangeFilter?.dateRange?.to,
                start_date: +dateRangeFilter?.dateRange?.from,
                expense_types: typeFilter
            }

            // Fetch main data
            const data = await fetch('/api/get-entries/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId": "d09bd4f7-e50c-486c-8b04-93c6540f48bb",
                    expenseFilter
                }),
            })

            if (!data.ok) {
                throw new Error("Failed to process expenses filter request.");
            }
            const { entries } = await data.json();
            setTableData(entries);

            // Fetch comparison data if needed
            if (comparisonType !== "none") {
                let comparisonFilter = { ...expenseFilter };

                if (comparisonDateRange?.from && comparisonDateRange?.to) {
                    // Use manually selected comparison dates
                    comparisonFilter.start_date = +comparisonDateRange.from;
                    comparisonFilter.end_date = +comparisonDateRange.to;
                } else if (comparisonType === "date") {
                    // Use automatic date-by-date comparison
                    const daysDiff = Math.ceil((dateRangeFilter.dateRange.to.getTime() - dateRangeFilter.dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
                    comparisonFilter.start_date = +new Date(dateRangeFilter.dateRange.from.getTime() - daysDiff * 24 * 60 * 60 * 1000);
                    comparisonFilter.end_date = +new Date(dateRangeFilter.dateRange.from.getTime() - 1);
                } else if (comparisonType === "month") {
                    // Use automatic month-by-month comparison
                    const fromDate = new Date(dateRangeFilter.dateRange.from);
                    fromDate.setMonth(fromDate.getMonth() - 1);
                    comparisonFilter.start_date = +fromDate;
                    comparisonFilter.end_date = +new Date(dateRangeFilter.dateRange.from.getTime() - 1);
                }

                const comparisonResponse = await fetch('/api/get-entries/filter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "userId": "d09bd4f7-e50c-486c-8b04-93c6540f48bb",
                        expenseFilter: comparisonFilter
                    }),
                });

                if (!comparisonResponse.ok) {
                    throw new Error("Failed to process comparison filter request.");
                }
                const { entries: comparisonEntries } = await comparisonResponse.json();
                setComparisonData(comparisonEntries);
            }

            setLoadingChart(false);
        } catch (error) {
            setLoadingChart(false);
            console.error(error);
        }
    };

    // Add effect to automatically update when filters change
    useEffect(() => {
        if (dateRangeFilter?.dateRange?.from && dateRangeFilter?.dateRange?.to && typeFilter) {
            updateTable();
        }
    }, [dateRangeFilter, typeFilter, comparisonType, comparisonDateRange]);

    return {
        dateRangeFilter,
        setDateRangeFilter,
        typeFilter,
        setTypeFilter,
        tableData,
        setTableData,
        updateTable,
        loadingChart,
        comparisonType,
        setComparisonType,
        comparisonData,
        comparisonDateRange,
        setComparisonDateRange
    };
};