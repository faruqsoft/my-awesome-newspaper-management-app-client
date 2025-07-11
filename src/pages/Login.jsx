import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const { signIn, googleLogin } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      Swal.fire("Success", "Login successful!", "success");
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      Swal.fire("Error", "Login failed. Please check your credentials.", "error");
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
      <div className="p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to NewsPortal</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleGoogle}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
