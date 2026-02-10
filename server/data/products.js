const products = [
  {
    name: "Premium Turmeric Powder",
    slug: "turmeric-powder",
    category: "Spices",
    tag: "Best Seller",
    image: "/products/turmeric.png", // Matches client/public/products/turmeric.jpg
    benefits: "High Curcumin Content • Immunity Booster",
    description: "Our Turmeric is sourced from the finest farms in Salem. Stone-ground to preserve natural oils and the potent active compound Curcumin. No artificial colors, just pure golden goodness.",
    price: 345, 
    originalPrice: 460,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 174, originalPrice: 232 },
      { weight: "100g", price: 35, originalPrice: 47 },
      { weight: "200g", price: 70, originalPrice: 94 },
      { weight: "1KG", price: 345, originalPrice: 460 }
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
    price: 169,
    originalPrice: 230,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 169, originalPrice: 230 },
      { weight: "100g", price: 35, originalPrice: 47 },
      { weight: "200g", price: 69, originalPrice: 92 },
      { weight: "1KG", price: 332, originalPrice: 443 }
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
      { weight: "500g", price: 174, originalPrice: 232 },
      { weight: "100g", price: 35, originalPrice: 47 },
      { weight: "200g", price: 70, originalPrice: 94 },
      { weight: "1KG", price: 345, originalPrice: 460 }
    ]
  },
  {
    name: "Chakki Fresh Atta",
    slug: "mp-sharbati-atta",
    category: "Wheat Flour",
    tag: "Premium",
    image: "/products/chakki-fresh-atta.png",
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
    image: "/products/brown-atta.png",
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
    name: "Cold Pressed Mustard Oil",
    slug: "mustard-oil-bottle",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description: "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined, unbleached, and full of natural antioxidants and strong aroma.",
    price: 247,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "1L", price: 270, originalPrice: 347 },
      { weight: "200ML", price: 270, originalPrice: 347 },
      { weight: "500ML", price: 270, originalPrice: 347 },
      { weight: "2L", price: 270, originalPrice: 347 }
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
    price: 999,
    originalPrice: 1400,
    countInStock: 30,
    variants: [
      { weight: "5L", price: 999, originalPrice: 1400 }
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
    price: 2950,
    originalPrice: 3800,
    countInStock: 30,
    variants: [
      { weight: "15L", price: 2950, originalPrice: 3800 }
    ]
  },
  {
    name: "Multigrain Flour",
    slug: "multigrain-atta",
    category: "Wheat Flour",
    tag: "High Fiber",
    image: "/products/multigrain-atta.png",
    benefits: "7 Grains Mix • Low GI • Diabetic Friendly",
    description: "A powerful blend of Wheat, Oats, Ragi, Chana, Maize, Barley, and Soy. Perfect for those looking to add more fiber and protein to their daily diet.",
    price: 400,
    originalPrice: 500,
    countInStock: 25,
    variants: [
      { weight: "5kg", price: 400, originalPrice: 500 }
    ]
  },
  {
    name: "Jodhpur Red Chilli Powder",
    slug: "jodhpuri-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/jodhpuri-chilli.png",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description: "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 190,
    originalPrice: 280,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 190, originalPrice: 280 },
      { weight: "1KG", price: 378, originalPrice: 550 },
      { weight: "100g", price: 42, originalPrice: 55 },
      { weight: "200g", price: 80, originalPrice: 115 },
      { weight: "1KG", price: 378, originalPrice: 550 }
    ]
  },
  {
    name: "Teja Red Chilli Powder",
    slug: "teja-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/teja-chilli.png",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description: "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 185,
    originalPrice: 256,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 185, originalPrice: 256 },
      { weight: "100g", price: 40, originalPrice: 50 },
      { weight: "200g", price: 75, originalPrice: 105 },
      { weight: "1KG", price: 368, originalPrice: 491 }
    ]
  }
];

module.exports = products;