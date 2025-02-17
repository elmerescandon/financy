import { FilterDateRange } from '@/components/molecules/filter-date-range/filter-date-range'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useTable } from '@/hooks/useTable'
import { Bold, Calendar, Calendar1Icon, Italic, Underline } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const FinanceDateFilter = () => {

    const [fixedDate, setFixedDate] = useState<"today" | "yesterday" | "week" | "month" | "">("");
    const { setDateRangeFilter: setDate, dateRangeFilter: date } = useTable();

    const handleChangeFixedDate = (value: "today" | "yesterday" | "week" | "month") => {
        setFixedDate(value);
        if (value) {
            if (value === "today") {
                setDate({ from: new Date(), to: new Date() }, "fixed")
            } else if (value === "yesterday") {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                setDate({ from: yesterday, to: yesterday }, "fixed")
            } else if (value === "week") {
                const today = new Date();
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                const from = new Date(today.setDate(diff));
                const to = new Date(today.setDate(from.getDate() + 6));
                setDate({ from, to }, "fixed")
            } else if (value === "month") {
                const today = new Date();
                const from = new Date(today.getFullYear(), today.getMonth(), 1);
                const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                setDate({ from, to }, "fixed")
            }
        }
    }


    useEffect(() => {
        if (date && date.type === "calendar") {
            setFixedDate(""); // Set to an empty string instead of undefined
        }
    }, [date])

    return (
        <div className='mb-4'>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <FilterDateRange className="w-full md:w-auto" />
                <ToggleGroup className="flex border rounded-md" type="single" value={fixedDate} onValueChange={(value) => handleChangeFixedDate(value as any)}>
                    <ToggleGroupItem value="today" aria-label="Toggle Today" className="px-4 rounded-md w-full" >
                        Today
                    </ToggleGroupItem>
                    <ToggleGroupItem value="yesterday" aria-label="Toggle Yesterday" className="px-4 w-full rounded-md">
                        Yesterday
                    </ToggleGroupItem>
                    <ToggleGroupItem value="week" aria-label="Toggle Week" className="px-4 rounded-md w-full">
                        Week
                    </ToggleGroupItem>
                    <ToggleGroupItem value="month" aria-label="Toggle Month" className="px-4 rounded-md w-full">
                        Month
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    )
}

export default FinanceDateFilter