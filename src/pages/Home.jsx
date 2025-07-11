import React, { useEffect, useState } from "react";

import TrendingSlider from "../components/TrendingSlider";
import AllPublishers from "../components/AllPublishers";
import Stats from "../components/Stats";
import Plans from "../components/Plans";
import SubscriptionModal from "../components/SubscriptionModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-center text-3xl font-bold my-10">Welcome to NewsPortal Home 📰</h1>

      {/* 🔥 Trending Articles */}
      <TrendingSlider />

      {/* 📰 Publishers */}
      <AllPublishers />

      {/* 📊 Stats */}
      <Stats />

      {/* 💰 Subscription Plans */}
      <Plans />

      {/* 🟨 Modal after 10 seconds */}
      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
