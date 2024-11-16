import { SidebarProvider } from "@/components/ui/sidebar";
import { BirthCenterSidebar } from "@/app/_components/birth-center/BirthCenterSidebar";
import Header from "../_components/Header";

export default function BirthCenterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <BirthCenterSidebar />
      <main className="flex flex-col w-full">
        <Header />
        <div className="flex-grow h-[90vh]">{children}</div>
      </main>
    </SidebarProvider>
  );
}
