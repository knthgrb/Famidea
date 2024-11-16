"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    // role: formData.get("role") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    throw new Error(error.message);
  }

  const { data: userData, error: userDataError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (userDataError) {
    throw new Error(userDataError.message);
  }

  if (userData?.role === "patient") {
    const { data: patientData, error: patientDataError } = await supabase
      .from("patients")
      .select("address, phoneNumber")
      .eq("id", authData.user.id)
      .single();

    if (patientDataError) {
      throw new Error(patientDataError.message);
    }

    if (!patientData?.address || !patientData?.phoneNumber) {
      // Redirect to complete profile page if address or phone number is missing
      redirect("/complete-profile");
    }
  } else if (userData?.role === "birth_center") {
    const { data: birthCenterData, error: birthCenterDataError } =
      await supabase
        .from("birth_centers")
        .select("address, phoneNumber")
        .eq("id", authData.user.id)
        .single();

    if (birthCenterDataError) {
      throw new Error(birthCenterDataError.message);
    }

    if (!birthCenterData?.address || !birthCenterData?.phoneNumber) {
      // Redirect to complete profile page if address or phone number is missing
      redirect("/complete-profile");
    }
  }

  if (userData?.role === "birth_center") {
    redirect("/dashboard-birth-center");
  } else if (userData?.role === "patient") {
    redirect("/dashboard-patient");
  }

  revalidatePath("/login", "layout");
}

export async function signUp(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as string;
  const fullName = `${firstName} ${lastName}`;
  const centerName = formData.get("centerName") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user?.id;

  // Insert the user data into user_data table
  const { error: insertError } = await supabase
    .from("user_roles")
    .insert({ id: userId, role });

  if (insertError) {
    throw new Error(insertError.message);
  }

  // Depending on the role, insert data into patients or birth_centers table
  if (role === "patient") {
    const { error: patientError } = await supabase
      .from("patients")
      .insert({ id: userId, fullName: fullName });

    if (patientError) {
      throw new Error(patientError.message);
    }
  } else if (role === "birth_center") {
    const { error: centerError } = await supabase
      .from("birth_centers")
      .insert({ id: userId, centerName: centerName });

    if (centerError) {
      throw new Error(centerError.message);
    }
  }

  // Remove this one once SMTP server is available for email confirmation
  // Destroy the session after signup
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
}
