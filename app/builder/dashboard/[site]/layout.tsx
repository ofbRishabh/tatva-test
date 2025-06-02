import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
  site,
}: {
  children: React.ReactNode;
  site: string;
}) {
  console.log("site", site);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Main content */}
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
