import React from 'react';
import { Search, Bell, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="w-full">
      <div className="bg-gradient-to-r from-[#121212] via-[#1A1A1A] to-[#121212] text-white py-4 px-6 md:px-8 shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Logo />
            <div className="hidden md:block w-[500px]">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <NavLinks 
                links={[
                  { label: 'News', href: '/news' },
                  { label: 'About', dropdown: [
                    { label: 'How StockX Works', href: '/how-it-works' },
                    { label: 'Buying Guide', href: '/buying-guide' },
                    { label: 'Selling Guide', href: '/selling-guide' },
                    { label: 'Our Process', href: '/our-process' },
                    { label: 'Newsroom', href: '/newsroom' },
                    { label: 'Company', href: '/company' }
                  ] },
                  { label: 'Help', href: '/help' },
                  { label: 'Sell', href: '/sell' }
                ]} 
              />
            </nav>

            <div className="flex items-center space-x-6">
              <button aria-label="Notifications" className="text-white hover:text-green-400 transition-transform transform hover:scale-110">
                <Bell size={20} />
              </button>

              <div className="hidden md:flex space-x-4">
                <button className="px-5 py-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300">
                  <Link to="/login">Login</Link>
                </button>
                <button className="px-5 py-2 rounded-full bg-white text-black hover:bg-green-400 hover:text-white transition-all duration-300">
                  <Link to="/signup">Sign Up</Link>
                </button>
              </div>

              <button className="md:hidden text-white bg-green-500 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-green-400 transition-all duration-300">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-[#121212] border-t border-gray-800 px-4 py-3">
        <SearchBar />
      </div>

      <div className="bg-[#1A1A1A] text-white py-4 px-6 md:px-8 overflow-x-auto scrollbar-hide">
        <div className="max-w-screen-2xl mx-auto flex items-center space-x-8 md:space-x-10">
          <NavLinks 
            links={[
              { label: 'Brands', href: '/brands' },
              { label: 'New', href: '/new' },
              { label: 'Men', href: '/men' },
              { label: 'Women', href: '/women' },
              { label: 'Kids', href: '/kids' },
              { label: 'Sneakers', href: '/sneakers' },
              { label: 'Shoes', href: '/shoes' },
              { label: 'Apparel', href: '/apparel' },
              { label: 'Accessories', href: '/accessories' },
              { label: 'More Categories', href: '/categories' },
              { label: 'Deals', href: '/deals' }
            ]} 
            className="whitespace-nowrap text-sm md:text-base hover:text-green-400 transition-colors duration-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;