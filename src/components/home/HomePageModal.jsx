import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Set app element for react-modal (important for accessibility)
Modal.setAppElement('#root');

const HomePageModal = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // GSAP animation for modal
    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo('.modal-content-animation', { scale: 0.8, opacity: 0, y: -50 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
        }
    }, [isOpen]);

    useEffect(() => {
        // Only trigger modal if not authenticated and not currently loading auth
        if (!authLoading && !user) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 10000); // 10 seconds

            return () => clearTimeout(timer); // Cleanup timer on component unmount or if user logs in
        }
    }, [user, authLoading]);

    const closeModal = () => {
        setIsOpen(false);
    };

    const navigateToSubscription = () => {
        closeModal();
        navigate('/subscription');
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Subscription Offer"
            className="modal-content-animation bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto my-20 relative outline-none border-4 border-purple-500"
            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-[9999]" // Higher z-index
        >
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-4xl font-bold transition-transform duration-200 transform hover:rotate-90">&times;</button>
            <div className="text-center">
                <img src="https://i.ibb.co/3W6qj1r/premium-star.png" alt="Premium Star" className="w-24 h-24 mx-auto mb-4 animate-bounce-slow" /> {/* Example star image */}
                <h2 className="text-4xl font-extrabold text-blue-700 mb-4 leading-tight">
                    Upgrade to Premium!
                </h2>
                <p className="text-lg text-gray-700 mb-8 px-4">
                    Unlock exclusive content, enjoy an ad-free experience, and post unlimited articles!
                </p>
                <button
                    onClick={navigateToSubscription}
                    className="w-full bg-purple-600 text-white py-4 px-8 rounded-full hover:bg-purple-700 font-bold text-xl shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    Subscribe Now!
                </button>
            </div>
        </Modal>
    );
};

export default HomePageModal;