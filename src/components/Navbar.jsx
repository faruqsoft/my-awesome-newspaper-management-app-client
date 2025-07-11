// client/src/components/Navbar.jsx
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut().then(() => {}).catch(console.log);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <NavLink to="/" className="text-xl font-bold">📰 NewsPortal</NavLink>
      <div className="flex gap-4 items-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/add-article">Add Articles</NavLink>
        <NavLink to="/all-articles">All Articles</NavLink>
        <NavLink to="/subscription">Subscription</NavLink>

        {/* Conditional: Only Admin */}
        {user?.email === "admin@example.com" && (
          <NavLink to="/dashboard">Dashboard</NavLink>
        )}

        {/* Conditional: Premium Only */}
        {user && (
          <NavLink to="/premium-articles">Premium Articles</NavLink>
        )}

        {user && (
          <>
            <NavLink to="/my-articles">My Articles</NavLink>
            <NavLink to="/profile">
              <img src={user.photoURL} alt="profile" className="h-8 w-8 rounded-full" />
            </NavLink>
            <button onClick={handleLogout} className="text-red-300">Logout</button>
          </>
        )}

        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
