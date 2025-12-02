"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  ChartBarStacked,
  ChevronDown,
  Database,
  FileText,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { memo, useLayoutEffect, useRef, useState } from "react";
const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { title: "Pages", icon: FileText, href: "/admin/pages" },
  // { title: "Posts", icon: StickyNote, href: "/post" },
  // { title: "Media", icon: BookImage, href: "/media" },
  { title: "Categories", icon: ChartBarStacked, href: "/admin/categories" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Collections", icon: Database, href: "/admin/collections" },
  {
    title: "Globals",
    icon: BarChart3,
    children: [
      { title: "Headers", href: "/admin/globals/headers" },
      { title: "Footers", href: "/admin/globals/footers" },
      { title: "Themes", href: "/admin/globals/themes" },
    ],
  },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string | number>(open ? "auto" : 0);
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      const full = el.scrollHeight;
      setHeight(full);
      const t = setTimeout(() => {
        setHeight("auto");
      }, 200);
      return () => clearTimeout(t);
    } else {
      const current = el.getBoundingClientRect().height;
      setHeight(current);
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [open]);
  return (
    <div
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "height 200ms ease, opacity 200ms ease",
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export const AdminSidebar = memo(() => {
  const { theme, setTheme } = useTheme();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="#dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TechCorp</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    {item.href ? (
                      <SidebarMenuButton asChild>
                        <Link prefetch={false} href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        data-state={openGroups[item.title] ? "open" : "closed"}
                        onClick={() =>
                          setOpenGroups((prev) => ({
                            ...prev,
                            [item.title]: !prev[item.title],
                          }))
                        }
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                    {item.children && (
                      <>
                        <SidebarMenuAction
                          aria-label="Toggle"
                          onClick={() =>
                            setOpenGroups((prev) => ({
                              ...prev,
                              [item.title]: !prev[item.title],
                            }))
                          }
                          className={
                            openGroups[item.title] ? "rotate-180" : "rotate-0"
                          }
                        >
                          <ChevronDown />
                        </SidebarMenuAction>
                        <Collapsible open={!!openGroups[item.title]}>
                          <SidebarMenuSub>
                            {item.children.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link prefetch={false} href={sub.href}>
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </Collapsible>
                      </>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="#profile">
                <User />
                <span>Admin Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
