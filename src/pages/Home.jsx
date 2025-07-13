import React from 'react';
import { useAuth } from '../providers/AuthProvider'; // <-- Import useAuth

// Import the new components
import HeroSection from '../components/home/HeroSection';
import TrendingArticlesSlider from '../components/home/TrendingArticlesSlider';
import AllPublishersSection from '../components/home/AllPublishersSection';
import StatisticsSection from '../components/home/StatisticsSection';
import PlansSection from '../components/home/PlansSection';
import HomePageModal from '../components/home/HomePageModal'; // For the 10-second modal
import { Link } from 'react-router-dom'; // Make sure Link is imported if used in extra sections

const Home = () => {
    // --- FIX IS HERE ---
    const { user, loading: authLoading } = useAuth(); // Destructure user and authLoading from useAuth

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navbar and Footer are handled by MainLayout */}

            <HeroSection />
            <TrendingArticlesSlider />
            <AllPublishersSection />
            <StatisticsSection />
            <PlansSection />

            {/* Extra Section 1: Latest News Highlight (Example) */}
            <section className="py-16 px-4 md:px-8 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 section-title">📢 Dive Deeper: Our Latest Perspectives</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl shadow-lg border border-teal-200 transform hover:scale-[1.02] transition-transform duration-300">
                            <h3 className="text-2xl font-bold text-teal-700 mb-3">The Future of AI in Journalism</h3>
                            <p className="text-gray-700 text-lg mb-4">
                                Explore how artificial intelligence is transforming news creation, distribution, and consumption. A must-read for tech enthusiasts!
                            </p>
                            <Link to="/articles/ai-in-journalism-id" className="text-blue-600 hover:underline font-semibold">Read More &rarr;</Link> {/* Link to a hypothetical article */}
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl shadow-lg border border-orange-200 transform hover:scale-[1.02] transition-transform duration-300">
                            <h3 className="text-2xl font-bold text-orange-700 mb-3">Global Climate Initiatives: A Progress Report</h3>
                            <p className="text-gray-700 text-lg mb-4">
                                Our in-depth analysis of worldwide efforts to combat climate change and what's next for environmental policy.
                            </p>
                            <Link to="/articles/climate-report-id" className="text-blue-600 hover:underline font-semibold">Read More &rarr;</Link> {/* Link to a hypothetical article */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Extra Section 2: Call to Action / Join Our Community */}
            <section className="py-16 px-4 md:px-8 bg-purple-700 text-white text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-4xl font-bold mb-6 section-title">🤝 Join Our Growing Community!</h2>
                    <p className="text-xl font-light mb-8">
                        Become a part of MyNewsApp and get personalized news, contribute your own articles, and connect with other readers and writers.
                    </p>
                    {/* Use the destructured 'user' variable here */}
                    {!user ? (
                        <div className="space-x-4">
                            <Link to="/register">
                                <button className="bg-white text-purple-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white">
                                    Register Now
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-700 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white">
                                    Login
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-lg">You're already part of our community! Explore more articles.</p>
                    )}
                </div>
            </section>

            {/* Homepage Subscription Modal (It manages its own state and visibility) */}
            <HomePageModal />
        </div>
    );
};

export default Home;