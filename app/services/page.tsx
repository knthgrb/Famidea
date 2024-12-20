import React from "react";
import Services from "@/app/services/_components/Services";
import { fetchServices } from "@/services/birthCenterServices_service";

export default async function ServicesPage() {
  const servicesData = await fetchServices();
  return <Services initialServices={servicesData} />;
}
