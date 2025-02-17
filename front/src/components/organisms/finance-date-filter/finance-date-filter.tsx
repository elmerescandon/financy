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
            const from = new Date();
            const to = new Date();
            switch (value) {
                case "today":
                    from.setHours(0, 0, 0, 0);
                    to.setHours(23, 59, 59, 999);
                    break;
                case "yesterday":
                    from.setDate(from.getDate() - 1);
                    from.setHours(0, 0, 0, 0);
                    to.setDate(to.getDate() - 1);
                    to.setHours(23, 59, 59, 999);
                    break;
                case "week":
                    const day = from.getDay();
                    const diff = from.getDate() - day + (day === 0 ? -6 : 1);
                    from.setDate(diff);
                    from.setHours(0, 0, 0, 0);
                    to.setDate(from.getDate() + 6);
                    to.setHours(23, 59, 59, 999);
                    break;
                case "month":
                    from.setDate(1);
                    from.setHours(0, 0, 0, 0);
                    to.setMonth(to.getMonth() + 1);
                    to.setDate(0);
                    to.setHours(23, 59, 59, 999);
                    break;
            }
            setDate({ from, to }, "fixed");
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
                <FilterDateRange className="w-full max-md:w-full" />
                <ToggleGroup className="flex border rounded-md max-md:w-full" type="single" value={fixedDate} onValueChange={(value) => handleChangeFixedDate(value as any)}>
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