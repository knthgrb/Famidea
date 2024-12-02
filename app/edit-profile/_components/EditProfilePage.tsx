"use client";
import { useUserStore } from "@/lib/store/user";
import { getInitials } from "@/utils/getUserInitials";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toastUtils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfilePage() {
  const { user, userRole, fetchUser } = useUserStore();

  const supabase = createClient();

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const [formData, setFormData] = useState({
    fullName: userRole === "patient" ? user?.fullName : "",
    centerName: userRole === "birth_center" ? user?.centerName : "",
    brgy: user?.address?.split(",")[0].trim(),
    municipality: user?.address?.split(",")[1].trim(),
    province: user?.address?.split(",")[2].trim(),
    zipcode: user?.address?.split(",")[3].trim(),
    country: "Philippines",
    phoneNumber: user?.phoneNumber,
    birthDate: user?.birthDate,
    gender: user?.gender,
  });

  const name = userRole === "birth_center" ? user?.centerName : user?.fullName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { brgy, municipality, province, phoneNumber, zipcode, birthDate } =
      formData;

    const complete_address = `${brgy}, ${municipality}, ${province}, ${zipcode}, ${formData.country}`;

    try {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(
          complete_address
        )}&api_key=${process.env.NEXT_PUBLIC_GEO_CODE_API_KEY}`
      );

      if (!response.ok) throw new Error("Error fetching geocode data");

      const geocodeData = await response.json();
      if (!geocodeData.length) {
        showToast(
          "Unable to find the location. Please check the address.",
          "error"
        );
        setIsSubmitting(false);
        return;
      }

      const { lat, lon } = geocodeData[0];

      if (user) {
        if (userRole === "patient") {
          const { error } = await supabase
            .from("patients")
            .update({
              fullName: formData.fullName,
              address: complete_address,
              phoneNumber: `${phoneNumber}`,
              latitude: lat,
              longitude: lon,
              birthDate: birthDate,
              gender: formData.gender,
            })
            .eq("id", user.id);

          if (error)
            throw new Error(`Error updating profile: ${error.message}`);
        } else if (userRole === "birth_center") {
          const { error } = await supabase
            .from("birth_centers")
            .update({
              centerName: formData.centerName,
              address: complete_address,
              phoneNumber: `${phoneNumber}`,
              latitude: lat,
              longitude: lon,
            })
            .eq("id", user.id);

          if (error)
            throw new Error(`Error updating profile: ${error.message}`);
        }
      }
      showToast("Profile updated successfully!", "success");
      fetchUser();
    } catch (error: any) {
      showToast(error.message || "Unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileName = `avatars/${user.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!) // Replace with your actual bucket name
        .upload(fileName, file, { upsert: true });

      if (error) throw new Error("Error uploading avatar");

      const { data: publicURL } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
        .getPublicUrl(data.path);

      const { error: updateError } = await supabase
        .from(userRole === "patient" ? "patients" : "birth_centers")
        .update({ avatarUrl: publicURL.publicUrl })
        .eq("id", user.id);

      if (updateError) throw new Error("Error updating avatar URL");

      showToast("Avatar updated successfully!", "success");
      fetchUser(); // Refresh user data
    } catch (error: any) {
      showToast(error.message || "Unexpected error occurred.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Fields configuration
  const fields = [
    {
      label: userRole === "patient" ? "Full Name" : "Center Name",
      name: userRole === "patient" ? "fullName" : "centerName",
    },
    { label: "Brgy", name: "brgy" },
    { label: "Municipality", name: "municipality" },
    { label: "Province", name: "province" },
    {
      label: "Zip Code",
      name: "zipcode",
      type: "text",
    },
    {
      label: "Country",
      name: "country",
      readOnly: true,
      defaultValue: "Philippines",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: "text",
      prefix: "+63",
    },
    ...(userRole === "patient"
      ? [
          {
            label: "Gender",
            name: "gender",
            type: "select",
            options: ["", "Male", "Female", "Other"],
          },
        ]
      : []),
    ...(userRole === "patient"
      ? [
          {
            label: "Birth Date",
            name: "birthDate",
            type: "date",
          },
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl text-gray-600 font-semibold mb-8">
        Edit Profile
      </h1>
      <div className="flex gap-6 items-center">
        <label
          htmlFor="avatarUpload"
          className="flex items-center justify-center bg-customAccentColor text-white rounded-full w-28 h-28 text-lg font-bold cursor-pointer relative"
        >
          {user?.avatarUrl ? (
            <Image
              src={user?.avatarUrl}
              width={100}
              height={100}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(name) || "?"
          )}
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </label>
        {isUploading && (
          <span className="text-sm text-gray-500">Uploading...</span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-8">
        {fields.map((field, idx) => (
          <div key={idx} className="col-span-2 sm:col-span-1">
            <label className="block font-semibold text-customPrimaryTextColor mb-1">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border rounded-md py-2"
              >
                {field.options?.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex">
                {field.prefix && (
                  <span className="border rounded-l-md py-2 px-3 bg-gray-200">
                    {field.prefix}
                  </span>
                )}
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  readOnly={field.readOnly}
                  className={`w-full ${
                    field.prefix ? "rounded-r-md" : "rounded-md"
                  } border px-4 py-2`}
                />
              </div>
            )}
          </div>
        ))}
        <div className="col-span-2 flex justify-start">
          <button
            type="submit"
            className="bg-customAccentColor text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
