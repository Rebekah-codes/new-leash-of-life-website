// PRODUCT DATABASE
const products = [
  {
    id: 1,
    name: "Natural Chicken Training Treats 200g",
    price: 4.5,
    oldPrice: 5.29,
    unitPrice: "£22.50 / kg",
    rating: 4.8,
    reviews: 124,
    petType: "Dog",
    category: "Food & Treats",
    brand: "Natures Menu",
    collections: ["Offers", "Price Drop"],
    image: "/assets/images/chicken-treats.jpg",
    description:
      "100% natural chicken treats with no additives for positive reinforcement.",
  },
  {
    id: 2,
    name: "Grain-Free Adult Salmon Kibble 2kg",
    price: 16.99,
    oldPrice: 19.49,
    unitPrice: "£8.50 / kg",
    rating: 4.6,
    reviews: 89,
    petType: "Dog",
    category: "Food & Treats",
    brand: "KONG",
    collections: ["New Lines"],
    image: "/assets/images/rope-toy.jpg",
    description: "Digestive-friendly complete food with salmon and botanicals.",
  },
  {
    id: 3,
    name: "Reflective Walk Lead",
    price: 12.99,
    oldPrice: 14.99,
    unitPrice: "£12.99 / unit",
    rating: 4.5,
    reviews: 61,
    petType: "Dog",
    category: "Accessories",
    brand: "Ancol",
    collections: ["Offers"],
    image: "/assets/images/plush-duck.jpg",
    description:
      "Comfort grip lead with reflective weave for safer evening walks.",
  },
  {
    id: 4,
    name: "Anti-Slip Pet Feeding Mat",
    price: 7.49,
    oldPrice: 9.99,
    unitPrice: "£7.49 / unit",
    rating: 4.3,
    reviews: 47,
    petType: "Cat",
    category: "Accessories",
    brand: "Rosewood",
    collections: ["Clearance"],
    image: "/assets/images/rope-toy.jpg",
    description:
      "Easy-wipe silicone feeding mat to keep floors clean at mealtimes.",
  },
  {
    id: 5,
    name: "Sensitive Skin Oatmeal Shampoo",
    price: 9.99,
    oldPrice: 11.49,
    unitPrice: "£19.98 / l",
    rating: 4.7,
    reviews: 96,
    petType: "Dog",
    category: "Health & Hygiene",
    brand: "Hurtta",
    collections: ["Seasonal"],
    image: "/assets/images/chicken-treats.jpg",
    description:
      "Soothing wash formulated for pets with dry or irritated skin.",
  },
  {
    id: 6,
    name: "Dental Care Chew Sticks",
    price: 5.99,
    oldPrice: 6.79,
    unitPrice: "£39.93 / kg",
    rating: 4.2,
    reviews: 58,
    petType: "Dog",
    category: "Health & Hygiene",
    brand: "SportsPet",
    collections: ["Price Drop"],
    image: "/assets/images/plush-duck.jpg",
    description:
      "Daily dental chews that help reduce plaque and freshen breath.",
  },
  {
    id: 7,
    name: "Odour Control Clumping Litter 10L",
    price: 11.49,
    oldPrice: 13.99,
    unitPrice: "£1.15 / l",
    rating: 4.9,
    reviews: 312,
    petType: "Cat",
    category: "Litter & Bedding",
    brand: "Rosewood",
    collections: ["Best Seller"],
    image: "/assets/images/rope-toy.jpg",
    description:
      "Fast-clumping cat litter with long-lasting odour lock technology.",
  },
  {
    id: 8,
    name: "Calming Pet Bed Medium",
    price: 22.99,
    oldPrice: 27.99,
    unitPrice: "£22.99 / unit",
    rating: 4.4,
    reviews: 76,
    petType: "Cat",
    category: "Litter & Bedding",
    brand: "Natures Menu",
    collections: ["New Lines", "Offers"],
    image: "/assets/images/plush-duck.jpg",
    description:
      "Soft donut-style bed designed for warmth, comfort, and deep sleep.",
  },
];

// Get unique categories
function getCategories() {
  const cats = products.map((p) => p.category);
  return ["all", ...new Set(cats)];
}

function getBrands() {
  return [...new Set(products.map((p) => p.brand))];
}
