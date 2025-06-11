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

const workOptions = [
  { name: "Operative", icon: "✨" },
  { name: "Endo", icon: "🦷" },
];

const Appointments = () => {
  console.log(Object.entries(appointments));

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-white">
          🗓️ Appointments
        </h1>
        <Link
          to="./new"
          className="border-2 border-black font-medium rounded-lg p-2 text-sm hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:border-white dark:hover:text-gray-900 cursor-pointer transition duration-200"
        >
          + New Appointment
        </Link>
      </div>

      {Object.entries(appointments).map(([day, appts]) => {
        return (
          <div className="dark:text-white" key={day}>
            <p className="mb-2">{day}:</p>
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="ltr:text-left rtl:text-right bg-gray-200 dark:bg-gray-700">
                <tr className="*:font-medium *:text-gray-900">
                  <th className="dark:text-white">
                    <div className="flex justify-between">
                      <div className="px-3 py-2 whitespace-nowrap flex-2/8">
                        Patient
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-2/8">
                        Doctor
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-1/8">
                        Start Time
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap flex-1/8">
                        End Time
                      </div>{" "}
                      <div className="px-3 py-2 whitespace-nowrap capitalize flex-1/8">
                        Status
                      </div>
                      <div className="px-3 py-2 whitespace-nowrap capitalize flex-1/8">
                        Work
                      </div>{" "}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                // Key for the tbody should be unique per day
                key={day + "-body"}
                className="divide-y divide-gray-200 dark:bg-gray-800"
              >
                {/* This is the only map needed for appointments within a day */}
                {appts.map((appt) => (
                  <tr
                    key={appt._id}
                    className="text-gray-900 dark:text-white flex justify-between hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                  >
                    <td className="px-3 py-2 whitespace-nowrap flex-2/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.patient}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-2/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.doctor}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-1/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.startTime}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex-1/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.endTime}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap capitalize flex-1/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.status}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap capitalize flex-1/8">
                      <Link className="block" to={`/appointments/${appt._id}`}>
                        {appt.workToBeDone.map((work) => {
                          const match = workOptions.find(
                            (opt) => opt.name === work
                          );
                          return (
                            <span key={work} className="mr-1">
                              {match?.icon}
                            </span>
                          );
                        })}{" "}
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
