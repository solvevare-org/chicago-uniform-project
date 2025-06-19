import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
                try {
                  const response = await fetch(`http://localhost:3000/api/styles/titles`);
                  const data = await response.json();
                  setCategories(data.titles.slice(0, 15) || []);
                } catch (error) {
                  console.error('Error fetching categories:', error);
                }
              };
 fetchCategories();
  }, [])
  return (
    <footer className="bg-white text-[#222] text-sm pt-12 pb-6 px-4 md:px-8 lg:px-16 border-t border-[#b3ddf3]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#b3ddf3] pb-10">
          {/* Categories - Split into 2 columns */}
          <div className="md:col-span-2">
            <h3 className="text-[#222] font-bold mb-4 text-lg tracking-wide">Categories</h3>
            <div className="grid grid-cols-2 gap-6">
              <ul className="space-y-2">
                {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category}>
                    <Link to={`/category/${category.replace(/\s+/g, '%20').toLowerCase()}`} className="hover:text-[#b3ddf3] transition-colors duration-200">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category}>
                    <Link to={`/category/${category.replace(/\s+/g, '%20').toLowerCase()}`} className="hover:text-[#b3ddf3] transition-colors duration-200">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Help */}
          <div>
            <h3 className="text-[#222] font-bold mb-4 text-lg tracking-wide">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Product Suggestions</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Size Guide</a></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="text-[#222] font-bold mb-4 text-lg tracking-wide">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Press</a></li>
            </ul>
          </div>
          {/* Social & Newsletter */}
          <div>
            <h3 className="text-[#222] font-bold mb-4 text-lg tracking-wide">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#b3ddf3] transition-colors duration-200"><Facebook size={22} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-[#b3ddf3] transition-colors duration-200"><Twitter size={22} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-[#b3ddf3] transition-colors duration-200"><Instagram size={22} /></a>
            </div>
            <form className="flex flex-col space-y-2">
              <input type="email" placeholder="Your email address" className="px-3 py-2 rounded bg-[#b3ddf3] text-[#222] focus:outline-none focus:ring-2 focus:ring-[#b3ddf3]" />
              <button type="submit" className="bg-[#b3ddf3] text-black rounded px-4 py-2 font-semibold hover:bg-[#b3ddf3] transition-colors duration-200">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
          <div className="text-center md:text-left text-gray-400">
            <p>&copy; 2025 Southloop Print. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Your Privacy Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;