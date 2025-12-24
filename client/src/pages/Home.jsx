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
  
  // Filter Logic
  const filteredProducts = activeCategory === 'All' 
    ? products.slice(0, 8) // Show top 8 on home
    : products.filter(p => p.category === activeCategory);

  const categories = ['All', 'Wheat Flour', 'Spices', 'Mustard Oil', 'Graded Wheat', 'Animal Feed'];

  return (
    <div className="bg-parosa-bg min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="relative z-10 animate-fadeIn max-w-4xl mx-auto">
          <span className="text-parosa-accent uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4 block">
            Farm to Kitchen Purity
          </span>
          <h1 className="text-4xl md:text-7xl font-serif text-parosa-dark mb-6 leading-[1.15]">
            Authentic Nutrition <br/>
            <span className="italic font-light text-gray-700">For Your Modern Kitchen.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-lg max-w-lg mx-auto mb-10 px-2 leading-relaxed">
            From the stone-ground flours of Rajasthan to the premium spices of Salem. 
            Directly from our farms to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="bg-parosa-dark text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-parosa-accent transition-all w-full shadow-lg shadow-parosa-dark/10">
                Shop Collection
              </button>
            </Link>
            <Link to="/purity" className="w-full sm:w-auto">
              <button className="border border-parosa-dark text-parosa-dark px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-parosa-dark hover:text-white transition-all w-full">
                Our Story
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "🌾", title: "Stone Ground", desc: "Cold milled purity" },
            { icon: "☀️", title: "Sun Dried", desc: "Premium spices" },
            { icon: "🧪", title: "Lab Tested", desc: "Zero additives" },
            { icon: "🚚", title: "Farm Direct", desc: "100% Traceable" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-2xl mb-2">{item.icon}</span>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-parosa-dark">{item.title}</h5>
              <p className="text-[9px] text-gray-400 uppercase mt-1 tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY BAR */}
      <section className="bg-white border-b border-gray-100 sticky top-[72px] md:top-[88px] z-40 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar py-4 px-6 md:justify-center gap-8 md:gap-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all pb-1 border-b-2 ${
                activeCategory === cat 
                ? 'text-parosa-dark border-parosa-dark' 
                : 'text-gray-400 border-transparent hover:text-parosa-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-serif text-parosa-dark capitalize leading-tight">
            {activeCategory} <span className="italic font-light text-gray-500">Selection</span>
          </h2>
          <div className="h-1 w-12 bg-parosa-accent mx-auto md:mx-0 mt-4"></div>
        </div>

        {loading ? (
           <div className="text-center py-20 text-gray-400 font-serif italic">Fetching latest products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
            {filteredProducts.map((product) => (
              // UPDATED: Passing the full object as 'product'
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. SEO FOOTER */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center border-t border-gray-100">
        <h2 className="text-2xl font-serif text-parosa-dark mb-4">Pure Staples for a Healthier Home</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Parosa is committed to traditional food processing. Our stone-ground (Chakki) flours preserve essential vitamins often lost in industrial mills. 
        </p>
        <Link to="/purity" className="text-xs font-bold uppercase tracking-widest text-parosa-accent border-b border-parosa-accent pb-1">
          Learn About Our Process
        </Link>
      </section>
      
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Home;