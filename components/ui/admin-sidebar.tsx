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
import { Link } from "@/src/i18n/routing";
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
import { useTranslations } from "next-intl";
import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";

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

export const AdminSidebar = memo(({ side = "left" }: { side?: "left" | "right" }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const t = useTranslations("Sidebar");

  const menuItems = useMemo(() => [
    { title: t("dashboard"), icon: LayoutDashboard, href: "#dashboard" },
    { title: t("pages"), icon: FileText, href: "/admin/pages" },
    { title: t("categories"), icon: ChartBarStacked, href: "/admin/categories" },
    { title: t("users"), icon: Users, href: "/admin/users" },
    { title: t("collections"), icon: Database, href: "/admin/collections" },
    {
      title: t("globals"),
      icon: BarChart3,
      children: [
        { title: t("headers"), href: "/admin/globals/headers" },
        { title: t("footers"), href: "/admin/globals/footers" },
        { title: t("themes"), href: "/admin/globals/themes" },
      ],
    },
    { title: t("settings"), icon: Settings, href: "/admin/settings" },
  ], [t]);

  return (
    <Sidebar collapsible="icon" side={side}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TechCorp</span>
                  <span className="truncate text-xs">{t("admin_panel")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    {item.href ? (
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
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
                                  <Link href={sub.href}>
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
              <Link href="#profile">
                <User />
                <span>{t("admin_profile")}</span>
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
