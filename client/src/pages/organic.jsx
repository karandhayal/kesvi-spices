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
const IMAGES = {
  hero: "/hero-organic-2.jpg", 
  farmer: "/farmer-soil.png",
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
const HeroSection = () => {
  return (
    <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 z-10" /> 
        <img 
          src={IMAGES.hero} 
          alt="Golden wheat fields at sunset" 
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      <div className="relative z-20 text-center w-full px-4 md:px-6 mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-white/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm mb-3 md:mb-4 block">
            The Private Harvest Collection
          </span>
          
          {/* Responsive Typography: Smaller on mobile, Huge on desktop */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] md:leading-tight">
            Crafted for <span className="italic text-[#E6C9A8]">100 Families</span>.<br />
            <span className="block mt-2 md:mt-0">Not the Market.</span>
          </h1>

          <p className="text-white/90 text-sm md:text-xl font-light max-w-xs md:max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
            Single-origin organic wheat. Vacuum-sealed freshness. 
            Delivered monthly to a closed circle of connoisseurs.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-[#2C2420] px-6 py-3 md:px-8 md:py-4 uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-[#E6C9A8] transition-colors duration-500 w-auto"
          >
            Request Invitation
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={20} className="md:w-6 md:h-6" />
      </motion.div>
    </section>
  );
};

// 3. STORY SECTION
const StorySection = () => {
  return (
    <section className={`${BRAND_COLORS.bg} py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* Image Side - Order 1 on mobile (shows first) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-1 md:order-none"
        >
          <div className="aspect-[4/5] bg-[#E6E2DD] overflow-hidden rounded-sm">
             <img src={IMAGES.farmer} alt="Farmer hands in soil" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
          </div>
          {/* Floating Quote - Hidden on very small screens, visible on tablet+ */}
          <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-white p-4 md:p-6 shadow-xl max-w-[200px] md:max-w-xs hidden sm:block">
            <p className="font-serif italic text-sm md:text-lg text-[#2C2420]">"We don't grow for yield. We grow for the soul of the grain."</p>
          </div>
        </motion.div>

        {/* Text Side - Order 2 on mobile */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-2 md:order-none"
        >
          <h2 className={`text-3xl md:text-5xl font-serif ${BRAND_COLORS.text} mb-6 md:mb-8 leading-tight`}>
            A Return to <br/><span className="italic text-[#B08968]">Ancestral Purity</span>
          </h2>
          <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 font-light leading-relaxed">
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
              <span className="uppercase tracking-widest text-[10px] md:text-xs font-bold text-[#B08968]">Ethically Sourced</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 4. PROCESS SECTION
const ProcessStep = ({ icon: Icon, title, desc, step }) => (
  <motion.div 
    className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center relative z-10 gap-6 md:gap-0 pl-4 md:pl-0"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.1 }}
  >
    {/* Mobile Timeline Dot */}
    <div className="absolute left-[-5px] top-6 w-3 h-3 rounded-full bg-[#B08968] md:hidden z-20" />
    
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#B08968]/30 flex flex-shrink-0 items-center justify-center bg-[#F9F7F2] md:mb-6 shadow-sm group hover:border-[#B08968] transition-colors">
      <Icon className="text-[#B08968] w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
    </div>
    
    <div>
      <h3 className="font-serif text-lg md:text-xl mb-1 md:mb-2 text-[#2C2420] mt-0 md:mt-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-[250px] md:max-w-[200px] leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const ProcessSection = () => {
  return (
    <section className="bg-white py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs text-gray-400 mb-2 block">The Journey</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2420]">From Soil to Seal</h2>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4 ml-2 md:ml-0">
          
          {/* Desktop Horizontal Line */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-[#E6E2DD] z-0" />
          
          {/* Mobile Vertical Line */}
          <div className="md:hidden absolute top-4 left-[2px] w-px h-[90%] bg-[#E6E2DD] z-0" />

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

// 5. MEMBERSHIP SECTION
const MembershipSection = () => {
  // Simulating limited spots
  const totalSpots = 100;
  const takenSpots = 20;

  return (
    <section className="bg-[#2C2420] text-[#F9F7F2] py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        
        {/* Left: The Logic */}
        <div className="flex-1 space-y-6 md:space-y-8 w-full">
          <div className="flex items-center gap-2 text-[#B08968]">
            <Lock size={16} className="md:w-5 md:h-5" />
            <span className="uppercase tracking-widest text-[10px] md:text-xs font-bold">Private Membership</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif leading-none">
            Not for Everyone.<br/>
            <span className="text-white/30 italic">By Design.</span>
          </h2>
          
          <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
            Mass production kills purity. To maintain our strict vacuum-seal standards and soil health, 
            we can only support 100 families per harvest year.
          </p>

          {/* Scarcity Counter */}
          <div className="bg-white/5 p-5 md:p-6 border border-white/10 rounded-sm backdrop-blur-sm">
            <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest mb-2 text-[#B08968]">
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
            <p className="mt-4 text-[10px] md:text-xs text-white/40">
              *Once filled, the waitlist opens for the 2026 harvest.
            </p>
          </div>
        </div>

        {/* Right: The Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 w-full max-w-md bg-[#F9F7F2] text-[#2C2420] p-8 md:p-14 shadow-2xl relative mt-4 md:mt-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B08968] text-white px-4 py-1 uppercase text-[10px] md:text-xs font-bold tracking-widest whitespace-nowrap">
            Annual Plan
          </div>

          <h3 className="text-2xl md:text-3xl font-serif text-center mb-2">The Heritage Circle</h3>
          <div className="text-center text-gray-500 text-xs md:text-sm italic mb-6 md:mb-8">12 Month Supply</div>

          <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            {[
              "100% Organic 1482 Wheat",
              "Vacuum Packed for 12-Month Freshness",
              "Monthly Doorstep Delivery",
              "Priority Farm Visit Access",
              "Zero-touch Processing"
            ].map((item, i) => (
              <li key={i} className="flex items-start md:items-center gap-3 text-sm border-b border-gray-200 pb-3 last:border-0">
                <Star size={14} className="text-[#B08968] flex-shrink-0 mt-0.5 md:mt-0" />
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>

          <button className="w-full bg-[#2C2420] text-white py-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold hover:bg-[#4a3e36] transition-all">
            Apply for Membership
          </button>
          
          <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4">
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
    <div className="bg-[#E6E2DD] py-8 md:py-12 border-t border-[#d6d2cd]">
      {/* Grid on mobile, Flex on desktop */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-x-4 gap-y-8 md:gap-12 opacity-60">
        {['Certified Organic', 'Zero Pesticide', 'Small Batch', 'Fair Trade'].map((badge) => (
          <div key={badge} className="flex items-center justify-center md:justify-start gap-2 text-center">
            <ShieldCheck size={18} className="md:w-5 md:h-5" />
            <span className="font-serif uppercase text-[10px] md:text-sm tracking-widest">{badge}</span>
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
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-5 md:px-8 md:py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-serif text-xl md:text-2xl tracking-tighter font-bold z-50">BRAND.</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
          <button className="hover:opacity-70">Story</button>
          <button className="hover:opacity-70">Process</button>
          <button className="hover:opacity-70">Reserve</button>
        </div>
        
        <button className="border border-white/40 px-4 py-2 md:px-6 md:py-2 uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-colors z-50">
          Login
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