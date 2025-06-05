import "./App.css";
import Sidebar from "./components/Sidebar";
import Appointments from "./pages/Appointments";
import Home from "./pages/Home";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div className="flex">
      <div className="flex-1/5">
        <Sidebar></Sidebar>
      </div>
      <div className="flex-4/5 p-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
