import { Link } from "react-router";
import { useState } from "react";

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
  type AppointmentData,
} from "../constants/appointmentsConstants";

const newAppointment: AppointmentData = {
  patientName: "",
  doctorName: "",
  date: "",
  startTime: "",
  endTime: "",
  status: "Pending",
  chiefComplaint: [],
  diagnosis: [],
  workToBeDone: [],
  workDone: [],
  prescribedMeds: [],
  notes: [],
};

const NewAppointment = () => {
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData>(newAppointment);
  const [tempArray, setTempArray] = useState<Record<string, string>>({});
  const [editingStates, setEditingStates] = useState<
    Record<string, Record<number, string>>
  >({});

  const renderFieldCell = (field: (typeof tableStructure)[number]) => {
    const value = appointmentData[field.name as keyof typeof appointmentData];

    if (stringFields.includes(field.name)) {
      return (
        <div className="flex justify-between items-center w-full">
          <input
            value={value as string}
            onChange={(e) => handleStringField(field.name, e.target.value)}
            className={inputFieldStyles}
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
              className={inputFieldStyles}
            ></input>
            <button
              type="button"
              onClick={() => handleArrayField(field.name)}
              className={buttonStyles}
            >
              +
            </button>
          </div>
          {(value as string[]).map((item, index) => (
            <div className={arrayStyles} key={index}>
              {editingStates[field.name]?.[index] !== undefined ? (
                <input
                  value={editingStates[field.name][index]}
                  onChange={(e) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [field.name]: {
                        ...prev[field.name],
                        [index]: e.target.value,
                      },
                    }))
                  }
                  className={inputFieldStyles}
                />
              ) : (
                <span>{item}</span>
              )}
              <div className="flex gap-2">
                {editingStates[field.name]?.[index] !== undefined ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAppointmentData((prev) => {
                          const updated = [
                            ...(prev[
                              field.name as keyof typeof prev
                            ] as string[]),
                          ];
                          updated[index] = editingStates[field.name][index];
                          return { ...prev, [field.name]: updated };
                        });
                        setEditingStates((prev) => {
                          const { [index]: _, ...rest } = prev[field.name];
                          return {
                            ...prev,
                            [field.name]: rest,
                          };
                        });
                      }}
                      className={buttonStyles}
                    >
                      💾
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingStates((prev) => {
                          const { [index]: _, ...rest } = prev[field.name];
                          return {
                            ...prev,
                            [field.name]: rest,
                          };
                        })
                      }
                      className={buttonStyles}
                    >
                      ✖️
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingStates((prev) => ({
                        ...prev,
                        [field.name]: {
                          ...prev[field.name],
                          [index]: item,
                        },
                      }))
                    }
                    className={buttonStyles}
                  >
                    ✏️
                  </button>
                )}
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
            className={timeFieldStyles}
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
            className={`${timeFieldStyles} uppercase`}
            onChange={(e) => {
              const splitDate = e.target.value.split("-");
              handleStringField(
                field.name,
                `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
              );
            }}
            required={requiredFields.includes(field.name)}
          ></input>
        </div>
      );
    } else if (field.name === "status") {
      return (
        <div className="flex justify-between items-center w-full">
          <select
            className="w-max bg-transparent border border-black dark:border-white dark:bg-gray-800 rounded-md p-1"
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
      let durationDisplay = "Please enter start and end time first!";

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
          <p className="p-1">{durationDisplay}</p>
        </div>
      );
    } else if (field.name === "notes") {
      return (
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
              className={inputFieldStyles}
            ></input>
            <button
              type="button"
              onClick={() => handleArrayField("notes")}
              className={buttonStyles}
            >
              +
            </button>
          </div>
          {(appointmentData.notes || []).map((item, index) => {
            const editingValue = editingStates["notes"]?.[index];

            return (
              <div className={arrayStyles} key={item._id}>
                {editingValue !== undefined ? (
                  <input
                    value={editingValue}
                    onChange={(e) =>
                      setEditingStates((prev) => ({
                        ...prev,
                        notes: {
                          ...prev.notes,
                          [index]: e.target.value,
                        },
                      }))
                    }
                    className={inputFieldStyles}
                  />
                ) : (
                  <span>{item.note}</span>
                )}
                <div className="flex gap-2">
                  {editingValue !== undefined ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedNotes = [...appointmentData.notes];
                          updatedNotes[index] = {
                            ...updatedNotes[index],
                            note: editingValue,
                          };
                          setAppointmentData((prev) => ({
                            ...prev,
                            notes: updatedNotes,
                          }));
                          setEditingStates((prev) => {
                            const { [index]: _, ...rest } = prev.notes || {};
                            return { ...prev, notes: rest };
                          });
                        }}
                        className={buttonStyles}
                      >
                        💾
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingStates((prev) => {
                            const { [index]: _, ...rest } = prev.notes || {};
                            return { ...prev, notes: rest };
                          })
                        }
                        className={buttonStyles}
                      >
                        ✖️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingStates((prev) => ({
                            ...prev,
                            notes: {
                              ...prev.notes,
                              [index]: item.note,
                            },
                          }))
                        }
                        className={buttonStyles}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteFromTempArray("notes", index)
                        }
                        className={buttonStyles}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const handleStringField = (field: string, value: string) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value.trim(),
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
    const { patientName, doctorName, date } = appointmentData;
    if (!patientName || !doctorName || !date) {
      alert("Please fill in required fields.");
      return;
    }
    fetch("http://localhost:9000/api/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
          className="border border-black rounded-md p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer hover:transition-colors hover:duration-200"
          onClick={handleSave}
          type="submit"
        >
          Save Appointment
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

export default NewAppointment;
