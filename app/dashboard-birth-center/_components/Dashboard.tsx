"use client";
import React, { useEffect } from "react";
import { Appointment, ServiceData } from "@/lib/types";
import StatsCard from "@/app/dashboard-birth-center/_components/StatsCard";
import { stats } from "@/utils/constants";
import { MdOutlineMedicalServices } from "react-icons/md";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isAfter, addDays } from "date-fns";

interface DashboardComponentProps {
  appointments: {
    scheduled: Appointment[];
    completed: Appointment[];
  };
  services: ServiceData[];
  subscribedPatientsCount: number;
  birthCenterId: string;
}

export default function DashboardComponent({
  appointments,
  services,
  subscribedPatientsCount,
  birthCenterId,
}: DashboardComponentProps) {
  useEffect(() => {
    if (birthCenterId) {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("birthCenterId", birthCenterId);
      }
    }
  }, [birthCenterId]);

  const today = new Date();

  const totalUpcomingAppointments = appointments.scheduled.length;
  const completedAppointments = appointments.completed.length;

  const upcomingAppointments = appointments.scheduled
    .filter((apt) => {
      const scheduledDate = new Date(apt.scheduledAt);
      return (
        isAfter(scheduledDate, today) &&
        isAfter(addDays(today, 5), scheduledDate)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.scheduledAt);
      const dateB = new Date(b.scheduledAt);
      return dateA.getTime() - dateB.getTime();
    });

  const statsValues = [
    totalUpcomingAppointments,
    completedAppointments,
    subscribedPatientsCount,
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:h-[90vh] bg-white">
      <div className="w-full lg:w-[70%] p-6 flex flex-col h-full border-r border-gray-300">
        <div className="mb-6">
          <h1 className="text-3xl text-gray-600 font-semibold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your appointments and services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch mb-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={statsValues[index]}
            />
          ))}
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg flex flex-col min-h-0">
          <div className="flex-none p-4 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center p-2 rounded-lg bg-gray-200">
                  <MdOutlineMedicalServices size={20} />
                </div>
                <p className="text-sm">Services you Offer</p>
              </div>
              <Link href="/services">
                <button className="text-sm border font-semibold border-gray-300 hover:bg-gray-100 rounded-md px-4 py-2 text-gray-700">
                  Go to Services
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {service.serviceName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.serviceDescription}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Duration: {service.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        ${service.price}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          service.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%] p-6 h-full">
        <div className="border border-gray-300 rounded-lg p-4 h-full flex flex-col">
          <div className="flex-none flex items-center justify-between">
            <h1 className="text-md font-semibold text-gray-600">
              Upcoming Appointments
            </h1>
            <Link
              href="/appointments"
              className="text-sm text-gray-500 hover:text-gray-600 font-semibold"
            >
              See All
            </Link>
          </div>
          <div
            className={`flex-1 space-y-4 mt-4 overflow-y-auto ${
              upcomingAppointments.length === 0
                ? "flex justify-center items-center"
                : ""
            }`}
          >
            {upcomingAppointments.length === 0 ? (
              <div className="text-center text-gray-500 py-4 xl:max-w-48">
                No upcoming appointments for this week.
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-semibold">
                      {appointment.patientName}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {format(appointment.scheduledAt, "PPp")}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm">
                      <span className="text-gray-600">Service: </span>
                      {appointment.serviceName}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
