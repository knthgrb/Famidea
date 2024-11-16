import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/app/_components/patient/PatientSidebar";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PatientSidebar />
      <main className="flex flex-col w-full bg-white">
        <SidebarTrigger />
        <div className="flex-grow">{children}</div>
      </main>
    </SidebarProvider>
  );
}
