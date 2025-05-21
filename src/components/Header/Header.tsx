import React, { useState, useEffect } from 'react';
import { Search, Bell, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import '../../pages/Categories/CustomEmbroideredOutwear';

const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to manage which dropdown is open
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu toggle
const [brandNames, setBrandNames] = useState<string[]>([]);
const [categories, setCategories] = useState<string[]>([]);
const [hoverBuffer, setHoverBuffer] = useState(false);

  useEffect(() => {
    // ...existing resize logic...
    // Fetch brand names dynamically
    fetch('http://localhost:3000/api/styles/brand-names')
      .then(res => res.json())
      .then(data => setBrandNames(data.brandNames || []))
      .catch(() => setBrandNames([]));
   fetch('http://localhost:3000/api/styles/base-categories')
      .then(res => res.json())
      .then(data => setCategories(data.baseCategories || []))
      .catch(() => setCategories([]));
  }, []);
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

  // Prevent dropdown from closing when hovering over dropdown content
  const handleDropdownMouseEnter = (dropdown: string) => {
    if (isDesktop) setOpenDropdown(dropdown);
    setHoverBuffer(false);
  };
  const handleDropdownMouseLeave = () => {
    if (isDesktop) setHoverBuffer(true);
    setTimeout(() => {
      setHoverBuffer(false);
      if (isDesktop) setOpenDropdown(null);
    }, 200);
  };

const renderBrandsDropdown = (isMobile = false) => {
  const showAll = brandNames.length > 15;
  const visibleBrands = showAll ? brandNames.slice(0, 15) : brandNames;

  // Dynamically set columns: 2 for <=10, 3 for <=20, 4 for more
  let columns = 2;
  if (visibleBrands.length > 10) columns = 3;
  if (visibleBrands.length > 20) columns = 4;

  const perCol = Math.ceil(visibleBrands.length / columns);
  const brandColumns = Array.from({ length: columns }, (_, i) =>
    visibleBrands.slice(i * perCol, (i + 1) * perCol)
  );

  return (
    <div className={`w-full max-w-5xl mx-auto py-6 px-8`}>
      {!isMobile && (
        <div className="mb-4">
          <h4 className="text-2xl font-bold text-green-400 border-b border-green-400 pb-2">Brands</h4>
        </div>
      )}
      <div className="flex gap-8">
        {brandColumns.map((col, idx) => (
          <div key={idx} className="flex-1 min-w-0 flex flex-col space-y-2">
            {col.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-3 py-2 rounded hover:bg-green-50 hover:text-green-700 transition break-words text-lg text-white"
                onClick={isMobile ? () => setMenuOpen(false) : undefined}
              >
                {brand}
              </Link>
            ))}
          </div>
        ))}
      </div>
      {showAll && (
        <div className="pt-6">
          <Link
            to="/all-brands"
            className="block px-4 py-2 text-center font-semibold text-blue-600 hover:underline"
            onClick={isMobile ? () => setMenuOpen(false) : undefined}
          >
            Show all Brands
          </Link>
        </div>
      )}
    </div>
  );
};
 // ...existing code...
// ...existing code...

const renderCategoriesDropdown = (isMobile = false) => {
  const showAll = categories.length > 15;
  const visibleCategories = showAll ? categories.slice(0, 15) : categories;

  // Dynamically set columns: 2 for <=10, 3 for <=20, 4 for more
  let columns = 2;
  if (visibleCategories.length > 10) columns = 3;
  if (visibleCategories.length > 20) columns = 4;

  // Split categories into columns as evenly as possible
  const perCol = Math.ceil(visibleCategories.length / columns);
  const categoryColumns = Array.from({ length: columns }, (_, i) =>
    visibleCategories.slice(i * perCol, (i + 1) * perCol)
  );

  return (
    <div className={`w-full max-w-5xl mx-auto py-6 px-8`}>
      {!isMobile && (
        <div className="mb-4">
          <h4 className="text-2xl font-bold text-green-400 border-b border-green-400 pb-2">Categories</h4>
        </div>
      )}
      <div className={`flex gap-8`}>
        {categoryColumns.map((col, idx) => (
          <div key={idx} className="flex-1 min-w-0 flex flex-col space-y-2">
            {col.map((cat) => (
              <Link
                key={cat}
                to={`/${cat.toLowerCase().replace(/\s+/g, '%20')}`}
                className="block px-3 py-2 rounded hover:bg-green-50 hover:text-green-700 transition break-words text-lg text-white"
                onClick={isMobile ? () => setMenuOpen(false) : undefined}
              >
                {cat}
              </Link>
            ))}
          </div>
        ))}
      </div>
      {showAll && (
        <div className="pt-6">
          <Link
            to="/all-categories"
            className="block px-4 py-2 text-center font-semibold text-blue-600 hover:underline"
            onClick={isMobile ? () => setMenuOpen(false) : undefined}
          >
            Show all Categories
          </Link>
        </div>
      )}
    </div>
  );
};
// ...existing code...

// ...existing code...

  return (
    <header className="w-full font-sans bg-[#f1f0e7]">
      <div className="relative z-10">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#f2f1e6] via-[#f2f1e6] to-[#f2f1e6] text-[#333333] py-1 px-2 md:px-10 shadow-lg shadow-black/30">

          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex items-center justify-between md:justify-start gap-6">
              <Logo />
              <button
                className="md:hidden text-black hover:text-green-400 transition-transform transform hover:scale-110"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden md:block w-[500px]">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center  justify-center md:justify-end gap-6 md:gap-8">
              <div className="hidden md:flex items-center gap-8">
                <NavLinks
                  links={[
                    { label: 'News', href: '/news' },
                    {
                      label: 'About', dropdown: [
                        { label: 'How Works', href: '/how-it-works' },
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
                  className="text-black hover:text-green-500"
                />
              </div>

              <div className="flex items-center gap-6">
                <Link to="/wishlist" aria-label="Wishlist" className="text-black hover:text-green-400 transition-transform transform hover:scale-110">
                  <Heart size={20} />
                </Link>
                <button aria-label="Notifications" className="text-black hover:text-green-400 transition-transform transform hover:scale-110">
                  <Bell size={20} />
                </button>

                <div className="hidden md:flex gap-4">
                 <Link to="/login" className="px-5 py-2 rounded-full bg-white text-black hover:bg-green-400 hover:text-white transition-all duration-300 text-base">
                    Log In
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
        <div className="md:hidden bg-[#333333] border-t border-gray-800 px-4 py-3">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-[#1A1A1A] text-white py-4 px-4 md:px-10 relative">
            <nav className="flex flex-col gap-4 text-sm px-2">
              {/* Brands Dropdown */}
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
                    {renderBrandsDropdown(true)}
                  </ul>
                )}
              </div>

              {/* Custom Embroidered Apparel Dropdown */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('Custom Embroidered Apparel')}>Custom Embroidered Apparel</span>
                  <ChevronDown
                    className={`cursor-pointer transition-transform ${openDropdown === 'Custom Embroidered Apparel' ? 'rotate-180' : ''}`}
                    onClick={() => toggleDropdown('Custom Embroidered Apparel')}
                  />
                </div>
                {openDropdown === 'Custom Embroidered Apparel' && (
                  <ul className="mt-2 space-y-1">
                    {dropdownMenuNames['Custom Embroidered Apparel'].map((item) => (
                      <li key={item}>
                        <Link to={`/Custom Embroidered Apparel/${item.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Custom Printed Apparel Dropdown */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown('Custom Printed Apparel')}>Custom Printed Apparel</span>
                  <ChevronDown
                    className={`cursor-pointer transition-transform ${openDropdown === 'Custom Printed Apparel' ? 'rotate-180' : ''}`}
                    onClick={() => toggleDropdown('Custom Printed Apparel')}
                  />
                </div>
                {openDropdown === 'Custom Printed Apparel' && (
                  <ul className="mt-2 space-y-1">
                    {dropdownMenuNames['Custom Printed Apparel'].map((item) => (
                      <li key={item}>
                        <Link to={`/Custom Printed Apparel/${item.toLowerCase().replace(/\s+/g, '-')}`} className="block hover:text-green-400">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="bg-green-500 text-black py-4 px-4 md:px-10 relative">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-10">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {/* Category Dropdown */}

              {/* Brands Dropdown */}
<div
  className="relative"
  onMouseEnter={() => handleDropdownMouseEnter('brands')}
  onMouseLeave={handleDropdownMouseLeave}
>
  <Link
    to="/all-brands"
    className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200"
    onClick={() => setOpenDropdown(null)}
  >
    Brands
  </Link>
  {openDropdown === 'brands' && (
    <>
      {/* Hover buffer area above dropdown */}
      <div
        style={{ position: 'absolute', top: '-10px', left: 0, width: '100%', height: '10px', zIndex: 60 }}
        onMouseEnter={() => setHoverBuffer(false)}
        onMouseLeave={handleDropdownMouseLeave}
      />
      <div
  className="absolute top-full left-0 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-full max-w-screen-xl z-50 px-8 py-6 animate-fadeIn"
  style={{ minWidth: 600 }}
  onMouseEnter={() => setHoverBuffer(false)}
  onMouseLeave={handleDropdownMouseLeave}
>
  {renderBrandsDropdown()}
</div>
    </>
  )}
</div>

{/* Categories Dropdown */}
<div
  className="relative"
  onMouseEnter={() => handleDropdownMouseEnter('categories')}
  onMouseLeave={handleDropdownMouseLeave}
>
  <Link
    to="/all-categories"
    className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200"
    onClick={() => setOpenDropdown(null)}
  >
    Categories
  </Link>
  {openDropdown === 'categories' && (
    <>
      {/* Hover buffer area above dropdown */}
      <div
        style={{ position: 'absolute', top: '-10px', left: 0, width: '100%', height: '10px', zIndex: 60 }}
        onMouseEnter={() => setHoverBuffer(false)}
        onMouseLeave={handleDropdownMouseLeave}
      />


<div
  className="absolute top-full left-0 mt-3 bg-[#121212] border border-gray-700 rounded-xl shadow-2xl w-full max-w-screen-xl z-50 px-8 py-6 animate-fadeIn"
  style={{ minWidth: 600 }}
  onMouseEnter={() => setHoverBuffer(false)}
  onMouseLeave={handleDropdownMouseLeave}
>
  {renderCategoriesDropdown()}
</div>

    </>
  )}
</div>

              {/* Food Service Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => isDesktop && setOpenDropdown('Custom Printed Apparel')}
                onMouseLeave={() => isDesktop && setOpenDropdown(null)}
              >
              <Link
                to="/customembroideredoutwear"
                className="cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200"
                onClick={() => !isDesktop && toggleDropdown('Custom Printed Apparel')}
              >
                Custom Printed Apparel
              </Link>
                {openDropdown === 'Custom Printed Apparel' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#121212] text-white border border-gray-700 rounded-xl shadow-2xl w-[600px] z-50 p-6 grid grid-cols-2 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Custom  Shirts</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/custom polo shirts" className="hover:text-green-400 transition duration-200">
                          custom polo shirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom  t-shirts" className="hover:text-green-400 transition duration-200">
                          custom  t-shirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom tank tops" className="hover:text-green-400 transition duration-200">
                          custom tank tops
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom long sleeve shirts" className="hover:text-green-400 transition duration-200">
                          custom long sleeve shirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom dress shirts" className="hover:text-green-400 transition duration-200">
                          custom dress shirts
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Custom Outerwear</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/custom hoodies" className="hover:text-green-400 transition duration-200">
                          custom hoodies
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom sweaters" className="hover:text-green-400 transition duration-200">
                          custom sweaters
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom sweatshirts" className="hover:text-green-400 transition duration-200">
                          custom sweatshirts
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom jackets" className="hover:text-green-400 transition duration-200">
                          custom jackets
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom vests" className="hover:text-green-400 transition duration-200">
                          custom vests
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Custom Headwear</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Hats" className="hover:text-green-400 transition duration-200">
                          Custom Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Embroidered Hats" className="hover:text-green-400 transition duration-200">
                          Custom Embroidered Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Embroidered Baseball Hats" className="hover:text-green-400 transition duration-200">
                          Embroidered Baseball Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Embroidered Trucker Hats" className="hover:text-green-400 transition duration-200">
                          Embroidered Trucker Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Beanies" className="hover:text-green-400 transition duration-200">
                          Custom Beanies
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Richardson 112 Hats" className="hover:text-green-400 transition duration-200">
                          Custom Richardson 112 Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Headbands" className="hover:text-green-400 transition duration-200">
                          Custom Headbands
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Bucket Hats" className="hover:text-green-400 transition duration-200">
                          Custom Bucket Hats
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/Custom Dad Hats" className="hover:text-green-400 transition duration-200">
                          Custom Dad Hats
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Pants&Shorts</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/custom pants" className="hover:text-green-400 transition duration-200">
                          custom pants
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom sweatpants" className="hover:text-green-400 transition duration-200">
                          custom sweatpants
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom shorts" className="hover:text-green-400 transition duration-200">
                          custom shorts
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Custom Bags</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/custom backpacks" className="hover:text-green-400 transition duration-200">
                          custom backpacks
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom tote bags" className="hover:text-green-400 transition duration-200">
                          custom tote bags
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom drawstring bags" className="hover:text-green-400 transition duration-200">
                          custom drawstring bags
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom paper bags" className="hover:text-green-400 transition duration-200">
                          custom paper bags
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-400 mb-3">Custom Accessories</h4>
                      <ul className="space-y-1 text-base">
                        <li>
                          <Link to="/Custom Printed Apparel/custom blankets" className="hover:text-green-400 transition duration-200">
                          custom blankets
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom hand towels" className="hover:text-green-400 transition duration-200">
                          custom hand towels
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom scarves" className="hover:text-green-400 transition duration-200">
                          custom scarves
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom aprons" className="hover:text-green-400 transition duration-200">
                          custom aprons
                          </Link>
                        </li>
                        <li>
                          <Link to="/Custom Printed Apparel/custom bandanas" className="hover:text-green-400 transition duration-200">
                          custom bandanas
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Nav */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;