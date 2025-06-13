export interface AppointmentData {
  patientName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  chiefComplaint: string[];
  diagnosis: string[];
  workToBeDone: string[];
  workDone: string[];
  prescribedMeds: string[];
  notes: { _id: string; note: string }[];
}

export const tableStructure: {
  name: keyof AppointmentData;
  label: string;
}[] = [
  { name: "patientName", label: "Patient" },
  { name: "doctorName", label: "Doctor" },
  { name: "date", label: "Date" },
  { name: "startTime", label: "Start Time" },
  { name: "endTime", label: "End Time" },
  { name: "duration", label: "Duration" },
  { name: "status", label: "Status" },
  { name: "chiefComplaint", label: "Chief Complaint" },
  { name: "diagnosis", label: "Diagnosis" },
  { name: "workToBeDone", label: "To Be Done" },
  { name: "workDone", label: "Done" },
  { name: "prescribedMeds", label: "Prescribed Medications" },
  { name: "notes", label: "Notes" },
];

export const stringFields = ["patientName", "doctorName"];
export const arrayFields = [
  "chiefComplaint",
  "diagnosis",
  "workToBeDone",
  "workDone",
  "prescribedMeds",
];
export const timeFields = ["startTime", "endTime"];
export const requiredFields = ["patientName", "doctorName", "date"];

export const statusOptions = ["Pending", "Finished", "Cancelled"];

export const inputFieldStyles =
  "w-full bg-transparent border border-black dark:border-white rounded-md p-1";
export const timeFieldStyles =
  "bg-transparent border border-black dark:border-white rounded-md p-1";
export const buttonStyles =
  "border border-black font-medium rounded-md p-1 text-sm cursor-pointer w-[2rem] dark:text-white dark:border-white hover:transition-colors hover:duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-gray-900";
export const arrayStyles =
  "bg-gray-200 dark:bg-gray-700 p-1 text-sm dark:text-white dark:border-white flex gap-2 items-center justify-between rounded-md";
