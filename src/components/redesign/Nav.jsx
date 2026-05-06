import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="px-5 md:px-10 lg:px-20 py-3.5 flex justify-between items-center text-[13px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
            alt="Vellmont"
            className="h-8 w-auto"
          />
          <span className="font-medium text-[14px] text-indigo-600 hidden sm:inline">
            Vellmont Services
          </span>
        </Link>
        <div className="flex gap-4 md:gap-5 text-neutral-600">
          <a href="/#products" className="hover:text-neutral-900 transition-colors">
            Products
          </a>
          <a href="/#thesis" className="hover:text-neutral-900 transition-colors hidden sm:inline">
            Thesis
          </a>
          <a href="/#process" className="hover:text-neutral-900 transition-colors hidden sm:inline">
            Process
          </a>
          <Link to="/contact" className="hover:text-neutral-900 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
