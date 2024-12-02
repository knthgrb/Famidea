import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { LuUsers2 } from "react-icons/lu";
import { RiQrScan2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
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
    icon: LuUsers2,
  },
  {
    title: "Services",
    url: "/services",
    icon: Search,
  },
  {
    title: "QR Code",
    url: "/scan-qr-code",
    icon: RiQrScan2Line,
  },
  {
    title: "Feedbacks",
    url: "/feedbacks",
    icon: VscFeedback,
  },
];
export const patientSidebartItems = [
  {
    title: "For you",
    url: "/for-you",
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
];

export const stats = [
  { icon: LuCalendarDays, title: "Upcoming Appointments" },
  { icon: LuCalendarCheck2, title: "Completed Appointments" },
  { icon: LuCalendarClock, title: "Subscribed Patients" },
];
