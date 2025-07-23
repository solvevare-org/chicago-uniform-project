import React, { useEffect, useState } from "react";

interface Brand {
  _id: string;
  brandID: number;
  name: string;
  image: string;
  noeRetailing: boolean;
  activeProducts: number;
  __v: number;
}

const AllBrandPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(30);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://31.97.41.27:5000/api/brands/");
        const data = await res.json();
        setBrands(Array.isArray(data.brands) ? data.brands : []);
      } catch (err: any) {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#b3ddf3]">All Brands</h1>
        {loading ? (
          <p className="text-center text-gray-400">Loading brands...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {brands.slice(0, visibleCount).map((brand) => (
                <a
                  key={brand._id}
                  href={`/brands/${encodeURIComponent(brand.name)}`}
                  className="bg-white border border-[#b3ddf3] rounded-xl p-6 flex flex-col items-center justify-center text-lg font-semibold shadow hover:shadow-lg transition-all text-center w-full cursor-pointer hover:text-[#b3ddf3] hover:border-[#b3ddf3]"
                >
                  <img
                    src={`https://www.ssactivewear.com/${brand.image}`}
                    alt={brand.name}
                    className="w-20 h-20 object-contain mb-3 rounded bg-white border border-[#b3ddf3]"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span className="mt-2 text-[#222] font-bold">
                    {brand.name}
                  </span>
                </a>
              ))}
            </div>
            {visibleCount < brands.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 30)}
                  className="px-6 py-2 bg-[#b3ddf3] hover:bg-[#b3ddf3] text-white font-semibold rounded-full shadow-md transition-all"
                >
                  Show More Brands
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBrandPage;
