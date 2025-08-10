import { NavLink } from "react-router-dom";
import { BookOpen, Headphones, Heart, Inbox, Bot, CalendarClock, ListChecks } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const items = [
  { title: "Mes consultations", url: "/dashboard/consultations", icon: Bot },
  { title: "Respiration", url: "/dashboard/breathing", icon: Heart },
  { title: "Playlist apaisante", url: "/dashboard/playlist", icon: Headphones },
  { title: "Bibliothèque", url: "/dashboard/library", icon: BookOpen },
  { title: "Guides d'exercices", url: "/dashboard/guides", icon: ListChecks },
  { title: "Planning personnalisé", url: "/dashboard/planning", icon: CalendarClock },
  { title: "Abonnement", url: "/dashboard/subscription", icon: Inbox },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
