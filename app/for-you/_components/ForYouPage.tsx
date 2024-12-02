"use client";
import { useUserStore } from "@/lib/store/user";
import { getNearbyBirthCenters } from "@/services/birthCenterServices_service";
import React, { useEffect, useState } from "react";
import BirthCenterCard from "./BirthCenterCard";

export default function ForYouPage() {
  const { user } = useUserStore();
  const [nearbyBirthCenters, setNearbyBirthCenters] = useState([]);

  useEffect(() => {
    const getBirthCenters = async () => {
      const nearBirthCenters = await getNearbyBirthCenters(user);
      setNearbyBirthCenters(nearBirthCenters);
    };
    getBirthCenters();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">For You</h1>
      <p className="text-gray-600 mb-4">Check birth centers near you.</p>
      <div className="flex flex-wrap gap-6 mt-8">
        {nearbyBirthCenters?.map((birthCenter: any, index) => (
          <BirthCenterCard key={index} birthCenter={birthCenter} />
        ))}
      </div>
    </div>
  );
}
