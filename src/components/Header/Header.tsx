import React, { useState, useEffect } from 'react';
import { Search, Bell, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to manage which dropdown is open
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu toggle

  const topBrands = ['Nike', 'adidas', 'New Balance', 'Supreme', 'UGG', 'Yeezy', 'Puma', 'Jordan', 'Fear of God', 'ASICS', 'Pop Mart', 'Crocs', 'BAPE', 'Kith'];
  const trendingBrands = ['Louis Vuitton', 'Gucci', 'Travis Scott', 'Balenciaga', 'Converse', 'Maison Mihara Yasuhiro', 'Palace', 'FC Barcelona', 'Pokemon', 'Sp5der', 'OFF-WHITE', 'Denim Tears', 'Vans', 'Chrome Hearts'];
  const allBrands = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <header className="w-full font-sans">
      <div className="relative z-10">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#111] via-[#1b1b1b] to-[#111] text-white py-5 px-4 md:px-10 shadow-lg shadow-black/30">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex items-center justify-between md:justify-start gap-6">
              <Logo />
              <button
                className="md:hidden text-white hover:text-green-400 transition-transform transform hover:scale-110"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden md:block w-[500px]">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-6 md:gap-8">
              <div className="hidden md:flex items-center gap-8">
                <NavLinks
                  links={[
                    { label: 'News', href: '/news' },
                    {
                      label: 'About', dropdown: [
                        { label: 'How StockX Works', href: '/how-it-works' },
                        { label: 'Buying Guide', href: '/buying-guide' },
                        { label: 'Selling Guide', href: '/selling-guide' },
                        { label: 'Our Process', href: '/our-process' },
                        { label: 'Newsroom', href: '/newsroom' },
                        { label: 'Company', href: '/company' }
                      ]
                    },
                    { label: 'Help', href: '/help' },
                    { label: 'Sell', href: '/sell' }
                  ]}
                />
              </div>

              <div className="flex items-center gap-6">
                <Link to="/wishlist" aria-label="Wishlist" className="text-white hover:text-green-400 transition-transform transform hover:scale-110">
                  <Heart size={20} />
                </Link>
                <button aria-label="Notifications" className="text-white hover:text-green-400 transition-transform transform hover:scale-110">
                  <Bell size={20} />
                </button>

                <div className="hidden md:flex gap-4">
                  <Link to="/login" className="px-5 py-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 text-base">
                    Login
                  </Link>
                  <Link to="/signup" className="px-5 py-2 rounded-full bg-white text-black hover:bg-green-400 hover:text-white transition-all duration-300 text-base">
                    Sign Up
                  </Link>
                </div>

                <div className="md:hidden flex gap-2 justify-center">
                  <Link to="/login" className="text-white bg-green-500 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-green-400 transition-all duration-300">
                    Login
                  </Link>
                  <Link to="/signup" className="text-white bg-green-500 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-green-400 transition-all duration-300">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden bg-[#121212] border-t border-gray-800 px-4 py-3">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-[#1A1A1A] text-white py-4 px-4 md:px-10 relative">
            <nav className="flex flex-col gap-4 text-sm px-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('category')}>Category</span>
                  <ChevronDown
                    className={`cursor-pointer transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                    onClick={() => toggleDropdown('category')}
                  />
                </div>
                {openDropdown === 'category' && (
                  <ul className="mt-2 space-y-1">
                    {['Fire', 'Security', 'Medical'].map((item) => (
                      <li key={item}>
                        <Link to={`/category/${item.toLowerCase()}`} className="block hover:text-green-400">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('brands')}>Brands</span>
                  <ChevronDown
                    className={`cursor-pointer transition-transform ${openDropdown === 'brands' ? 'rotate-180' : ''}`}
                    onClick={() => toggleDropdown('brands')}
                  />
                </div>
                {openDropdown === 'brands' && (
                  <ul className="mt-2 space-y-1">
                    <li>
                      <h4 className="text-base font-semibold text-gray-400">Top Brands</h4>
                      <ul className="space-y-1">
                        {topBrands.map((brand) => (
                          <li key={brand}>
                            <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                              {brand}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <h4 className="text-base font-semibold text-gray-400 mt-4">Trending Brands</h4>
                      <ul className="space-y-1">
                        {trendingBrands.map((brand) => (
                          <li key={brand}>
                            <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                              {brand}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <Link to="/brands/all" className="block text-green-400 mt-4">
                        View All Brands
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {['Police', 'EMS', 'Embroidery'].map((item) => (
                  <Link key={item} to={`/${item.toLowerCase()}`} className="hover:text-green-400">
                    {item}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="bg-[#1A1A1A] text-white py-4 px-4 md:px-10 relative">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-10">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {/* Category Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('category')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('category')}
                >
                  Category
                </span>
                {openDropdown === 'category' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-48 z-50 p-4 animate-fadeIn">
                    <ul className="space-y-2 text-base">
                      {['Fire', 'Security', 'Medical'].map((item) => (
                        <li key={item}>
                          <Link to={`/category/${item.toLowerCase()}`} className="hover:text-green-400 transition duration-200">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Brands Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('brands')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('brands')}
                >
                  Brands
                </span>

                {openDropdown === 'brands' && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[1000px] z-50 p-6 grid grid-cols-3 gap-6 animate-fadeIn"
                    onMouseEnter={() => isDesktop && setOpenDropdown('brands')}
                    onMouseLeave={() => isDesktop && setOpenDropdown(null)}
                  >
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Top Brands</h4>
                      <ul className="space-y-1 text-base">
                        {topBrands.map((brand) => (
                          <li key={brand}>
                            <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-green-400 transition duration-200">
                              {brand}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Trending Brands</h4>
                      <ul className="space-y-1 text-base">
                        {trendingBrands.map((brand) => (
                          <li key={brand}>
                            <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-green-400 transition duration-200">
                              {brand}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Browse All Brands</h4>
                      <div className="flex flex-wrap gap-2 text-base">
                        {allBrands.map((char) => (
                          <Link key={char} to={`/brands/all#${char}`} className="hover:text-green-400 transition duration-200">
                            {char}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Static Menu Items */}
              {['Police', 'EMS', 'Embroidery'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-green-400 text-base md:text-lg font-medium transition duration-200"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Mobile Nav */}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
