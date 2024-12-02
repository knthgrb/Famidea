"use client";
import { useUserStore } from "@/lib/store/user";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/utils/toastUtils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BirthCenterCard({ birthCenter }: any) {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUserStore();

  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch subscription status on component load
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: existingSubscription, error: checkError } = await supabase
          .from("subscribed_patients")
          .select("*")
          .eq("birthCenterId", birthCenter.id)
          .eq("patientId", user.id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking subscription status:", checkError);
          return;
        }

        setIsSubscribed(!!existingSubscription);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscriptionStatus();
  }, [birthCenter.id, supabase, user?.id]);

  const handleSubscribe = async (birthCenterId: string) => {
    try {
      if (isSubscribed) {
        showToast("You are already subscribed to this birth center.", "error");
        return;
      }

      const subscribedAt = new Date();
      const subscriptionExpiry = new Date(
        subscribedAt.getFullYear(),
        subscribedAt.getMonth() + 1,
        subscribedAt.getDate()
      );

      // Insert new subscription
      const { data, error } = await supabase
        .from("subscribed_patients")
        .insert({
          birthCenterId: birthCenterId,
          patientId: user.id,
          subscribedOn: subscribedAt.toISOString(),
          subscriptionExpiry: subscriptionExpiry.toISOString(),
          status: "active",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIsSubscribed(true);
      showToast("Successfully subscribed to the birth center!");
    } catch (error) {
      console.error("Error subscribing to birth center:", error);
      showToast("Failed to subscribe. Please try again.", "error");
    }
  };

  return (
    <div className="w-full sm:w-full md:w-full lg:w-[320px] bg-white rounded-lg shadow-md overflow-hidden">
      <ToastContainer />
      <Image
        width={100}
        height={100}
        src={birthCenter.avatarUrl || "/images/no-avatar.jpg"}
        alt="Birth Center"
        className="w-full h-48 object-contain"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {birthCenter.centerName}
        </h3>
        <p className="text-sm text-gray-600">{birthCenter.address}</p>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 min-w-24 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
            onClick={() => {
              router.push(`/for-you/${birthCenter.id}`);
            }}
          >
            Visit
          </button>
          <button
            onClick={() => handleSubscribe(birthCenter.id)}
            className={`px-4 py-2 min-w-24 text-white text-sm font-medium rounded ${
              isSubscribed
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isSubscribed}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
