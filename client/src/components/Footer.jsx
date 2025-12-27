import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- TOP SECTION: 4 COLUMNS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COL 1: BRAND INFO */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif tracking-wide mb-2">PAROSA</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                By Dhayal Industries
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing the purity of traditional Indian farming to your modern kitchen. 
              Stone-ground flours and sun-dried spices, processed with care.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-200">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?cat=Spices" className="hover:text-white transition-colors">Fresh Spices</Link></li>
              <li><Link to="/shop?cat=Wheat Flour" className="hover:text-white transition-colors">Stone Ground Atta</Link></li>
              <li><Link to="/shop?cat=Mustard Oil" className="hover:text-white transition-colors">Cold Pressed Oils</Link></li>
            </ul>
          </div>

          {/* COL 3: LEGAL & SUPPORT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-200">Support</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* COL 4: CONTACT & NEWSLETTER */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-200">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-400 mb-8">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Dhayal Industries,<br/>Zirakpur, Punjab - 140603</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>support@parosa.com</span>
              </div>
            </div>

            {/* Mini Newsletter Form */}
            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 mb-3">Subscribe for Offers</h4>
              <div className="flex border-b border-gray-600 pb-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-transparent w-full outline-none text-sm placeholder-gray-600 focus:placeholder-gray-400 text-white"
                />
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Parosa. All Rights Reserved.
          </p>
          <p className="mt-2 md:mt-0">
            Parosa is a registered trademark of <span className="text-gray-300">Dhayal Industries</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;