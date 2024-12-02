"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment } from "@/lib/types";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbCheck } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import {
  deleteAppointmentRecord,
  updateCompletedAppointmentStatus,
} from "@/services/appointments_service";
import { showToast } from "@/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatScheduledDate } from "@/utils/formatScheduleDate";
import CreateAppointmentForm from "./CreateAppointmentForm";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface AppointmentsClientProps {
  initialAppointments: Record<string, Appointment[]>;
}

export default function Appointments({
  initialAppointments,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] =
    useState(initialAppointments);

  const router = useRouter();

  // Function to sort appointments by scheduled date
  const sortAppointments = (appointmentList: Appointment[]) => {
    const now = new Date();

    return [...appointmentList].sort((a, b) => {
      const dateA = new Date(a.scheduledAt);
      const dateB = new Date(b.scheduledAt);

      if (a.status === "scheduled" && b.status === "scheduled") {
        if (dateA < now && dateB >= now) return 1;
        if (dateB < now && dateA >= now) return -1;
        return dateA.getTime() - dateB.getTime();
      }

      if (a.status === "completed" && b.status === "completed") {
        if (dateA < now && dateB >= now) return -1;
        if (dateB < now && dateA >= now) return 1;
        return dateA.getTime() - dateB.getTime();
      }

      if (a.status === "canceled" && b.status === "canceled") {
        if (dateA < now && dateB >= now) return -1;
        if (dateB < now && dateA >= now) return 1;
        return dateA.getTime() - dateB.getTime();
      }

      return dateB.getTime() - dateA.getTime();
    });
  };

  // Function to filter appointments based on search term
  const filterAppointments = (
    appointments: Record<string, Appointment[]>,
    term: string
  ) => {
    const searchTermLower = term.toLowerCase();
    return {
      scheduled: appointments.scheduled.filter((appointment) =>
        appointment.patientName?.toLowerCase().includes(searchTermLower)
      ),
      completed: appointments.completed.filter((appointment) =>
        appointment.patientName?.toLowerCase().includes(searchTermLower)
      ),
      canceled: appointments.canceled.filter((appointment) =>
        appointment.patientName?.toLowerCase().includes(searchTermLower)
      ),
    };
  };

  useEffect(() => {
    const sortedAppointments = {
      scheduled: sortAppointments(initialAppointments.scheduled),
      completed: sortAppointments(initialAppointments.completed),
      canceled: sortAppointments(initialAppointments.canceled),
    };
    setAppointments(sortedAppointments);
    setFilteredAppointments(sortedAppointments);
  }, [initialAppointments]);

  // Update filtered appointments when search term changes
  useEffect(() => {
    const filtered = filterAppointments(appointments, searchTerm);
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  const handleMarkAsCompleted = async (appointmentId: any) => {
    try {
      await updateCompletedAppointmentStatus(appointmentId);
      showToast("Appointment status updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update appointment status", "error");
    }
  };

  const handleDeleteRecord = async (appointmentId: any) => {
    try {
      await deleteAppointmentRecord(appointmentId);
      showToast("Appointment record deleted.", "success");
    } catch (error) {
      showToast("Failed to delete appointment record", "error");
    }
  };

  const handleCreateAppointmentSuccess = () => {
    showToast("Appointment created successfully!", "success");
    setIsCreateModalOpen(false);
  };

  const renderTableContent = (appointments: Appointment[]) => {
    const now = new Date();

    return (
      <tbody className="divide-y divide-gray-200">
        {appointments.map((appointment) => {
          const appointmentDate = new Date(appointment.scheduledAt);
          const isUpcoming = appointmentDate >= now;
          const isPast =
            appointmentDate < now && appointment.status === "scheduled";

          return (
            <tr
              key={appointment.id}
              className={`text-center ${
                isPast
                  ? "bg-gray-50 text-gray-500"
                  : isUpcoming
                  ? "bg-white"
                  : ""
              }`}
            >
              <td className="whitespace-nowrap px-4 py-2">
                {appointment.patientName}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                {appointment.serviceName}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                {formatScheduledDate(appointment.scheduledAt)}
                {isPast && (
                  <span className="ml-2 text-xs text-red-500">(Past due)</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <div className="flex items-center justify-center">
                  <Popover>
                    <PopoverTrigger>
                      <HiDotsHorizontal className="cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 min-w-[150px]">
                      {appointment.status === "scheduled" && (
                        <>
                          <button
                            className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                            onClick={() =>
                              router.push(`/appointments/${appointment.id}`)
                            }
                          >
                            <MdOutlineRemoveRedEye
                              size={20}
                              className="text-customAccentColor"
                            />
                            View Details
                          </button>
                          <button
                            className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                            onClick={() =>
                              handleMarkAsCompleted(appointment.id)
                            }
                          >
                            <TbCheck size={20} className="text-green-500" />
                            Mark as Completed
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              <AiOutlineDelete size={20} color="red" /> Delete
                              Record
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Record?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-600/75"
                                  onClick={() =>
                                    handleDeleteRecord(appointment.id)
                                  }
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <>
                          <button
                            className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                            onClick={() =>
                              router.push(`/appointments/${appointment.id}`)
                            }
                          >
                            <MdOutlineRemoveRedEye
                              size={20}
                              className="text-blue-500"
                            />
                            View Details
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              <AiOutlineDelete size={20} color="red" /> Delete
                              Record
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Record?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-600/75"
                                  onClick={() =>
                                    handleDeleteRecord(appointment.id)
                                  }
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {appointment.status === "canceled" && (
                        <>
                          <button
                            className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                            onClick={() =>
                              router.push(`/appointments/${appointment.id}`)
                            }
                          >
                            <MdOutlineRemoveRedEye
                              size={20}
                              className="text-blue-500"
                            />
                            View Details
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm">
                              <AiOutlineDelete size={20} color="red" /> Delete
                              Record
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Record?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-600/75"
                                  onClick={() =>
                                    handleDeleteRecord(appointment.id)
                                  }
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="flex flex-col h-[90vh]">
      <ToastContainer />
      <div className="flex items-center justify-between p-4">
        <div className="">
          <h1 className="text-3xl text-gray-600 font-semibold">Appointments</h1>
          <p className="text-gray-500 mt-1">List of your Appointments.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-customAccentColor hover:bg-customAccentColor/75 text-white rounded-full p-2 md:hidden"
        >
          <LuPlus size={20} />
        </button>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden md:block font-semibold px-4 py-2 bg-customAccentColor hover:bg-customAccentColor/75 text-white rounded-lg"
        >
          Create Appointment
        </button>
      </div>
      <div className="flex-1 mx-6 mb-6 border border-gray-300 rounded-lg overflow-hidden flex flex-col">
        <Tabs defaultValue="scheduled" className="flex flex-col h-full">
          <div className="bg-white sticky top-0 z-10 border-b p-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="canceled">Canceled</TabsTrigger>
              </TabsList>
              <div className="relative w-auto">
                <input
                  type="text"
                  placeholder="Search patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-customAccentColor sm:text-sm md:text-base"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <TabsContent value="scheduled" className="flex-1 relative">
            <div className="absolute inset-0 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-md">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Patient
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Service
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Schedule
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                {renderTableContent(filteredAppointments.scheduled)}
              </table>
            </div>
          </TabsContent>
          <TabsContent value="completed" className="flex-1 relative">
            <div className="absolute inset-0 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-md">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Patient
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Service
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Schedule
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                {renderTableContent(filteredAppointments.completed)}
              </table>
            </div>
          </TabsContent>
          <TabsContent value="canceled" className="flex-1 relative">
            <div className="absolute inset-0 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-md">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Patient
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Service
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Schedule
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-600 w-[25%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                {renderTableContent(filteredAppointments.canceled)}
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateAppointmentForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateAppointmentSuccess}
      />
    </div>
  );
}
