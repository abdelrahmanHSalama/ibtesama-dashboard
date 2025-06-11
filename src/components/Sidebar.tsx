import { NavLink } from "react-router";
import { useTheme } from "../context/ThemeContext";

const tabs = [
  { name: "🏡 Home", link: "/" },
  { name: "🗓️ Appointments", link: "/appointments" },
  // { name: "🧑🏻 Patients", link: "/patients" },
  // { name: "🎨 Labs", link: "/labs" },
  // { name: "📦 Inventory", link: "/inventory" },
  // { name: "💵 Finances", link: "/finances" },
];

const disabledTabs = [
  { name: "🧑🏻 Patients" },
  { name: "🎨 Labs" },
  { name: "📦 Inventory" },
  { name: "💵 Finances" },
];

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen h-full flex-col justify-between border-e border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <span className="flex justify-center items-center w-full p-4 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white">
          Ibtisama-Dashboard
        </span>

        <ul className="mt-6 space-y-1">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <NavLink
                to={tab.link}
                className={({ isActive }) =>
                  `block rounded-lg p-4 font-medium ${
                    isActive
                      ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-white"
                      : "text-gray-500 dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-gray-700 dark:text-white dark:hover:text-white"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="space-y-1 mt-1">
          {disabledTabs.map((tab) => (
            <li key={tab.name}>
              <div className="block rounded-lg p-4 text-sm font-medium text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:text-white dark:hover:text-white">
                {tab.name}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center p-4 dark:text-white">
        <a href="" className="flex items-center gap-2 bg-inherit">
          <img
            alt="User Image"
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs">
              <strong className="block font-medium">Dr. John Doe</strong>
              <span> john@doe.com </span>
            </p>
          </div>
        </a>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="cursor-pointer bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700 rounded p-2 hover:bg-gray-300"
          >
            {theme === "light" ? "🌑" : "☀"}
          </button>
          <button className="cursor-pointer bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700 rounded p-2 hover:bg-gray-300">
            🏃🏻‍♂️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
