"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"

// Use the existing dropdown menu names from your code
const dropdownMenuNames = {
  "Custom Embroidered Apparel": [
    "Embroidered Polo Shirts",
    "Custom Hoodies",
    "Embroidered Caps",
    "Corporate Uniforms",
    "Team Jerseys",
  ],
  "Custom Printed Apparel": [
    "Screen Printed T-Shirts",
    "Digital Print Hoodies",
    "Vinyl Graphics",
    "Heat Transfer Designs",
  ],
}

const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768)
  const [menuOpen, setMenuOpen] = useState(false)
  const [brandNames, setBrandNames] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isClosing, setIsClosing] = useState(false)
  const [mouseInDropdown, setMouseInDropdown] = useState(false)
  const [mouseInNav, setMouseInNav] = useState(false)

  // Refs for dropdown containers to handle hover properly
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    brands: null,
    categories: null,
    "Custom Embroidered Apparel": null,
    "Custom Printed Apparel": null,
  })

  const navRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    brands: null,
    categories: null,
    "Custom Embroidered Apparel": null,
    "Custom Printed Apparel": null,
  })

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Fetch brand names dynamically
    fetch("http://localhost:3000/api/styles/brand-names")
      .then((res) => res.json())
      .then((data) => setBrandNames(data.brandNames || []))
      .catch(() => setBrandNames([]))

    fetch("http://localhost:3000/api/styles/base-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.baseCategories || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const currentDropdownRef = dropdownRefs.current[openDropdown]
        const currentNavRef = navRefs.current[openDropdown]

        if (
          currentDropdownRef &&
          !currentDropdownRef.contains(event.target as Node) &&
          currentNavRef &&
          !currentNavRef.contains(event.target as Node)
        ) {
          handleCloseDropdown()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Monitor mouse position for dropdown
  useEffect(() => {
    if (isDesktop) {
      if (!mouseInNav && !mouseInDropdown && openDropdown && !isClosing) {
        startCloseTimer()
      } else if ((mouseInNav || mouseInDropdown) && isClosing) {
        cancelCloseTimer()
      }
    }
  }, [mouseInNav, mouseInDropdown, openDropdown, isClosing, isDesktop])

  const startCloseTimer = () => {
    setIsClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      if (!mouseInNav && !mouseInDropdown) {
        setOpenDropdown(null)
      }
      setIsClosing(false)
    }, 300)
  }

  const cancelCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsClosing(false)
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown))
  }

  const handleCloseDropdown = () => {
    setIsClosing(true)
    setTimeout(() => {
      setOpenDropdown(null)
      setIsClosing(false)
    }, 300)
  }

  // Improved dropdown handling
  const handleNavMouseEnter = (dropdown: string) => {
    if (isDesktop) {
      setMouseInNav(true)
      cancelCloseTimer()
      setOpenDropdown(dropdown)
    }
  }

  const handleNavMouseLeave = () => {
    if (isDesktop) {
      setMouseInNav(false)
      // Don't close immediately, wait to see if mouse enters dropdown
    }
  }

  const handleDropdownMouseEnter = () => {
    if (isDesktop) {
      setMouseInDropdown(true)
      cancelCloseTimer()
    }
  }

  const handleDropdownMouseLeave = () => {
    if (isDesktop) {
      setMouseInDropdown(false)
      // Don't close immediately, wait to see if mouse enters nav
    }
  }

  // Get top brands (first 8 brands)
  const getTopBrands = () => {
    return brandNames.slice(0, 8)
  }

  // Get trending brands (next 8 brands)
  const getTrendingBrands = () => {
    return brandNames.slice(8, 16)
  }

  const renderBrandsDropdown = (isMobile = false) => {
    const topBrands = getTopBrands()
    const trendingBrands = getTrendingBrands()

    if (isMobile) {
      return (
        <div className="w-full py-4 px-2">
          <div className="grid grid-cols-2 gap-2">
            {brandNames.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-3 py-2 rounded hover:bg-gray-700 text-white"
                onClick={() => setMenuOpen(false)}
              >
                {brand}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/all-brands"
              className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Show all Brands
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto py-8 px-8 grid grid-cols-3 gap-12">
        {/* All Brands (Alphabetical) */}

        {/* Top Brands */}
        <div>
          <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">Top Brands</h3>
          <div className="space-y-3">
            {topBrands.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                onClick={() => setOpenDropdown(null)}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Brands */}
        <div>
          <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">Trending Brands</h3>
          <div className="space-y-3">
            {trendingBrands.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                onClick={() => setOpenDropdown(null)}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCategoriesDropdown = (isMobile = false) => {
    // Split categories into 3 columns
    const categoriesColumn1 = categories.slice(0, Math.ceil(categories.length / 3))
    const categoriesColumn2 = categories.slice(Math.ceil(categories.length / 3), Math.ceil((categories.length / 3) * 2))
    const categoriesColumn3 = categories.slice(Math.ceil((categories.length / 3) * 2))

    if (isMobile) {
      return (
        <div className="w-full py-4 px-2">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-3 py-2 rounded hover:bg-gray-700 text-white"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/all-categories"
              className="inline-block px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Show all Categories
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto py-8 px-8">
        <div className="grid grid-cols-3 gap-12 mb-8">
          {/* Categories Column 1 */}
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">Popular Categories</h3>
            <div className="space-y-3">
              {categoriesColumn1.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Column 2 */}
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">Trending Categories</h3>
            <div className="space-y-3">
              {categoriesColumn2.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Column 3 */}
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">All Categories</h3>
            <div className="space-y-3">
              {categoriesColumn3.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Show All Categories Button */}
        <div className="text-center border-t border-gray-600 pt-6">
          <Link
            to="/all-categories"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
            onClick={() => setOpenDropdown(null)}
          >
            Show All Categories
          </Link>
        </div>
      </div>
    )
  }

  const renderCustomApparel = (type: string, isMobile = false) => {
    const items = dropdownMenuNames[type as keyof typeof dropdownMenuNames] || []

    if (isMobile) {
      return (
        <div className="w-full py-4 px-2">
          <div className="grid grid-cols-1 gap-2">
            {items.map((item) => (
              <Link
                key={item}
                to={`/${type}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block px-3 py-2 rounded hover:bg-gray-700 text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto py-8 px-8">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">{type}</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <Link
                  key={item}
                  to={`/${type}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block px-2 py-2 rounded hover:bg-gray-700 text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-green-500 rounded-t-md px-3 py-2">Coming Soon</h3>
            <p className="text-gray-400">More options will be available soon!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="w-full font-sans bg-[#f1f0e7] relative z-50 sticky top-0 left-0 right-0 shadow-lg">
        <div className="relative z-10">
          {/* Top Header */}
          {/* Top Header - Dark Theme */}
          <div className="bg-gray-900 text-white py-3 px-4 shadow-lg shadow-black/30 border-b border-gray-700">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
              <Link to="/" className="text-xl md:text-2xl font-bold text-white hover:text-gray-300 transition-colors">
                South Loop Prints
              </Link>

              {/* Desktop Search and Auth */}
              <div className="hidden md:flex items-center gap-6">
                <div className="w-96">
                  <SearchBar />
                </div>
                
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white hover:text-gray-300 transition-transform transform hover:scale-110"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search and Auth - Dark Theme */}
          <div className="md:hidden">
            {/* Search Bar */}
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
              <SearchBar />
            </div>

            {/* Auth Buttons */}
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
              <div className="flex gap-2 justify-center">
                <Link
                  to="/login"
                  className="flex-1 text-center text-white bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-gray-600 border border-gray-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center text-white bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-gray-600 border border-gray-600 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>


          {/* Mobile Menu */}
          {menuOpen && (
            <div className="bg-[#1A1A1A] text-white py-4 px-4 md:px-10 relative">
              <nav className="flex flex-col gap-4 text-sm px-2">
                {/* Brands Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown("brands")}>
                      Brands
                    </span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === "brands" ? "rotate-180" : ""}`}
                      onClick={() => toggleDropdown("brands")}
                    />
                  </div>
                  {openDropdown === "brands" && <div className="mt-2">{renderBrandsDropdown(true)}</div>}
                </div>

                {/* Categories Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold cursor-pointer" onClick={() => toggleDropdown("categories")}>
                      Categories
                    </span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${openDropdown === "categories" ? "rotate-180" : ""}`}
                      onClick={() => toggleDropdown("categories")}
                    />
                  </div>
                  {openDropdown === "categories" && <div className="mt-2">{renderCategoriesDropdown(true)}</div>}
                </div>

                {/* Custom Embroidered Apparel Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold cursor-pointer"
                      onClick={() => toggleDropdown("Custom Embroidered Apparel")}
                    >
                      Custom Embroidered Apparel
                    </span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${
                        openDropdown === "Custom Embroidered Apparel" ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleDropdown("Custom Embroidered Apparel")}
                    />
                  </div>
                  {openDropdown === "Custom Embroidered Apparel" && (
                    <div className="mt-2">{renderCustomApparel("Custom Embroidered Apparel", true)}</div>
                  )}
                </div>

                {/* Custom Printed Apparel Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold cursor-pointer"
                      onClick={() => toggleDropdown("Custom Printed Apparel")}
                    >
                      Custom Printed Apparel
                    </span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${
                        openDropdown === "Custom Printed Apparel" ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleDropdown("Custom Printed Apparel")}
                    />
                  </div>
                  {openDropdown === "Custom Printed Apparel" && (
                    <div className="mt-2">{renderCustomApparel("Custom Printed Apparel", true)}</div>
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
                {/* Brands Dropdown */}
                <div
                  ref={(el) => (navRefs.current["brands"] = el)}
                  className="relative group"
                  onMouseEnter={() => handleNavMouseEnter("brands")}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    to="/all-brands"
                    className={`cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200 ${
                      openDropdown === "brands" ? "text-[#f2f1e6]" : ""
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Brands
                  </Link>
                  {/* Invisible buffer to prevent dropdown from closing */}
                  <div className="absolute h-8 w-full bottom-0 left-0 translate-y-full opacity-0" />
                </div>

                {/* Categories Dropdown */}
                <div
                  ref={(el) => (navRefs.current["categories"] = el)}
                  className="relative group"
                  onMouseEnter={() => handleNavMouseEnter("categories")}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    to="/all-categories"
                    className={`cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200 ${
                      openDropdown === "categories" ? "text-[#f2f1e6]" : ""
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Categories
                  </Link>
                  {/* Invisible buffer to prevent dropdown from closing */}
                  <div className="absolute h-8 w-full bottom-0 left-0 translate-y-full opacity-0" />
                </div>

                {/* Custom Embroidered Apparel Dropdown */}
                <div
                  ref={(el) => (navRefs.current["Custom Embroidered Apparel"] = el)}
                  className="relative group"
                  onMouseEnter={() => handleNavMouseEnter("Custom Embroidered Apparel")}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    to="/custom-embroidered-apparel"
                    className={`cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200 ${
                      openDropdown === "Custom Embroidered Apparel" ? "text-[#f2f1e6]" : ""
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Custom Embroidered Apparel
                  </Link>
                  {/* Invisible buffer to prevent dropdown from closing */}
                  <div className="absolute h-8 w-full bottom-0 left-0 translate-y-full opacity-0" />
                </div>

                {/* Custom Printed Apparel Dropdown */}
                <div
                  ref={(el) => (navRefs.current["Custom Printed Apparel"] = el)}
                  className="relative group"
                  onMouseEnter={() => handleNavMouseEnter("Custom Printed Apparel")}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    to="/custom-printed-apparel"
                    className={`cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200 ${
                      openDropdown === "Custom Printed Apparel" ? "text-[#f2f1e6]" : ""
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Custom Printed Apparel
                  </Link>
                  {/* Invisible buffer to prevent dropdown from closing */}
                  <div className="absolute h-8 w-full bottom-0 left-0 translate-y-full opacity-0" />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Full-width Dropdown Overlay */}
      {openDropdown && isDesktop && (
        <div className={`fixed inset-0 z-40 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
          {/* Background Overlay with Blue Tint */}
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm" onClick={handleCloseDropdown} />

          {/* Dropdown Content */}
          <div
            ref={(el) => (dropdownRefs.current[openDropdown] = el)}
            className={`absolute top-[120px] left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 shadow-2xl ${
              isClosing ? "animate-slideUp" : "animate-slideDown"
            }`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {openDropdown === "brands" && renderBrandsDropdown()}
            {openDropdown === "categories" && renderCategoriesDropdown()}
            {openDropdown === "Custom Embroidered Apparel" && renderCustomApparel("Custom Embroidered Apparel")}
            {openDropdown === "Custom Printed Apparel" && renderCustomApparel("Custom Printed Apparel")}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Header;