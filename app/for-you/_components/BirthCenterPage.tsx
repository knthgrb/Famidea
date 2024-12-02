"use client";
import { getInitials } from "@/utils/getUserInitials";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

export default function BirthCenterPage({ id }: { id: string }) {
  const supabase = createClient();

  const [birthCenter, setBirthCenter] = useState<any>({});
  const [services, setServices] = useState<any>([]);

  const getBirthCenterById = async () => {
    try {
      const { data: birthCenter } = await supabase
        .from("birth_centers")
        .select("*")
        .eq("id", id)
        .single();

      setBirthCenter(birthCenter);
    } catch (error) {
      console.log(error);
    }
  };

  const getServices = async () => {
    try {
      const { data: services } = await supabase
        .from("birth_center_services")
        .select("*")
        .eq("birthCenterId", id);

      setServices(services);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getBirthCenterById(), getServices()]);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <button
        className="mb-4 pl-0 rounded-lg hover:text-customAccentColor"
        onClick={() => history.back()}
      >
        <MdOutlineArrowBackIosNew />
      </button>
      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4">
          {birthCenter.avatarUrl ? (
            <Image
              src={birthCenter.avatarUrl}
              width={100}
              height={100}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              {getInitials(birthCenter?.centerName || "")}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-700">
              {birthCenter?.centerName}
            </h1>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="px-4 py-2 min-w-24 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">
            Subscribe
          </button>
          <button className="px-4 py-2 min-w-24 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600">
            Send Feedback
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label>Address</label>
        <p className="text-gray-600 mb-4">{birthCenter?.address}</p>
        <label>Phone Number</label>
        <p className="text-gray-600 mb-4">{birthCenter?.phoneNumber}</p>
      </div>
      <label>Services</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {services?.map((service: any, index: any) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {service.serviceName}
            </h3>
            <p className="text-gray-600">{service.description}</p>
            <p className="text-gray-600">Php {service.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
