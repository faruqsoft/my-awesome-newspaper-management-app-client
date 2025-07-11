import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionModal = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-center shadow-lg">
        <h3 className="text-xl font-bold mb-2">🔔 Get Premium Access!</h3>
        <p className="mb-4">Enjoy unlimited articles and exclusive premium content.</p>
        <button
          onClick={() => navigate("/subscription")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
