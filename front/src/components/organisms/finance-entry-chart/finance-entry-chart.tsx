"use client"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FinancyEntry } from "@/services/Financy.type"
import { useTable } from "@/hooks/useTable"
import { CoinsIcon, Loader2, TrendingUp, CalendarIcon } from "lucide-react"
import { ChartConfigKey, chartFinancyConfig, financeOptions } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

type FinanceEntryChartProps = {
    chartData: FinancyEntry[]
    comparisonData?: FinancyEntry[]
    comparisonType?: "none" | "date" | "month"
}

function FinanceEntryChart({
    chartData,
    comparisonData,
    comparisonType = "none"
}: FinanceEntryChartProps) {
    const { loadingChart, dateRangeFilter, comparisonDateRange } = useTable();

    const processData = (data: FinancyEntry[]) => {
        const groupedData = data.reduce((acc, entry) => {
            const { type, amount } = entry;
            if (!acc[type]) {
                acc[type] = { type, amount: 0 };
            }
            acc[type].amount += amount;
            return acc;
        }, {} as Record<string, { type: string; amount: number }>);

        return Object.values(groupedData);
    };

    const processedData = processData(chartData);
    const processedComparisonData = comparisonData ? processData(comparisonData) : [];

    const combinedData = processedData.map(item => {
        const comparisonItem = processedComparisonData.find(comp => comp.type === item.type);
        return {
            ...item,
            comparisonAmount: comparisonItem?.amount || 0,
            difference: item.amount - (comparisonItem?.amount || 0)
        };
    });

    const formatDateRange = (from: Date, to: Date) => {
        return `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`;
    };

    const currentTotal = processedData.reduce((sum, entry) => sum + entry.amount, 0);
    const comparisonTotal = processedComparisonData.reduce((sum, entry) => sum + entry.amount, 0);

    return (
        <div>
            <Card className="max-md:max-w-[340px] mx-auto">
                <CardHeader>
                    <CardTitle>Bar Chart - Amount spend by type</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingChart && (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}
                    {chartData.length > 0 && !loadingChart && (
                        <ChartContainer config={chartFinancyConfig} className="min-h-[400px] w-full max-md:min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={combinedData}
                                    height={300}
                                    width={400}
                                    margin={{
                                        top: 32,
                                    }}
                                >
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <XAxis
                                        dataKey="type"
                                        tickLine={false}
                                        tickFormatter={(value) => chartFinancyConfig[value as ChartConfigKey]?.label || value}
                                        axisLine={false}
                                    />
                                    <CartesianGrid vertical={false} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="amount" fill="var(--color-breakfast)" radius={8} >
                                        <LabelList
                                            position="top"
                                            offset={5}
                                            className="fill-foreground"
                                            fontSize={12}
                                            formatter={(value: any) => `S/.${value.toLocaleString()}`}
                                        />
                                    </Bar>
                                    {comparisonType !== "none" && (
                                        <Bar dataKey="comparisonAmount" fill="var(--color-dinner)" radius={8}>
                                            <LabelList
                                                position="top"
                                                offset={5}
                                                className="fill-foreground"
                                                fontSize={12}
                                                formatter={(value: any) => `S/.${value.toLocaleString()}`}
                                            />
                                        </Bar>
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                    {chartData.length === 0 && !loadingChart && (
                        <div className="flex justify-center items-center h-[200px]">
                            <p className="text-sm text-gray-400">No data to display</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">Current Period</span>
                            </div>
                            <div className="pl-6 space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {dateRangeFilter?.dateRange?.from && dateRangeFilter?.dateRange?.to ?
                                        formatDateRange(dateRangeFilter.dateRange.from, dateRangeFilter.dateRange.to) :
                                        "No date range selected"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <CoinsIcon className="w-4 h-4" />
                                    <span className="text-sm">Total: S/.{currentTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {comparisonType !== "none" && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="font-medium">Comparison Period</span>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            {comparisonDateRange?.from && comparisonDateRange?.to ?
                                                formatDateRange(comparisonDateRange.from, comparisonDateRange.to) :
                                                comparisonType === "date" ? "Previous equal period" : "Previous month"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <CoinsIcon className="w-4 h-4" />
                                            <span className="text-sm">Total: S/.{comparisonTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-medium">Difference: S/.{combinedData.reduce((sum, entry) => sum + entry.difference, 0).toLocaleString()}</span>
                                </div>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default FinanceEntryChart