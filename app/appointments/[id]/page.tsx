import React from "react";
import AppointmentDetailsPage from "../_components/AppointmentDetailsPage";

export default function page({ params }: { params: { id: number } }) {
  const { id } = params;

  return <AppointmentDetailsPage id={id} />;
}
