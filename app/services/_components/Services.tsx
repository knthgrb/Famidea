"use client";
import React, { useEffect, useState, useOptimistic } from "react";
import { ServiceData } from "@/lib/types";
import ServiceModal from "@/app/services/_components/ServiceModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";
import {
  editService,
  saveService,
  deleteService,
} from "@/services/birthCenterServices_service";
import { LuTrash, LuPenLine, LuPlus } from "react-icons/lu";
import { convertDurationToWords } from "@/utils/convertDurationToWords";
import { v4 as uuidv4 } from "uuid";
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
interface ServicesClientProps {
  initialServices: ServiceData[];
}

export default function Services({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [optimisticServices, addOptimisticService] = useOptimistic(
    services,
    (state: ServiceData[], newService: ServiceData) => {
      if (newService.id) {
        return state.map((s) => (s.id === newService.id ? newService : s));
      }
      return [...state, newService];
    }
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serviceName, setServiceName] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("active");
  const [currentServiceId, setCurrentServiceId] = useState<number | null>(null);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const handleAddService = (): void => {
    setIsModalOpen(true);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = (): void => {
    setServiceName("");
    setServiceDescription("");
    setDuration("");
    setPrice("");
    setStatus("active");
    setCurrentServiceId(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveService = async (serviceData: ServiceData): Promise<void> => {
    try {
      if (isEditing && currentServiceId) {
        const updatedService = {
          ...serviceData,
          id: currentServiceId,
        };
        await editService(currentServiceId, updatedService);
        addOptimisticService(updatedService);
        showToast("Service updated successfully!", "success");
      } else {
        const newService = {
          ...serviceData,
          id: Number(uuidv4()),
          status: "active",
        };
        await saveService(serviceData);
        addOptimisticService(newService);
        showToast("Service added successfully!", "success");
      }
      handleCloseModal();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to save service. Please try again.",
        "error"
      );
    }
  };

  const handleEditService = (service: ServiceData): void => {
    setIsEditing(true);
    setCurrentServiceId(service.id ?? null);
    setServiceName(service.serviceName);
    setServiceDescription(service.serviceDescription);
    setDuration(service.duration);
    setPrice(service.price.toString());
    setStatus(service.status || "active");
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id: number): Promise<void> => {
    try {
      // Optimistic update
      await deleteService(id);
      showToast("Service deleted successfully!", "success");
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      // Revert optimistic update on error
      setServices(initialServices);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete service. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col p-6 h-[90vh]">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-gray-600 font-semibold">Services</h1>
          <p className="text-gray-500 mt-1">Manage services that you offer.</p>
        </div>
        <button
          onClick={handleAddService}
          className="bg-customAccentColor hover:bg-customAccentColor/75 text-white rounded-full p-2 md:hidden"
        >
          <LuPlus size={20} />
        </button>
        <button
          onClick={handleAddService}
          className="hidden md:block font-semibold px-4 py-2 bg-customAccentColor hover:bg-customAccentColor/75 text-white rounded-lg"
        >
          Add Service
        </button>
      </div>
      <div className="flex-1 relative mt-6 border border-gray-300 rounded-lg overflow-scroll flex flex-col">
        <div className="absolute inset-0 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-md">
            <thead className="sticky top-0 z-10 bg-white shadow-sm text-center w-full font-semibold text-gray-600">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 w-[20%]">
                  Service Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 w-[20%]">
                  Duration
                </th>
                <th className="whitespace-nowrap px-4 py-2 w-[20%]">Price</th>
                <th className="whitespace-nowrap px-4 py-2 w-[20%]">Status</th>
                <th className="whitespace-nowrap px-4 py-2 w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 w-full">
              {optimisticServices.length > 0 ? (
                optimisticServices.map((service) => (
                  <tr className="text-center" key={service.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-550 font-semibold">
                      {service.serviceName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      {convertDurationToWords(service.duration)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      P{service.price}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${
                          service.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.status || "active"}
                      </span>
                    </td>
                    <td className="mt-0.5 whitespace-nowrap px-4 py-2 text-gray-500 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <LuPenLine size={20} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger className="text-gray-500 hover:text-gray-700">
                          <LuTrash size={20} />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the service.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-600/75"
                              onClick={() =>
                                service.id && handleDeleteService(service.id)
                              }
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    No services available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveService}
        serviceName={serviceName}
        setServiceName={setServiceName}
        serviceDescription={serviceDescription}
        setServiceDescription={setServiceDescription}
        duration={duration}
        setDuration={setDuration}
        price={price}
        setPrice={setPrice}
        isEditing={isEditing}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
}
