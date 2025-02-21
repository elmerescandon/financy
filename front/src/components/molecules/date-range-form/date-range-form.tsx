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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type DateRangeFormProps = {
    label: string;
    htmlFor: string;
    error?: string[];
}


export function DateRangeForm({ label, htmlFor, error }: DateRangeFormProps) {
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    return (
        <div className={cn("grid gap-2")}>
            <Popover>
                <Input
                    name={htmlFor}
                    className="hidden"
                    id={htmlFor}
                    type="text"
                    value={date && date.from && date.to ? `${+date.from || ''} - ${+date.to || ''}` : ''}
                    onChange={() => { }}
                />
                <PopoverTrigger asChild>
                    <div className="mb-4 flex w-full flex-col gap-2">
                        <Label htmlFor={htmlFor} className="font-semibold max-md:text-base">
                            {label}
                        </Label>
                        <Button
                            type="button"
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal max-md:w-full",
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
                        {error && <p className="text-red-500 text-sm mt-1">{error.join(", ")}</p>}

                    </div>

                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        required
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
