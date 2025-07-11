import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MyArticles = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [modalInfo, setModalInfo] = useState(null);

  // ✅ Fetch articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["my-articles"],
    queryFn: async () =>
      (await axios.get(`http://localhost:5000/articles/user/${user.email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })).data,
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axios.delete(`http://localhost:5000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    onSuccess: () => {
      toast.success("Article deleted");
      queryClient.invalidateQueries(["my-articles"]);
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Articles</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.title}</td>
                <td>
                  {a.status}
                  {a.status === "declined" && (
                    <button
                      onClick={() => setModalInfo(a)}
                      className="ml-2 text-xs text-red-500 underline"
                    >
                      View Reason
                    </button>
                  )}
                </td>
                <td>{a.isPremium ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <Link
                    to={`/article/${a._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/update-article/${a._id}`}
                    className="btn btn-sm btn-info"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => deleteMutation.mutate(a._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decline Reason Modal */}
      {modalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Decline Reason</h3>
            <p>{modalInfo.declineReason || "No reason given."}</p>
            <button
              onClick={() => setModalInfo(null)}
              className="mt-4 btn btn-sm btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArticles;
