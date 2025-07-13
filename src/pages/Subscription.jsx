import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { processPayment } from '../services/paymentApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // For payment confirmation

const Subscription = () => {
    const { user, loading: authLoading, login } = useAuth(); // login is needed to refresh user state
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedDuration, setSelectedDuration] = useState('1 minute'); // Default for assignment testing

    const calculatePrice = (duration) => {
        switch (duration) {
            case '1 minute': return 1; // For assignment checking
            case '5 days': return 50;
            case '10 days': return 90;
            default: return 0;
        }
    };

    const processPaymentMutation = useMutation({
        mutationFn: processPayment,
        onSuccess: async (data) => {
            toast.success(data.message);
            // After successful payment, the backend updates premiumTaken.
            // We need to refresh the user context in the frontend to reflect this.
            // A simple re-login call or explicit state update could work.
            // For robust update, you could refetch user profile:
            // queryClient.invalidateQueries(['userProfile']); // If you have a userProfile query
            // Or trigger a re-login to update AuthProvider state:
            await login({ email: user.email, password: user.password }); // This might not be ideal, as it needs password.
            // A better way is if the backend returns the updated user object and AuthProvider updates state.
            // Current AuthProvider's login function handles this.
            // If user is already logged in, you need a mechanism to update the AuthProvider's `user` state.
            // A simpler approach: Backend sends back updated `user` object in payment success.
            // For now, `login` is a placeholder for updating context.
            // The `premiumTaken` in JWT will also update on next login.

            navigate('/premium-articles'); // Navigate to premium articles page
        },
        onError: (error) => {
            console.error('Payment failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Payment failed.');
        },
    });

    const handleSubscribe = async () => {
        if (!user) {
            Swal.fire({
                title: 'Not Logged In',
                text: 'You need to log in to subscribe.',
                icon: 'info',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        Swal.fire({
            title: 'Confirm Subscription',
            html: `You are about to subscribe for <strong>${selectedDuration}</strong> for <strong>$${calculatePrice(selectedDuration)}</strong>.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed to Payment'
        }).then((result) => {
            if (result.isConfirmed) {
                processPaymentMutation.mutate(selectedDuration);
            }
        });
    };

    if (authLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-10 text-center">
                <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">Unlock Premium Content!</h1>
                <p className="text-xl mb-6 max-w-2xl mx-auto">
                    Get unlimited access to exclusive articles, ad-free Browse, and more.
                </p>
                <div className="flex justify-center items-center space-x-4">
                    <span className="text-6xl font-bold">$</span>
                    <span className="text-8xl font-extrabold">{calculatePrice(selectedDuration)}</span>
                    <span className="text-4xl">/ {selectedDuration.includes('minute') ? 'min' : 'days'}</span>
                </div>
            </div>

            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Choose Your Plan</h2>

                <div>
                    <label htmlFor="duration" className="block text-xl font-semibold text-gray-700 mb-3 text-center">
                        Select Subscription Duration
                    </label>
                    <select
                        id="duration"
                        className="w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm text-lg focus:ring-blue-500 focus:border-blue-500 text-center"
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                    >
                        <option value="1 minute">1 Minute (For Assignment Checking)</option>
                        <option value="5 days">5 Days</option>
                        <option value="10 days">10 Days</option>
                    </select>
                </div>

                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 mt-4">
                        Total: ${calculatePrice(selectedDuration)}
                    </p>
                </div>

                <ul className="text-lg text-gray-700 space-y-2 mt-6 list-disc list-inside">
                    <li>✔️ Access to all Premium Articles</li>
                    <li>✔️ Unlimited Article Posts (for authors)</li>
                    <li>✔️ Ad-free experience</li>
                    <li>✔️ Priority support</li>
                </ul>

                <button
                    onClick={handleSubscribe}
                    className="w-full bg-green-500 text-white py-4 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-bold text-2xl mt-8"
                    disabled={processPaymentMutation.isLoading}
                >
                    {processPaymentMutation.isLoading ? 'Processing Payment...' : 'Subscribe Now'}
                </button>
            </div>
        </div>
    );
};

export default Subscription;