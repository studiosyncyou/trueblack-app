// Complete Menu Data for Travertine Coffee Shops
// Placeholder prices - update with actual prices later

export const menuItems = [
  // TOASTS
  {
    id: 't1',
    name: 'Black Hummus Toast (Mushroom)',
    category: 'Toasts',
    type: 'veg',
    price: 240,
    description: 'Rich black hummus with sautéed mushrooms on artisan toast',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 8,
    calories: 280,
    customizations: {
      extras: [
        { name: 'Extra Hummus', price: 40 },
        { name: 'Extra Mushrooms', price: 50 },
      ],
    },
  },
  {
    id: 't2',
    name: 'Black Hummus Toast (Chicken)',
    category: 'Toasts',
    type: 'non-veg',
    price: 280,
    description: 'Rich black hummus with grilled chicken on artisan toast',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 10,
    calories: 320,
    customizations: {
      extras: [
        { name: 'Extra Hummus', price: 40 },
        { name: 'Extra Chicken', price: 60 },
      ],
    },
  },
  {
    id: 't3',
    name: 'Avocado Toast',
    category: 'Toasts',
    type: 'veg',
    price: 290,
    description: 'Fresh smashed avocado with cherry tomatoes on sourdough',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 7,
    calories: 310,
    new: true,
    customizations: {
      extras: [
        { name: 'Poached Egg', price: 50 },
        { name: 'Feta Cheese', price: 60 },
      ],
    },
  },
  {
    id: 't4',
    name: 'Eggs on Toast',
    category: 'Toasts',
    type: 'egg',
    price: 180,
    description: 'Classic scrambled eggs on buttered toast',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 6,
    calories: 240,
    customizations: {
      style: [
        { name: 'Scrambled', price: 0 },
        { name: 'Sunny Side Up', price: 0 },
        { name: 'Poached', price: 20 },
      ],
    },
  },
  {
    id: 't5',
    name: 'Minced Chicken Toast',
    category: 'Toasts',
    type: 'non-veg',
    price: 260,
    description: 'Spiced minced chicken with herbs on toasted bread',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 10,
    calories: 340,
  },
  {
    id: 't6',
    name: 'Red Pepper Hummus Toast',
    category: 'Toasts',
    type: 'veg',
    price: 220,
    description: 'Roasted red pepper hummus on multigrain toast',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 7,
    calories: 260,
    customizations: {
      extras: [
        { name: 'Extra Hummus', price: 40 },
      ],
    },
  },
  {
    id: 't7',
    name: 'Egg Benedict Toast',
    category: 'Toasts',
    type: 'egg',
    price: 320,
    description: 'Poached eggs with hollandaise sauce on English muffin',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 12,
    calories: 380,
    new: true,
  },

  // SANDWICHES
  {
    id: 's1',
    name: 'Chicken Salad Sandwich',
    category: 'Sandwiches',
    type: 'non-veg',
    price: 280,
    description: 'Tender chicken salad with crisp lettuce on fresh bread',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 8,
    calories: 350,
  },
  {
    id: 's2',
    name: 'Veg Sandwich',
    category: 'Sandwiches',
    type: 'veg',
    price: 200,
    description: 'Fresh vegetables with herbs and mayo',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 6,
    calories: 280,
  },
  {
    id: 's3',
    name: 'Pepperoni Focaccia Sandwich',
    category: 'Sandwiches',
    type: 'non-veg',
    price: 340,
    description: 'Spicy pepperoni with mozzarella on focaccia bread',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 10,
    calories: 420,
    new: true,
  },
  {
    id: 's4',
    name: 'Pesto Paneer Focaccia Sandwich',
    category: 'Sandwiches',
    type: 'veg',
    price: 300,
    description: 'Grilled paneer with basil pesto on focaccia',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 10,
    calories: 380,
  },
  {
    id: 's5',
    name: 'Chicken Ham Focaccia Sandwich',
    category: 'Sandwiches',
    type: 'non-veg',
    price: 360,
    description: 'Smoked chicken ham with cheese on focaccia',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 10,
    calories: 400,
  },

  // BOWLS
  {
    id: 'b1',
    name: 'Pesto Grilled Chicken Bowl',
    category: 'Bowls',
    type: 'non-veg',
    price: 380,
    description: 'Grilled chicken with pesto, quinoa, and fresh vegetables',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 15,
    calories: 450,
  },
  {
    id: 'b2',
    name: 'Pesto Grilled Paneer Bowl',
    category: 'Bowls',
    type: 'veg',
    price: 340,
    description: 'Grilled paneer with pesto, quinoa, and fresh vegetables',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 15,
    calories: 420,
  },
  {
    id: 'b3',
    name: 'Chocolate Smoothie',
    category: 'Bowls',
    type: 'veg',
    price: 280,
    description: 'Rich chocolate smoothie with banana and dates',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 320,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Large (480ml)', price: 60 },
      ],
      extras: [
        { name: 'Protein Powder', price: 80 },
        { name: 'Extra Chocolate', price: 40 },
      ],
    },
  },
  {
    id: 'b4',
    name: 'Green Smoothie',
    category: 'Bowls',
    type: 'veg',
    price: 260,
    description: 'Healthy green smoothie with spinach, apple, and cucumber',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 5,
    calories: 180,
    new: true,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Large (480ml)', price: 60 },
      ],
    },
  },
  {
    id: 'b5',
    name: 'Yogurt Bowl',
    category: 'Bowls',
    type: 'veg',
    price: 240,
    description: 'Greek yogurt with granola, honey, and fresh fruits',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 280,
  },
  {
    id: 'b6',
    name: 'Berry Smoothie',
    category: 'Bowls',
    type: 'veg',
    price: 280,
    description: 'Mixed berry smoothie with yogurt and honey',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 240,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Large (480ml)', price: 60 },
      ],
    },
  },

  // BURGERS
  {
    id: 'bg1',
    name: 'Grilled Chicken Burger',
    category: 'Burgers',
    type: 'non-veg',
    price: 340,
    description: 'Juicy grilled chicken patty with lettuce, tomato, and special sauce',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 12,
    calories: 480,
    customizations: {
      extras: [
        { name: 'Extra Cheese', price: 50 },
        { name: 'Bacon', price: 80 },
        { name: 'Extra Patty', price: 120 },
      ],
    },
  },
  {
    id: 'bg2',
    name: 'Veg Burger',
    category: 'Burgers',
    type: 'veg',
    price: 280,
    description: 'Crispy veggie patty with fresh vegetables and sauces',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 10,
    calories: 420,
    customizations: {
      extras: [
        { name: 'Extra Cheese', price: 50 },
        { name: 'Extra Patty', price: 100 },
      ],
    },
  },

  // BEVERAGES
  {
    id: 'bv1',
    name: 'OG Cold Coffee Creme',
    category: 'Beverages',
    type: 'veg',
    price: 240,
    description: 'Original cold coffee with whipped cream',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 280,
    new: true,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
        { name: 'Large (600ml)', price: 80 },
      ],
      sugar: [
        { name: 'No Sugar', price: 0 },
        { name: 'Less Sugar', price: 0 },
        { name: 'Regular Sugar', price: 0 },
        { name: 'Extra Sugar', price: 0 },
      ],
    },
  },
  {
    id: 'bv2',
    name: 'Matcha Creme',
    category: 'Beverages',
    type: 'veg',
    price: 280,
    description: 'Smooth matcha latte with vanilla cream',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 240,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
      temperature: [
        { name: 'Iced', price: 0 },
        { name: 'Hot', price: 0 },
      ],
    },
  },
  {
    id: 'bv3',
    name: 'Brookie Creme',
    category: 'Beverages',
    type: 'veg',
    price: 300,
    description: 'Brownie and cookie blended with cream',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 6,
    calories: 380,
    new: true,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
    },
  },
  {
    id: 'bv4',
    name: 'Hazelnut Creme',
    category: 'Beverages',
    type: 'veg',
    price: 280,
    description: 'Smooth hazelnut coffee with whipped cream',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 300,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
    },
  },
  {
    id: 'bv5',
    name: 'Peanut Butter Creme',
    category: 'Beverages',
    type: 'veg',
    price: 290,
    description: 'Rich peanut butter coffee with cream',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 5,
    calories: 340,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
    },
  },
  {
    id: 'bv6',
    name: 'True Chocolate Hot',
    category: 'Beverages',
    type: 'veg',
    price: 220,
    description: 'Rich hot chocolate with marshmallows',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 280,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Large (480ml)', price: 50 },
      ],
      extras: [
        { name: 'Extra Marshmallows', price: 30 },
        { name: 'Whipped Cream', price: 40 },
      ],
    },
  },
  {
    id: 'bv7',
    name: 'Matcha Latte (Iced)',
    category: 'Beverages',
    type: 'veg',
    price: 260,
    description: 'Refreshing iced matcha latte',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 4,
    calories: 200,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
      milk: [
        { name: 'Whole Milk', price: 0 },
        { name: 'Oat Milk', price: 40 },
        { name: 'Almond Milk', price: 40 },
      ],
    },
  },
  {
    id: 'bv8',
    name: 'Matcha Latte (Hot)',
    category: 'Beverages',
    type: 'veg',
    price: 260,
    description: 'Warm matcha latte with steamed milk',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 5,
    calories: 200,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Large (480ml)', price: 50 },
      ],
      milk: [
        { name: 'Whole Milk', price: 0 },
        { name: 'Oat Milk', price: 40 },
        { name: 'Almond Milk', price: 40 },
      ],
    },
  },
  {
    id: 'bv9',
    name: 'Strawberry Latte',
    category: 'Beverages',
    type: 'veg',
    price: 280,
    description: 'Sweet strawberry latte with cream',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 5,
    calories: 260,
    new: true,
    customizations: {
      size: [
        { name: 'Regular (360ml)', price: 0 },
        { name: 'Medium (480ml)', price: 50 },
      ],
      temperature: [
        { name: 'Iced', price: 0 },
        { name: 'Hot', price: 0 },
      ],
    },
  },

  // BAKED GOODS & DESSERTS
  {
    id: 'd1',
    name: 'Basque Cheese Cake',
    category: 'Desserts',
    type: 'veg',
    price: 320,
    description: 'Creamy burnt Basque style cheesecake',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 3,
    calories: 380,
    new: true,
  },
  {
    id: 'd2',
    name: 'Cinnamon Roll',
    category: 'Desserts',
    type: 'veg',
    price: 180,
    description: 'Soft cinnamon roll with cream cheese frosting',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 2,
    calories: 320,
    customizations: {
      temperature: [
        { name: 'Room Temp', price: 0 },
        { name: 'Warmed', price: 0 },
      ],
    },
  },
  {
    id: 'd3',
    name: 'Lemon Poppyseed Slice',
    category: 'Desserts',
    type: 'veg',
    price: 200,
    description: 'Zesty lemon cake with poppyseeds',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 2,
    calories: 280,
  },
  {
    id: 'd4',
    name: 'Triple Chocochunk Cookie',
    category: 'Desserts',
    type: 'veg',
    price: 160,
    description: 'Triple chocolate chunk cookie',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 2,
    calories: 340,
    pairs: ['bv1', 'bv6'], // Pairs with OG Cold Coffee and True Chocolate Hot
  },
  {
    id: 'd5',
    name: 'Chocochunk Cookie',
    category: 'Desserts',
    type: 'veg',
    price: 140,
    description: 'Classic chocolate chunk cookie',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 2,
    calories: 300,
    pairs: ['bv1', 'bv6'],
  },
  {
    id: 'd6',
    name: 'Banana Walnut Slice',
    category: 'Desserts',
    type: 'veg',
    price: 190,
    description: 'Moist banana bread with walnuts',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 2,
    calories: 280,
  },
  {
    id: 'd7',
    name: 'Chocolate Pecan Bun',
    category: 'Desserts',
    type: 'veg',
    price: 200,
    description: 'Sweet chocolate bun with pecans',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 2,
    calories: 340,
  },
  {
    id: 'd8',
    name: 'Hazelnut Chocolate Slice',
    category: 'Desserts',
    type: 'veg',
    price: 220,
    description: 'Rich hazelnut chocolate cake slice',
    image: 'placeholder',
    popular: false,
    available: true,
    prepTime: 2,
    calories: 360,
  },
  {
    id: 'd9',
    name: 'Double Layer Chocolate Cake',
    category: 'Desserts',
    type: 'veg',
    price: 280,
    description: 'Decadent double layer chocolate cake',
    image: 'placeholder',
    popular: true,
    available: true,
    prepTime: 3,
    calories: 420,
    new: true,
  },
];

export const categories = [
  { id: 'all', name: 'All Items', icon: '📋' },
  { id: 'toasts', name: 'Toasts', icon: '🍞' },
  { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
  { id: 'bowls', name: 'Bowls', icon: '🥗' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'beverages', name: 'Beverages', icon: '☕' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
];

// Helper functions
export const getItemsByCategory = (category) => {
  if (category === 'all' || category === 'All Items') {
    return menuItems;
  }
  return menuItems.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
};

export const getItemsByType = (type) => {
  if (!type || type === 'all') return menuItems;
  return menuItems.filter(item => item.type === type);
};

export const searchItems = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return menuItems.filter(item =>
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getPopularItems = () => {
  return menuItems.filter(item => item.popular);
};

export const getNewItems = () => {
  return menuItems.filter(item => item.new);
};

export const getItemById = (id) => {
  return menuItems.find(item => item.id === id);
};

export const getItemsThatPairWith = (itemId) => {
  const item = getItemById(itemId);
  if (!item || !item.pairs) return [];
  return item.pairs.map(id => getItemById(id)).filter(Boolean);
};

// Get suggested pairings for any item
export const getSuggestedPairings = (itemId) => {
  const item = getItemById(itemId);
  if (!item) return [];
  
  // If item has specific pairs defined
  if (item.pairs && item.pairs.length > 0) {
    return getItemsThatPairWith(itemId);
  }
  
  // Otherwise suggest popular items from different categories
  const otherCategories = menuItems.filter(
    i => i.category !== item.category && i.popular
  );
  
  return otherCategories.slice(0, 3);
};

export default menuItems;
