"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useRouter, useParams, notFound } from "next/navigation"; // ⬅️ include notFound
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Site = {
  id: string;
  name: string;
  slug: string;
  logo: React.ElementType;
  plan: string;
};

export function SiteSwitcher({ sites }: { sites: Site[] }) {
  const router = useRouter();
  const { site: currentSite } = useParams() as { site?: string };
  const { isMobile } = useSidebar();

  const activeSite = sites.find((t) => t.id === currentSite);

  // 🚫 Invalid site slug? Show 404
  if (!activeSite) return notFound();

  const switchToSite = (site: Site) => {
    router.push(`/dashboard/${site.id}`);
  };

  const addSite = () => {
    router.push("/create");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeSite.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeSite.name}
                </span>
                <span className="truncate text-xs">{activeSite.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sites
            </DropdownMenuLabel>

            {sites.map((site, index) => (
              <DropdownMenuItem
                key={site.slug}
                onClick={() => switchToSite(site)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <site.logo className="size-4 shrink-0" />
                </div>
                {site.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Add site - stub for now */}
            <DropdownMenuItem onClick={() => addSite()} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add site</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
