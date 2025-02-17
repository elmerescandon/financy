"use client"
import { TableProvider } from "@/hooks/useTable";

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <TableProvider>
                {children}
            </TableProvider>
        </>
    );
}
