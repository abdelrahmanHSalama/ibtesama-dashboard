// TODO: Light Mode
// TODO: Start and End Time

import { Link } from "react-router";
import { useState } from "react";

const tableStructure = [
  { name: "patient", label: "Patient" },
  { name: "doctor", label: "Doctor" },
  { name: "date", label: "Date" },
  { name: "startTime", label: "Start Time" },
  { name: "endTime", label: "End Time" },
  { name: "duration", label: "Duration" },
  { name: "status", label: "Status" },
  { name: "chiefComplaint", label: "Chief Complaint" },
  { name: "diagnosis", label: "Diagnosis" },
  { name: "workToBeDone", label: "To Be Done" },
  { name: "workDone", label: "Done" },
  { name: "prescribedMeds", label: "Prescribed Medication" },
];

const stringFields = ["patient", "doctor"];
const arrayFields = [
  "chiefComplaint",
  "diagnosis",
  "workToBeDone",
  "workDone",
  "prescribedMeds",
  "notes",
];
const timeFields = ["startTime", "endTime"];
const requiredFields = ["patient", "doctor", "date"];

const newAppointment: AppointmentData = {
  patient: "",
  doctor: "",
  date: "",
  startTime: "",
  endTime: "",
  status: "",
  chiefComplaint: [],
  diagnosis: [],
  workToBeDone: [],
  workDone: [],
  prescribedMeds: [],
  notes: [],
};

interface AppointmentData {
  patient: string;
  doctor: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  chiefComplaint: string[];
  diagnosis: string[];
  workToBeDone: string[];
  workDone: string[];
  prescribedMeds: string[];
  notes: { _id: string; note: string }[];
}

const NewAppointment = () => {
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData>(newAppointment);
  //Explain
  const [tempArray, setTempArray] = useState<Record<string, string>>({});

  const renderFieldCell = (field: (typeof tableStructure)[number]) => {
    const value = appointmentData[field.name as keyof typeof appointmentData];

    if (stringFields.includes(field.name)) {
      return (
        <div className="flex justify-between items-center w-full">
          <input
            // Explain
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
            className="w-full bg-transparent border border-gray-400 dark:border-white rounded-md p-1"
            required={requiredFields.includes(field.name)}
          />
        </div>
      );
    } else if (arrayFields.includes(field.name)) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-1 items-center gap-2">
            <input
              value={tempArray[field.name] || ""}
              onChange={(e) =>
                setTempArray((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className="w-full bg-transparent border border-gray-400 dark:border-white rounded-md p-1"
            ></input>
            <button
              onClick={() => handleArrayField(field.name)}
              className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
            >
              +
            </button>
          </div>
          {(value as string[]).map((item, index) => (
            <div
              className="dark:bg-gray-700 p-1 text-sm dark:text-white dark:border-white transition duration-200 flex gap-2 items-center justify-between rounded-md"
              key={index}
            >
              <span>{item}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteFromTempArray(field.name, index)}
                  className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteFromTempArray(field.name, index)}
                  className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (timeFields.includes(field.name)) {
      return (
        <div className="flex justify-between items-center w-full">
          <input
            type="time"
            className="text-white bg-transparent border border-gray-400 dark:border-white rounded-md p-1"
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
          ></input>
        </div>
      );
    } else if (field.name === "date") {
      return (
        <div className="flex justify-between items-center w-full">
          <input
            type="date"
            className="bg-transparent border border-gray-400 dark:border-white rounded-md p-1 uppercase"
            onChange={(e) => handleStringField(field.name, e.target.value)}
            required={requiredFields.includes(field.name)}
          ></input>
        </div>
      );
    } else if (field.name === "status") {
      return (
        <div className="flex justify-between items-center w-full">
          <select
            className="w-max bg-transparent border border-gray-400 dark:border-white dark:bg-gray-800 rounded-md p-1"
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      );
    } else if (field.name === "duration") {
      const { startTime, endTime } = appointmentData;
      let durationDisplay = "";

      if (startTime && endTime) {
        const [startHourStr, startMinuteStr] = startTime.split(":");
        const [endHourStr, endMinuteStr] = endTime.split(":");

        const startHour = Number(startHourStr);
        const startMinute = Number(startMinuteStr);
        const endHour = Number(endHourStr);
        const endMinute = Number(endMinuteStr);

        if (
          !isNaN(startHour) &&
          !isNaN(startMinute) &&
          !isNaN(endHour) &&
          !isNaN(endMinute)
        ) {
          const totalStartMinutes = startHour * 60 + startMinute;
          const totalEndMinutes = endHour * 60 + endMinute;

          let durationInMinutes = totalEndMinutes - totalStartMinutes;

          if (durationInMinutes < 0) {
            durationInMinutes += 24 * 60;
          }
          durationDisplay = `${durationInMinutes}m`;
        }
      }

      return (
        <div className="flex items-center">
          <p className="flex-1">{durationDisplay}</p>
        </div>
      );
    } else if (field.name === "status") {
      return (
        <div className="flex justify-between items-center w-full">
          <select
            className="w-max bg-transparent border border-gray-400 dark:border-white dark:bg-gray-800 rounded-md p-1"
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      );
    }
  };

  const handleStringField = (field: string, value: string) => {
    const valueToAdd = value.trim();
    if (!valueToAdd) return;
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Explain
  const handleArrayField = (field: string) => {
    const valueToAdd = tempArray[field]?.trim();
    if (!valueToAdd) return;

    setAppointmentData((prev) => {
      if (field === "notes") {
        return {
          ...prev,
          notes: [
            ...prev.notes,
            { _id: crypto.randomUUID(), note: valueToAdd },
          ],
        };
      } else {
        return {
          ...prev,
          [field]: [
            ...(prev[field as keyof typeof prev] as string[]),
            valueToAdd,
          ],
        };
      }
    });

    setTempArray((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDeleteFromTempArray = (field: string, indexToRemove: number) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSave = () => {
    const { patient, doctor, date } = appointmentData;
    if (!patient || !doctor || !date) {
      alert("Please fill in required fields.");
      return;
    }
    console.log("Appointment:", appointmentData);
    alert("Appointment saved!");
  };

  return (
    <div className="flex flex-col h-full gap-2 p-1 items-start dark:text-white space-y-1">
      <Link
        className="hover:underline underline-offset-2 text-sm cursor-pointer flex items-end"
        to="/appointments"
      >
        ◀ Return to Appointments
      </Link>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">New Appointment</h1>
        <button
          className="border border-black rounded-md p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
          onClick={handleSave}
          type="submit"
        >
          Save Appointment
        </button>
      </div>

      <form className="w-full">
        <table className="w-full">
          <tbody>
            {tableStructure.map((field) => (
              <tr key={field.name} className="flex *:p-2 border-b">
                <td className="flex-1/4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white flex gap-1 items-center">
                  <span className="font-medium">{field.label}</span>
                  {requiredFields.includes(field.name) ? (
                    <span className="text-red-600 text-sm">(Required)</span>
                  ) : (
                    ""
                  )}
                </td>
                <td className="flex-3/4 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 w-full justify-center">
                  {renderFieldCell(field)}
                </td>
              </tr>
            ))}
            <tr className="flex *:p-2">
              <td className="flex-1/4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium flex items-center">
                Notes
              </td>
              <td className="flex-3/4 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={tempArray["notes"] || ""}
                      onChange={(e) =>
                        setTempArray((prev) => ({
                          ...prev,
                          ["notes"]: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent border border-gray-400 dark:border-white rounded-md p-1"
                    ></input>
                    <button
                      onClick={() => handleArrayField("notes")}
                      className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                    >
                      +
                    </button>
                  </div>
                  {(appointmentData.notes || []).map((item, index) => (
                    <div
                      className="dark:bg-gray-700 text-sm dark:text-white dark:border-white transition duration-200 p-1 flex gap-2 items-center justify-between rounded-md"
                      key={index}
                    >
                      <span>{item.note}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleDeleteFromTempArray("notes", index)
                          }
                          className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFromTempArray("notes", index)
                          }
                          className="border border-black font-medium rounded-md p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default NewAppointment;
