import { ChartConfig } from "@/components/ui/chart";

export const financeOptions = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  cloth: "Cloth",
  bus: "Bus",
  taxi: "Taxi",
  productivity: "Productivity",
  health: "Health",
  party: "Party",
  date: "Dating",
  goOut: "Go out",
  selfCare: "Self care",
  decoration: "Decoration",
};

export const chartFinancyConfig = {
  amount: {
    label: "Breakfast",
    color: "#2563eb",
  },

} satisfies ChartConfig;


export type ChartConfigKey = keyof typeof chartFinancyConfig;
