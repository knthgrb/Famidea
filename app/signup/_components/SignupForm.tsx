"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signUp } from "@/services/auth_service";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/toastUtils";

export default function SignupPage() {
  const supabase = createClient();

  const [role, setRole] = useState<"patient" | "birth_center">("patient");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Redirect to home page if user is already logged in
        router.push("/");
      }
    };

    checkUser();
  }, [router, supabase]);

  // Signup handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Check if the passwords match
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    // Append role in the form
    formData.append("role", role);

    try {
      setIsLoading(true);
      await signUp(formData);
      router.push("/login");
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="mb-4"
          priority={true}
          quality={80}
        />
        <form className="flex flex-col gap-2 w-[80%]" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  value="patient"
                  checked={role === "patient"}
                  onChange={() => setRole("patient")}
                  className="mr-2"
                />
                Patient
              </label>
              <label>
                <input
                  type="radio"
                  value="birth_center"
                  checked={role === "birth_center"}
                  onChange={() => setRole("birth_center")}
                  className="mr-2"
                />
                Birth Center
              </label>
            </div>
          </div>

          {/* Conditional Name Fields */}
          {role === "patient" ? (
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName">First Name:</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="border border-customOutlineColor rounded-md px-4 py-2 w-full h-10"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="border border-customOutlineColor rounded-md px-4 py-2 w-full h-10"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="centerName">Center Name:</label>
              <input
                id="centerName"
                name="centerName"
                type="text"
                required
                className="border border-customOutlineColor rounded-md px-4 py-2 w-full h-10"
              />
            </div>
          )}

          {/* Remaining Fields */}
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="border border-customOutlineColor rounded-md px-4 py-2 w-full h-10"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="border rounded-md px-4 py-2 border-customOutlineColor h-10 w-full"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="border rounded-md px-4 py-2 border-customOutlineColor h-10 w-full"
            />
          </div>

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
              Signing up...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-customAccentColor rounded-md px-4 py-2 text-white h-10 mt-2.5"
            >
              Sign Up
            </button>
          )}
          <p className="text-center">
            Already have an account?{" "}
            <span>
              <Link href="/login" className="text-customAccentColor">
                Login
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
