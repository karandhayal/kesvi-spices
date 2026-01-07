const products = [
  {
    name: "Premium Turmeric Powder",
    slug: "turmeric-powder",
    category: "Spices",
    tag: "Best Seller",
    image: "/products/turmeric.png", // Matches client/public/products/turmeric.jpg
    benefits: "High Curcumin Content • Immunity Booster",
    description: "Our Turmeric is sourced from the finest farms in Salem. Stone-ground to preserve natural oils and the potent active compound Curcumin. No artificial colors, just pure golden goodness.",
    price: 165, 
    originalPrice: 250,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 165, originalPrice: 250 },
      { weight: "250g", price: 90, originalPrice: 130 }
    ]
  },
  {
    name: "Premium Red Chilli Powder",
    slug: "kashmiri-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/chilli.png",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description: "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 174,
    originalPrice: 275,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 174, originalPrice: 275 },
      { weight: "250g", price: 93, originalPrice: 140 }
    ]
  },
  {
    name: "Jodhpur Red Chilli Powder",
    slug: "jodhpuri-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/jodhpurichilli.jpg",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description: "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 120,
    originalPrice: 160,
    countInStock: 50,
    variants: [
      { weight: "250g", price: 120, originalPrice: 160 },
      { weight: "500g", price: 230, originalPrice: 320 }
    ]
  },
  {
    name: "Teja Red Chilli Powder",
    slug: "teja-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/tejachilli.jpg",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description: "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 120,
    originalPrice: 160,
    countInStock: 50,
    variants: [
      { weight: "250g", price: 120, originalPrice: 160 },
      { weight: "500g", price: 230, originalPrice: 320 }
    ]
  },
  {
    name: "Coriander Powder (Dhaniya)",
    slug: "coriander-powder",
    category: "Spices",
    tag: "",
    image: "/products/coriander.png",
    benefits: "Fresh Aroma • Digestive Aid",
    description: "Made from roasted coriander seeds to release a citrusy, nutty flavor. Essential for thickening gravies and adding a fresh aroma to Indian dishes.",
    price: 102,
    originalPrice: 150,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 102, originalPrice: 150 },
      { weight: "250g", price: 80, originalPrice: 110 }
    ]
  },
  {
    name: "Chakki Fresh Atta",
    slug: "mp-sharbati-atta",
    category: "Wheat Flour",
    tag: "Premium",
    image: "/products/wheat.jpg",
    benefits: "100% MP Sharbati • Soft Rotis for 12hrs",
    description: "The gold standard of wheat. Our Sharbati wheat is sourced from Sehore, MP. Stone-ground (Chakki Fresh) to ensure the bran and germ are intact for maximum fiber.",
    price: 350,
    originalPrice: 450,
    countInStock: 20,
    variants: [
      { weight: "5kg", price: 350, originalPrice: 450 },
      { weight: "10kg", price: 680, originalPrice: 900 }
    ]
  },
  {
    name: "Brown Atta",
    slug: "parosa-brown-atta",
    category: "Wheat Flour",
    tag: "Premium",
    image: "/products/wheat.jpg",
    benefits: "100% MP Sharbati • Soft Rotis for 12hrs",
    description: "The gold standard of wheat. Our Sharbati wheat is sourced from Sehore, MP. Stone-ground (Chakki Fresh) to ensure the bran and germ are intact for maximum fiber.",
    price: 350,
    originalPrice: 450,
    countInStock: 20,
    variants: [
      { weight: "5kg", price: 350, originalPrice: 450 },
      { weight: "10kg", price: 680, originalPrice: 900 }
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 200ML",
    slug: "mustard-oil-200",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "200ML", price: 247, originalPrice: 347 }
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 500ML",
    slug: "mustard-oil-500",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "500ML", price: 247, originalPrice: 347 },
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 1L",
    slug: "mustard-oil-1000",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard1.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "1L", price: 247, originalPrice: 347 }
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 2L",
    slug: "mustard-oil-2000",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "1L", price: 247, originalPrice: 347 }
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 5L",
    slug: "mustard-oil-5000",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard5.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "1L", price: 247, originalPrice: 347 }
    ]
  },
  {
    name: "Cold Pressed Mustard Oil 15L",
    slug: "mustard-oil-15l",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard15.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "15L", price: 247, originalPrice: 347 }
    ]
  },
  {
    name: "Multigrain Flour",
    slug: "multigrain-atta",
    category: "Wheat Flour",
    tag: "High Fiber",
    image: "/products/multigrain.jpg",
    benefits: "7 Grains Mix • Low GI • Diabetic Friendly",
    description: "A powerful blend of Wheat, Oats, Ragi, Chana, Maize, Barley, and Soy. Perfect for those looking to add more fiber and protein to their daily diet.",
    price: 400,
    originalPrice: 500,
    countInStock: 25,
    variants: [
      { weight: "5kg", price: 400, originalPrice: 500 }
    ]
  }
];

module.exports = products;