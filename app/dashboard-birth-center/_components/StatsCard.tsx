import React from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  title: string;
  value: number;
}

export default function StatsCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <div className="border border-gray-300 p-4 rounded-lg h-36">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-2 rounded-lg bg-gray-200">
          <Icon size={20} />
        </div>
        <p className="text-sm">{title}</p>
      </div>
      <p className="text-4xl font-semibold text-gray-700 mt-8 sm:mt-8 sm:ml-auto">
        {value}
      </p>
    </div>
  );
}
