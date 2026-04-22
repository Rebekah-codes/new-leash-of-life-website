// PRODUCT DATABASE
const placeholderProductImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' rx='32' fill='%23f4efe7'/%3E%3Crect x='56' y='56' width='528' height='368' rx='24' fill='%23ffffff' stroke='%23d8c9ba' stroke-width='6' stroke-dasharray='18 14'/%3E%3Cpath d='M188 316l66-72 66 56 92-112 120 144' fill='none' stroke='%23846a5c' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='226' cy='170' r='34' fill='%23c8a98e'/%3E%3Ctext x='320' y='386' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-size='34' fill='%23846a5c'%3EPet product image%3C/text%3E%3C/svg%3E";

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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
    image: placeholderProductImage,
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
