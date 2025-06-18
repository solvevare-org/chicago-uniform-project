import React from 'react';

interface Brand {
  _id: string;
  name: string;
  image: string;
}

interface BrandGridProps {
  title: string;
  brands: Brand[];
  showMore?: boolean;
  onShowMore?: () => void;
}

const BrandGrid: React.FC<BrandGridProps> = ({ title, brands, showMore = false, onShowMore }) => {
  return (
    <div className="my-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#222]">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <a
              key={brand._id}
              href={`/brands/${encodeURIComponent(brand.name)}`}
              className="bg-white border border-[#b3ddf3] rounded-lg p-4 flex flex-col items-center justify-center text-lg font-semibold shadow hover:shadow-lg transition-all text-center w-full cursor-pointer hover:text-[#b3ddf3]"
            >
              <img
                src={`https://www.ssactivewear.com/${brand.image}`}
                alt={brand.name}
                className="w-16 h-16 object-contain mb-2 rounded bg-white"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              {brand.name}
            </a>
          ))}
        </div>
        {showMore && onShowMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onShowMore}
              className="px-6 py-2 bg-[#b3ddf3] hover:bg-[#a0cbe8] text-[#222] font-semibold rounded-full shadow-md transition-all"
            >
              Show More Brands
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandGrid;
