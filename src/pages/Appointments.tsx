import { useEffect, useState } from "react";
import { Link } from "react-router";

const appointments = {
  "25-06-2025": [
    {
      _id: "1",
      patient: "John Doe",
      doctor: "Dr. Abdelrahman",
      startTime: "10:00",
      endTime: "10:30",
      status: "confirmed",
      workToBeDone: ["Endo", "Operative"],
    },
    {
      _id: "2",
      patient: "Jane Smith",
      doctor: "Dr. Zeyad",
      startTime: "11:00",
      endTime: "11:30",
      status: "pending",
      workToBeDone: ["Endo", "Operative"],
    },
  ],
  "25-07-2025": [
    {
      _id: "3",
      patient: "John Smith",
      doctor: "Dr. Abdelrahman",
      startTime: "09:00",
      endTime: "09:45",
      status: "cancelled",
      workToBeDone: ["Endo", "Operative"],
    },
  ],
};

interface Appointment {
  _id: string;
  patient: string;
  doctor: string;
  startTime: string;
  endTime: string;
  status: string;
  workToBeDone: string[];
}

interface AppointmentsByDate {
  [date: string]: Appointment[];
}

const workOptions = [
  { name: "Operative", icon: "✨" },
  { name: "Endo", icon: "🦷" },
];

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState<AppointmentsByDate>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:9000/api/appointment");
      const fetchedData = await res.json();
      setAppointmentsData(fetchedData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(appointmentsData);
  }, [appointmentsData]);

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-white">
          🗓️ Appointments
        </h1>
        <Link
          to="./new"
          className="border border-black rounded-md p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer hover:transition-colors hover:duration-200"
        >
          + New Appointment
        </Link>
      </div>

      {Object.entries(appointmentsData).map(([day, appts]) => {
        return (
          <div className="dark:text-white" key={day}>
            <p className="mb-2">{day}:</p>
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="ltr:text-left rtl:text-right bg-gray-200 dark:bg-gray-700">
                <tr className="*:font-medium *:text-gray-900">
                  <th className="dark:text-white">
                    <div className="flex justify-between">
                      <div className="px-3 py-2 whitespace-nowrap flex-2/9">
                        Patient
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-2/9">
                        Doctor
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-2/9">
                        Work
                      </div>
                      <div className="px-3 py-2 whitespace-nowrap flex-1/9">
                        Start Time
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-1/9">
                        End Time
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-1/9">
                        Status
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                // Key for the tbody should be unique per day
                key={day + "-body"}
                className="divide-y divide-gray-200 dark:bg-gray-800 bg-gray-50"
              >
                {/* This is the only map needed for appointments within a day */}
                {appts.map((appt) => (
                  <tr
                    key={appt._id}
                    className="text-gray-900 dark:text-white flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                  >
                    <td className="px-3 py-2 whitespace-nowrap flex-2/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.patient}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-2/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.doctor}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-2/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.workToBeDone.length < 1 ? (
                          <span>-</span>
                        ) : (
                          appt.workToBeDone.map((work) => {
                            const match = workOptions.find(
                              (opt) => opt.name === work
                            );
                            return (
                              <span key={work} className="mr-1">
                                {match?.icon}
                              </span>
                            );
                          })
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-1/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.startTime ? appt.startTime : "-"}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-1/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.endTime ? appt.endTime : "-"}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-1/9">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.status}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Appointments;
