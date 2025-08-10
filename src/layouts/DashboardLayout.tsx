import { ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-12 flex items-center border-b px-3 gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Espace Client</h1>
            <div className="ml-auto">
              <Button variant="secondary" onClick={() => navigate("/home")}>Site</Button>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
