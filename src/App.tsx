import "./App.css";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import NewAppointment from "./pages/NewAppointment";
// import Appointments from "./pages/Appointments";
// import AppointmentDetails from "./pages/AppointmentDetails";

function App() {
  return (
    <div className="flex dark:bg-gray-900">
      <div className="flex-1/5">
        <Sidebar></Sidebar>
      </div>
      <div className="flex-4/5 p-2">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} /> */}
          <Route path="/appointments/new" element={<NewAppointment />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
