import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, CalendarDays } from 'lucide-react';

const SocialLink = ({ href, icon: Icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={label}
    className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
  >
    <Icon className="w-6 h-6" />
  </a>
);

const Footer = ({ companyName, logoUrl }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src={logoUrl} alt={`${companyName} logo`} className="h-16 w-auto" />
            </Link>
            <p className="text-xl font-bold gradient-text">
              Vellmont Services OPC Pvt Ltd
            </p>
            <p className="text-gray-400 leading-relaxed">WeWork Rajapushpa Summit, SY. 130P & 115/1P Financial District, Nanakramguda Rd, Manikonda Jagir Rangareddy Dist, Hyderabad, Telangana 500032
           </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map(link => (
                <SocialLink key={link.label} href={link.href} icon={link.icon} label={link.label} />
              ))}
            </div>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Services</span>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/#features" className="hover:text-white transition-colors">Custom Development</Link></li>
              <li><Link to="/#features" className="hover:text-white transition-colors">AI & ML Solutions</Link></li>
              <li><Link to="/#features" className="hover:text-white transition-colors">Cloud Engineering</Link></li>
              <li><Link to="/#features" className="hover:text-white transition-colors">Cybersecurity</Link></li>
            </ul>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Products</span>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://marrysmartly.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MarrySmartlyAI</a></li>
              <li><Link to="/products/glowzy" className="hover:text-white transition-colors">Glowzy</Link></li>
              <li><Link to="/products/courtmate" className="hover:text-white transition-colors">CourtMate</Link></li>
              <li><Link to="/products/medical-queue" className="hover:text-white transition-colors">AI-Powered Medical Queue Management</Link></li>
              <li><a href="https://invitesync.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" /> Invitation Manager
              </a></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors">All SaaS Products</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">API Docs</Link></li>
            </ul>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Company</span>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {currentYear} {companyName}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;