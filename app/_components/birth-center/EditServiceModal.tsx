"use client";
import React from "react";
import { ServiceData } from "@/lib/types";

interface EditServiceModalProps {
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
  status: string; // Add a status field
  setStatus: (status: string) => void; // Function to set status
}

export default function EditServiceModal({
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
  status, // Destructure status
  setStatus, // Destructure setStatus
}: EditServiceModalProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    const priceNumber = price ? Number(price) : 0; // Convert to number, or default to 0
    onSave({
      serviceName,
      serviceDescription,
      duration,
      price: priceNumber,
      status,
    });
    onClose();
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
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Service Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Service Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Duration of Service
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Price</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={price}
              placeholder="Price in Peso"
              onChange={(e) => setPrice(e.target.value)} // Keep it as a string
            />
          </div>
          {/* New Status Field */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">Status</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={status}
              onChange={(e) => setStatus(e.target.value)} // Update status on change
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
