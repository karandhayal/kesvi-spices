import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react'; 

const Shop = () => {
  // 1. State for Data & Loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Filters & Sort
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // CHANGED: specific domain removed, uses global base URL
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

  // 4. Process Data (Filter & Sort)
  const processedProducts = useMemo(() => {
    let filtered = filter === 'All' 
      ? [...products] 
      : products.filter(p => p.category === filter);

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    
    return filtered;
  }, [products, filter, sort]);

  const categories = ['All', 'Wheat Flour', 'Spices', 'Mustard Oil', 'Graded Wheat', 'Animal Feed'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-parosa-bg">
        <Loader2 className="animate-spin text-parosa-dark mb-4" size={40} />
        <p className="font-serif text-parosa-dark animate-pulse">Loading Pantry...</p>
      </div>
    );
  }

  return (
    <div className="bg-parosa-bg min-h-screen pb-20">
      <header className="pt-20 pb-12 px-6 text-center border-b border-gray-100 bg-white">
        <h1 className="text-4xl md:text-5xl font-serif text-parosa-dark mb-4">The Parosa Store</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-parosa-accent font-bold">Uncompromising Quality Staples</p>
      </header>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-[72px] md:top-[88px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
                  filter === cat ? 'text-parosa-red' : 'text-gray-400 hover:text-parosa-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Sort:</span>
            <select 
              className="text-[10px] uppercase tracking-widest font-bold bg-transparent outline-none cursor-pointer text-parosa-dark border-b border-parosa-dark pb-0.5"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
          {processedProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              {...product} 
            />
          ))}
        </div>

        {processedProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-gray-400 italic">No products found in this category.</p>
          </div>
        )}
      </main>

      <section className="max-w-4xl mx-auto px-6 mt-20 py-16 border-t border-gray-100 text-center">
        <h2 className="text-2xl font-serif text-parosa-dark mb-4">Bulk & B2B Inquiries</h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Looking to stock Parosa at your retail outlet or use our graded grains for your commercial kitchen?
        </p>
        <button className="bg-parosa-dark text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-parosa-accent transition-all">
          Contact Wholesale
        </button>
      </section>
    </div>
  );
};

export default Shop;