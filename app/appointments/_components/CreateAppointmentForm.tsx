import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment } from "@/services/appointments_service";
import { showToast } from "@/utils/toastUtils";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isAfter, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUserStore } from "@/lib/store/user";
import { getSubscribedPatients } from "@/services/patients_service";
import { fetchServices } from "@/services/birthCenter_service";
import { ServiceData, SubscribedPatient } from "@/lib/types";

interface CreateAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  patient?: string;
  service?: string;
  date?: string;
  time?: string;
}

export default function CreateAppointmentForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateAppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<
    number | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [patients, setPatients] = useState<SubscribedPatient[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setIsFetching(true);
        const [patientsData, servicesData] = await Promise.all([
          getSubscribedPatients(user.id),
          fetchServices(),
        ]);

        if (patientsData) {
          setPatients(patientsData);
        }
        if (servicesData) {
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const getPatientName = (patientId: string): string => {
    const patient = patients.find((p) => p.patientId === patientId);
    return patient?.patients?.fullName || "Unknown Patient";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedPatient) {
      newErrors.patient = "Please select a patient";
    }
    if (!selectedServiceId) {
      newErrors.service = "Please select a service";
    }
    if (!date) {
      newErrors.date = "Please select a date";
    } else if (!isAfter(date, startOfDay(new Date()))) {
      newErrors.date = "Please select a future date";
    }
    if (!time) {
      newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (!date || !user?.id || !selectedServiceId)
        throw new Error("Missing required data");

      const [hours, minutes] = time.split(":");
      const appointmentDate = new Date(date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await createAppointment({
        birthCenterId: user.id,
        patientId: selectedPatient,
        serviceId: selectedServiceId,
        scheduledAt: appointmentDate,
        status: "scheduled",
      });

      onSuccess();
      handleReset();
    } catch (error) {
      showToast("Failed to create appointment", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDate(undefined);
    setTime("");
    setSelectedPatient("");
    setSelectedServiceId(undefined);
    setSearchPatient("");
    setErrors({});
    onClose();
  };

  if (isFetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading form data...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient</label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => setIsPopoverOpen((prev) => !prev)}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    errors.patient && "border-red-500"
                  )}
                >
                  {selectedPatient
                    ? getPatientName(selectedPatient)
                    : "Select patient..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search patient..."
                    value={searchPatient}
                    onValueChange={setSearchPatient}
                  />
                  <CommandList>
                    <CommandEmpty>No patient found.</CommandEmpty>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.patientId}
                        onSelect={() => {
                          setSelectedPatient(patient.patientId);
                          setSearchPatient("");
                          setIsPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPatient === patient.patientId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {getPatientName(patient.patientId)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.patient && (
              <p className="text-sm text-red-500">{errors.patient}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service</label>
            <Select
              onValueChange={(value) => {
                setSelectedServiceId(Number(value));
                setErrors((prev) => ({ ...prev, service: undefined }));
              }}
              value={selectedServiceId?.toString()}
            >
              <SelectTrigger className={cn(errors.service && "border-red-500")}>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) =>
                  service.id ? (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.serviceName} - ${service.price}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-sm text-red-500">{errors.service}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date and Time</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    disabled={(date) => !isAfter(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className={cn("w-[130px]", errors.time && "border-red-500")}
              />
            </div>
            {(errors.date || errors.time) && (
              <p className="text-sm text-red-500">
                {errors.date || errors.time}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-customAccentColor hover:bg-customAccentColor/90"
            >
              {isLoading ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
