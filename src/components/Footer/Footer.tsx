import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] text-gray-400 text-sm py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <h3 className="text-white font-bold mb-4">Air Jordan</h3>
            <ul className="space-y-2">
              <li>Air Jordan 1</li>
              <li>Air Jordan 3</li>
              <li>Air Jordan 4</li>
              <li>Air Jordan 5</li>
              <li>Air Jordan 11</li>
              <li>Air Jordan 12</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Adidas</h3>
            <ul className="space-y-2">
              <li>Adidas Yeezy</li>
              <li>Yeezy Slides</li>
              <li>Yeezy Foam RNR</li>
              <li>Yeezy Boost 350</li>
              <li>Yeezy 700</li>
              <li>Campus 00s</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Nike</h3>
            <ul className="space-y-2">
              <li>Air Force 1</li>
              <li>Air Max</li>
              <li>Nike Dunk</li>
              <li>Nike Ja</li>
              <li>Nike Kobe</li>
              <li>Nike Vomero 5</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">ASICS</h3>
            <ul className="space-y-2">
              <li>Asics Gel 1130</li>
              <li>Asics Kayano 14</li>
              <li>Asics Gel-NYC</li>
              <li>Asics for Men</li>
              <li>Asics for Women</li>
              <li>Asics for Kids</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Fear of God</h3>
            <ul className="space-y-2">
              <li>Essentials Hoodies</li>
              <li>Essentials Sweatpants</li>
              <li>Essentials T-Shirts</li>
              <li>Essentials Pants</li>
              <li>Essentials Kids</li>
              <li>Essentials Women’s</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Product Suggestions</li>
              <li>Size Guide</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <p>&copy; 2025 StockX. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Your Privacy Choices</a>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white">
            <Facebook size={20} />
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">
            <Twitter size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;