import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All'); 

  // Fetch Data on Load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  // ✅ UPDATED FILTER LOGIC: Dynamic based on selection
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categories = ['All', 'Wheat Flour', 'Spices', 'Mustard Oil', 'Graded Wheat', 'Animal Feed'];

  return (
    <div className="bg-stone-50 min-h-screen font-sans selection:bg-amber-200 pt-[60px] md:pt-[80px]">
      
      {/* --- RAJASTHANI BACKGROUND PATTERN --- */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")` }}>
      </div>

      {/* OFFER STRIP */}
      <div className="bg-red-700 text-white py-2 px-4 text-center relative z-50 shadow-sm">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2">
          🚚 Free Shipping on orders above ₹399
        </p>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-12 md:py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/farmer-background.jpg" 
            alt="Rajasthan Fields" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-amber-900/30 to-stone-900/80"></div>
        </div>

        <div className="relative z-10 animate-fadeIn max-w-5xl mx-auto mt-6 md:mt-10">
          <div className="w-16 md:w-24 h-1 bg-amber-500 mx-auto mb-4 md:mb-6 rounded-full"></div>

          <span className="text-amber-300 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm font-bold mb-3 md:mb-4 block drop-shadow-md">
            Rajasthan ki Shan
          </span>
          
          <h1 className="text-4xl md:text-7xl font-serif text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
            Unadulterated. <br/>
            <span className="text-amber-100 italic font-light">Purest Quality.</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="bg-amber-700 text-white border border-amber-600 px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-amber-600 transition-all w-full">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. USP BANNER */}
      <section className="bg-amber-900 text-amber-50 py-6 md:py-8 border-y-4 border-amber-700 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-center md:text-left">
           <div>
             <h3 className="text-lg md:text-2xl font-serif font-bold">100% No Adulteration Policy</h3>
             <p className="text-amber-200/80 text-[10px] md:text-sm">We don't just sell food; we sell trust.</p>
           </div>
           <div className="flex items-center gap-2 border border-amber-500/30 px-3 py-1 rounded-lg bg-amber-800/50">
             <span className="text-xl">🛡️</span>
             <span className="text-[10px] font-bold uppercase tracking-widest">Lab Tested</span>
           </div>
        </div>
      </section>

      {/* 3. TRUST BAR */}
      <section className="bg-white py-12 md:py-16 border-b border-stone-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {[
            { icon: "🌾", title: "Shuddh Desi", desc: "From Rajasthan" },
            { icon: "☀️", title: "Farm Origin", desc: "Sourced from Best Places" },
            { icon: "🚫", title: "Zero Chemicals", desc: "No Preservatives" },
            { icon: "🤝", title: "Farmer Connect", desc: "Direct from Source" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 group-hover:bg-amber-50 transition-all">
                {item.icon}
              </div>
              <h5 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-800 group-hover:text-amber-700">{item.title}</h5>
              <p className="text-[9px] md:text-[10px] text-stone-500 uppercase mt-1 tracking-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">
        <div className="mb-8 md:mb-12 text-center">
          <span className="text-amber-600 text-[10px] md:text-xs font-bold tracking-widest uppercase block mb-1">From Our Farms</span>
          <h2 className="text-2xl md:text-5xl font-serif text-stone-900 capitalize mb-8">
            {activeCategory === 'All' ? 'Our Best' : activeCategory} <span className="italic font-light text-stone-500">Collection</span>
          </h2>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-widest font-bold pb-1 border-b-2 transition-colors ${
                  activeCategory === cat 
                    ? 'text-amber-800 border-amber-800' 
                    : 'text-stone-400 border-transparent hover:text-stone-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-stone-400 italic font-serif">
                No products found in this category.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. HERITAGE FOOTER NOTE */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center border-t border-stone-200 relative z-10">
        <h2 className="text-xl md:text-2xl font-serif text-stone-800 mb-4">Rooted in Tradition. Verified by Science.</h2>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
          We combine the rich agricultural heritage of Rajasthan with modern quality checks.
        </p>
        <Link to="/about" className="inline-block border border-stone-300 text-stone-600 px-8 py-3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 hover:text-white transition-all">
          Read Our Story
        </Link>
      </section>
      
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Home;