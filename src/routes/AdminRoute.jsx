// client/src/routes/AdminRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ["admin", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axios.get(`http://localhost:5000/users/admin/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })).data?.admin,
  });

  if (loading || isLoading) return <p className="text-center">Checking Admin...</p>;

  if (!user || !isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
