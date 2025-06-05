const appointments = {
  "2025-06-04": [
    {
      _id: "1",
      patient: "John Doe",
      doctor: "Dr. Abdelrahman",
      date: "2025-06-04",
      startTime: "10:00",
      endTime: "10:30",
      status: "confirmed",
    },
    {
      _id: "2",
      patient: "Jane Smith",
      doctor: "Dr. Zeyad",
      date: "2025-06-04",
      startTime: "11:00",
      endTime: "11:30",
      status: "pending",
    },
  ],
  "2025-06-05": [
    {
      _id: "3",
      patient: "John Smith",
      doctor: "Dr. Ahmed",
      date: "2025-06-05",
      startTime: "09:00",
      endTime: "09:45",
      status: "cancelled",
    },
  ],
};

const Appointments = () => {
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">🗓️ Appointments</h1>
        <button className="border rounded-lg px-2 py-1 text-sm hover:bg-black hover:text-white cursor-pointer transition duration-250">
          + Add Appointment
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="ltr:text-left rtl:text-right">
            <tr className="*:font-medium *:text-gray-900">
              <th className="px-3 py-2 whitespace-nowrap">Patient</th>
              <th className="px-3 py-2 whitespace-nowrap">Doctor</th>
              <th className="px-3 py-2 whitespace-nowrap">Date</th>
              <th className="px-3 py-2 whitespace-nowrap">Start Time</th>
              <th className="px-3 py-2 whitespace-nowrap">End Time</th>
              <th className="px-3 py-2 whitespace-nowrap">Duration</th>
              <th className="px-3 py-2 whitespace-nowrap">Work to be done</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* {appointments.map((appointment) => (
              <tr className="*:text-gray-900">
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.patient}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.doctor}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.date}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.startTime}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.endTime}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.duration}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {appointment.workToBeDone}
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
