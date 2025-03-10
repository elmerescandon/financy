"use client"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FinancyEntry } from "@/services/Financy.type"
import { useTable } from "@/hooks/useTable"
import { CoinsIcon, Loader2, TrendingUp } from "lucide-react"
import { ChartConfigKey, chartFinancyConfig, financeOptions } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"



type FinanceEntryChartProps = {
    chartData: FinancyEntry[]
}

function FinanceEntryChart({
    chartData
}: FinanceEntryChartProps) {

    const { loadingChart } = useTable();
    const groupedData = chartData.reduce((acc, entry) => {
        const { type, amount } = entry;
        if (!acc[type]) {
            acc[type] = { type, amount: 0 };
        }
        acc[type].amount += amount;
        return acc;
    }, {} as Record<string, { type: string; amount: number }>);

    const processedData = Object.values(groupedData);

    return (
        <div>
            <Card className="max-md:max-w-[340px] mx-auto" >
                <CardHeader>
                    <CardTitle>Bar Chart - Amount spend by type</CardTitle>
                </CardHeader>
                <CardContent>

                    {loadingChart && (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}
                    {chartData.length > 0 && !loadingChart && (<ChartContainer config={chartFinancyConfig} className="min-h-[400px] w-full max-md:min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart accessibilityLayer data={processedData} height={300} width={400}
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
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>)
                    }
                    {chartData.length === 0 && !loadingChart && (
                        <div className="flex justify-center items-center h-[200px]">
                            <p className="text-sm text-gray-400">No data to display</p>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <CoinsIcon className="w-4 h-4" />
                        <span>Total Amount: S/.{processedData.reduce((sum, entry) => sum + entry.amount, 0).toLocaleString()}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>

    )
}

export default FinanceEntryChart