import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const AllUsers = () => {
  const { data: users = [], refetch } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () =>
      (await axios.get("http://localhost:5000/users")).data,
  });

  const makeAdmin = async (email) => {
    try {
      await axios.patch(`http://localhost:5000/users/make-admin`, { email });
      toast.success("User promoted to admin!");
      refetch();
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Photo</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <img src={u.photo} className="h-10 w-10 rounded-full" />
                </td>
                <td>
                  {u.role === "admin" ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    <button
                      onClick={() => makeAdmin(u.email)}
                      className="btn btn-xs"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
