import React from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroSection = () => {
    // GSAP Context for component-specific animations
    useGSAP(() => {
        gsap.from('.hero-content > *', { opacity: 0, y: 50, stagger: 0.2, delay: 0.5, duration: 1, ease: 'power3.out' });
        gsap.from('.hero-background-blob', {
            opacity: 0,
            scale: 0,
            duration: 2,
            ease: 'elastic.out(1, 0.5)',
            stagger: 0.3,
            delay: 0.2
        });
    }, []);

    const [typeEffect] = useTypewriter({
        words: ['Stay Informed', 'Explore Trends', 'Get Premium Access'],
        loop: {},
        typeSpeed: 80,
        deleteSpeed: 50,
    });

    return (
        <section className="relative bg-gradient-to-br from-blue-700 to-purple-800 text-white py-24 px-4 md:px-8 text-center overflow-hidden min-h-[60vh] flex items-center justify-center">
            {/* Background shapes for visual appeal */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl hero-background-blob" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl hero-background-blob" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl hero-background-blob" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <div className="container mx-auto hero-content z-10">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                    {typeEffect} <Cursor cursorStyle='|' />
                </h1>
                <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light">
                    Your ultimate destination for the latest news, insightful analysis, and trending stories.
                </p>
                <Link to="/articles">
                    <button className="bg-white text-blue-700 px-10 py-4 rounded-full text-3xl font-semibold shadow-lg hover:bg-gray-200 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Explore Articles
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;