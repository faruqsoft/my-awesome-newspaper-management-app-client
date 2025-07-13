import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { processPayment } from '../services/paymentApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // For payment confirmation

const Subscription = () => {
    const { user, loading: authLoading, updateAuthUser } = useAuth(); // Use updateAuthUser from AuthProvider
    const navigate = useNavigate();

    const [selectedDuration, setSelectedDuration] = useState('5 days'); // Changed default to 5 days for a more realistic demo

    // Function to calculate price based on duration
    const calculatePrice = (duration) => {
        switch (duration) {
            case '1 minute': return 1; // For assignment checking
            case '5 days': return 50;
            case '10 days': return 90;
            default: return 0;
        }
    };

    // TanStack Mutation for processing payment
    const processPaymentMutation = useMutation({
        mutationFn: processPayment,
        onSuccess: (data) => {
            toast.success(data.message);
            // Update the user context with the fresh premium status returned from backend
            if (data.user) {
                updateAuthUser(data.user);
            }
            navigate('/premium-articles'); // Navigate to premium articles page after successful subscription
        },
        onError: (error) => {
            console.error('Payment failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        },
    });

    // Handle subscribe button click
    const handleSubscribe = async () => {
        if (authLoading) {
            // Prevent action if auth state is still loading
            toast.info("Please wait while we verify your login status.");
            return;
        }

        if (!user) {
            // Use SweetAlert for login prompt
            Swal.fire({
                title: 'Not Logged In',
                text: 'You need to log in to subscribe to a premium plan.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Login',
                cancelButtonText: 'No, thanks',
                confirmButtonColor: '#3b82f6', // Tailwind blue-500
                cancelButtonColor: '#ef4444' // Tailwind red-500
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        // Confirmation dialog before proceeding to payment
        Swal.fire({
            title: 'Confirm Premium Subscription',
            html: `You are about to subscribe for <strong class="text-blue-600">${selectedDuration}</strong> for only <strong class="text-green-600">$${calculatePrice(selectedDuration)}</strong>.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb', // Tailwind blue-600
            cancelButtonColor: '#ef4444', // Tailwind red-500
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                processPaymentMutation.mutate(selectedDuration); // Trigger payment mutation
            }
        });
    };

    // Loading state for auth or payment processing
    if (authLoading || processPaymentMutation.isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-800">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-xl">Loading subscription options...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Attractive Banner Section */}
                <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl shadow-xl overflow-hidden py-16 md:py-24 px-6 mb-12 text-center transform transition-transform duration-300 hover:scale-[1.005]">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight animate-fade-in-down">
                            Unlock Your Ultimate Reading Experience! 🚀
                        </h1>
                        <p className="text-lg md:text-xl font-light mb-8 max-w-3xl mx-auto animate-fade-in">
                            Go premium and dive into exclusive content, enjoy an ad-free environment, and gain unlimited publishing power.
                        </p>
                        <div className="flex justify-center items-center space-x-3 md:space-x-4 animate-fade-in-up">
                            <span className="text-5xl md:text-7xl font-bold">$</span>
                            <span className="text-7xl md:text-9xl font-extrabold">{calculatePrice(selectedDuration)}</span>
                            <span className="text-3xl md:text-5xl font-light">/ {selectedDuration.includes('minute') ? 'min' : 'days'}</span>
                        </div>
                    </div>
                    {/* Background shapes (for visual appeal) */}
                    <div className="absolute inset-0 z-0 opacity-15">
                        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </section>

                {/* Plan Selection and Features Section */}
                <section className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-8 border border-gray-200">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-6 leading-tight">
                        Choose Your Ideal Plan
                    </h2>

                    {/* Duration Dropdown */}
                    <div>
                        <label htmlFor="duration" className="block text-xl font-semibold text-gray-700 mb-3 text-center">
                            Select Subscription Duration
                        </label>
                        <select
                            id="duration"
                            className="w-full px-5 py-3 border border-b-gray-700 text-center transition duration-200" /* Global select styles */
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                        >
                            <option value="1 minute">1 Minute (for Assignment Checking)</option>
                            <option value="5 days">5 Days</option>
                            <option value="10 days">10 Days</option>
                        </select>
                    </div>

                    {/* Total Price Display */}
                    <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-2xl font-bold text-gray-900">
                            Current Price: <span className="text-blue-600">${calculatePrice(selectedDuration)}</span>
                        </p>
                    </div>

                    {/* Features List */}
                    <ul className="text-lg text-gray-700 space-y-3 mt-6 list-none pl-0">
                        <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">✓</span> Access to all Premium Articles</li>
                        <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">✓</span> Unlimited Article Posts (for authors)</li>
                        <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">✓</span> Completely Ad-Free Browse Experience</li>
                        <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">✓</span> Priority Customer Support</li>
                        <li className="flex items-center"><span className="text-green-500 mr-3 text-2xl">✓</span> Early Access to New Features</li>
                    </ul>

                    {/* Subscribe Button */}
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 font-bold text-2xl shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processPaymentMutation.isLoading}
                    >
                        {processPaymentMutation.isLoading ? 'Processing Payment...' : 'Subscribe Now!'}
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Subscription;