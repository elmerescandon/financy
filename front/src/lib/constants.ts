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
  breakfast: {
    label: "Breakfast",
    color: "#2563eb",
  },
  lunch: {
    label: "Lunch",
    color: "#34d399",
  },
  dinner: {
    label: "Dinner",
    color: "#f87171",
  },
  snack: {
    label: "Snack",
    color: "#fbbf24",
  },
  cloth: {
    label: "Cloth",
    color: "#a78bfa",
  },
  bus: {
    label: "Bus",
    color: "#f472b6",
  },
  taxi: {
    label: "Taxi",
    color: "#fb923c",
  },
  productivity: {
    label: "Productivity",
    color: "#10b981",
  },
  health: {
    label: "Health",
    color: "#ef4444",
  },
  party: {
    label: "Party",
    color: "#8b5cf6",
  },
  date: {
    label: "Dating",
    color: "#ec4899",
  },
  goOut: {
    label: "Go out",
    color: "#f59e0b",
  },
  selfCare: {
    label: "Self care",
    color: "#3b82f6",
  },
  decoration: {
    label: "Decoration",
    color: "#d946ef",
  },
} satisfies ChartConfig;


export type ChartConfigKey = keyof typeof chartFinancyConfig;
