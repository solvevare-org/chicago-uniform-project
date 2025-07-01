import React, { useEffect, useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
                try {
                  const response = await fetch(`http://31.97.41.27:5000/api/styles/titles`);
                  const data = await response.json();
                  setCategories(data.titles.slice(0, 15) || []);
                } catch (error) {
                  console.error('Error fetching categories:', error);
                }
              };
 fetchCategories();
  }, [])
  return (
    <footer className="bg-[#0a3764] text-white pt-12 pb-6 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-blue-900 pb-10">
          {/* Contact Info */}
          <div>
            <h3 className="tracking-widest text-sm font-semibold mb-4">CHICAGO UNIFORM COMPANY</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="inline-block mt-1">📍</span>
                <span>550 W Roosevelt Rd<br/>Chicago, IL 60607<br/>United States</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>312-913-1006</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@chicagouniformcompany.com</span>
              </div>
            </div>
          </div>
          {/* Customer Links */}
          <div>
            <h3 className="tracking-widest text-sm font-semibold mb-4">CUSTOMER</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">My Account</Link></li>
              <li><Link to="#">Custom Orders</Link></li>
              <li><Link to="#">Order Tracking</Link></li>
              <li><Link to="#">My Wishlist</Link></li>
              <li><Link to="#">FAQs</Link></li>
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h3 className="tracking-widest text-sm font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Contact</Link></li>
              <li><Link to="#">Accessibility</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
            </ul>
          </div>
          {/* Social & Payment */}
          <div className="flex flex-col items-end justify-between h-full">
            <div className="flex gap-3 mb-4">
              <a href="#" aria-label="Facebook" className="bg-white/10 rounded p-2 hover:bg-white/20"><Facebook size={24} /></a>
              <a href="#" aria-label="Instagram" className="bg-white/10 rounded p-2 hover:bg-white/20"><Instagram size={24} /></a>
            </div>
            <div className="text-xs tracking-widest mb-2">ACCEPTED CARDS</div>
            <div className="flex gap-2 mb-4">
              <img src="/cards/visa.png" alt="Visa" className="h-6" />
              <img src="/cards/mastercard.png" alt="Mastercard" className="h-6" />
              <img src="/cards/amex.png" alt="Amex" className="h-6" />
              <img src="/cards/discover.png" alt="Discover" className="h-6" />
            </div>
          </div>
        </div>
        {/* Customer Service */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-blue-900">
          <div>
            <h4 className="font-semibold mb-2">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">Shipping & Returns</Link></li>
              <li><Link to="#">Sizing Guide</Link></li>
              <li><Link to="#">Order Tracking</Link></li>
              <li><Link to="#">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Accessibility</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>info@chicagouniformcompany.com</li>
              <li>312-913-1006</li>
              <li>550 W Roosevelt Rd, Chicago, IL 60607</li>
            </ul>
          </div>
        </div>
        {/* Trust Signals Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 py-8 mt-4 border-t border-blue-900">
          <div className="flex-1 flex flex-col items-center text-center">
            <img src="/trust/76ers.png" alt="76ers Partner" className="h-10 mb-2 object-contain" />
            <span className="text-xs text-gray-200">Official Partner of the Philadelphia 76ers</span>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <img src="/trust/inc5000.png" alt="Inc 5000" className="h-10 mb-2 object-contain" />
            <span className="text-xs text-gray-200">One of the Fastest Growing Private Companies in America</span>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <img src="/trust/nyt.png" alt="NY Times" className="h-10 mb-2 object-contain" />
            <span className="text-xs text-gray-200">Featured in the New York Times Business Section</span>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <img src="/trust/bbb.png" alt="BBB Accredited" className="h-8 object-contain" />
              <img src="/trust/a-plus.png" alt="A+ Rating" className="h-8 object-contain" />
            </div>
            <span className="text-xs text-gray-200">BBB Accredited Business</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4 text-xs text-gray-400">
          <div className="text-center md:text-left">
            <p>&copy; 2025 Chicago Uniform Company. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-[#b3ddf3] transition-colors duration-200">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;