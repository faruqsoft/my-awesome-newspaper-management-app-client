import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { createUser, googleLogin } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("Password must be at least 6 characters.");
    if (!/[A-Z]/.test(password)) errors.push("Password must have a capital letter.");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Password must have a special character.");
    if (!/[0-9]/.test(password)) errors.push("Password must have a number.");
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setLoading(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      await updateProfile(result.user, { displayName: name, photoURL: photo });

      Swal.fire("Success", "Registration completed!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Registration failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      Swal.fire("Success", "Google login successful!", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", "Google login failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register on NewsPortal</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Photo URL</label>
            <input
              type="text"
              name="photo"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleGoogle}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
