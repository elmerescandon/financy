"use client"

import { useEffect, useState, useCallback } from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTable } from "@/hooks/useTable"

export function FilterDateRange({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const { dateRangeFilter, setDateRangeFilter } = useTable()

    const handleDateChange = useCallback((dateRange: DateRange) => {
        setDate(dateRange)
        setDateRangeFilter(dateRange, "calendar")
    }, [date, setDateRangeFilter])

    useEffect(() => {
        if (dateRangeFilter && dateRangeFilter.type === "fixed") {
            setDate(undefined)
        }
    }, [dateRangeFilter])

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        required
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
