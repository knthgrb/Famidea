import React from "react";
import PatientPage from "./_components/PatientPage";

export default function page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PatientPage id={id} />;
}
