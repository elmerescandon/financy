import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeFilter = { dateRange: DateRange | undefined, type: "calendar" | "fixed" } | undefined;

interface TableState {
    dateRangeFilter: DateRangeFilter
    typeFilter: string | null;
    tableData: any[];
}

type Action =
    | { type: 'SET_DATE_RANGE_FILTER'; payload: DateRangeFilter }
    | { type: 'SET_TYPE_FILTER'; payload: string | null }
    | { type: 'SET_TABLE_DATA'; payload: any[] };

const initialState: TableState = {
    dateRangeFilter: undefined,
    typeFilter: null,
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

    const setDateRangeFilter = (DateRange: DateRange, type: "calendar" | "fixed") => {
        dispatch({ type: 'SET_DATE_RANGE_FILTER', payload: { dateRange: DateRange, type: type } });
    }

    const setTypeFilter = (type: string | null) => {
        dispatch({ type: 'SET_TYPE_FILTER', payload: type });
    }

    const setTableData = (data: any[]) => {
        dispatch({ type: 'SET_TABLE_DATA', payload: data });
    }


    const { state, dispatch } = context;
    const { dateRangeFilter, typeFilter, tableData } = state;

    return { dateRangeFilter, setDateRangeFilter, typeFilter, setTypeFilter, tableData, setTableData };
};