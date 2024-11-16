"use client"; // Ensures this component is rendered on the client side

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path based on your project structure

export default function ConfirmEmailPage() {
  const [isResending, setIsResending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showResendOptions, setShowResendOptions] = useState<boolean>(false);

  const supabase = createClient();

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    // Check if the email field is filled
    if (!email) {
      setMessage("Please enter your email.");
      setIsResending(false);
      return;
    }

    // Resend confirmation email using the resend method
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      setMessage("Error resending confirmation email. Please try again.");
    } else {
      setMessage("Confirmation email resent! Please check your inbox.");
    }

    setIsResending(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 border border-gray-300 rounded-lg bg-white shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2">Confirm your email</h2>
        <p className="text-gray-600 mb-4">
          If you did not receive an email, click the button below.
        </p>

        {/* Show resend options if the user clicks on the link */}
        {!showResendOptions ? (
          <button
            onClick={() => setShowResendOptions(true)}
            className="text-blue-500 hover:underline"
          >
            Did not receive an email?
          </button>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <button
              onClick={handleResend}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend Confirmation Email"}
            </button>
          </>
        )}

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>
    </div>
  );
}
