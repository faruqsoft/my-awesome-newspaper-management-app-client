import { useNavigate } from "react-router-dom";

const Plans = () => {
  const navigate = useNavigate();

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-center mb-6">💼 Subscription Plans</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg text-center shadow-md">
          <h3 className="text-xl font-bold mb-2">Free Plan</h3>
          <ul className="text-gray-600 space-y-2">
            <li>✔️ 1 Article Limit</li>
            <li>✔️ Access Public Articles</li>
            <li>❌ Premium Access</li>
          </ul>
        </div>
        <div className="border p-6 rounded-lg text-center shadow-md bg-yellow-50">
          <h3 className="text-xl font-bold mb-2 text-yellow-700">Premium Plan</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✔️ Unlimited Articles</li>
            <li>✔️ Access Premium Articles</li>
            <li>✔️ Priority Support</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => navigate("/subscription")}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plans;
