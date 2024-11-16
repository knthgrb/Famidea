import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  LuCalendarClock,
  LuCalendarCheck2,
  LuCalendarDays,
} from "react-icons/lu";

export const birthCenterSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard-birth-center",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Inbox,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Calendar,
  },
  {
    title: "Services",
    url: "/services",
    icon: Search,
  },
  {
    title: "QR Code",
    url: "/scan",
    icon: Search,
  },
];

export const stats = [
  { icon: LuCalendarDays, title: "Upcoming Appointments" },
  { icon: LuCalendarCheck2, title: "Completed Appointments" },
  { icon: LuCalendarClock, title: "Subscribed Patients" },
];
