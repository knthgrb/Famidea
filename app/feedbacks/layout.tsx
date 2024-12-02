import { SidebarProvider } from "@/components/ui/sidebar";
import { BirthCenterSidebar } from "@/app/_components/birth-center/BirthCenterSidebar";
import Header from "../_components/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <BirthCenterSidebar />
      <main className="flex flex-col w-full bg-white">
        <Header />
        <div className="flex-grow">{children}</div>
      </main>
    </SidebarProvider>
  );
}
