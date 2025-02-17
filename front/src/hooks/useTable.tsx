import { financeOptions } from '@/lib/constants';
import { FinancyService } from '@/services/Financy.service';
import { FinancyEntry, FinancyFilter } from '@/services/Financy.type';
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeFilter = { dateRange: DateRange | undefined, type: "calendar" | "fixed" } | undefined;

interface TableState {
    dateRangeFilter: DateRangeFilter
    typeFilter: string[] | null;
    tableData: FinancyEntry[];
}

type Action =
    | { type: 'SET_DATE_RANGE_FILTER'; payload: DateRangeFilter }
    | { type: 'SET_TYPE_FILTER'; payload: string[] | null }
    | { type: 'SET_TABLE_DATA'; payload: any[] };

const initialState: TableState = {
    dateRangeFilter: undefined,
    typeFilter: Object.entries(financeOptions).map(([key, value]) => (key)),
    tableData: []
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

    const setDateRangeFilter = (DateRange: DateRange, type: "calendar" | "fixed") => {
        dispatch({ type: 'SET_DATE_RANGE_FILTER', payload: { dateRange: DateRange, type: type } });
    }

    const setTypeFilter = (type: string[] | null) => {
        dispatch({ type: 'SET_TYPE_FILTER', payload: type });
    }

    const setTableData = (data: any[]) => {
        dispatch({ type: 'SET_TABLE_DATA', payload: data });
    }


    const { state, dispatch } = context;
    const { dateRangeFilter, typeFilter, tableData } = state;

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
            const data = await fetch('/api/get-entries/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId": "d09bd4f7-e50c-486c-8b04-93c6540f48bb",
                    expenseFilter
                }
                ),
            })

            if (!data.ok) {
                throw new Error("Failed to process expenses filter request.");
            }
            const { entries } = await data.json();
            setTableData(entries);
            setLoadingChart(false);
        } catch (error) {
            setLoadingChart(false);
            console.error(error);
        }
    };



    return { dateRangeFilter, setDateRangeFilter, typeFilter, setTypeFilter, tableData, setTableData, updateTable, loadingChart };
};