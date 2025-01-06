"use client";

import { financeOptions } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  time: number;
  amount: number;
  type: string;
  note?: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = parseFloat(row.getValue("time")) * 1000;
      const limaTimeZoneOffset = new Date().getTimezoneOffset() * 60000;
      const limaTime = new Date(time - limaTimeZoneOffset);
      return limaTime.toLocaleString("en-US", {
        weekday: "short",
        year: "2-digit",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "numeric",
      });
    },
    enableResizing: false,
    size: 30,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return type ? financeOptions[type as keyof typeof financeOptions] : type;
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      const note = row.getValue("note");
      return note ? note : "-";
    },
  },
];
