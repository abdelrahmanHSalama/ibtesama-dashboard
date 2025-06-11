// TODO: Duration if appointment spans the midnight
// TODO: Notes

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
  { name: "prescribedMeds", label: "Prescribed Medication(s)" },
];

const stringFields = ["patient", "doctor", "date", "startTime", "endTime"];
const arrayFields = [
  "chiefComplaint",
  "diagnosis",
  "workToBeDone",
  "workDone",
  "prescribedMeds",
];

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
  // notes: [],
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
  // notes: { _id: string; note: string }[];
}

const NewAppointment = () => {
  // const { notes, ...restOfAppointment } = newAppointment;
  // const [appointmentNotes, setAppointmenNotes] = useState(notes);
  // const [appointmentData, setAppointmentData] = useState<AppointmentData>(restOfAppointment);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData>(newAppointment);
  //Explain
  const [tempArray, setTempArray] = useState<Record<string, string>>({});

  const renderFieldCell = (field: (typeof tableStructure)[number]) => {
    const value = appointmentData[field.name as keyof typeof appointmentData];

    if (stringFields.includes(field.name)) {
      return (
        <div className="flex justify-between items-center w-full h-[2rem]">
          <input
            // Explain
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
            className="w-1/3 bg-transparent border border-gray-400 dark:border-white rounded px-2 py-1"
          />
        </div>
      );
    } else if (arrayFields.includes(field.name)) {
      return (
        <div className="flex gap-2 items-center w-full h-[2rem]">
          <div className="flex w-1/3 items-center gap-2 *:h-[2.5rem]">
            <input
              value={tempArray[field.name] || ""}
              onChange={(e) =>
                setTempArray((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className="bg-transparent border w-full border-gray-400 dark:border-white rounded px-2 py-1"
            ></input>
            <button
              onClick={() => handleArrayField(field.name)}
              className="border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
            >
              +
            </button>
          </div>
          {/* Explain */}
          {(value as string[]).map((item, index) => (
            <p
              className="border border-black font-medium rounded-lg p-1 text-sm dark:text-white dark:border-white transition duration-200 px-2 flex gap-1 items-center"
              key={index}
            >
              {item}
              <button
                onClick={() => handleDeleteFromTempArray(field.name, index)}
                className="border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[1.5rem]"
              >
                ×
              </button>
            </p>
          ))}
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
            durationDisplay = "Invalid time range";
          } else {
            durationDisplay = `${durationInMinutes}m`;
          }
        }
      }

      return (
        <div className="h-[2rem] flex items-center">
          <p className="flex-1">{durationDisplay}</p>
        </div>
      );
    } else if (field.name === "status") {
      return (
        <div className="flex justify-between items-center w-full h-[2rem]">
          <select
            className="w-max bg-transparent border border-gray-400 dark:border-white dark:bg-gray-800 rounded p-1"
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
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Explain
  const handleArrayField = (field: string) => {
    const valueToAdd = tempArray[field]?.trim();
    if (valueToAdd) {
      setAppointmentData((prev) => ({
        ...prev,
        [field]: [
          ...(prev[field as keyof typeof prev] as string[]),
          valueToAdd,
        ],
      }));
      // Explain
      setTempArray((prev) => ({ ...prev, [field]: "" }));
    }
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
    console.log("Appointment:", appointmentData);
    alert("Appointment saved!");
  };

  return (
    <div className="flex flex-col h-full gap-2 p-2 items-start dark:text-white space-y-1">
      <Link
        className="hover:underline underline-offset-2 text-sm cursor-pointer flex items-end"
        to="/appointments"
      >
        ◀ Return to Appointments
      </Link>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">New Appointment</h1>
        <button
          className="border-2 border-black font-medium rounded-lg p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
          onClick={handleSave}
        >
          Save Appointment
        </button>
      </div>

      <table className="w-full">
        <tbody>
          {tableStructure.map((field) => (
            <tr key={field.name} className="flex *:px-3 *:py-2 border-b">
              <td className="flex-1/4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium flex items-center">
                {field.label}
              </td>
              <td className="flex-3/4 flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 w-full">
                {renderFieldCell(field)}
              </td>
            </tr>
          ))}
          <tr className="flex *:px-3 *:py-2">
            <td className="flex-1/4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium flex items-center">
              Notes
            </td>
            <td className="flex-3/4 flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 w-full">
              Notes
            </td>
            {/* <td >
              {appointmentNotes.map((note) => (
                <div
                  key={note._id}
                  className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 rounded px-2 py-1"
                >
                  {editingField === "notes" && editingNoteId === note._id ? (
                    <>
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 bg-transparent border border-gray-400 dark:border-white rounded px-2 py-1"
                      />
                      <div>
                        <button
                          onClick={handleCancel}
                          className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                        >
                          ❌
                        </button>
                        <button
                          onClick={handleSave}
                          className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                        >
                          💾
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="flex-1">{note.note}</p>
                      <button
                        onClick={() => handleEditClick("notes", note._id)}
                        className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                      >
                        ✏
                      </button>
                    </>
                  )}
                </div>
              ))}
            </td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NewAppointment;
