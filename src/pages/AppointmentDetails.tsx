import { Link, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";

import { EditButtons } from "../components/AppointmentDetailsEditButtons";

import {
  tableStructure,
  stringFields,
  arrayFields,
  timeFields,
  requiredFields,
  inputFieldStyles,
  timeFieldStyles,
  buttonStyles,
  arrayStyles,
  statusOptions,
  type AppointmentData,
} from "../constants/appointmentsConstants";

const fetchedAppointment: AppointmentData = {
  patientName: "John Doe",
  doctorName: "Dr. Abdelrahman",
  date: "25-06-2025",
  startTime: "10:00",
  endTime: "11:30",
  duration: "",
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
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData>(fetchedAppointment);
  const [tempArray, setTempArray] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState("");
  const [editingArrayItem, setEditingArrayItem] = useState<{
    field: string;
    index: number;
  } | null>(null);
  const [localEdit, setLocalEdit] = useState<Record<string, any>>({});

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:9000/api/appointment/${id}`);
      const fetchedData = await res.json();
      setAppointmentData(fetchedData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Appointment:", appointmentData);
  }, [appointmentData]);

  useEffect(() => {
    console.log("ID:", id);
  }, [id]);

  function toInputDateFormat(date: string): string {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  }

  function fromInputDateFormat(input: string): string {
    const [year, month, day] = input.split("-");
    return `${day}-${month}-${year}`;
  }

  const cancelLocalEdit = (key: string, isArrayItem: boolean = false) => {
    setLocalEdit((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    if (isArrayItem) {
      setEditingArrayItem(null);
    } else {
      setEditingField("");
    }
  };

  const saveLocalEdit = ({
    fieldName,
    value,
    index,
    isArrayItem = false,
  }: {
    fieldName: keyof AppointmentData;
    value?: any;
    index?: number;
    isArrayItem?: boolean;
  }) => {
    if (isArrayItem && typeof index === "number") {
      setAppointmentData((prev) => {
        const updatedArray = [...prev[fieldName]];
        updatedArray[index] = value;
        return {
          ...prev,
          [fieldName]: updatedArray,
        };
      });
      setEditingArrayItem(null);
    } else {
      const newValue = localEdit[fieldName];

      const formattedValue =
        fieldName === "date" && typeof newValue === "string"
          ? fromInputDateFormat(newValue)
          : newValue;

      console.log("Formatted value:", formattedValue);

      if (formattedValue !== undefined) {
        setAppointmentData((prev) => ({
          ...prev,
          [fieldName]: formattedValue,
        }));
      }

      setLocalEdit((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });

      setEditingField("");
    }
  };

  const saveField = (fieldName: keyof AppointmentData) =>
    saveLocalEdit({ fieldName });

  const saveArrayItem = (
    fieldName: keyof AppointmentData,
    value: any,
    index: number
  ) => saveLocalEdit({ fieldName, value, index, isArrayItem: true });

  const handleSave = () => {
    fetch(`http://localhost:9000/api/appointment/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("PATCH successful:", data);
      })
      .catch((error) => {
        console.error("PATCH failed:", error);
      });
  };

  const renderFieldCell = (field: (typeof tableStructure)[number]) => {
    const value = appointmentData[field.name as keyof typeof appointmentData];
    const editedValue = localEdit[field.name as keyof AppointmentData] as
      | string
      | string[]
      | { _id: string; note: string }[]
      | undefined;
    const originalValue = appointmentData[
      field.name as keyof AppointmentData
    ] as string | string[] | { _id: string; note: string }[];
    const currentValue = editedValue ?? originalValue;

    if (stringFields.includes(field.name)) {
      return (
        <div className="flex justify-between items-center w-full">
          {editingField === field.name ? (
            <div className="flex gap-2">
              <input
                value={currentValue as string}
                onChange={(e) =>
                  setLocalEdit((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className={inputFieldStyles}
                required={requiredFields.includes(field.name)}
              />
              <EditButtons
                onCancel={() => cancelLocalEdit(field.name)}
                onSave={() => saveField(field.name)}
              />
            </div>
          ) : (
            <>
              {typeof value === "string" ? <p>{value}</p> : ""}
              <button
                type="button"
                className={buttonStyles}
                onClick={() => setEditingField(field.name)}
              >
                ✏
              </button>
            </>
          )}
        </div>
      );
    } else if (arrayFields.includes(field.name)) {
      const currentArray = appointmentData[
        field.name as keyof AppointmentData
      ] as string[];

      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <input
              value={tempArray[field.name] || ""}
              onChange={(e) =>
                setTempArray({ ...tempArray, [field.name]: e.target.value })
              }
              className={inputFieldStyles}
            />
            <button
              type="button"
              className={buttonStyles}
              onClick={() => {
                if (!tempArray[field.name]) return;
                setAppointmentData((prev) => ({
                  ...prev,
                  [field.name]: [...currentArray, tempArray[field.name]],
                }));
                setTempArray({ ...tempArray, [field.name]: "" });
              }}
            >
              +
            </button>
          </div>

          {currentArray.map((item, index) => {
            const isEditing =
              editingArrayItem?.field === field.name &&
              editingArrayItem.index === index;
            const localKey = `${field.name}-${index}`;
            const localValue = localEdit[localKey] ?? item;

            return (
              <div key={index} className={arrayStyles}>
                {isEditing ? (
                  <>
                    <input
                      value={localValue}
                      onChange={(e) =>
                        setLocalEdit({
                          ...localEdit,
                          [localKey]: e.target.value,
                        })
                      }
                      className={inputFieldStyles}
                    />
                    <EditButtons
                      onCancel={() => cancelLocalEdit(localKey, true)}
                      onSave={() =>
                        saveArrayItem(field.name, localValue, index)
                      }
                    />
                  </>
                ) : (
                  <>
                    <p>{item}</p>
                    <button
                      type="button"
                      className={buttonStyles}
                      onClick={() =>
                        setEditingArrayItem({ field: field.name, index })
                      }
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (timeFields.includes(field.name)) {
      const value = appointmentData[
        field.name as keyof AppointmentData
      ] as string;
      const localValue = localEdit[field.name] ?? value;

      return (
        <div className="flex justify-between items-center w-full">
          {editingField === field.name ? (
            <div className="flex gap-2">
              <input
                type="time"
                value={localValue}
                onChange={(e) =>
                  setLocalEdit((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className={timeFieldStyles}
              />
              <EditButtons
                onCancel={() => cancelLocalEdit(field.name)}
                onSave={() => saveField(field.name)}
              />
            </div>
          ) : (
            <>
              <p>{value}</p>
              <button
                type="button"
                className={buttonStyles}
                onClick={() => setEditingField(field.name)}
              >
                ✏️
              </button>
            </>
          )}
        </div>
      );
    } else if (field.name === "date") {
      const original = appointmentData.date;
      const isEditing = editingField === "date";
      const localRaw = localEdit.date ?? toInputDateFormat(original);

      return (
        <div className="flex justify-between items-center w-full">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                className={`${timeFieldStyles} uppercase`}
                value={localRaw}
                onChange={(e) =>
                  setLocalEdit((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                required
              />
              <EditButtons
                onCancel={() => cancelLocalEdit(field.name)}
                onSave={() => saveField(field.name)}
              />
            </div>
          ) : (
            <>
              <p>{original}</p>
              <button
                type="button"
                className={buttonStyles}
                onClick={() => setEditingField("date")}
              >
                ✏️
              </button>
            </>
          )}
        </div>
      );
    } else if (field.name === "status") {
      const value = appointmentData.status;
      const localValue = localEdit.status ?? value;

      return (
        <div className="flex justify-between items-center w-full">
          {editingField === "status" ? (
            <div className="flex gap-2 items-center">
              <select
                className="w-max bg-transparent border border-black dark:border-white dark:bg-gray-800 rounded-md p-1"
                value={localValue}
                onChange={(e) =>
                  setLocalEdit((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                {statusOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
              <EditButtons
                onCancel={() => cancelLocalEdit(field.name)}
                onSave={() => saveField(field.name)}
              />
            </div>
          ) : (
            <>
              <p>{value}</p>
              <button
                type="button"
                className={buttonStyles}
                onClick={() => setEditingField("status")}
              >
                ✏️
              </button>
            </>
          )}
        </div>
      );
    } else if (field.name === "duration") {
      const durationDisplay = useMemo(() => {
        const { startTime, endTime } = appointmentData;

        if (!startTime || !endTime) {
          return "Please enter start and end time first!";
        }

        const [startHourStr, startMinuteStr] = startTime.split(":");
        const [endHourStr, endMinuteStr] = endTime.split(":");

        const startHour = Number(startHourStr);
        const startMinute = Number(startMinuteStr);
        const endHour = Number(endHourStr);
        const endMinute = Number(endMinuteStr);

        if (
          isNaN(startHour) ||
          isNaN(startMinute) ||
          isNaN(endHour) ||
          isNaN(endMinute)
        ) {
          return "Invalid time format!";
        }

        const totalStartMinutes = startHour * 60 + startMinute;
        const totalEndMinutes = endHour * 60 + endMinute;

        let durationInMinutes = totalEndMinutes - totalStartMinutes;

        if (durationInMinutes < 0) {
          durationInMinutes += 24 * 60;
        }

        return `${durationInMinutes}m`;
      }, [appointmentData.startTime, appointmentData.endTime]);

      return (
        <div className="flex items-center">
          <p className="p-1">{durationDisplay}</p>
        </div>
      );
    } else if (field.name === "notes") {
      const currentNotes = appointmentData.notes || [];

      return (
        <div className="flex flex-col gap-2 w-full">
          {/* Add Note */}
          <div className="flex gap-2 items-center">
            <input
              value={tempArray["notes"] || ""}
              onChange={(e) =>
                setTempArray({ ...tempArray, notes: e.target.value })
              }
              className={inputFieldStyles}
              placeholder="Enter a new note"
            />
            <button
              type="button"
              className={buttonStyles}
              onClick={() => {
                const newNote = tempArray["notes"];
                if (!newNote?.trim()) return;

                setAppointmentData((prev) => ({
                  ...prev,
                  notes: [
                    ...prev.notes,
                    { _id: Date.now().toString(), note: newNote },
                  ],
                }));
                setTempArray({ ...tempArray, notes: "" });
              }}
            >
              +
            </button>
          </div>

          {/* Display Notes */}
          {currentNotes.map((item, index) => {
            const localKey = `notes-${item._id}`;
            const isEditing =
              editingArrayItem?.field === "notes" &&
              editingArrayItem.index === index;
            const localValue = localEdit[localKey] ?? item.note;

            return (
              <div className={arrayStyles} key={item._id}>
                {isEditing ? (
                  <>
                    <input
                      value={localValue}
                      onChange={(e) =>
                        setLocalEdit((prev) => ({
                          ...prev,
                          [localKey]: e.target.value,
                        }))
                      }
                      className={inputFieldStyles}
                    />
                    <EditButtons
                      onCancel={() => cancelLocalEdit(localKey, true)}
                      onSave={() =>
                        saveArrayItem(
                          "notes",
                          { ...currentNotes[index], note: localValue },
                          index
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <p>{item.note}</p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className={buttonStyles}
                        onClick={() =>
                          setEditingArrayItem({ field: "notes", index })
                        }
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className={buttonStyles}
                        onClick={() => {
                          setAppointmentData((prev) => ({
                            ...prev,
                            notes: prev.notes.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }
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
          className="border border-black rounded-md p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer hover:transition-colors hover:duration-200"
          type="submit"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>

      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <table className="w-full">
          <tbody>
            {tableStructure.map((field, index) => {
              const isLast = index === tableStructure.length - 1;

              return (
                <tr
                  key={field.name}
                  className={`flex *:p-2 ${isLast ? "" : "border-b"}`}
                >
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
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default AppointmentDetails;
