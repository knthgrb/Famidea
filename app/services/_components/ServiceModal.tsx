import React from "react";
import { ServiceData } from "@/lib/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceData) => void;
  serviceName: string;
  setServiceName: (name: string) => void;
  serviceDescription: string;
  setServiceDescription: (description: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  price: string;
  setPrice: (price: string) => void;
  isEditing: boolean;
  status: string;
  setStatus: (status: string) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceName,
  setServiceName,
  serviceDescription,
  setServiceDescription,
  duration,
  setDuration,
  price,
  setPrice,
  isEditing,
  status,
  setStatus,
}: ServiceModalProps) => {
  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!serviceName.trim()) {
      showToast("Service name is required", "error");
      return;
    }
    if (!serviceDescription.trim()) {
      showToast("Service description is required", "error");
      return;
    }
    if (!duration.trim()) {
      showToast("Duration is required", "error");
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }
    if (isEditing && !status) {
      showToast("Please select a status", "error");
      return;
    }

    const serviceData: ServiceData = {
      serviceName: serviceName.trim(),
      serviceDescription: serviceDescription.trim(),
      duration: duration.trim(),
      price: Number(price),
      status: isEditing ? status : "active",
    };

    onSave(serviceData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
    >
      <ToastContainer />
      <div
        className="bg-white p-8 rounded-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Service" : "Add New Service"}
        </h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label
              htmlFor="serviceName"
              className="block text-gray-600 font-medium mb-1"
            >
              Service Name *
            </label>
            <input
              id="serviceName"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter service name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="serviceDescription"
              className="block text-gray-600 font-medium mb-1"
            >
              Service Description *
            </label>
            <textarea
              id="serviceDescription"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Enter service description"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="duration"
              className="block text-gray-600 font-medium mb-1"
            >
              Duration of Service *
            </label>
            <input
              id="duration"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 1 hour, 30 minutes"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-600 font-medium mb-1"
            >
              Price (Php) *
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          {isEditing && (
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-gray-600 font-medium mb-1"
              >
                Status *
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
