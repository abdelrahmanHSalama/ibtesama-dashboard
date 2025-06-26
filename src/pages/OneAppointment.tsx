import { Link, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

import {
  tableStructure,
  stringFields,
  arrayFields,
  requiredFields,
  inputFieldStyles,
  timeFieldStyles,
  buttonStyles,
  arrayStyles,
  type AppointmentData,
  type Messages,
} from "../constants/appointmentsConstants";

const appointment: AppointmentData = {
  _id: "",
  patientName: "",
  doctorName: "",
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

const OneAppointment = () => {
  const [appointmentData, setAppointmentData] = useState(appointment);
  const [isEditing, setIsEditing] = useState(false);
  const [tempArrayValue, setTempArrayValue] = useState({});
  const [loadingMsgs, setLoadingMsgs] = useState<Messages>({
    time: null,
    submission: null,
  });
  const [successMsgs, setSuccessMsgs] = useState<Messages>({
    time: null,
    submission: null,
  });
  const [warningMsgs, setWarningMsgs] = useState<Messages>({
    time: null,
    submission: null,
  });
  const [errorMsgs, setErrorMsgs] = useState<Messages>({
    time: null,
    submission: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const isInitialEdit = useRef(false);

  useEffect(() => {
    if (isEditing) {
      isInitialEdit.current = true;
    } else {
      isInitialEdit.current = false;
    }
  }, [isEditing]);

  const fetchAppointment = () => {
    fetch(`http://localhost:9000/api/appointment/${params.id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointmentData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const handleDeleteAppt = () => {
    console.log(params.id);
    fetch(`http://localhost:9000/api/appointment/${params.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setSuccessMsgs((prev) => ({
          ...prev,
          submission: "Appointment deleted! Redirecting...",
        }));

        console.log(data);

        setTimeout(() => navigate("/appointments"), 1000);
      })
      .catch((error) => {
        console.error("Delete Error:", error.message);
        setErrorMsgs((prev) => ({
          ...prev,
          submission: "Delete failed!",
        }));
      });
  };

  const handleStringField = (
    fieldName: keyof AppointmentData,
    value: string
  ) => {
    setAppointmentData((prev) => ({ ...prev, [fieldName]: value }));
    if (requiredFields.includes(fieldName) && errorMsgs.submission) {
      setErrorMsgs((prev) => ({ ...prev, submission: null }));
    }
  };

  const handleArrayField = (
    fieldName: keyof AppointmentData,
    value: string
  ) => {
    const valueToBeAdded = value.trim();
    setTempArrayValue((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
    if (!valueToBeAdded) return;
    setAppointmentData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], value],
      // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'AppointmentData'.
      // No index signature with a parameter of type 'string' was found on type 'AppointmentData'.ts(7053)
    }));
  };

  const handleEditInArray = (
    fieldName: keyof AppointmentData,
    index: number,
    newValue: string
  ) => {
    setAppointmentData((prev) => {
      const updatedArray = [...prev[fieldName]];
      updatedArray[index] = newValue;

      return {
        ...prev,
        [fieldName]: updatedArray,
      };
    });
  };

  const handleDeleteFromArray = (
    fieldName: keyof AppointmentData,
    index: number
  ) => {
    setAppointmentData((prev) => {
      const updatedArray = [...prev[fieldName]].filter((_, i) => i !== index);

      return {
        ...prev,
        [fieldName]: updatedArray,
      };
    });
  };

  const handleTempArrayValue = (fieldName: string, value: string) => {
    setTempArrayValue((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    if (
      !isEditing ||
      isInitialEdit.current ||
      !appointmentData.date ||
      !appointmentData.startTime
    ) {
      return;
    }

    if (appointmentData.date && appointmentData.startTime) {
      if (appointmentData.endTime) {
        const [startHour, startMinute] = appointmentData.startTime
          .split(":")
          .map(Number);
        let [endHour, endMinute] = appointmentData.endTime
          .split(":")
          .map(Number);
        if (
          endHour < startHour ||
          (endHour === startHour && endMinute < startMinute)
        ) {
          endHour += 24;
          setWarningMsgs((prev) => ({
            ...prev,
            time: "(!) End time before start time!",
          }));
        } else {
          setWarningMsgs((prev) => ({
            ...prev,
            time: null,
          }));
        }
      }

      const payload = {
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
      };

      setLoadingMsgs((prev) => ({
        ...prev,
        time: "Checking Availability...",
      }));
      setErrorMsgs((prev) => ({ ...prev, time: null }));
      setSuccessMsgs((prev) => ({ ...prev, time: null }));

      debouncedCheckConflict(payload);
    }
  }, [
    appointmentData.date,
    appointmentData.startTime,
    appointmentData.endTime,
  ]);

  const debouncedCheckConflict = useCallback(
    debounce((payload: any) => {
      fetch("http://localhost:9000/api/appointment/is-available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoadingMsgs((prev) => ({ ...prev, time: null }));
          if (data.conflict) {
            setErrorMsgs((prev) => ({ ...prev, time: data.error }));
          } else {
            setSuccessMsgs((prev) => ({
              ...prev,
              time: "Time slot available!",
            }));
          }
        })
        .catch((error) => {
          console.error(error);
          setLoadingMsgs((prev) => ({ ...prev, time: null }));
          setErrorMsgs((prev) => ({ ...prev, time: error }));
        });
    }, 1000),
    []
  );

  const handleTimeField = (fieldName: string, timeString: string) => {
    if (!timeString) return;
    if (timeString.length !== 5 || !timeString.includes(":")) return;

    setAppointmentData((prev) => ({
      ...prev,
      [fieldName]: timeString,
    }));

    if (!appointmentData.date) {
      console.error("Enter date first!");
      return;
    }

    isInitialEdit.current = false;

    const payload =
      fieldName === "startTime"
        ? {
            date: appointmentData.date,
            startTime: timeString,
            endTime: null,
          }
        : {
            date: appointmentData.date,
            startTime: appointmentData.startTime,
            endTime: timeString,
          };

    debouncedCheckConflict(payload);
  };

  const handleSubmit = () => {
    setLoadingMsgs((prev) => ({
      ...prev,
      submission: "Saving Appointment...",
    }));
    fetch(`http://localhost:9000/api/appointment/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingMsgs((prev) => ({
          ...prev,
          submission: null,
        }));
        setErrorMsgs((prev) => ({
          ...prev,
          submission: null,
        }));
        if (data.success) {
          setSuccessMsgs((prev) => ({
            ...prev,
            submission: "Appointment Saved!",
          }));
          fetchAppointment();
          setIsEditing(false);
          setTimeout(() => {
            setSuccessMsgs((prev) => ({
              ...prev,
              submission: null,
            }));
          }, 2500);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoadingMsgs((prev) => ({
          ...prev,
          submission: null,
        }));
        setErrorMsgs((prev) => ({
          ...prev,
          submission: null,
        }));
      });
  };

  const renderFieldCell = (field: {
    name: keyof AppointmentData;
    label: string;
  }) => {
    if (stringFields.includes(field.name)) {
      return (
        <div className="flex items-center">
          {isEditing ? (
            <input
              value={appointmentData[field.name]}
              className={inputFieldStyles}
              required={requiredFields.includes(field.name)}
              onChange={(e) => handleStringField(field.name, e.target.value)}
            />
          ) : (
            <p>{appointmentData[field.name]}</p>
          )}
        </div>
      );
    } else if (arrayFields.includes(field.name)) {
      return (
        <div className="flex flex-col gap-2 justify-center">
          {isEditing ? (
            <>
              <div className="flex flex-1 gap-1">
                <input
                  value={tempArrayValue[field.name] || ""}
                  className={inputFieldStyles}
                  onChange={(e) =>
                    handleTempArrayValue(field.name, e.target.value)
                  }
                ></input>
                <button
                  type="button"
                  className={buttonStyles}
                  onClick={() =>
                    handleArrayField(field.name, tempArrayValue[field.name])
                  }
                >
                  ➕
                </button>
              </div>
              {appointmentData[field.name].length > 0 && (
                <ul className="flex flex-col gap-2">
                  {appointmentData[field.name].map((element, index) => (
                    // Parameter '_' implicitly has an 'any' type.ts(7006)
                    // Parameter 'index' implicitly has an 'any' type.ts(7006)
                    <li key={index} className={arrayStyles}>
                      <input
                        value={element}
                        className={inputFieldStyles}
                        onChange={(e) =>
                          handleEditInArray(field.name, index, e.target.value)
                        }
                      ></input>
                      <button
                        type="button"
                        className={buttonStyles}
                        onClick={() => handleDeleteFromArray(field.name, index)}
                      >
                        ❌
                      </button>
                    </li>
                  )) || "-"}
                </ul>
              )}
            </>
          ) : (
            <>
              {appointmentData[field.name].length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {appointmentData[field.name].map((element, index) => (
                    // Parameter '_' implicitly has an 'any' type.ts(7006)
                    // Parameter 'index' implicitly has an 'any' type.ts(7006)
                    <li key={index} className={arrayStyles}>
                      {element}
                    </li>
                  )) || "-"}
                </ul>
              ) : (
                <p>-</p>
              )}
            </>
          )}
        </div>
      );
    } else if (field.name === "date") {
      return (
        <div className="flex justify-between items-center w-full">
          {isEditing ? (
            <input
              type="date"
              className={`${timeFieldStyles} uppercase`}
              value={appointmentData.date}
              required={requiredFields.includes(field.name)}
              onChange={(e) => handleStringField("date", e.target.value)}
            ></input>
          ) : (
            <p>{appointmentData.date || "-"}</p>
          )}
        </div>
      );
    } else if (field.name === "time") {
      return isEditing ? (
        <div className="flex items-center gap-2">
          <span>From</span>
          <input
            type="time"
            value={appointmentData.startTime}
            className={timeFieldStyles}
            required={requiredFields.includes("startTime")}
            disabled={!appointmentData.date}
            onChange={(e) => handleTimeField("startTime", e.target.value)}
          ></input>
          <span>to</span>
          <input
            type="time"
            value={appointmentData.endTime}
            className={timeFieldStyles}
            required={requiredFields.includes("endTime")}
            disabled={!appointmentData.startTime}
            onChange={(e) => handleTimeField("endTime", e.target.value)}
          ></input>
          {!appointmentData.date && (
            <span className="text-sm">Please add a date first!</span>
          )}
          {appointmentData.date && !appointmentData.startTime && (
            <span className="text-sm dark:text-white">
              Please add a start time to be able to add an end time!
            </span>
          )}
          {loadingMsgs.time && (
            <span className="text-sm dark:text-white">{loadingMsgs.time}</span>
          )}
          {successMsgs.time && (
            <span className="text-sm text-green-500">{successMsgs.time}</span>
          )}
          {errorMsgs.time && (
            <span className="text-sm text-red-500">{errorMsgs.time}</span>
          )}
          {warningMsgs.time && (
            <span className="text-sm dark:text-white">{warningMsgs.time}</span>
          )}
        </div>
      ) : (
        <p>
          {appointmentData.startTime || "-"} - {appointmentData.endTime || "-"}
        </p>
      );
    } else if (field.name === "status") {
      return (
        <div className="flex justify-between items-center w-full">
          {isEditing ? (
            <select
              className="w-max bg-transparent border border-black dark:border-white dark:bg-gray-800 rounded-md p-1"
              value={appointmentData[field.name]}
              onChange={(e) => handleStringField("status", e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Finished">Finished</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          ) : (
            <p>{appointmentData.status}</p>
          )}
        </div>
      );
    }
  };

  const isSaveDisabled =
    !!loadingMsgs.time ||
    !!errorMsgs.time ||
    !appointmentData.patientName ||
    !appointmentData.date;

  return (
    <div className="flex flex-col h-full gap-2 p-1 items-start dark:text-white space-y-1">
      <Link
        className="hover:underline underline-offset-2 text-sm cursor-pointer flex items-end"
        to="/appointments"
      >
        ◀ Return to Appointments
      </Link>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointment Details</h1>
        <div className="flex gap-2 items-center">
          <span>
            {loadingMsgs.submission && (
              <span className="text-sm dark:text-white">
                {loadingMsgs.submission}
              </span>
            )}
            {successMsgs.submission && (
              <span className="text-sm text-green-500">
                {successMsgs.submission}
              </span>
            )}
            {errorMsgs.submission && (
              <span className="text-sm text-red-500">
                {errorMsgs.submission}
              </span>
            )}
          </span>
          {isEditing ? (
            <>
              <button
                className={`${buttonStyles} p-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSaveDisabled}
                type="submit"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                }}
              >
                Stop Editing
              </button>
              <button
                className={`${buttonStyles} p-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSaveDisabled}
                type="submit"
                onClick={handleSubmit}
              >
                Update Appointment
              </button>
            </>
          ) : (
            <button
              className={`${buttonStyles} p-2`}
              type="button"
              onClick={() => {
                setIsEditing((prev) => !prev);
              }}
            >
              Edit Appointment
            </button>
          )}
          <button
            className={`${buttonStyles} p-2`}
            type="button"
            onClick={() => {
              handleDeleteAppt();
            }}
          >
            Delete Appointment
          </button>
        </div>
      </div>
      {isEditing ? (
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          {tableStructure.map((field, index) => {
            const isLast = index === tableStructure.length - 1;

            return (
              <div
                key={field.name}
                className={`flex *:p-2 ${isLast ? "" : "border-b"}`}
              >
                <div className="flex-1/4 flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <span className="font-medium">{field.label}</span>
                  {requiredFields.includes(field.name) ? (
                    <span className="text-red-600 text-sm">(Required)</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex-3/4 flex flex-col justify-center gap-2 bg-gray-100 dark:bg-gray-800">
                  {renderFieldCell(field as keyof AppointmentData)}
                  {/* Argument of type 'string' is not assignable to parameter of type '{ name: keyof AppointmentData; label: string; }'.
  Type 'string' is not assignable to type '{ name: keyof AppointmentData; label: string; }'.ts(2345) */}
                </div>
              </div>
            );
          })}
        </form>
      ) : (
        <div className="w-full">
          {tableStructure.map((field, index) => {
            const isLast = index === tableStructure.length - 1;

            return (
              <div
                key={field.name}
                className={`flex *:p-2 ${isLast ? "" : "border-b"}`}
              >
                <div className="flex-1/4 flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <span className="font-medium">{field.label}</span>
                  {requiredFields.includes(field.name) ? (
                    <span className="text-red-600 text-sm">(Required)</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex-3/4 flex flex-col justify-center gap-2 bg-gray-100 dark:bg-gray-800">
                  {renderFieldCell(field as keyof AppointmentData)}
                  {/* Argument of type 'string' is not assignable to parameter of type '{ name: keyof AppointmentData; label: string; }'.
  Type 'string' is not assignable to type '{ name: keyof AppointmentData; label: string; }'.ts(2345) */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OneAppointment;
