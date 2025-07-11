// client/src/pages/dashboard/AddPublisher.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddPublisher = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logo || !name) return toast.error("All fields required");

    const formData = new FormData();
    formData.append("image", logo);

    try {
      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );
      const logoUrl = uploadRes.data.data.url;

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/publishers",
        { name, logo: logoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Publisher added!");
      setName("");
      setLogo(null);
    } catch (err) {
      toast.error("Failed to add publisher");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">➕ Add New Publisher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Publisher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="file-input file-input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Add Publisher
        </button>
      </form>
    </div>
  );
};

export default AddPublisher;
