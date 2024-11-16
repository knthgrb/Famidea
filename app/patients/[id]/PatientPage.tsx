"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { formatScheduledDate } from "@/utils/formatScheduleDate";

export default function PatientPage({ id }: { id: string }) {
  const supabase = createClient();

  const [patientInfo, setPatientInfo] = useState<any | null>(null);

  const getPatientAppointments = async () => {
    let birthCenterId;
    if (typeof window !== "undefined" && window.localStorage) {
      birthCenterId = localStorage.getItem("birthCenterId");
    }

    try {
      const { data } = await supabase
        .from("appointments")
        .select(
          `*, birth_center_services (
          serviceName, price
        )`
        )
        .eq("patientId", id)
        .eq("birthCenterId", birthCenterId)
        .order("scheduledAt", { ascending: false });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch appointments");
    }
  };

  const fetchPatientDetails = async () => {
    try {
      const { data } = await supabase.from("patients").select("*").eq("id", id);

      if (!data) {
        throw new Error("Patient not found");
      }
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch patient details");
    }
  };

  useEffect(() => {
    const getPatientDetails = async () => {
      const [patientAppointments, patientDetails] = await Promise.all([
        getPatientAppointments(),
        fetchPatientDetails(),
      ]);

      setPatientInfo({
        ...patientDetails[0],
        appointments: patientAppointments,
      });
    };
    getPatientDetails();
  }, [id]);

  useEffect(() => {
    if (patientInfo) {
      console.log(patientInfo);
    }
  }, [patientInfo]);

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.map((n) => n.charAt(0).toUpperCase()).join("");
  };

  const initials = getInitials(patientInfo?.fullName);

  return (
    <div className="p-6">
      <button
        className="mb-4 rounded-lg p-3 hover:bg-gray-100"
        onClick={() => history.back()}
      >
        <MdOutlineArrowBackIosNew />
      </button>
      <div className="flex gap-6 items-center">
        <div className="flex items-center justify-center bg-customAccentColor text-white rounded-full w-20 h-20 text-lg font-bold cursor-pointer">
          {initials || "?"}{" "}
        </div>
        <div>
          <p className="font-semibold text-lg text-gray-600">
            {patientInfo?.fullName}
          </p>
          <p>{patientInfo?.phoneNumber}</p>
        </div>
      </div>
      <Tabs
        defaultValue="patient-information"
        className="flex flex-col h-full mt-4"
      >
        <div className="bg-white sticky top-0 z-10 border-b py-4">
          <TabsList>
            <TabsTrigger value="patient-information">
              Patient Information
            </TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="patient-information">
          <p className="text-gray-600 font-semibold text-lg">Gender</p>
          <p className="text-gray-600 capitalize">{patientInfo?.gender}</p>
          <p className="text-gray-600 font-semibold text-lg mt-8">Age</p>
          <p className="text-gray-600">{patientInfo?.age}</p>
          <p className="text-gray-600 font-semibold text-lg mt-8">Birth Date</p>
          <p className="text-gray-600">{patientInfo?.birthDate}</p>
          <p className="text-gray-600 font-semibold text-lg mt-8">Address</p>
          <p className="text-gray-600">{patientInfo?.address}</p>
        </TabsContent>
        <TabsContent value="appointments" className="">
          {patientInfo?.appointments?.map((apt: any) => (
            <div
              key={apt.id}
              className="border mt-2 border-gray-300 rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-600 font-semibold text-lg">
                  {apt.birth_center_services.serviceName}
                </p>
                <p className="text-gray-600">
                  {formatScheduledDate(apt.scheduledAt)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-lg text-gray-600">
                  Php. {apt.birth_center_services.price.toFixed(2)}
                </p>
                <p
                  className={`${
                    apt.status === "completed" ? "bg-green-400" : "bg-blue-400"
                  }  rounded-xl px-1 text-white text-center`}
                >
                  {apt.status}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
