"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTable } from "@/hooks/useTable"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function FilterComparison() {
    const {
        comparisonType,
        setComparisonType,
        comparisonDateRange,
        setComparisonDateRange,
        updateTable
    } = useTable()

    const handleComparisonDateChange = (dateRange: DateRange | undefined) => {
        if (dateRange?.from) {
            dateRange.from.setHours(0, 0, 0, 0)
        }
        if (dateRange?.to) {
            dateRange.to.setHours(23, 59, 59, 999)
        }
        setComparisonDateRange(dateRange)
        updateTable()
    }

    return (
        <div className="space-y-4">
            <Select value={comparisonType} onValueChange={(value) => {
                setComparisonType(value as "none" | "date" | "month")
                updateTable()
            }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select comparison type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">No Comparison</SelectItem>
                    <SelectItem value="date">Date by Date</SelectItem>
                    <SelectItem value="month">Month by Month</SelectItem>
                </SelectContent>
            </Select>

            {comparisonType !== "none" && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !comparisonDateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {comparisonDateRange?.from ? (
                                comparisonDateRange.to ? (
                                    <>
                                        {format(comparisonDateRange.from, "LLL dd, y")} -{" "}
                                        {format(comparisonDateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(comparisonDateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick comparison date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={comparisonDateRange?.from}
                            selected={comparisonDateRange}
                            onSelect={handleComparisonDateChange}
                            numberOfMonths={2}
                            required
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
} 