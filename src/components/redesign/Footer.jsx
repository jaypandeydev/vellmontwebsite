import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-200 px-5 md:px-10 lg:px-20 py-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-neutral-500">
        <div className="font-mono">
          © {year} Vellmont Services · Hyderabad · Dubai
        </div>
        <div className="flex gap-4 md:gap-5">
          <Link to="/contact" className="hover:text-neutral-900 transition-colors">
            Contact
          </Link>
          <Link to="/privacy-policy" className="hover:text-neutral-900 transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-neutral-900 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
