"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { birthCenterSidebarItems } from "@/utils/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BirthCenterSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center">
        <Image
          src="/images/blue_logo.png"
          alt="logo"
          width={130}
          height={100}
          priority={true}
          quality={80}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {birthCenterSidebarItems.map((item) => {
                const isActive =
                  pathname.startsWith(item.url) || pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex group items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                        isActive
                          ? "bg-blue-100 text-blue-600 font-medium hover:bg-blue-100 hover:text-blue-600"
                          : "text-gray-600 hover:text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      <a href={item.url}>
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-blue-600" : "text-gray-500"
                          )}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
