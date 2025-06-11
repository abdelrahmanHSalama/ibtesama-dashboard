import { Link, useParams } from "react-router";
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

const fetchedAppointment = {
  patient: "John Doe",
  doctor: "Dr. Abdelrahman",
  date: "25-06-2025",
  startTime: "10:00",
  endTime: "11:30",
  status: "Finished",
  chiefComplaint: ["Pain in Upper Left Quadrant"],
  diagnosis: ["Acute Pulpitis in UL7"],
  workToBeDone: ["Endo"],
  workDone: [],
  prescribedMeds: ["Brufen 600"],
  notes: [
    { _id: "1", note: "May need crown!" },
    { _id: "2", note: "May need extraction!" },
  ],
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const { notes, ...restOfAppointment } = fetchedAppointment;
  const [appointmentNotes, setAppointmenNotes] = useState(notes);
  const [appointmentData, setAppointmentData] = useState(restOfAppointment);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [tempArray, setTempArray] = useState<string[]>([]);
  const [tempValue, setTempValue] = useState("");

  const renderFieldCell = (field: (typeof tableStructure)[number]) => {
    const value = appointmentData[field.name as keyof typeof appointmentData];
    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    if (stringFields.includes(field.name)) {
      return (
        <>
          {editingField === field.name ? (
            <div className="flex justify-between items-center w-full h-[2rem]">
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
                  onClick={() => handleSave()}
                  className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                >
                  💾
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full h-[2rem]">
              <p className="flex-1">{displayValue}</p>
              <button
                onClick={() => handleEditClick(field.name)}
                className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
              >
                ✏
              </button>
            </div>
          )}
        </>
      );
    } else if (arrayFields.includes(field.name)) {
      return (
        <>
          {editingField === field.name ? (
            <div className="flex justify-between items-center w-full h-[2rem]">
              <div className="flex items-center gap-2 *:h-[2.5rem]">
                <input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="bg-transparent border border-gray-400 dark:border-white rounded px-2 py-1"
                ></input>
                <button
                  onClick={() => handleTempArray()}
                  className="border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[2rem]"
                >
                  +
                </button>
                {tempArray.map((e, index) => (
                  <p
                    className="border border-black font-medium rounded-lg p-1 text-sm dark:text-white dark:border-white transition duration-200 px-2 flex gap-1 items-center"
                    key={index}
                  >
                    {e}
                    <button
                      onClick={() => handleDeleteFromTempArray(index)}
                      className="border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200 w-[1.5rem]"
                    >
                      ×
                    </button>
                  </p>
                ))}
              </div>
              <div>
                <button
                  onClick={handleCancel}
                  className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                >
                  ❌
                </button>
                <button
                  onClick={() => handleSave()}
                  className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                >
                  💾
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full h-[2rem]">
              <p className="flex-1">{displayValue}</p>
              <button
                onClick={() => handleEditClick(field.name)}
                className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
              >
                ✏
              </button>
            </div>
          )}
        </>
      );
    } else if (field.name === "duration") {
      let durationHours =
        (Number(appointmentData.endTime.split(":")[0]) -
          Number(appointmentData.startTime.split(":")[0])) *
        60;
      let durationMinutes =
        Number(appointmentData.endTime.split(":")[1]) -
        Number(appointmentData.startTime.split(":")[1]);
      let durationTotal = durationHours + durationMinutes;
      return (
        <div className="h-[2rem] flex items-center">
          <p className="flex-1">{durationTotal}m</p>
        </div>
      );
    } else if (field.name === "status") {
      return (
        <>
          {editingField === field.name ? (
            <div className="flex justify-between items-center w-full h-[2rem]">
              <select
                className="w-max bg-transparent border border-gray-400 dark:border-white dark:bg-gray-800 rounded p-1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Finished">Finished</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div>
                <button
                  onClick={handleCancel}
                  className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                >
                  ❌
                </button>
                <button
                  onClick={() => handleSave()}
                  className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
                >
                  💾
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full h-[2rem]">
              <p className="flex-1">{displayValue}</p>
              <button
                onClick={() => handleEditClick(field.name)}
                className="ml-2 border border-black font-medium rounded-lg p-1 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
              >
                ✏
              </button>
            </div>
          )}
        </>
      );
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditingNoteId(null);
    setEditValue("");
    setTempArray([]);
    setTempValue("");
  };

  const handleTempArray = () => {
    setTempArray([...tempArray, tempValue]);
  };

  const handleDeleteFromTempArray = (indexToRemove: number) => {
    setTempArray((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleEditClick = (field: string, noteId?: string) => {
    setEditValue("");
    setTempArray([]);
    setTempValue("");

    if (field === "notes" && noteId) {
      setEditingNoteId(noteId);
      setEditingField("notes");
      const note = appointmentNotes.find((n) => n._id === noteId);
      if (note) setEditValue(note.note);
    } else {
      setEditingField(field);
      const current = appointmentData[field as keyof typeof appointmentData];

      if (arrayFields.includes(field)) {
        setTempArray(Array.isArray(current) ? current : []);
        setTempValue("");
      } else {
        setEditValue(String(current));
      }
    }
  };

  const handleSave = () => {
    if (editingField === "notes" && editingNoteId) {
      setAppointmenNotes((prev) =>
        prev.map((note) =>
          note._id === editingNoteId
            ? { ...note, note: editValue.trim() }
            : note
        )
      );
      setEditingNoteId(null);
    } else if (editingField) {
      let updatedValue;

      if (arrayFields.includes(editingField)) {
        updatedValue = tempArray;
      } else {
        updatedValue = editValue.trim();
      }

      setAppointmentData((prev) => ({
        ...prev,
        [editingField]: updatedValue,
      }));
    }
    setEditingField(null);
    setEditValue("");
    setTempArray([]);
    setTempValue("");
    console.log(appointmentData);
  };

  return (
    <div className="flex flex-col h-full gap-2 p-2 items-start dark:text-white space-y-1">
      <Link
        className="hover:underline underline-offset-2 text-sm cursor-pointer flex items-end"
        to="/appointments"
      >
        ◀ Return to Appointments
      </Link>
      <h1 className="text-2xl font-semibold">Appointment #{id}</h1>

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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentDetails;
