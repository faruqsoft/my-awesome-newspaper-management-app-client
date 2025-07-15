import React from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for internal navigation

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-200 pt-12 mt-2 shadow-inner"> {/* Changed background to a deep blue, text to light gray */}
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: About MyNewsApp */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">MyNewsApp</h3> {/* Headings remain white for prominence */}
          <ul className="space-y-2 text-gray-300"> {/* Slightly lighter gray for link text */}
            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 2: Articles */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Articles</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/articles" className="hover:text-white transition-colors duration-200">All Articles</Link></li>
            <li><Link to="/premium-articles" className="hover:text-white transition-colors duration-200">Premium Articles</Link></li>
            <li><Link to="/add-article" className="hover:text-white transition-colors duration-200">Submit Article</Link></li>
            <li><Link to="/my-articles" className="hover:text-white transition-colors duration-200">My Articles</Link></li>
          </ul>
        </div>

        {/* Column 3: Account & Support */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Account & Support</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/my-profile" className="hover:text-white transition-colors duration-200">My Profile</Link></li>
            <li><Link to="/subscription" className="hover:text-white transition-colors duration-200">Subscription</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQs</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
          </ul>
        </div>

        {/* Column 4 - Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/omar.faruq.399"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white text-2xl transition-colors duration-200"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.youtube.com/@omarfaruq1905"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white text-2xl transition-colors duration-200"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.linkedin.com/in/omar-faruq-5a771a267/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white text-2xl transition-colors duration-200"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.instagram.com/omar.sau/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white text-2xl transition-colors duration-200"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-blue-800"> {/* Adjusted border color to match blue theme */}
        <div className="text-center py-6 text-sm text-gray-400"> {/* Adjusted copyright text color */}
          © {new Date().getFullYear()} <span className="text-white font-medium">MyNewsApp</span> by Omar Developer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;