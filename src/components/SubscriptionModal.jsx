import React from "react";

const SubscriptionModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Get Premium Access</h2>
        <p className="text-gray-600 mb-4">Subscribe now to unlock premium articles and features!</p>
        <button
          onClick={() => {
            onClose();
            window.location.href = "/subscription"; // Navigate to subscription page
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Go to Subscription
        </button>
        <button
          onClick={onClose}
          className="block mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
