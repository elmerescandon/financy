"use client"
import FilterSelect from '@/components/molecules/filter-select/filter-select'
import FinanceDateFilter from '@/components/organisms/finance-date-filter/finance-date-filter'
import { FinanceEntryChart } from '@/components/organisms/finance-entry-chart/finance-entry-chart'
import { Separator } from '@/components/ui/separator'
import { useTable } from '@/hooks/useTable'
import React, { use, useEffect } from 'react'

const page = () => {

    const { dateRangeFilter } = useTable();

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
    return (
        <div>
            <div className='py-4'>
                <FilterSelect />
                <FinanceDateFilter />
            </div>
            {/* <FinanceEntryChart chartData={chartData} /> */}

        </div>
    )
}

export default page