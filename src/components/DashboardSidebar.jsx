import { NavLink } from "react-router-dom";

const DashboardSidebar = () => {
  const links = [
    { path: "/dashboard/users", label: "All Users" },
    { path: "/dashboard/articles", label: "All Articles" },
    { path: "/dashboard/addPublisher", label: "Add Publisher" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4 space-y-4 border-r">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            isActive
              ? "block font-semibold text-blue-600"
              : "block text-gray-700 hover:text-blue-500"
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default DashboardSidebar;
