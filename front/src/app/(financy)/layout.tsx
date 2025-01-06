import { AppSidebar } from "@/components/organisms/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full m-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
