const Sidebar = () => {
  const tabs = [
    { name: "Home", link: "/" },
    { name: "Appointments", link: "/appointments" },
  ];

  const disabledTabs = [
    { name: "Patients", link: "/patients" },
    { name: "Labs", link: "/labs" },
    { name: "Inventory", link: "/inventory" },
    { name: "Finances", link: "/finances" },
  ];

  return (
    <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
      <div className="px-4 py-6">
        <span className="grid h-10 w-[100%] p-8 place-content-center rounded-lg bg-gray-100">
          🦷 Ibtisama-Dashboard
        </span>

        <ul className="mt-6 space-y-1">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <a
                href={tab.link}
                className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 ${
                  tab.link === location.pathname
                    ? "bg-gray-100 text-gray-700"
                    : "hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </a>
            </li>
          ))}
        </ul>

        <ul className="space-y-1">
          {disabledTabs.map((tab) => (
            <li key={tab.name}>
              <a
                href={tab.link}
                className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed ${
                  tab.link === location.pathname
                    ? "bg-gray-100 text-gray-700"
                    : "hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a
          href="#"
          className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
        >
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
      </div>
    </div>
  );
};

export default Sidebar;
