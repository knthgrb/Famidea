"use server";

import { createClient } from "@/utils/supabase/server";
import { DatabaseServiceData, ServiceData } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function fetchServices() {
  const supabase = createClient();

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found. Please try logging in again.");
    }

    const { data, error } = await supabase
      .from("birth_center_services")
      .select("*")
      .eq("birthCenterId", user.user.id)
      .order("created_at", { ascending: false })
      .returns<DatabaseServiceData[]>();

    if (error) throw error;
    if (!data) return [];

    const formattedServices: ServiceData[] = data.map((service) => ({
      id: service.id,
      birthCenterId: service.birthCenterId,
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      duration: service.duration,
      price: service.price,
      status: service.status || "active",
      created_at: service.created_at,
    }));

    return formattedServices;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch services"
    );
  }
}

export async function saveService(serviceData: ServiceData) {
  const supabase = createClient();

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found. Please try logging in again.");
    }

    const { data, error } = await supabase
      .from("birth_center_services")
      .insert([
        {
          birthCenterId: user.user.id,
          serviceName: serviceData.serviceName,
          serviceDescription: serviceData.serviceDescription,
          duration: serviceData.duration,
          price: serviceData.price,
          status: serviceData.status || "active",
        },
      ])
      .select();

    if (error) throw error;
    if (!data) throw new Error("No data returned from insert");

    revalidatePath("/services");
    return data[0];
  } catch (error) {
    console.error("Error saving service:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save service"
    );
  }
}

export async function editService(id: number, serviceData: ServiceData) {
  const supabase = createClient();

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found. Please try logging in again.");
    }

    const { data, error } = await supabase
      .from("birth_center_services")
      .update({
        serviceName: serviceData.serviceName,
        serviceDescription: serviceData.serviceDescription,
        duration: serviceData.duration,
        price: serviceData.price,
        status: serviceData.status || "active",
      })
      .eq("id", id)
      .eq("birthCenterId", user.user.id) // Additional security check
      .select();

    if (error) throw error;
    if (!data)
      throw new Error(
        "Service not found or you don't have permission to edit it"
      );

    revalidatePath("/services");
    return data[0];
  } catch (error) {
    console.error("Error editing service:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to edit service"
    );
  }
}

export async function deleteService(id: number) {
  const supabase = createClient();

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found. Please try logging in again.");
    }

    const { error } = await supabase
      .from("birth_center_services")
      .delete()
      .eq("id", id)
      .eq("birthCenterId", user.user.id); // Additional security check

    if (error) throw error;

    revalidatePath("/services");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete service"
    );
  }
}
