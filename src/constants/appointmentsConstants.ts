export interface AppointmentData {
  id?: string;
  patientName: string;
  doctorName: string;
  date?: string;
  startTime: string;
  endTime: string;
  status: string;
  chiefComplaint: string[];
  diagnosis: string[];
  workToBeDone: string[];
  workDone: string[];
  prescribedMeds: string[];
  notes: string[];
}

export type AppointmentsByDate = {
  [date: string]: AppointmentData[];
};

export type TableField = keyof AppointmentData | "time" | "duration";

export type AppointmentStatus =
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "No Show";

export interface Messages {
  time: string | null;
  submission: string | null;
}

export const tableStructure: { name: TableField; label: string }[] = [
  { name: "patientName", label: "Patient" },
  { name: "doctorName", label: "Doctor" },
  { name: "date", label: "Date" },
  { name: "time", label: "Time" },
  { name: "duration", label: "Duration" },
  { name: "status", label: "Status" },
  { name: "chiefComplaint", label: "Chief Complaint" },
  { name: "diagnosis", label: "Diagnosis" },
  { name: "workToBeDone", label: "To Be Done" },
  { name: "workDone", label: "Done" },
  { name: "prescribedMeds", label: "Prescribed Medications" },
  { name: "notes", label: "Notes" },
];

export const stringFields: (keyof AppointmentData)[] = [
  "patientName",
  "doctorName",
];
export const arrayFields: (keyof AppointmentData)[] = [
  "chiefComplaint",
  "diagnosis",
  "workToBeDone",
  "workDone",
  "prescribedMeds",
  "notes",
];

export const requiredFields = ["patientName", "date"];

export const statusOptions = ["Pending", "Finished", "Cancelled"];

export const inputFieldStyles =
  "w-full bg-transparent border border-black dark:border-white rounded-md p-1";
export const timeFieldStyles =
  "bg-transparent border border-black dark:border-white rounded-md p-1";
export const buttonStyles =
  "border border-black rounded-md p-1 text-sm cursor-pointer dark:text-white dark:border-white hover:transition-colors hover:duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-gray-900 h-full";
export const arrayStyles =
  "bg-gray-200 dark:bg-gray-700 p-1 dark:text-white dark:border-white flex gap-1 items-center justify-between rounded-md";
