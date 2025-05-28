"use client";

import * as React from "react";
import { Command, Globe, Home, MessageCircle, Target } from "lucide-react";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { SiteSwitcher } from "@/components/layout/site-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Site",
      url: "/playground",
      icon: Globe,
      items: [
        {
          title: "Config",
          url: "/site/config",
        },
        {
          title: "Pages",
          url: "/site/pages",
        },
        {
          title: "Settings",
          url: "/site/settings",
        },
      ],
    },
    {
      title: "RFQs",
      url: "/rfqs",
      icon: Target,
    },
    {
      title: "Messages",
      url: "/message",
      icon: MessageCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/sites");
        const data = await response.json();

        const formattedTeams = data.map((site) => ({
          name: site.name,
          slug: site.subDomain,
          logo: Command,
          plan: "Free",
        }));

        setTeams(formattedTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-10 w-full">
            <span className="animate-pulse">Loading teams...</span>
          </div>
        ) : (
          <SiteSwitcher sites={teams} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {/* <NavProjects projects={navigationData.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
