import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, LogOut, Package } from 'lucide-react'; 
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get Context Data
  const { cartCount } = useCart(); 
  const { user, logout } = useAuth(); 
  
  const location = useLocation();

  // 1. Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Distributor', path: '/distributor' },
    { name: 'Organic Atta', path: '/organic-atta' },
    { name: 'Our Story', path: '/about' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md ${
      isScrolled || isOpen ? 'py-3' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Left: Mobile Menu Toggle */}
        <button 
          className="md:hidden text-parosa-dark p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center/Left: Logo */}
        <Link to="/" className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-parosa-dark">
            PAROSA
          </span>
          <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-parosa-accent font-bold">
            Parosa ka Bharosa
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-[10px] uppercase tracking-widest font-bold text-parosa-dark hover:text-parosa-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Icons (Search | User | Cart) */}
        <div className="flex items-center gap-4 md:gap-6 text-parosa-dark">
          
          {/* 1. Search Icon */}
          <button className="hover:text-parosa-accent transition-colors">
            <Search size={20} />
          </button>

          {/* 2. USER AUTH SECTION */}
          {user ? (
            // --- LOGGED IN VIEW ---
            <div className="relative group cursor-pointer flex items-center gap-2">
              <User size={20} className="hover:text-parosa-accent transition-colors" />
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider">
                {user.name.split(' ')[0]}
              </span>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-4 w-48 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right rounded-sm">
                <div className="py-2">
                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-50 mb-1">
                    Signed in as <br/> <span className="font-bold text-parosa-dark">{user.email}</span>
                  </div>
                  
                  {/* My Orders Link in Dropdown */}
                  <Link 
                    to="/orders"
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                     <Package size={12} /> My Orders
                  </Link>

                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // --- GUEST VIEW (Desktop) ---
            <div className="flex items-center gap-5">
              {/* ADDED: Track Order Link for Guests */}
              <Link 
                to="/orders" 
                className="hidden md:block text-[10px] uppercase font-bold tracking-widest hover:text-parosa-accent transition-colors"
              >
                Track Order
              </Link>

              <Link 
                to="/login" 
                className="text-[10px] uppercase font-bold tracking-widest hover:text-parosa-accent transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* 3. CART ICON WITH BADGE */}
          <Link to="/cart" className="relative hover:text-parosa-accent transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div className={`fixed inset-0 top-[60px] bg-white z-40 transition-transform duration-500 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col p-8 gap-8">
          
          {/* Mobile User Section */}
          <div className="pb-6 border-b border-gray-100">
             {user ? (
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-xl font-serif text-parosa-dark">Hello, {user.name}</p>
                   <p className="text-xs text-gray-400">{user.email}</p>
                 </div>
                 <button onClick={logout} className="text-red-500"><LogOut size={20}/></button>
               </div>
             ) : (
               <Link to="/login" className="text-xl font-serif text-parosa-dark flex items-center gap-2">
                 <User size={20} /> Login / Register
               </Link>
             )}
          </div>

          {/* Mobile Links */}
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-xl font-serif text-parosa-dark"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Order Link */}
          <Link 
            to="/orders" 
            className="text-xl font-serif text-parosa-dark flex items-center gap-2"
          >
             {user ? 'My Orders' : 'Track Order'}
          </Link>
          
          <div className="mt-10 space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Customer Support</p>
            <p className="text-sm text-parosa-dark font-bold">+91 9587708808</p>
            <p className="text-sm text-parosa-dark font-bold">contact@parosa.co.in</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;