import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            // Define the base classes for the button
            const baseClasses = "w-full";

            // Define the active classes
            const activeClasses =
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-100 ease-linear";

            // Combine classes based on whether the item is active
            const buttonClasses = isActive
              ? `${baseClasses} ${activeClasses}`
              : baseClasses;

            return (
              <SidebarMenuItem
                key={item.title}
                className="flex items-center gap-2"
              >
                <Link to={item.url} key={item.url} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={buttonClasses}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
