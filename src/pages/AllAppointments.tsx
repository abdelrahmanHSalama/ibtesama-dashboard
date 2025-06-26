import { Link } from "react-router";
import {
  buttonStyles,
  type AppointmentsByDate,
} from "../constants/appointmentsConstants";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export const mockAppointments: AppointmentsByDate = {
  "2024-05-21": [
    {
      id: "1",
      patientName: "John Doe",
      doctorName: "Dr. Evelyn Reed",
      startTime: "09:00",
      endTime: "09:45",
      status: "Completed",
      chiefComplaint: ["Severe toothache in upper right molar."],
      diagnosis: ["Deep cavity (caries) in tooth #3."],
      workToBeDone: ["Composite filling."],
      workDone: [
        "Administered local anesthesia.",
        "Excavated decay from tooth #3.",
        "Placed and cured composite filling.",
      ],
      prescribedMeds: ["Ibuprofen 600mg as needed for pain."],
      notes: [
        "Patient tolerated procedure well. Advised to avoid chewing on the right side for 24 hours.",
      ],
    },
    {
      id: "2",
      patientName: "Jane Roe",
      doctorName: "Dr. Samuel Chen",
      startTime: "10:00",
      endTime: "10:30",
      status: "Pending",
      chiefComplaint: ["Routine check-up and cleaning."],
      diagnosis: [],
      workToBeDone: ["Prophylaxis.", "Bitewing X-rays."],
      workDone: [],
      prescribedMeds: [],
      notes: ["Patient is due for a 6-month recall."],
    },
  ],
  "2024-05-22": [
    {
      id: "3",
      patientName: "Peter Jones",
      doctorName: "Dr. Samuel Chen",
      startTime: "11:30",
      endTime: "12:00",
      status: "Pending",
      chiefComplaint: ["Wants teeth whitening consultation."],
      diagnosis: [],
      workToBeDone: [
        "Discuss whitening options (in-office vs. take-home).",
        "Take initial shade.",
      ],
      workDone: [],
      prescribedMeds: [],
      notes: ["Patient has no major sensitivities reported."],
    },
    {
      id: "4",
      patientName: "Mary Major",
      doctorName: "Dr. Evelyn Reed",
      startTime: "14:00",
      endTime: "15:00",
      status: "Pending",
      chiefComplaint: ["Follow-up for crown fitting on tooth #19."],
      diagnosis: ["Tooth #19 prepared for PFM crown."],
      workToBeDone: ["Try-in of permanent crown.", "Cementation of crown."],
      workDone: [],
      prescribedMeds: [],
      notes: [
        "Lab case #L-5821 arrived yesterday. Crown looks good on the model.",
      ],
    },
  ],
};

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return "";

  const [startHour, startMinute] = start.split(":").map(Number);
  let [endHour, endMinute] = end.split(":").map(Number);

  if (
    endHour < startHour ||
    (endHour === startHour && endMinute < startMinute)
  ) {
    endHour += 24;
  }

  const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `(${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? `${minutes}m` : ""})`;
};

const AllAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/api/appointment/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAppointmentsData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, []);

  return (
    <div className="flex flex-col h-full gap-2 p-1 items-start dark:text-white space-y-1">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">All Appointments</h1>
        <Link to="./new" className={`${buttonStyles} p-2`}>
          + New Appointment
        </Link>
      </div>
      <div className="flex flex-col flex-grow w-full space-y-4">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="w-full h-full flex justify-center items-center">
            <p>⚠ Error Loading Appointments!</p>
          </div>
        ) : Object.keys(appointmentsData).length > 0 ? (
          Object.entries(appointmentsData).map(([date, appointments]) => (
            <div key={date}>
              <h2 className="font-semibold mb-2">
                {date.split("-").reverse().join("-")}:
              </h2>
              <div className="flex justify-between dark:bg-gray-700 p-2">
                <p className="flex-1/6">Patient</p>
                <p className="flex-1/6">Doctor</p>
                <p className="flex-1/6">Time</p>
                <p className="flex-1/6">Status</p>
                <p className="flex-2/6">Work to Be Done</p>
              </div>
              {appointments.map((appt) => (
                <Link
                  to={`./${appt._id}`}
                  key={appt._id}
                  className="flex justify-between dark:bg-gray-800 p-2 hover:dark:bg-gray-700"
                >
                  <p className="flex-1/6">{appt.patient || "-"}</p>
                  <p className="flex-1/6">{appt.doctor || "-"}</p>
                  <p className="flex-1/6">
                    {appt.startTime} - {appt.endTime}{" "}
                    {calculateDuration(appt.startTime, appt.endTime)}
                  </p>
                  <p className="flex-1/6">{appt.status}</p>
                  <p
                    className="flex-2/6 truncate"
                    title={appt.workToBeDone.join(" + ")}
                  >
                    {appt.workToBeDone.join(" + ") || "-"}
                  </p>
                </Link>
              ))}
            </div>
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p>No Appointments!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
