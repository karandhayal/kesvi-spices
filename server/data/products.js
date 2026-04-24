const products = [
  {
    name: "Premium Turmeric Powder",
    slug: "turmeric-powder",
    category: "Spices",
    tag: "Best Seller",
    image: "/products/turmeric.png",
    benefits: "High Curcumin Content • Immunity Booster",
    description:
      "Our Turmeric is sourced from the finest farms in Salem. Stone-ground to preserve natural oils and the potent active compound Curcumin. No artificial colors, just pure golden goodness.",
    price: 367,
    originalPrice: 524,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 184, originalPrice: 263 },
      { weight: "100g", price: 38, originalPrice: 54 },
      { weight: "200g", price: 74, originalPrice: 106 },
      { weight: "1KG", price: 367, originalPrice: 524 }
    ]
  },

  {
    name: "Premium Red Chilli Powder",
    slug: "kashmiri-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/chilli.png",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description:
      "Hand-picked Kashmiri chillies known for their deep red color and mild heat. Perfect for adding a rich hue to your curries without overwhelming spice levels.",
    price: 358,
    originalPrice: 511,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 179, originalPrice: 256 },
      { weight: "100g", price: 37, originalPrice: 53 },
      { weight: "200g", price: 72, originalPrice: 103 },
      { weight: "1KG", price: 358, originalPrice: 511 }
    ]
  },

  {
    name: "Coriander Powder (Dhaniya)",
    slug: "coriander-powder",
    category: "Spices",
    tag: "",
    image: "/products/coriander.png",
    benefits: "Fresh Aroma • Digestive Aid",
    description:
      "Made from roasted coriander seeds to release a citrusy, nutty flavor. Essential for thickening gravies and adding a fresh aroma to Indian dishes.",
    price: 274,
    originalPrice: 392,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 137, originalPrice: 196 },
      { weight: "100g", price: 29, originalPrice: 41 },
      { weight: "200g", price: 55, originalPrice: 79 },
      { weight: "1KG", price: 274, originalPrice: 392 }
    ]
  },

  {
    name: "Jodhpur Red Chilli Powder",
    slug: "jodhpuri-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/jodhpuri-chilli.png",
    benefits: "Rich Color • Low Heat • 100% Natural",
    description:
      "Hand-picked Jodhpur chillies known for their deep red color and balanced heat. Ideal for everyday Indian cooking.",
    price: 389,
    originalPrice: 556,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 195, originalPrice: 279 },
      { weight: "100g", price: 40, originalPrice: 57 },
      { weight: "200g", price: 78, originalPrice: 111 },
      { weight: "1KG", price: 389, originalPrice: 556 }
    ]
  },

  {
    name: "Teja Red Chilli Powder",
    slug: "teja-chilli-powder",
    category: "Spices",
    tag: "Vibrant Color",
    image: "/products/teja-chilli.png",
    benefits: "High Heat • Rich Color • 100% Natural",
    description:
      "Teja chillies are known for their strong heat and vibrant red color. Perfect for spicy curries and masalas.",
    price: 368,
    originalPrice: 526,
    countInStock: 50,
    variants: [
      { weight: "500g", price: 184, originalPrice: 263 },
      { weight: "100g", price: 38, originalPrice: 54 },
      { weight: "200g", price: 74, originalPrice: 106 },
      { weight: "1KG", price: 368, originalPrice: 526 }
    ]
  },

  {
    name: "Chakki Fresh Atta",
    slug: "mp-sharbati-atta",
    category: "Wheat Flour",
    tag: "Premium",
    image: "/products/chakki-fresh-atta.png",
    benefits: "100% MP Sharbati • Soft Rotis for 12hrs",
    description:
      "The gold standard of wheat. Our Sharbati wheat is sourced from Sehore, MP. Stone-ground (Chakki Fresh) to ensure the bran and germ are intact.",
    price: 350,
    originalPrice: 450,
    countInStock: 20,
    variants: [
      { weight: "5kg", price: 449, originalPrice: 499 },
      { weight: "10kg", price: 810, originalPrice: 999 }
    ]
  },

  {
    name: "Brown Atta",
    slug: "parosa-brown-atta",
    category: "Wheat Flour",
    tag: "Premium",
    image: "/products/brown-atta.png",
    benefits: "High Fiber • Easy Digestion",
    description:
      "Nutritious brown atta made from whole wheat grains retaining natural fiber and nutrients.",
    price: 350,
    originalPrice: 450,
    countInStock: 20,
    variants: [
      { weight: "5kg", price: 499, originalPrice: 599 },
      { weight: "10kg", price: 850, originalPrice: 1199 }
    ]
  },

  {
    name: "Cold Pressed Mustard Oil",
    slug: "mustard-oil-bottle",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description:
      "Extracted using traditional wood-pressed (Kachi Ghani) method. Unrefined and rich in natural antioxidants.",
    price: 270,
    originalPrice: 347,
    countInStock: 30,
    variants: [
      { weight: "500ML", price: 270, originalPrice: 347 },
      { weight: "1L", price: 520, originalPrice: 695 },
      { weight: "2L", price: 999, originalPrice: 1350 }
    ]
  },

  {
    name: "Cold Pressed Mustard Oil 5L",
    slug: "mustard-oil-5000",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard5.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description:
      "Economical 5L pack of traditional Kachi Ghani mustard oil.",
    price: 999,
    originalPrice: 1400,
    countInStock: 30,
    variants: [{ weight: "5L", price: 999, originalPrice: 1400 }]
  },

  {
    name: "Cold Pressed Mustard Oil 15L",
    slug: "mustard-oil-15l",
    category: "Mustard Oil",
    tag: "Kachi Ghani",
    image: "/products/mustard15.png",
    benefits: "Cold Pressed • High Pungency • Heart Healthy",
    description:
      "Bulk 15L pack for families and commercial kitchens.",
    price: 2950,
    originalPrice: 3800,
    countInStock: 30,
    variants: [{ weight: "15L", price: 2950, originalPrice: 3800 }]
  },

  {
    name: "Multigrain Flour",
    slug: "multigrain-atta",
    category: "Wheat Flour",
    tag: "High Fiber",
    image: "/products/multigrain-atta.png",
    benefits: "7 Grains Mix • Low GI • Diabetic Friendly",
    description:
      "A healthy blend of Wheat, Oats, Ragi, Chana, Maize, Barley, and Soy.",
    price: 400,
    originalPrice: 500,
    countInStock: 25,
    variants: [{ weight: "5kg", price: 699, originalPrice: 850}]
  }
];

module.exports = products;
