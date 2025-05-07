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
                  <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('brands')}>Brands</span>
                  <ChevronDown
                    className={`cursor-pointer transition-transform ${openDropdown === 'brands' ? 'rotate-180' : ''}`}
                    onClick={() => toggleDropdown('brands')}
                  />
                </div>
                {openDropdown === 'brands' && (
                  <ul className="mt-2 space-y-1">
                    {[
                      'A4', 'Adams', 'All Sport', 'Alpine Fleece', 'Alternative', 'American Apparel', 'Anvil', 'Anywear',
                      'ASP', 'Augusta Sportswear', 'Authentic Pigment', 'Blauer', 'Liberty', 'Propper',
                      'Backpacker', 'BAGedge', 'Bayside', 'Bella + Canvas', 'Big Accessories', 'Boston Leather', 'Bright Shield', 'Burnside',
                      'Carmel Towel Company', 'Champion', 'Cherokee Medical', 'Cherokee Workwear', 'Chicago Uniform Company', 'Cobmex', 'View All'
                    ].map((brand) => (
                      <li key={brand}>
                        <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                          {brand}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('police')}>Police</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'police' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('police')}
                    />
                  </div>
                  {openDropdown === 'police' && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link to="/police/bibs-overalls" className="block hover:text-green-400">
                          Bibs & Overalls
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/bottoms" className="block hover:text-green-400">
                          Bottoms
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/duty-gear" className="block hover:text-green-400">
                          Duty Gear
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/emblems-insignia" className="block hover:text-green-400">
                          Emblems - Insignia
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/equipment" className="block hover:text-green-400">
                          Equipment
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/neckwear" className="block hover:text-green-400">
                          Neckwear
                        </Link>
                      </li>
                      <li>
                        <Link to="/police/sweaters" className="block hover:text-green-400">
                          Sweaters
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('ems')}>EMS</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'ems' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('ems')}
                    />
                  </div>
                  {openDropdown === 'ems' && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link to="/ems/t-shirts" className="block hover:text-green-400">
                          T-Shirts
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/jackets" className="block hover:text-green-400">
                          Jackets
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/station-boots" className="block hover:text-green-400">
                          Station Boots
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/accessories" className="block hover:text-green-400">
                          Accessories
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/base-layers" className="block hover:text-green-400">
                          Base Layers
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/footwear" className="block hover:text-green-400">
                          Footwear
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/mid-layers" className="block hover:text-green-400">
                          Mid Layers
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/outerwear" className="block hover:text-green-400">
                          Outerwear
                        </Link>
                      </li>
                      <li>
                        <Link to="/ems/pants" className="block hover:text-green-400">
                          Pants
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('food-service')}>Food Service</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'food-service' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('food-service')}
                    />
                  </div>
                  {openDropdown === 'food-service' && (
                    <ul className="mt-2 space-y-1">
                      {['Aprons', 'Blazers', 'Coats', 'Skirts', 'Suits', 'Sweaters', 'Neckwear'].map((item) => (
                        <li key={item}>
                          <Link to={`/food-service/${item.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('fire')}>Fire</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'fire' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('fire')}
                    />
                  </div>
                  {openDropdown === 'fire' && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link to="/fire/t-shirts" className="block hover:text-green-400">
                          T-Shirts
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/jackets" className="block hover:text-green-400">
                          Jackets
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/station-boots" className="block hover:text-green-400">
                          Station Boots
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/accessories" className="block hover:text-green-400">
                          Accessories
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/firefighting-accessories" className="block hover:text-green-400">
                          Firefighting Accessories
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/mid-layers" className="block hover:text-green-400">
                          Mid Layers
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/outerwear" className="block hover:text-green-400">
                          Outerwear
                        </Link>
                      </li>
                      <li>
                        <Link to="/fire/pants" className="block hover:text-green-400">
                          Pants
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('security')}>Security</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'security' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('security')}
                    />
                  </div>
                  {openDropdown === 'security' && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link to="/security/accessories" className="block hover:text-green-400">
                          Accessories
                        </Link>
                      </li>
                      <li>
                        <Link to="/security/apparel" className="block hover:text-green-400">
                          Apparel
                        </Link>
                      </li>
                      <li>
                        <Link to="/security/pants" className="block hover:text-green-400">
                          Pants
                        </Link>
                      </li>
                      <li>
                        <Link to="/security/shirts" className="block hover:text-green-400">
                          Shirts
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('medical')}>Medical</span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === 'medical' ? 'rotate-180' : ''}`}
                      onClick={() => toggleDropdown('medical')}
                    />
                  </div>
                  {openDropdown === 'medical' && (
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link to="/medical/bottoms" className="block hover:text-green-400">
                          Bottoms
                        </Link>
                      </li>
                      <li>
                        <Link to="/medical/coats" className="block hover:text-green-400">
                          Coats
                        </Link>
                      </li>
                      <li>
                        <Link to="/medical/equipment" className="block hover:text-green-400">
                          Equipment
                        </Link>
                      </li>
                      <li>
                        <Link to="/medical/lab-coats" className="block hover:text-green-400">
                          Lab Coats
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                {['Embroidery'].map((item) => (
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
                  <div className="absolute top-full left-0 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[800px] z-50 p-6 grid grid-cols-4 gap-6 animate-fadeIn">
                    {/* Adjusted left alignment to prevent it from going off-screen */}
                    {[
                      ['A4', 'Adams', 'All Sport', 'Alpine Fleece', 'Alternative', 'American Apparel', 'Anvil', 'Anywear'],
                      ['ASP', 'Augusta Sportswear', 'Authentic Pigment', 'Blauer', 'Liberty', 'Propper'],
                      ['Backpacker', 'BAGedge', 'Bayside', 'Bella + Canvas', 'Big Accessories', 'Boston Leather', 'Bright Shield', 'Burnside'],
                      ['Carmel Towel Company', 'Champion', 'Cherokee Medical', 'Cherokee Workwear', 'Chicago Uniform Company', 'Cobmex', 'View All']
                    ].map((column, index) => (
                      <div key={index}>
                        <h4 className="text-base font-semibold text-gray-400 mb-3">BRANDS</h4>
                        <ul className="space-y-1 text-base">
                          {column.map((brand) => (
                            <li key={brand}>
                              <Link to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-green-400 transition duration-200">
                                {brand}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Police Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('police')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('police')}
                >
                  Police
                </span>
                {openDropdown === 'police' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Police</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/police/bibs-overalls" className="hover:text-green-400 transition duration-200">
                            Bibs & Overalls
                          </Link>
                        </li>
                        <li>
                          <Link to="/police/bottoms" className="hover:text-green-400 transition duration-200">
                            Bottoms
                          </Link>
                        </li>
                        <li>
                          <Link to="/police/duty-gear" className="hover:text-green-400 transition duration-200">
                            Duty Gear
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Police</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/police/emblems-insignia" className="hover:text-green-400 transition duration-200">
                            Emblems - Insignia
                          </Link>
                        </li>
                        <li>
                          <Link to="/police/equipment" className="hover:text-green-400 transition duration-200">
                            Equipment
                          </Link>
                        </li>
                        <li>
                          <Link to="/police/neckwear" className="hover:text-green-400 transition duration-200">
                            Neckwear
                          </Link>
                        </li>
                        <li>
                          <Link to="/police/sweaters" className="hover:text-green-400 transition duration-200">
                            Sweaters
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Food Service Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('food-service')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('food-service')}
                >
                  Food Service
                </span>
                {openDropdown === 'food-service' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Food Service</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/food-service/aprons" className="hover:text-green-400 transition duration-200">
                            Aprons
                          </Link>
                        </li>
                        <li>
                          <Link to="/food-service/blazers" className="hover:text-green-400 transition duration-200">
                            Blazers
                          </Link>
                        </li>
                        <li>
                          <Link to="/food-service/coats" className="hover:text-green-400 transition duration-200">
                            Coats
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Food Service</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/food-service/skirts" className="hover:text-green-400 transition duration-200">
                            Skirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/food-service/suits" className="hover:text-green-400 transition duration-200">
                            Suits
                          </Link>
                        </li>
                        <li>
                          <Link to="/food-service/sweaters" className="hover:text-green-400 transition duration-200">
                            Sweaters
                          </Link>
                        </li>
                        <li>
                          <Link to="/food-service/neckwear" className="hover:text-green-400 transition duration-200">
                            Neckwear
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* EMS Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('ems')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('ems')}
                >
                  EMS
                </span>
                {openDropdown === 'ems' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">EMS</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/ems/t-shirts" className="hover:text-green-400 transition duration-200">
                            T-Shirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/jackets" className="hover:text-green-400 transition duration-200">
                            Jackets
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/station-boots" className="hover:text-green-400 transition duration-200">
                            Station Boots
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">EMS</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/ems/accessories" className="hover:text-green-400 transition duration-200">
                            Accessories
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/base-layers" className="hover:text-green-400 transition duration-200">
                            Base Layers
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/footwear" className="hover:text-green-400 transition duration-200">
                            Footwear
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/mid-layers" className="hover:text-green-400 transition duration-200">
                            Mid Layers
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/outerwear" className="hover:text-green-400 transition duration-200">
                            Outerwear
                          </Link>
                        </li>
                        <li>
                          <Link to="/ems/pants" className="hover:text-green-400 transition duration-200">
                            Pants
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Fire Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('fire')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('fire')}
                >
                  Fire
                </span>
                {openDropdown === 'fire' && (
                  <div className={`absolute ${isDesktop ? 'top-full left-1/2 -translate-x-1/2' : 'relative'} mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn`}>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">FIRE</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/fire/t-shirts" className="hover:text-green-400 transition duration-200">
                            T-Shirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/jackets" className="hover:text-green-400 transition duration-200">
                            Jackets
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/station-boots" className="hover:text-green-400 transition duration-200">
                            Station Boots
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">FIRE</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/fire/accessories" className="hover:text-green-400 transition duration-200">
                            Accessories
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/firefighting-accessories" className="hover:text-green-400 transition duration-200">
                            Firefighting Accessories
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/mid-layers" className="hover:text-green-400 transition duration-200">
                            Mid Layers
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/outerwear" className="hover:text-green-400 transition duration-200">
                            Outerwear
                          </Link>
                        </li>
                        <li>
                          <Link to="/fire/pants" className="hover:text-green-400 transition duration-200">
                            Pants
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('security')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('security')}
                >
                  Security
                </span>
                {openDropdown === 'security' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Security</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/security/accessories" className="hover:text-green-400 transition duration-200">
                            Accessories
                          </Link>
                        </li>
                        <li>
                          <Link to="/security/apparel" className="hover:text-green-400 transition duration-200">
                            Apparel
                          </Link>
                        </li>
                        <li>
                          <Link to="/security/pants" className="hover:text-green-400 transition duration-200">
                            Pants
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Security</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/security/shirts" className="hover:text-green-400 transition duration-200">
                            Shirts
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('medical')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
                <span
                  className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-green-400 transition duration-200"
                  onClick={() => !isDesktop && toggleDropdown('medical')}
                >
                  Medical
                </span>
                {openDropdown === 'medical' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Medical</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/medical/bottoms" className="hover:text-green-400 transition duration-200">
                            Bottoms
                          </Link>
                        </li>
                        <li>
                          <Link to="/medical/coats" className="hover:text-green-400 transition duration-200">
                            Coats
                          </Link>
                        </li>
                        <li>
                          <Link to="/medical/equipment" className="hover:text-green-400 transition duration-200">
                            Equipment
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Medical</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/medical/lab-coats" className="hover:text-green-400 transition duration-200">
                            Lab Coats
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Static Menu Items */}
              <Link
                to="/embroidery"
                className="hover:text-green-400 text-base md:text-lg font-medium transition duration-200"
              >
                Embroidery
              </Link>
            </nav>

            {/* Mobile Nav */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
