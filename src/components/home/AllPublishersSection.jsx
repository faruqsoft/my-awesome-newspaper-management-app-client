import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPublishers } from '../../services/publisherApi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AllPublishersSection = () => {
    useGSAP(() => {
        gsap.from('.publishers-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.publishers-title',
                start: 'top 80%',
            }
        });
        gsap.from('.publisher-item', { opacity: 0, scale: 0.8, stagger: 0.05, duration: 0.6, ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.publisher-grid',
                start: 'top 75%',
            }
        });
    }, []);

    const { data: publishers = [], isLoading, isError, error } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchAllPublishers,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    if (isLoading) {
        return <div className="text-center py-16 text-xl text-gray-700 bg-gray-100">Loading publishers...</div>;
    }

    if (isError) {
        return <div className="text-center py-16 text-xl text-red-600 bg-gray-100">Error loading publishers: {error.message}</div>;
    }

    return (
        <section className="bg-gray-100 py-16 px-4 md:px-8">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 publishers-title">📰 Our Esteemed Publishers</h2>
                {publishers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 publisher-grid">
                        {publishers.map((publisher) => (
                            <div key={publisher._id} className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 border border-gray-200 publisher-item">
                                <img src={publisher.logo} alt={publisher.name} className="w-24 h-24 object-contain mb-3 rounded-full border-2 border-purple-200 p-1" />
                                <p className="text-xl font-semibold text-gray-800 text-center line-clamp-1">{publisher.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No publishers added yet.</p>
                )}
            </div>
        </section>
    );
};

export default AllPublishersSection;