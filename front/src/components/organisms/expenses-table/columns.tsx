"use client";

import { financeOptions } from "@/lib/constants";
import { FinancyEntry } from "@/services/Financy.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FinancyService } from "@/services/Financy.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<FinancyEntry>[] = [
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = parseFloat(row.getValue("time")) * 1000;
      const limaTime = new Date(time);
      return format(limaTime, "PPPP");
    },
    enableResizing: false,
    size: 30,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount");
      return amount ? `S/.${amount}` : "-";
    }
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
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDeleting, setIsDeleting] = useState(false);
      const router = useRouter();
      const service = FinancyService.getInstance();
      const entry = row.original;

      const handleDelete = async () => {
        try {
          setIsDeleting(true);
          await service.deleteEntry(entry.id!);
          router.refresh();
        } catch (error) {
          console.error("Failed to delete entry:", error);
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
