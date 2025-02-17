"use client"
import FilterSelect from '@/components/molecules/filter-select/filter-select'
import FinanceDateFilter from '@/components/organisms/finance-date-filter/finance-date-filter'
import { FinanceEntryChart } from '@/components/organisms/finance-entry-chart/finance-entry-chart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTable } from '@/hooks/useTable'
import React, { use, useEffect } from 'react'

const page = () => {

    const { tableData, updateTable } = useTable();

    return (
        <div className='max-w-5xl w-full'>
            <div className='py-4'>
                <FilterSelect />
                <FinanceDateFilter />
                <Button variant="default" onClick={updateTable}>Update Table</Button>
            </div>
            <FinanceEntryChart chartData={tableData} />
        </div>
    )
}

export default page