import React, { useEffect, useState } from 'react';

const AllCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(30);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/api/styles/base-categories');
        const data = await res.json();
        setCategories(data.baseCategories || []);
      } catch (err: any) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#222] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#b3ddf3]">All Categories</h1>
        {loading ? (
          <p className="text-center text-gray-400">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {categories.slice(0, visibleCount).map((cat) => (
                <a
                  key={cat}
                  href={`/${encodeURIComponent(cat)}`}
                  className="bg-white border border-[#b3ddf3] rounded-xl p-6 flex flex-col items-center justify-center text-lg font-semibold shadow hover:shadow-lg transition-all text-center w-full cursor-pointer hover:text-[#b3ddf3] hover:border-[#b3ddf3]"
                >
                  {cat === 'Accessories' && (
                    <img src="https://png.pngtree.com/png-vector/20240205/ourmid/pngtree-baby-blue-sock-png-image_11621568.png" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Athletics' && (
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/054/046/000/small_2x/a-male-athlete-sprinting-in-a-dynamic-running-pose-during-training-png.png" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Bags' && (
                    <img src="https://www.ssactivewear.com/Images/Color/68968_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Bottoms' && (
                    <img src="https://www.ssactivewear.com/Images/Color/48301_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Fleece - Core - Crew' && (
                    <img src="https://www.ssactivewear.com/Images/Color/81640_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Fleece - Core - Hood' && (
                    <img src="https://www.ssactivewear.com/Images/Color/100013_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Fleece - Premium - Crew' && (
                    <img src="https://www.ssactivewear.com/Images/Color/94790_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Fleece - Premium - Hood' && (
                    <img src="https://www.ssactivewear.com/Images/Color/110373_f_fm.jpg" alt="Accessories" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Headwear' && (
                    <img src="https://www.ssactivewear.com/Images/Color/90039_f_fm.jpg" alt="Headwear" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Medical' && (
                    <img src="https://www.ssactivewear.com/Images/Color/93655_f_fm.jpg" alt="Medical" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Office Use' && (
                    <img src="https://www.ssactivewear.com/Images/Color/113970_f_fm.jpg" alt="Office Use" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Outerwear' && (
                    <img src="https://www.ssactivewear.com/Images/Color/112841_f_fm.jpg" alt="Outerwear" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Quarter-Zips' && (
                    <img src="https://www.ssactivewear.com/Images/Color/110360_f_fm.jpg" alt="Quarter-Zips" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Sport Shirts' && (
                    <img src="https://www.ssactivewear.com/Images/Color/115699_f_fm.jpg" alt="Sport Shirts" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'T-Shirts - Core' && (
                    <img src="https://www.ssactivewear.com/Images/Color/88165_fm.jpg" alt="T-Shirts - Core" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'T-Shirts - Long Sleeve' && (
                    <img src="https://www.ssactivewear.com/Images/Color/101453_f_fm.jpg" alt="T-Shirts - Long Sleeve" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'T-Shirts - Premium' && (
                    <img src="https://www.ssactivewear.com/Images/Color/101441_f_fm.jpg" alt="T-Shirts - Premium" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Workwear' && (
                    <img src="https://www.ssactivewear.com/Images/ModelColor/117929_omf_fm.jpg" alt="Workwear" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  {cat === 'Wovens' && (
                    <img src="https://www.ssactivewear.com/Images/Color/109991_b_fm.jpg" alt="Wovens" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8 }} />
                  )}
                  <span className="mt-2 text-[#222] font-bold">{cat}</span>
                </a>
              ))}
            </div>
            {visibleCount < categories.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 30)}
                  className="px-6 py-2 bg-[#b3ddf3] hover:bg-[#b3ddf3] text-white font-semibold rounded-full shadow-md transition-all"
                >
                  Show More Categories
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
