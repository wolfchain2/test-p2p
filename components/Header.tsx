
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NavItem } from '../types';
import { NAV_ITEMS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors">
          P2P CASH
        </Link>
        <div className="flex items-center space-x-1 md:space-x-2 mt-2 sm:mt-0">
          {NAV_ITEMS.map((item: NavItem) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-2 py-2 text-sm sm:text-base rounded hover:bg-teal-50 transition-colors ${
                  isActive
                    ? 'text-teal-600 border-b-2 border-teal-600 font-semibold'
                    : 'text-gray-600 hover:text-teal-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {/* Chat AI button removed */}
        </div>
      </nav>
    </header>
  );
};

export default Header;