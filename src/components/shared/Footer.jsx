import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} MyNewsApp. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="hover:text-blue-400">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400">Terms of Service</a>
                    <a href="#" className="hover:text-blue-400">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;