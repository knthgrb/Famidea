import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Logo & Description */}
          <div>
            <h2 className="text-lg font-semibold text-white">FAMIDEA</h2>
            <p className="mt-4 text-gray-400">
              Bridging the gap between birth centers and patients, FAMIDEA
              provides seamless appointment booking and communication tools.
            </p>
          </div>

          {/* Links */}
          <div className="sm:text-center lg:text-left">
            <h3 className="text-lg font-semibold text-white">Go to</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#home" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-start sm:items-center lg:items-start">
            <h3 className="text-lg font-semibold text-white">Stay Connected</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FAMIDEA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
