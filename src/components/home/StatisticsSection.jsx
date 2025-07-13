import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { useAuth } from '../../providers/AuthProvider'; // To check if user is admin
import { fetchUserStatistics } from '../../services/userApi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatisticsSection = () => {
    const { user, loading: authLoading } = useAuth();

    useGSAP(() => {
        gsap.from('.stats-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.stats-title',
                start: 'top 80%',
            }
        });
        gsap.from('.stat-card', { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 75%',
            }
        });
    }, []);

    // Only enable this query if an admin user is logged in
    // For a truly public display, the backend route for statistics would need to be public.
    // For now, it will only fetch if an admin is viewing.
    const { data: userStats, isLoading, isError, error } = useQuery({
        queryKey: ['userStatistics'],
        queryFn: fetchUserStatistics,
        enabled: user && user.role === 'admin', // Only fetch if an admin is logged in
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading || authLoading) {
        return <div className="text-center py-16 text-xl text-gray-700">Loading user statistics...</div>;
    }

    if (isError) {
        return <div className="text-center py-16 text-xl text-red-600">Error loading statistics: {error.message}</div>;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 stats-title">📈 Our Community in Numbers</h2>
                {userStats && user.role === 'admin' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center stats-grid">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-md stat-card border border-blue-300">
                            <h3 className="text-6xl font-extrabold text-blue-700 mb-3">
                                <CountUp end={userStats.totalUsers} duration={2.5} separator="," />
                            </h3>
                            <p className="text-xl font-semibold text-gray-800">Total Users</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-xl shadow-md stat-card border border-green-300">
                            <h3 className="text-6xl font-extrabold text-green-700 mb-3">
                                <CountUp end={userStats.premiumUsersCount} duration={2.5} separator="," />
                            </h3>
                            <p className="text-xl font-semibold text-gray-800">Premium Users</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl shadow-md stat-card border border-purple-300">
                            <h3 className="text-6xl font-extrabold text-purple-700 mb-3">
                                <CountUp end={userStats.normalUsersCount} duration={2.5} separator="," />
                            </h3>
                            <p className="text-xl font-semibold text-gray-800">Normal Users</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-8 rounded-lg shadow-inner text-center">
                        <p className="text-xl text-gray-700">User statistics are available to **administrators** only.</p>
                        <p className="mt-4 text-md text-gray-600">Log in as an admin to view detailed community insights.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StatisticsSection;