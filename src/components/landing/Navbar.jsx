import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Navbar = ({ companyName, logoUrl, onGetStarted }) => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logoUrl} alt={`${companyName} logo`} className="h-14 w-auto" />
            <span className="text-xl font-bold gradient-text">{companyName}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">Services</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-300 hover:text-white transition-colors outline-none">
                Products <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect border-white/20 text-gray-200">
                <DropdownMenuItem asChild>
                  <Link to="/#pricing" className="hover:!bg-purple-500/30 hover:!text-white">SaaS Suite</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://marrysmartly.com" target="_blank" rel="noopener noreferrer" className="hover:!bg-purple-500/30 hover:!text-white">MarrySmartlyAI</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/glowzy" className="hover:!bg-purple-500/30 hover:!text-white">Glowzy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/courtmate" className="hover:!bg-purple-500/30 hover:!text-white">CourtMate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/products/medical-queue" className="hover:!bg-purple-500/30 hover:!text-white">Medical Queue Management</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/#testimonials" className="text-gray-300 hover:text-white transition-colors">Clients</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              Sign In
            </Button>
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;