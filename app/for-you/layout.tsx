import { SidebarProvider } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/app/_components/patient/PatientSidebar";
import Header from "../_components/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PatientSidebar />
      <main className="flex flex-col w-full bg-white">
        <Header />
        <div className="flex-grow">{children}</div>
      </main>
    </SidebarProvider>
  );
}
