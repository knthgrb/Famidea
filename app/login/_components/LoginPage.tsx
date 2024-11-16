"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { login } from "@/services/auth_service";
import LoaderComponent from "@/components/LoaderComponent";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";
import { useUserStore } from "@/lib/store/user";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUserStore();

  const supabase = createClient();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Authentication error:", authError);
        router.push("/login");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        router.push("/login");
        setLoading(false);
        return;
      }

      // Fetch user role
      const { data: userData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      // FETCH PATIENT USER DATA AND SET TO STORE
      if (userData?.role === "patient") {
        const { data: patientDetails } = await supabase
          .from("patients")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (patientDetails) setUser(patientDetails);

        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("userRole", "patient");
        }
      }

      // FETCH BIRTH CENTER USER DATA AND SET TO STORE
      if (userData?.role === "birth_center") {
        const { data: birthCenterDetails } = await supabase
          .from("birth_centers")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (birthCenterDetails) setUser(birthCenterDetails);

        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("userRole", "birth_center");
        }
      }

      // Route based on role
      if (userData) {
        switch (userData.role) {
          case "patient":
            router.push("/dashboard-patient");
            break;
          case "birth_center":
            router.push("/dashboard-birth-center");
            break;
          default:
            router.push("/login"); // Fallback route
        }
      } else {
        // No user data found
        router.push("/login");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [supabase, router]);

  // Login handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsLoading(true);

    try {
      await login(formData);
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <LoaderComponent />;

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <ToastContainer />
      <div className="w-[60%] hidden md:flex h-screen items-center justify-center bg-customBackgroundColor">
        <Image
          src="/images/login_image.png"
          alt="logo"
          width={700}
          height={700}
        />
      </div>
      <div className="w-full md:w-[40%] flex flex-col items-center justify-center h-screen gap-1">
        <Image
          src="/images/blue_logo.png"
          alt="logo"
          width={200}
          height={200}
          className="mb-10"
          priority={true}
          quality={80}
        />
        <form className="flex flex-col gap-4 w-[80%]" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-customOutlineColor rounded-md px-4 py-2 w-full h-10"
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border rounded-md px-4 py-2 border-customOutlineColor h-10"
          />
          {isLoading ? (
            <button
              type="submit"
              className="flex item-center justify-center bg-customAccentColor rounded-md px-4 py-2 text-white h-10 mt-2.5"
              disabled
            >
              <svg
                color="white"
                className="text animate-spin h-5 w-5 mr-3 ..."
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Logging in...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-customAccentColor rounded-md px-4 py-2 text-white h-10 mt-2.5"
            >
              Log In
            </button>
          )}

          <Link href="/signup" className="text-customAccentColor">
            Forgot Password?
          </Link>
          <p className="text-center">
            New on our platform?{" "}
            <span>
              <Link href="/signup" className="text-customAccentColor">
                Signup
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
