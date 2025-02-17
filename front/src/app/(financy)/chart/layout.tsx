"use client"
import { TableProvider } from "@/hooks/useTable";

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex justify-center">
            <TableProvider>
                {children}
            </TableProvider>
        </div>
    );
}
