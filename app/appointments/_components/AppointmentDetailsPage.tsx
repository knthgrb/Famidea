"use client";
import { calculateAge } from "@/utils/calculateAge";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toastUtils";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

const AppointmentDetailsPage = ({ id }: { id: number }) => {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState<{
    appointment: any;
    patient: any;
    service: any;
  } | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setIsLoading(true);

        const { data: appointment, error: appointmentError } = await supabase
          .from("appointments")
          .select("*")
          .eq("id", id)
          .single();

        if (appointmentError) {
          return;
        }

        // Fetch patient and service data using UUIDs from the appointment
        const [
          { data: patient, error: patientError },
          { data: service, error: serviceError },
        ] = await Promise.all([
          supabase
            .from("patients")
            .select("*")
            .eq("id", appointment.patientId)
            .single(),
          supabase
            .from("birth_center_services")
            .select("*")
            .eq("id", appointment.serviceId)
            .single(),
        ]);

        // Handle errors for patient and service fetching
        if (patientError || serviceError) {
          return;
        }

        // Set combined data
        setAppointmentData({
          appointment,
          patient,
          service,
        });
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id, supabase]);

  // Improved loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center py-4">Loading appointment details...</div>
      </div>
    );
  }

  if (!appointmentData) {
    return <div className="text-center py-4">No appointment found</div>;
  }

  const { appointment, patient, service } = appointmentData;

  return (
    <div className="p-6 capitalize">
      <button
        className="mb-8 flex items-center gap-2 hover:text-customAccentColor"
        onClick={() => history.back()}
      >
        <MdOutlineArrowBackIosNew /> Back to Appointments
      </button>

      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>
        <div className="grid grid-cols-2 gap-2">
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
          <p>
            <strong>Scheduled Date:</strong>{" "}
            {new Date(appointment.scheduledAt).toLocaleString()}
          </p>
          3
          <p>
            <strong>Created On:</strong>{" "}
            {new Date(appointment.created_at).toLocaleString()}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <p>
            <strong>Name:</strong> {patient.fullName}
          </p>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
          <p>
            <strong>Age:</strong> {calculateAge(patient.birthDate)}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
          <p>
            <strong>Contact:</strong> {patient.phoneNumber}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Service Details</h2>
        <div className="grid grid-cols-2 gap-2">
          <p>
            <strong>Service Name:</strong> {service.serviceName}
          </p>
          <p>
            <strong>Description:</strong> {service.serviceDescription}
          </p>
          <p>
            <strong>Price:</strong> ${service.price.toFixed(2)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default AppointmentDetailsPage;
