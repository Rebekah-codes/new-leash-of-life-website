// PRODUCT DATABASE
const products = [
    {
        id: 1,
        name: "Handmade Rope Toy",
        price: 6.99,
        category: "Toys",
        image: "/assets/images/rope-toy.jpg",
        description: "Durable handmade rope toy perfect for small and medium dogs."
    },
    {
        id: 2,
        name: "Natural Chicken Treats",
        price: 4.50,
        category: "Treats",
        image: "/assets/images/chicken-treats.jpg",
        description: "100% natural chicken treats with no additives."
    },
    {
        id: 3,
        name: "Soft Plush Duck",
        price: 8.99,
        category: "Toys",
        image: "/assets/images/plush-duck.jpg",
        description: "A soft plush duck toy that dogs love to cuddle and carry."
    }
];

// Get unique categories
function getCategories() {
    const cats = products.map(p => p.category);
    return ["All", ...new Set(cats)];
}
