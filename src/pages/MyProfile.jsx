import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    bio: "",
  });

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/${user.email}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const { name, photo, bio } = res.data;
          setFormData({ name: name || "", photo: photo || "", bio: bio || "" });
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:5000/users/${user.email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          name="name"
          value={formData.name}
          placeholder="Your Name"
          onChange={handleChange}
          required
        />
        <input
          className="input input-bordered w-full"
          type="text"
          name="photo"
          value={formData.photo}
          placeholder="Photo URL (optional)"
          onChange={handleChange}
        />
        <textarea
          className="textarea textarea-bordered w-full"
          name="bio"
          value={formData.bio}
          placeholder="Short Bio (optional)"
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary w-full">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
