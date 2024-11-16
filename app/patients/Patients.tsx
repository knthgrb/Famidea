"use client";
import { formatScheduledDate } from "@/utils/formatScheduleDate";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface PatientClientProps {
  initialPatients: any;
}
export default function Patients({ initialPatients }: PatientClientProps) {
  const [patients, setPatients] = useState(initialPatients);

  const router = useRouter();

  return (
    <div className="flex flex-col p-6 h-[90vh]">
      <ToastContainer />
      <div>
        <h1 className="text-3xl text-gray-600 font-semibold">Patients</h1>
        <p className="text-gray-500 mt-1">
          List of your patients who's subscription status is active.
        </p>
      </div>
      <div className="flex-1 relative mt-6 border border-gray-300 rounded-lg overflow-scroll flex flex-col">
        <div className="absolute inset-0 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-md">
            <thead className="sticky top-0 z-10 bg-white shadow-sm text-center w-full font-semibold text-gray-600">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 w-[25%]">
                  Patient Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 w-[25%]">
                  Phone Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 w-[25%]">
                  Subscription Expiry
                </th>
                <th className="whitespace-nowrap px-4 py-2 w-[25%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 w-full">
              {patients?.map((patient: any) => (
                <tr
                  key={patient.id}
                  className="text-center border-b border-gray-300"
                >
                  <td className="whitespace-nowrap px-4 py-2">
                    {patient.patients.fullName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {patient.patients.phoneNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {formatScheduledDate(patient.subscriptionExpiry)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <Popover>
                      <PopoverTrigger>
                        <HiDotsHorizontal className="cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2 min-w-[150px]">
                        <button
                          className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => console.log("View Appointment")}
                        >
                          <LuSend size={20} className="text-green-500" />
                          Send Message
                        </button>
                        <button
                          className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() =>
                            router.push(`/patients/${patient.patients.id}`)
                          }
                        >
                          <MdOutlineRemoveRedEye
                            size={20}
                            className="text-customAccentColor"
                          />
                          View Details
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
