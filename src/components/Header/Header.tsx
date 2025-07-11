"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import { API_ENDPOINTS, apiRequest } from "../../config/api"

// Use the existing dropdown menu names from your code
const dropdownMenuNames = {
  "Custom Embroidered Apparel": [
    "Custom Embroidered Polo",
    "Custom Embroidered Hoodie",
    "Custom Embroidered T-Shirt",
    "Custom Embroidered Sweatshirt",
  ],
  "Custom Printed Apparel": [
    "Screen Printed T-Shirts",
    "Digital Print Hoodies",
    "Vinyl Graphics",
    "Heat Transfer Designs",
  ],
  "Custom Apparel": [
    "Embroidered Apparel",
    "Printed Apparel",
    "Custom Headwear",
    "Custom Bags",
    "Accessories",
    "Brands",
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
    "Custom Apparel": null,
  })

  const navRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    brands: null,
    categories: null,
    "Custom Embroidered Apparel": null,
    "Custom Printed Apparel": null,
    "Custom Apparel": null,
  })

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Fetch brand names dynamically
    apiRequest(API_ENDPOINTS.BRANDS.BRAND_NAMES)
      .then((data) => setBrandNames(data.brandNames || []))
      .catch(() => setBrandNames([]))

    apiRequest(API_ENDPOINTS.CATEGORIES.BASE_CATEGORIES)
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
                className="block px-3 py-2 rounded hover:bg-gray-700 text-[#222]"
                onClick={() => setMenuOpen(false)}
              >
                {brand}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/all-brands"
              className="inline-block px-4 py-2 bg-[#b3ddf3] text-[#222] rounded-md hover:bg-[#a0cbe8] transition-colors duration-200"
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
          <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">Top Brands</h3>
          <div className="space-y-3">
            {topBrands.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
                onClick={() => setOpenDropdown(null)}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Brands */}
        <div>
          <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">Trending Brands</h3>
          <div className="space-y-3">
            {trendingBrands.map((brand) => (
              <Link
                key={brand}
                to={`/brands/${brand.toLowerCase().replace(/\s+/g, "%20")}`}
                className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
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
                className="block px-3 py-2 rounded hover:bg-gray-700 text-[#222]"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/all-categories"
              className="inline-block px-4 py-2 bg-[#b3ddf3] text-[#222] rounded-md hover:bg-[#a0cbe8] transition-colors duration-200"
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
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">Popular Categories</h3>
            <div className="space-y-3">
              {categoriesColumn1.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Column 2 */}
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">Trending Categories</h3>
            <div className="space-y-3">
              {categoriesColumn2.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Column 3 */}
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">All Categories</h3>
            <div className="space-y-3">
              {categoriesColumn3.map((cat) => (
                <Link
                  key={cat}
                  to={`/${cat.toLowerCase().replace(/\s+/g, "%20")}`}
                  className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
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
            className="inline-flex items-center px-6 py-3 bg-[#b3ddf3] text-[#222] rounded-lg hover:bg-[#a0cbe8] transition-colors duration-200 font-medium"
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
    // Map display names to correct static routes
    const routeMap: Record<string, string> = {
      "Custom Embroidered Polo": "/custom-embroidered-polo",
      "Custom Embroidered Hoodie": "/custom-embroidered-hoodie",
      "Custom Embroidered T-Shirt": "/custom-embroidered-t-shirt",
      "Custom Embroidered Sweatshirt": "/custom-embroidered-sweatshirt",
      "Screen Printed T-Shirts": "/screen-printed-t-shirts",
      "Digital Print Hoodies": "/digital-print-hoodies",
      "Vinyl Graphics": "/vinyl-graphics",
      "Heat Transfer Designs": "/heat-transfer-designs",
      "Embroidered Apparel": "/custom-apparel/embroidered-apparel",
      "Printed Apparel": "/custom-apparel/printed-apparel",
      "Custom Headwear": "/custom-apparel/custom-headwear",
      "Custom Bags": "/custom-apparel/custom-bags",
      "Accessories": "/custom-apparel/accessories",
      "Brands": "/custom-apparel/brands",
    }
    if (isMobile) {
      return (
        <div className="w-full py-4 px-2">
          <div className="grid grid-cols-1 gap-2">
            {items.map((item) => (
              <Link
                key={item}
                to={routeMap[item] || "/"}
                className="block px-3 py-2 rounded hover:bg-[#e6f3fa] text-[#222]"
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
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">{type}</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <Link
                  key={item}
                  to={routeMap[item] || "/"}
                  className="block px-2 py-2 rounded hover:bg-[#e6f3fa] text-[#222] transition-colors duration-200"
                  onClick={() => setOpenDropdown(null)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mb-6 border-b border-gray-600 pb-2 bg-[#b3ddf3] rounded-t-md px-3 py-2">Coming Soon</h3>
            <p className="text-gray-400">More options will be available soon!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="w-full font-sans bg-white relative z-50 sticky top-0 left-0 right-0 shadow-lg">
        <div className="relative z-10">
          {/* Top Header */}
          {/* Top Header - Dark Theme */}
          <div className="bg-[#f3f8fa] text-[#222] py-3 px-4 shadow-lg shadow-black/30 border-b border-[#b3ddf3]">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col items-center">
                {/* Replace South Loop Prints and stars with logo */}
                <Link to="/" className="text-xl md:text-2xl font-bold text-[#b3ddf3] hover:text-[#a0cbe8] transition-colors">
                  {/* Logo in header, full width fit */}
                  <img src="/logo.png" alt="Brand Logo" className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto object-contain mx-auto" style={{maxHeight: '60px'}} />
                </Link>
              </div>

              {/* Desktop Search and Auth */}
              <div className="hidden md:flex items-center gap-6">
                <div className="w-96">
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3ddf3] transition-colors duration-300 group-focus-within:text-blue-500">
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search products, brands, categories..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-[#222] border-2 border-transparent focus:border-[#b3ddf3] shadow-md focus:shadow-[0_0_12px_0_#b3ddf3] transition-all duration-300 outline-none ring-0 placeholder-gray-400 font-medium text-base animate-searchbar-glow"
                      style={{ boxShadow: '0 2px 16px 0 rgba(179,221,243,0.10)' }}
                    />
                    <style>{`
                      @keyframes searchbar-glow {
                        0% { box-shadow: 0 0 0 0 #b3ddf3; }
                        50% { box-shadow: 0 0 16px 2px #b3ddf3; }
                        100% { box-shadow: 0 0 0 0 #b3ddf3; }
                      }
                      .animate-searchbar-glow {
                        animation: searchbar-glow 2.5s infinite;
                      }
                    `}</style>
                  </div>
                </div>
                
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-[#222] hover:text-gray-300 transition-transform transform hover:scale-110"
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
            <div className="bg-[#f3f8fa] border-t border-gray-700 px-4 py-3">
              <SearchBar />
            </div>

            {/* Auth Buttons */}
            <div className="bg-[#f3f8fa] border-t border-gray-700 px-4 py-3">
              <div className="flex gap-2 justify-center">
                <Link
                  to="/login"
                  className="flex-1 text-center text-[#222] bg-[#b3ddf3] px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#a0cbe8] border border-[#b3ddf3] transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center text-[#222] bg-[#b3ddf3] px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#a0cbe8] border border-[#b3ddf3] transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>


          {/* Mobile Menu */}
          {menuOpen && (
            <div className="bg-white text-[#222] py-4 px-4 md:px-10 relative">
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

                {/* Custom Apparel Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold cursor-pointer"
                      onClick={() => toggleDropdown("Custom Apparel")}
                    >
                      Custom Apparel
                    </span>
                    <ChevronDown
                      className={`cursor-pointer transition-transform ${
                        openDropdown === "Custom Apparel" ? "rotate-180" : ""
                      }`}
                      onClick={() => toggleDropdown("Custom Apparel")}
                    />
                  </div>
                  {openDropdown === "Custom Apparel" && (
                    <div className="mt-2">{renderCustomApparel("Custom Apparel", true)}</div>
                  )}
                </div>

                {/* Custom Embroidered Apparel Dropdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold cursor-pointer"
                      onClick={() => toggleDropdown("Custom Embroidered Polo")}
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
                    <div className="mt-2">{renderCustomApparel("Custom Embroidered Polo", true)}</div>
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
          <div className="bg-[#b3ddf3] text-[#222] py-4 px-4 md:px-10 relative">
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
                    to="/custom-embroidered-polo"
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
                    to="/screen-printed-t-shirts"
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

                {/* Custom Apparel Dropdown */}
                <div
                  ref={(el) => (navRefs.current["Custom Apparel"] = el)}
                  className="relative group"
                  onMouseEnter={() => handleNavMouseEnter("Custom Apparel")}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    to="/custom-apparel/embroidered-apparel"
                    className={`cursor-pointer font-medium text-base md:text-lg tracking-wide hover:text-[#f2f1e6] transition duration-200 ${
                      openDropdown === "Custom Apparel" ? "text-[#f2f1e6]" : ""
                    }`}
                    onClick={() => setOpenDropdown(null)}
                  >
                    Custom Apparel
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
            className={`absolute top-[120px] left-0 right-0 bg-[#f3f8fa] border-t border-gray-700 shadow-2xl ${
              isClosing ? "animate-slideUp" : "animate-slideDown"
            }`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {openDropdown === "brands" && renderBrandsDropdown()}
            {openDropdown === "categories" && renderCategoriesDropdown()}
            {openDropdown === "Custom Embroidered Apparel" && renderCustomApparel("Custom Embroidered Apparel")}
            {openDropdown === "Custom Printed Apparel" && renderCustomApparel("Custom Printed Apparel")}
            {openDropdown === "Custom Apparel" && renderCustomApparel("Custom Apparel")}
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