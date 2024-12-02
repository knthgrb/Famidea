"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";

export default function CompleteProfile() {
  const supabase = createClient();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<string>("");

  const [formData, setFormData] = useState({
    brgy: "",
    municipality: "",
    province: "",
    zipcode: "",
    country: "Philippines",
    phoneNumber: "",
    age: "",
    gender: "",
    birthDate: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: userDetails, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (error) {
            console.error("Error fetching user details:", error);
            return;
          }

          setRole(userDetails?.role);
        }
      } catch (err) {
        console.error("Error in fetchUser:", err);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      brgy,
      municipality,
      province,
      phoneNumber,
      zipcode,
      age,
      gender,
      birthDate,
    } = formData;

    if (
      role === "patient" &&
      (!brgy ||
        !municipality ||
        !zipcode ||
        !province ||
        !phoneNumber ||
        !age ||
        !gender ||
        !birthDate)
    ) {
      showToast("Please fill out all required fields.", "error");
      setIsSubmitting(false);
      return;
    } else if (
      role === "birth_center" &&
      (!brgy || !municipality || !province || !phoneNumber || !zipcode)
    ) {
      showToast("Please fill out all required fields.", "error");
      setIsSubmitting(false);
      return;
    }

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
      const user = await supabase.auth.getUser();

      if (user.data.user) {
        if (role === "patient") {
          const { error } = await supabase
            .from("patients")
            .update({
              address: complete_address,
              phoneNumber: `+63${phoneNumber}`,
              latitude: lat,
              longitude: lon,
              age,
              gender,
              birthDate: birthDate,
            })
            .eq("id", user.data.user.id);

          if (error)
            throw new Error(`Error updating profile: ${error.message}`);

          router.push("/for-you");
        } else if (role === "birth_center") {
          const { error } = await supabase
            .from("birth_centers")
            .update({
              address: complete_address,
              phoneNumber: `+63${phoneNumber}`,
              latitude: lat,
              longitude: lon,
            })
            .eq("id", user.data.user.id);

          if (error)
            throw new Error(`Error updating profile: ${error.message}`);

          router.push("/dashboard-birth-center");
        }
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      showToast(error.message || "Unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (role === "patient")
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <ToastContainer />
        <div className="max-w-md w-full mx-auto p-4">
          <h1 className="text-2xl font-bold text-customPrimaryTextColor mb-4">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: "Brgy", name: "brgy" },
              { label: "Municipality", name: "municipality" },
              { label: "Province", name: "province" },
              {
                label: "Zip Code",
                name: "zipcode",
                type: "text",
                pattern: "\\d*",
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
              { label: "Age", name: "age", type: "number" },
              {
                label: "Gender",
                name: "gender",
                type: "select",
                options: ["", "Male", "Female", "Other"],
              },
              { label: "Birth Date", name: "birthDate", type: "date" },
            ].map((field, idx) => (
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
                      pattern={field.pattern}
                      className={`w-full ${
                        field.prefix ? "rounded-r-md" : "rounded-md"
                      } border px-4 py-2`}
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="col-span-2 bg-customAccentColor text-white font-semibold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    );

  if (role === "birth_center")
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <ToastContainer />
        <div className="max-w-md w-full mx-auto p-4">
          <h1 className="text-2xl font-bold text-customPrimaryTextColor mb-4">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: "Brgy", name: "brgy" },
              { label: "Municipality", name: "municipality" },
              { label: "Province", name: "province" },
              {
                label: "Zip Code",
                name: "zipcode",
                type: "text",
                pattern: "\\d*",
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
            ].map((field, idx) => (
              <div key={idx} className="col-span-2 sm:col-span-1">
                <label className="block font-semibold text-customPrimaryTextColor mb-1">
                  {field.label}
                </label>
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
                    pattern={field.pattern}
                    className={`w-full ${
                      field.prefix ? "rounded-r-md" : "rounded-md"
                    } border px-4 py-2`}
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="col-span-2 bg-customAccentColor text-white font-semibold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    );
}
