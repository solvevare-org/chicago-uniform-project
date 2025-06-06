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
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">All Categories</h1>
        {loading ? (
          <p className="text-center text-gray-400">Loading categories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.slice(0, visibleCount).map((cat) => (
                <a
                  key={cat}
                  href={`/${encodeURIComponent(cat)}`}
                  className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 flex items-center justify-center text-lg font-semibold shadow hover:shadow-lg transition-all text-center w-full cursor-pointer hover:text-green-400"
                >
                  {cat}
                </a>
              ))}
            </div>
            {visibleCount < categories.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 30)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition-all"
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
