import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't render breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="bg-white py-3 px-4 md:px-8 border-b border-blue-100 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-blue-700 hover:underline">Home</Link>
        </li>
        {pathnames.map((value, idx) => {
          const to = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-700 font-semibold">{capitalize(decodeURIComponent(value))}</span>
              ) : (
                <Link to={to} className="text-blue-700 hover:underline">{capitalize(decodeURIComponent(value))}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
