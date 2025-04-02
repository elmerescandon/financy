"use client"
import FilterSelect from '@/components/molecules/filter-select/filter-select'
import FinanceDateFilter from '@/components/organisms/finance-date-filter/finance-date-filter'
import FinanceEntryChart from '@/components/organisms/finance-entry-chart/finance-entry-chart'
import { FilterComparison } from '@/components/molecules/filter-comparison/filter-comparison'
import { useTable } from '@/hooks/useTable'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const page = () => {
    const { tableData, comparisonData, comparisonType } = useTable();

    return (
        <div className='max-w-5xl w-full space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Expense Type</h3>
                                <FilterSelect />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-2">Date Range</h3>
                                <FinanceDateFilter />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-2">Comparison</h3>
                                <FilterComparison />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <FinanceEntryChart
                chartData={tableData}
                comparisonData={comparisonData}
                comparisonType={comparisonType}
            />
        </div>
    )
}

export default page