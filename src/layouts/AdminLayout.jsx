import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard Overview', path: '/dashboard' },
    { label: 'All Users', path: '/dashboard/all-users' },
    { label: 'All Articles', path: '/dashboard/all-articles' },
    { label: 'Add Publisher', path: '/dashboard/add-publisher' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-gray-100 to-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 p-6 sticky top-0 h-screen hidden lg:block">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg font-medium text-sm transition 
                    ${
                      location.pathname === link.path
                        ? 'bg-green-100 text-green-700 font-semibold shadow'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
