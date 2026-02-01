import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { 
  Wheat, 
  ShieldCheck, 
  Wind, 
  Truck, 
  Lock, 
  ChevronDown, 
  Star 
} from 'lucide-react';

/* --- ASSETS & CONSTANTS --- */
// Using placeholders for demo. In production, use high-fidelity macro photography.
const IMAGES = {
  hero: "/hero-organic.jpg", 
  farmer: "/api/placeholder/800/800",
  wheat: "/api/placeholder/800/600"
};

const BRAND_COLORS = {
  bg: "bg-[#F9F7F2]", // Unbleached paper
  text: "text-[#2C2420]", // Deep Loam
  accent: "text-[#B08968]", // Wheat Gold
  subtle: "bg-[#E6E2DD]" // Stone
};

/* --- COMPONENTS --- */

// 1. SCROLL PROGRESS INDICATOR
// Adds a subtle premium reading experience
const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#B08968] origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// 2. HERO SECTION
// Impact: High. Interaction: Slow fade + Parallax.
const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Parallax */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay for text readability */}
        <img 
          src={IMAGES.hero} 
          alt="Golden wheat fields at sunset" 
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      <div className="relative z-20 text-center max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-white/80 uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
            The Private Harvest Collection
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
            Crafted for <span className="italic text-[#E6C9A8]">100 Families</span>.<br />
            Not the Market.
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Single-origin organic wheat. Vacuum-sealed freshness. 
            Delivered monthly to a closed circle of connoisseurs.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-[#2C2420] px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-[#E6C9A8] transition-colors duration-500"
          >
            Request Invitation
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

// 3. STORY SECTION
// Vibe: Emotional, Earthy, Authentic.
const StorySection = () => {
  return (
    <section className={`${BRAND_COLORS.bg} py-24 px-6 md:px-12 lg:px-24 overflow-hidden`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] bg-[#E6E2DD] overflow-hidden">
             <img src={IMAGES.farmer} alt="Farmer hands in soil" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl max-w-xs hidden md:block">
            <p className="font-serif italic text-lg text-[#2C2420]">"We don't grow for yield. We grow for the soul of the grain."</p>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className={`text-4xl md:text-5xl font-serif ${BRAND_COLORS.text} mb-8`}>
            A Return to <br/><span className="italic text-[#B08968]">Ancestral Purity</span>
          </h2>
          <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
            <p>
              Most flour sits in warehouses for months, losing its life force before it reaches your shelf. 
              We rejected this model entirely.
            </p>
            <p>
              We partnered with <strong>Ram Narayan</strong>, a third-generation organic farmer who treats his soil like a living entity. 
              No pesticides. No middlemen. Just golden wheat, harvested at peak nutrition.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px w-12 bg-[#B08968]"></div>
              <span className="uppercase tracking-widest text-xs font-bold text-[#B08968]">Ethically Sourced</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 4. PROCESS SECTION
// Flow: Horizontal connection. Highlights the "Vacuum" USP.
const ProcessStep = ({ icon: Icon, title, desc, step }) => (
  <motion.div 
    className="flex flex-col items-center text-center relative z-10"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.2 }}
  >
    <div className="w-20 h-20 rounded-full border border-[#B08968]/30 flex items-center justify-center bg-[#F9F7F2] mb-6 shadow-sm group hover:border-[#B08968] transition-colors">
      <Icon className="text-[#B08968] group-hover:scale-110 transition-transform" size={32} />
    </div>
    <h3 className="font-serif text-xl mb-2 text-[#2C2420]">{title}</h3>
    <p className="text-sm text-gray-500 max-w-[200px]">{desc}</p>
  </motion.div>
);

const ProcessSection = () => {
  return (
    <section className="bg-white py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-2 block">The Journey</span>
          <h2 className="text-4xl font-serif text-[#2C2420]">From Soil to Seal</h2>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-[#E6E2DD] z-0" />

          <ProcessStep 
            step={1}
            icon={Wheat} 
            title="Ethical Sourcing" 
            desc="Direct harvest from our exclusive organic partner farm." 
          />
          <ProcessStep 
            step={2}
            icon={Wind} 
            title="Hygienic Cleaning" 
            desc="Triple-cleaned to remove impurities without stripping nutrients." 
          />
          <ProcessStep 
            step={3}
            icon={ShieldCheck} 
            title="Vacuum Storage" 
            desc="Stored in vacuum to prevent oxidation and pest infestation." 
          />
          <ProcessStep 
            step={4}
            icon={Truck} 
            title="Monthly Delivery" 
            desc="Freshly ground batches delivered directly to your doorstep." 
          />
        </div>
      </div>
    </section>
  );
};

// 5. LIMITED ACCESS / MEMBERSHIP
// Logic: Scarcity, Annual Commitment.
const MembershipSection = () => {
  // Simulating limited spots
  const totalSpots = 100;
  const takenSpots = 87;

  return (
    <section className="bg-[#2C2420] text-[#F9F7F2] py-32 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left: The Logic */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-2 text-[#B08968]">
            <Lock size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">Private Membership</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif leading-none">
            Not for Everyone.<br/>
            <span className="text-white/30 italic">By Design.</span>
          </h2>
          
          <p className="text-lg text-white/60 font-light leading-relaxed">
            Mass production kills purity. To maintain our strict vacuum-seal standards and soil health, 
            we can only support 100 families per harvest year.
          </p>

          {/* Scarcity Counter */}
          <div className="bg-white/5 p-6 border border-white/10 rounded-sm backdrop-blur-sm">
            <div className="flex justify-between text-sm uppercase tracking-widest mb-2 text-[#B08968]">
              <span>Current Availability</span>
              <span>{totalSpots - takenSpots} Slots Left</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(takenSpots/totalSpots)*100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-[#B08968]"
              />
            </div>
            <p className="mt-4 text-xs text-white/40">
              *Once filled, the waitlist opens for the 2026 harvest.
            </p>
          </div>
        </div>

        {/* Right: The Card */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="flex-1 w-full max-w-md bg-[#F9F7F2] text-[#2C2420] p-10 md:p-14 shadow-2xl relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B08968] text-white px-4 py-1 uppercase text-xs font-bold tracking-widest">
            Annual Plan
          </div>

          <h3 className="text-3xl font-serif text-center mb-2">The Heritage Circle</h3>
          <div className="text-center text-gray-500 text-sm italic mb-8">12 Month Supply</div>

          <ul className="space-y-4 mb-10">
            {[
              "100% Organic Khapli Wheat",
              "Vacuum Packed for 12-Month Freshness",
              "Monthly Doorstep Delivery",
              "Priority Farm Visit Access",
              "Zero-touch Processing"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm border-b border-gray-200 pb-3 last:border-0">
                <Star size={14} className="text-[#B08968] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button className="w-full bg-[#2C2420] text-white py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#4a3e36] transition-all">
            Apply for Membership
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            No cancellation. No monthly billing. Commitment required.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

// 6. FOOTER / TRUST
const FooterTrust = () => {
  return (
    <div className="bg-[#E6E2DD] py-12 border-t border-[#d6d2cd]">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Placeholder for Trust Badges/Logos */}
        {['Certified Organic', 'Zero Pesticide', 'Small Batch', 'Fair Trade'].map((badge) => (
          <div key={badge} className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="font-serif uppercase text-sm tracking-widest">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- MAIN PAGE LAYOUT --- */
const OrganicProductPage = () => {
  return (
    <div className="font-sans antialiased selection:bg-[#B08968] selection:text-white">
      <ProgressBar />
      
      {/* Navigation Placeholder */}
      <nav className="fixed top-0 w-full z-40 px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-serif text-2xl tracking-tighter font-bold">BRAND.</div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
          <a href="#" className="hover:opacity-70">Story</a>
          <a href="#" className="hover:opacity-70">Process</a>
          <a href="#" className="hover:opacity-70">Reserve</a>
        </div>
        <button className="border border-white/40 px-6 py-2 uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-colors">
          Member Login
        </button>
      </nav>

      <main>
        <HeroSection />
        <StorySection />
        <ProcessSection />
        <MembershipSection />
        <FooterTrust />
      </main>
    </div>
  );
};

export default OrganicProductPage;