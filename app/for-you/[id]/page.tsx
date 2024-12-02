import React from "react";
import BirthCenterPage from "../_components/BirthCenterPage";

export default function page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <BirthCenterPage id={id} />;
}
