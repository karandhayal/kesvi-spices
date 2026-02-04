import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ChefHat, Sprout, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

/* --- ASSETS --- */
const IMAGES = {
  brownAtta: "/products/brown-atta.png"
};

/* --- CUSTOM WHEAT SVG COMPONENT --- */
// This component changes appearance based on the active 'layer' prop
const WheatGrainSVG = ({ progress }) => {
  // Progress 0-0.3: Full Grain
  // Progress 0.3-0.6: Bran (Outer)
  // Progress 0.6-0.9: Endosperm (Inner)
  // Progress 0.9-1.0: Germ (Core)

  const isBranActive = progress > 0.25 && progress < 0.55;
  const isEndospermActive = progress >= 0.55 && progress < 0.8;
  const isGermActive = progress >= 0.8;

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. THE GERM (The Life Force) - Bottom Core */}
      <motion.path 
        d="M95,330 Q100,350 105,330 Q115,310 100,300 Q85,310 95,330 Z" 
        fill="#FFD700" // Bright Gold
        className="transition-all duration-700"
        style={{ 
          opacity: isGermActive ? 1 : 0,
          scale: isGermActive ? 1.2 : 1,
          transformOrigin: "100px 320px"
        }}
      />

      {/* 2. THE ENDOSPERM (The Energy) - White Center */}
      <motion.path 
        d="M100,20 Q160,20 170,100 Q180,250 100,380 Q20,250 30,100 Q40,20 100,20 Z" 
        fill="#FFFBF0" // Creamy White
        stroke="#E6C9A8"
        strokeWidth="2"
        className="transition-all duration-700"
        style={{ 
          opacity: isEndospermActive || isGermActive ? 1 : 0,
          filter: isEndospermActive ? "brightness(1.1)" : "brightness(0.5)"
        }}
      />

      {/* 3. THE BRAN (The Armor) - Outer Shell */}
      <motion.path 
        d="M100,10 Q165,10 180,100 Q195,260 100,390 Q5,260 20,100 Q35,10 100,10 Z" 
        fill="transparent"
        stroke="#8B4513" // Saddle Brown
        strokeWidth={isBranActive ? "6" : "2"}
        className="transition-all duration-700"
        style={{ 
          opacity: isBranActive ? 1 : (isEndospermActive || isGermActive ? 0.1 : 1),
          fill: isBranActive || (!isEndospermActive && !isGermActive) ? "#C19A6B" : "transparent" // Wheat color
        }}
      />
      
      {/* Decorative Crease Line */}
      <motion.path 
        d="M100,40 Q105,200 100,350"
        fill="transparent"
        stroke="#5D4037"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ opacity: isEndospermActive ? 0.2 : 0.6 }}
      />
    </svg>
  );
};

/* --- PRODUCT MINI CARD --- */
const ProductMiniCard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 100 }}
    className="bg-white p-4 md:p-6 rounded-sm shadow-xl border border-[#E6E2DD] max-w-[280px] md:max-w-xs mx-auto md:mx-0"
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-[#B08968] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-full">
        High Fiber
      </div>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest">
        The Whole Grain
      </div>
    </div>
    
    <div className="flex gap-4 items-center">
      <div className="w-20 h-24 bg-[#F9F7F2] relative flex-shrink-0">
        <img 
          src={IMAGES.brownAtta} 
          alt="Parosa Brown Atta" 
          className="w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div>
        <h4 className="font-serif text-lg text-[#2C2420] leading-none mb-1">Parosa <br/><span className="italic text-[#B08968]">Brown Atta</span></h4>
        <p className="text-xs text-gray-500 mb-2">100% Bran retention for digestion & heart health.</p>
        <Link to="/product/brown-atta" className="text-[10px] font-bold underline decoration-[#B08968] underline-offset-4 hover:text-[#B08968]">
          View Product
        </Link>
      </div>
    </div>
  </motion.div>
);

/* --- MAIN PAGE COMPONENT --- */
const WheatIngredientPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Smooth out the scroll value
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="bg-[#F9F7F2] min-h-screen font-sans selection:bg-[#B08968] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-[#B08968]">
            <Sprout size={20} />
            <span className="uppercase tracking-[0.3em] text-xs font-bold">Ingredient Spotlight</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif text-[#2C2420] mb-6">
            The Anatomy <br/><span className="italic text-gray-400">of Purity</span>
          </h1>
          <p className="max-w-md mx-auto text-gray-600 text-sm md:text-lg font-light">
            Scroll to deconstruct the grain. Discover why whole wheat matters.
          </p>
        </motion.div>
        
        {/* Scroll Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-gray-400"
        >
          <ArrowRight className="rotate-90" />
        </motion.div>
      </section>

      {/* 2. THE SCROLLYTELLING CONTAINER */}
      <div ref={containerRef} className="relative h-[400vh]">
        
        {/* STICKY VISUAL (The Grain) */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden z-0">
          <div className="relative w-[60vh] h-[60vh] md:w-[600px] md:h-[600px] flex items-center justify-center">
            
            {/* Background Halo */}
            <motion.div 
              className="absolute inset-0 bg-white rounded-full blur-3xl opacity-50"
              style={{ scale: useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 1.5]) }}
            />
            
            {/* The Dynamic SVG */}
            <div className="relative z-10 w-48 md:w-64 h-auto">
              <AnimatedWheatVisual progress={smoothProgress} />
            </div>

            {/* Labels that rotate/fade based on scroll */}
            <FloatingLabel progress={smoothProgress} />
          </div>
        </div>

        {/* SCROLL TEXT LAYERS (Foreground) */}
        {/* Layer 1: The Whole Grain */}
        <div className="relative z-10 h-screen flex items-center justify-center md:justify-start pointer-events-none">
          {/* Spacer */}
        </div>

        {/* Layer 2: BRAN (The Outer Shell) */}
        <div className="relative z-10 h-screen flex items-center justify-center md:justify-end px-6 md:px-24 pointer-events-none">
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.25, 0.35, 0.5, 0.55], [0, 1, 1, 0]) }}
            className="pointer-events-auto"
          >
            <div className="max-w-md text-center md:text-left">
              <span className="text-[#B08968] font-bold text-6xl md:text-9xl opacity-20 absolute -top-10 -left-10 z-0">01</span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4 relative z-10">The Bran</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                The hard outer shell. It shields the seed and is packed with fiber, B vitamins, and trace minerals. 
                Modern refining strips this away. <strong className="text-[#2C2420]">We keep it.</strong>
              </p>
              
              {/* SHOW PRODUCT CARD HERE */}
              <ProductMiniCard />
            </div>
          </motion.div>
        </div>

        {/* Layer 3: ENDOSPERM (The Middle) */}
        <div className="relative z-10 h-screen flex items-center justify-center md:justify-start px-6 md:px-24 pointer-events-none">
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.55, 0.65, 0.75, 0.8], [0, 1, 1, 0]) }}
            className="max-w-md text-center md:text-left pointer-events-auto"
          >
            <span className="text-gray-300 font-bold text-6xl md:text-9xl opacity-30 absolute -top-10 -left-10 z-0">02</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4 relative z-10">The Endosperm</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              The starchy center. This is where white flour (Maida) comes from. It provides energy, but without the Bran and Germ, it's just empty calories.
            </p>
            <div className="flex items-center gap-3 text-[#B08968]">
              <Sun size={20} />
              <span className="uppercase text-xs font-bold tracking-widest">Energy Source</span>
            </div>
          </motion.div>
        </div>

        {/* Layer 4: GERM (The Core) */}
        <div className="relative z-10 h-screen flex items-center justify-center md:justify-end px-6 md:px-24 pointer-events-none">
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1]) }}
            className="max-w-md text-center md:text-left pointer-events-auto"
          >
            <span className="text-[#B08968] font-bold text-6xl md:text-9xl opacity-20 absolute -top-10 -left-10 z-0">03</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4 relative z-10">The Germ</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              The embryo. The tiniest part, but the nutrient powerhouse. Rich in healthy fats and Vitamin E. 
              Usually removed to extend shelf life. <br/><br/>
              <span className="italic font-serif text-xl text-[#2C2420]">We stone grind it cold to keep it alive.</span>
            </p>
            <div className="flex items-center gap-3 text-[#B08968]">
              <ChefHat size={20} />
              <span className="uppercase text-xs font-bold tracking-widest">Nutrient Density</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. CONCLUSION / CTA */}
      <section className="bg-[#2C2420] text-[#F9F7F2] py-24 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-6">Whole Wheat. Whole Life.</h2>
        <p className="max-w-xl mx-auto text-white/60 mb-10">
          Experience the difference of flour that hasn't been stripped of its soul.
        </p>
        <Link to="/products" className="inline-block bg-[#B08968] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-[#2C2420] transition-colors">
          Shop the Harvest
        </Link>
      </section>

    </div>
  );
};

/* --- HELPER: WRAPPER FOR SVG TO HANDLE MOTION VALUE SUBSCRIPTION --- */
const AnimatedWheatVisual = ({ progress }) => {
  // We use a state to force re-render when motion value changes significantly
  // or pass the motion value directly if the SVG was fully motion-component based.
  // For simplicity in this demo, we re-render based on a listener or just pass the raw value 
  // and let the child component handle logic.
  
  const [currentProgress, setCurrentProgress] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      setCurrentProgress(latest);
    });
    return () => unsubscribe();
  }, [progress]);

  return <WheatGrainSVG progress={currentProgress} />;
};

/* --- HELPER: FLOATING LABELS --- */
const FloatingLabel = ({ progress }) => {
  // Only shows labels on large screens to keep mobile clean, or adjust positioning for mobile
  const y = useTransform(progress, [0, 1], [0, -50]);
  const opacity = useTransform(progress, [0.1, 0.2], [0, 1]);

  return (
    <motion.div 
      style={{ y, opacity }}
      className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block"
    >
      {/* Decorative vertical line */}
      <div className="h-32 w-px bg-[#B08968]/30 absolute left-0" />
    </motion.div>
  );
};

export default WheatIngredientPage;