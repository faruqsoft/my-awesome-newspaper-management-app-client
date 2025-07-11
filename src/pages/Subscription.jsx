import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Subscription = () => {
  const [period, setPeriod] = useState(1);
  const navigate = useNavigate();

  const prices = {
    1: 10,
    5: 50,
    10: 100,
  };

  const handleSubscribe = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        "http://localhost:5000/users/subscribe",
        { email: user.email, days: period },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Subscription activated!");
      navigate("/payment");
    } catch (err) {
      toast.error("Subscription failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <img
        src="https://i.ibb.co/D4tK364/Capture.png"
        alt="Subscription banner"
        className="w-full h-60 object-cover rounded mb-6"
      />
      <h2 className="text-2xl font-bold mb-4">Choose Your Subscription</h2>

      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="select select-bordered mb-4"
      >
        <option value={1}>1 Minute (Test)</option>
        <option value={5}>5 Days</option>
        <option value={10}>10 Days</option>
      </select>

      <p className="mb-4">💳 Price: ${prices[period]}</p>

      <button onClick={handleSubscribe} className="btn btn-primary">
        Take Subscription
      </button>
    </div>
  );
};

export default Subscription;