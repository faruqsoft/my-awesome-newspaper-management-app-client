import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const AllArticlesAdmin = () => {
  const [declineReason, setDeclineReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { data: articles = [], refetch } = useQuery({
    queryKey: ["all-articles-admin"],
    queryFn: async () => (await axios.get("http://localhost:5000/articles/all")).data,
  });

  const handleApprove = async (id) => {
    await axios.patch(`http://localhost:5000/articles/${id}`, { status: "approved" });
    toast.success("Approved");
    refetch();
  };

  const handleDecline = async () => {
    await axios.patch(`http://localhost:5000/articles/${selectedId}`, {
      status: "declined",
      declineReason,
    });
    toast.error("Declined");
    setSelectedId(null);
    refetch();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/articles/${id}`);
    toast.success("Deleted");
    refetch();
  };

  const handleMakePremium = async (id) => {
    await axios.patch(`http://localhost:5000/articles/${id}`, { isPremium: true });
    toast.success("Made Premium");
    refetch();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Articles</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Email</th>
              <th>Status</th>
              <th>Publisher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.title}</td>
                <td>{a.authorName}</td>
                <td>{a.email}</td>
                <td>{a.status}</td>
                <td>{a.publisher}</td>
                <td className="space-x-2">
                  <button onClick={() => handleApprove(a._id)} className="btn btn-xs bg-green-500 text-white">
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedId(a._id)}
                    className="btn btn-xs bg-yellow-500 text-white"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleMakePremium(a._id)}
                    className="btn btn-xs bg-blue-500 text-white"
                  >
                    Premium
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="btn btn-xs bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decline Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-2">Decline Reason</h3>
            <textarea
              className="w-full border p-2 rounded"
              rows={3}
              placeholder="Write reason..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setSelectedId(null)}
                className="btn btn-sm bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="btn btn-sm bg-red-500 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllArticlesAdmin;
