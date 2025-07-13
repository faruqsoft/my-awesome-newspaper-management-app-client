import React from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PlansSection = () => {
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.from('.plans-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.plans-title',
                start: 'top 80%',
            }
        });
        gsap.from('.plan-card-item', { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.plans-grid',
                start: 'top 75%',
            }
        });
    }, []);

    // Placeholder for price calculation (as in Subscription.jsx)
    const calculatePrice = (duration) => {
        switch (duration) {
            case '1 minute': return 1;
            case '5 days': return 50;
            case '10 days': return 90;
            default: return 0;
        }
    };

    return (
        <section className="bg-gray-100 py-16 px-4 md:px-8">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 plans-title">💸 Flexible Plans for Every Reader</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto plans-grid">
                    {/* Free Plan Card */}
                    <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-600 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300 plan-card-item">
                        <div>
                            <h3 className="text-3xl font-extrabold text-blue-700 mb-4">Free Plan</h3>
                            <p className="text-gray-700 mb-6 text-lg">Ideal for casual readers and new authors getting started.</p>
                            <ul className="text-gray-800 space-y-3 mb-8 text-lg">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Access to all public articles</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Basic Browse experience</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Post 1 article (for authors)</li>
                                <li className="flex items-center text-gray-500"><span className="text-red-500 mr-2">✖️</span>Premium content access</li>
                                <li className="flex items-center text-gray-500"><span className="text-red-500 mr-2">✖️</span>Ad-free experience</li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <span className="text-5xl md:text-6xl font-extrabold text-blue-700">$0</span>
                            <span className="text-xl text-gray-600">/forever</span>
                            <button className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg opacity-70 cursor-not-allowed">
                                Current Plan
                            </button>
                        </div>
                    </div>

                    {/* Premium Plan Card */}
                    <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-purple-600 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300 plan-card-item">
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-3xl font-extrabold text-purple-700 mb-4">Premium Plan</h3>
                            <p className="text-gray-700 mb-6 text-lg">Unlock the full potential of MyNewsApp with exclusive benefits!</p>
                            <ul className="text-gray-800 space-y-3 mb-8 text-lg flex-grow">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Access to ALL articles (including Exclusive Premium)</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Ad-free reading experience</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Unlimited article posts (for authors)</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✔️</span>Priority customer support</li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <span className="text-5xl md:text-6xl font-extrabold text-purple-700">${calculatePrice('5 days')}</span>
                            <span className="text-xl text-gray-600">/5 days</span> {/* Example, use dynamic values if possible */}
                            <button
                                onClick={() => navigate('/subscription')}
                                className="mt-8 w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                            >
                                Get Premium Now!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlansSection;