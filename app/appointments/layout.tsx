"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BirthCenterSidebar } from "@/app/_components/birth-center/BirthCenterSidebar";
import Header from "../_components/Header";
import { useUserStore } from "@/lib/store/user";
import { PatientSidebar } from "../_components/patient/PatientSidebar";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole } = useUserStore();

  return (
    <SidebarProvider>
      {userRole === "birth_center" ? (
        <BirthCenterSidebar />
      ) : (
        <PatientSidebar />
      )}
      <main className="flex flex-col w-full bg-white">
        <Header />
        <div className="flex-grow">{children}</div>
      </main>
    </SidebarProvider>
  );
}
