// TRUE BLACK - Complete Store Menus
// All 5 Locations with Real Images
// Production Ready - November 2025

// ===========================================
// IMAGE HELPER with Fallback Icons
// ===========================================

const getMenuImage = (imageName, category) => {
  const images = {
    // Espresso Hot
    'shot': require('../assets/images/menu/shot.jpg'),
    'long-black': require('../assets/images/menu/long-black.jpg'),
    'cortado': require('../assets/images/menu/cortado.jpg'),
    'flat-white': require('../assets/images/menu/flat-white.jpg'),
    'cappuccino': require('../assets/images/menu/cappuccino.jpg'),
    'latte': require('../assets/images/menu/latte.jpg'),
    'spanish-latte': require('../assets/images/menu/spanish-latte.jpg'),
    'true-mocha': require('../assets/images/menu/true-mocha.jpg'),
    
    // Espresso Iced
    'dirty-coffee': require('../assets/images/menu/dirty-coffee.jpg'),
    'iced-latte': require('../assets/images/menu/iced-latte.jpg'),
    'true-vanilla-latte': require('../assets/images/menu/true-vanilla-latte.jpg'),
    'true-mocha-iced': require('../assets/images/menu/true-mocha-iced.jpg'),
    'vietnamese-latte': require('../assets/images/menu/vietnamese-latte.jpg'),
    'cranberry-espresso': require('../assets/images/menu/cranberry-espresso.jpg'),
    'valencia-orange-coffee': require('../assets/images/menu/valencia-orange-coffee.jpg'),
    'espresso-tonic': require('../assets/images/menu/espresso-tonic.jpg'),
    
    // Cold Brew
    'cold-brew': require('../assets/images/menu/cold-brew.jpg'),
    'vanilla-cream-cold-brew': require('../assets/images/menu/vanilla-cream-cold-brew.jpg'),
    'toffee-nut-cold-brew': require('../assets/images/menu/toffee-nut-cold-brew.jpg'),
    'nitro-cold-brew': require('../assets/images/menu/nitro-cold-brew.jpg'),
    
    // Cremes
    'og-gold-coffee': require('../assets/images/menu/og-cold-coffee.jpg'),
    'peanut-butter-creme': require('../assets/images/menu/peanut-butter-creme.jpg'),
    'brookie': require('../assets/images/menu/brookie.jpg'),
    'hazelnut-creme': require('../assets/images/menu/hazelnut-creme.jpg'),
    'matcha-creme': require('../assets/images/menu/matcha-creme.jpg'),
    
    // Smoothie Bowls - Fixed to match item calls
    'berry-bowl': require('../assets/images/menu/berry.jpg'),
    'chocolate-bowl': require('../assets/images/menu/chocolate.jpg'),
    'green-bowl': require('../assets/images/menu/green.jpg'),
    'yogurt-bowl': require('../assets/images/menu/yogurt.jpg'),
    
    // Non Coffee/Tea - Added all missing mappings
    'hot-chocolate': require('../assets/images/menu/hot-chocolate.jpg'),
    'strawberry-latte': require('../assets/images/menu/strawberry-latte.jpg'),
    'kombu-inf-iced': require('../assets/images/item-default.jpg'),
    'rose-oolong-iced': require('../assets/images/menu/rose-oolong-iced.jpg'),
    'orange-refresher-iced': require('../assets/images/item-default.jpg'),
    'chamomile-tea': require('../assets/images/item-default.jpg'),
    'turmeric-ginger': require('../assets/images/item-default.jpg'),
    'blossom-chai': require('../assets/images/item-default.jpg'),
    'watermelon-juice': require('../assets/images/item-default.jpg'),
    'orange-juice': require('../assets/images/item-default.jpg'),
    
    // Matcha
    'matcha-latte-hot': require('../assets/images/menu/matcha-latte-hot.jpg'),
    'matcha-latte-iced': require('../assets/images/menu/matcha-latte-iced.jpg'),
    'cocoa-matcha': require('../assets/images/menu/cocoa-matcha.jpg'),
    
    // Breakfast Toast - Added missing mappings
    'avocado-toast': require('../assets/images/menu/avocado-toast.jpg'),
    'black-summer-toast': require('../assets/images/menu/black-hummus-chicken-toast.jpg'),
    'red-pepper-hummus-toast': require('../assets/images/item-default.jpg'),
    'eggplant-toast': require('../assets/images/menu/eggplant-toast.jpg'),
    'eggs-on-toast': require('../assets/images/menu/eggs-on-toast.jpg'),
    'tumago-egg-toast': require('../assets/images/item-default.jpg'),
    'pesto-chicken-toast': require('../assets/images/menu/pesto-chicken-toast.jpg'),
    
    // French Toast
    'french-toast-original': require('../assets/images/menu/french-toast-original.jpg'),
    'french-toast-chocolate': require('../assets/images/menu/french-toast-chocolate.jpg'),
    'french-toast-tiramisu': require('../assets/images/menu/french-toast-tiramisu.jpg'),
    
    // Burgers
    'veg-burger': require('../assets/images/menu/veg-burger.jpg'),
    'grilled-chicken-burger': require('../assets/images/menu/grilled-chicken-burger.jpg'),
    'crispy-chicken-burger': require('../assets/images/menu/crispy-chicken-burger.jpg'),
    
    // Sandwiches
    'veg-sandwich': require('../assets/images/menu/veg-sandwich.jpg'),
    'chicken-salad-sandwich': require('../assets/images/menu/chicken-salad-sandwich.jpg'),
    
    // Focaccia
    'spiced-honey-bean-focaccia': require('../assets/images/menu/spiced-bean-focaccia.jpg'),
    'pesto-paneer-focaccia': require('../assets/images/menu/pesto-paneer-focaccia.jpg'),
    'pepperoni-focaccia': require('../assets/images/menu/pepperoni-focaccia.jpg'),
    'chicken-ham-focaccia': require('../assets/images/menu/chicken-ham-focaccia.jpg'),
    
    // Croissant Sandwich - Fixed to match item calls
    'mushroom-egg-croissant': require('../assets/images/menu/scrambled-egg-croissant.jpg'),
    'chicken-ham-croissant': require('../assets/images/menu/chicken-ham-croissant.jpg'),
    'cottage-cheese-croissant': require('../assets/images/menu/cottage-cheese-croissant.jpg'),
    
    // Mains
    'red-sauce-pasta': require('../assets/images/item-default.jpg'),
    'white-sauce-pasta': require('../assets/images/item-default.jpg'),
    'pesto-aglio-olio-pasta': require('../assets/images/item-default.jpg'),
    'pesto-grilled-chicken': require('../assets/images/item-default.jpg'),
    'pesto-grilled-paneer': require('../assets/images/item-default.jpg'),
    
    // Bagels
    'jalapeno-cream-cheese-bagel': require('../assets/images/item-default.jpg'),
    'classic-cream-cheese-bagel': require('../assets/images/item-default.jpg'),
    'japanese-style-bagel': require('../assets/images/item-default.jpg'),
    'scrambled-egg-bagel': require('../assets/images/item-default.jpg'),
    
    // Sides
    'classic-fries': require('../assets/images/menu/classic-fries.jpg'),
    'peri-peri-fries': require('../assets/images/menu/peri-peri-fries.jpg'),
    'cheesy-peri-peri-fries': require('../assets/images/item-default.jpg'),
  };

  // Try to return the image, fallback to category icon if not found
  if (images[imageName]) {
    return images[imageName];
  }

  // Fallback icons based on category
  const fallbackIcons = {
    espresso_hot: '☕',
    espresso_iced: '🧊',
    cold_brew: '❄️',
    cremes: '🥤',
    smoothie_bowls: '🥣',
    non_coffee: '🍵',
    matcha: '🍵',
    breakfast_toast: '🍞',
    french_toast: '🍞',
    burgers: '🍔',
    sandwiches: '🥪',
    focaccia: '🥖',
    croissant_sandwich: '🥐',
    mains: '🍝',
    bagels: '🥯',
    sides: '🍟',
  };

  return { uri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><text y="50" font-size="50">' + fallbackIcons[category] + '</text></svg>' };
};

// ===========================================
// COMPLETE MENU DATA
// ===========================================

const COMPLETE_MENU = {
  espresso_hot: [
    { id: 101, name: 'Shot', description: 'Single espresso shot', price: 220, image: getMenuImage('shot', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 102, name: 'Long Black', description: 'Espresso with hot water', price: 240, image: getMenuImage('long-black', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 103, name: 'Cortado', description: 'Espresso cut with warm milk', price: 260, image: getMenuImage('cortado', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 104, name: 'Flat White', description: 'Velvety microfoam with espresso', price: 280, image: getMenuImage('flat-white', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 105, name: 'Cappuccino', description: 'Equal parts espresso, milk, foam', price: 290, image: getMenuImage('cappuccino', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 106, name: 'Latte', description: 'Smooth espresso with steamed milk', price: 290, image: getMenuImage('latte', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 107, name: 'Spanish Latte', description: 'Sweet with condensed milk', price: 310, image: getMenuImage('spanish-latte', 'espresso_hot'), isVeg: true, containsNut: false },
    { id: 108, name: 'True Mocha Hot', description: 'Signature dark latte', price: 340, image: getMenuImage('true-mocha', 'espresso_hot'), isVeg: true, containsNut: false },
  ],

  espresso_iced: [
    { id: 110, name: 'Dirty Coffee', description: 'Cold brew with espresso shot', price: 310, image: getMenuImage('dirty-coffee', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 111, name: 'Iced Latte', description: 'Cold espresso with milk', price: 290, image: getMenuImage('iced-latte', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 112, name: 'True Vanilla Latte', description: 'House-made vanilla iced latte', price: 340, image: getMenuImage('true-vanilla-latte', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 113, name: 'True Mocha Iced', description: 'Chocolate espresso iced', price: 350, image: getMenuImage('true-mocha-iced', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 114, name: 'Vietnamese Latte', description: 'Sweetened condensed milk iced latte', price: 340, image: getMenuImage('vietnamese-latte', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 115, name: 'Cranberry Espresso', description: 'Tart cranberry with espresso', price: 340, image: getMenuImage('cranberry-espresso', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 116, name: 'Valencia Orange Coffee', description: 'Citrus-infused cold coffee', price: 370, image: getMenuImage('valencia-orange-coffee', 'espresso_iced'), isVeg: true, containsNut: false },
    { id: 117, name: 'Espresso Tonic', description: 'Espresso with tonic water', price: 370, image: getMenuImage('espresso-tonic', 'espresso_iced'), isVeg: true, containsNut: false },
  ],

  cold_brew: [
    { id: 120, name: 'Cold Brew', description: '18 hour slow-extracted cold brew', price: 290, image: getMenuImage('cold-brew', 'cold_brew'), isVeg: true, containsNut: false },
    { id: 121, name: 'Vanilla Cream', description: 'Cold brew with vanilla cream', price: 340, image: getMenuImage('vanilla-cream-cold-brew', 'cold_brew'), isVeg: true, containsNut: false },
    { id: 122, name: 'Toffee Nut', description: 'Cold brew with toffee nut', price: 360, image: getMenuImage('toffee-nut-cold-brew', 'cold_brew'), isVeg: true, containsNut: true },
    { id: 123, name: 'Nitro', description: 'Nitrogen-infused cold brew', price: 300, image: getMenuImage('nitro-cold-brew', 'cold_brew'), isVeg: true, containsNut: false },
  ],

  cremes: [
    { id: 130, name: 'OG Gold Coffee', description: 'Rich creamy eggless whipped coffee', price: 340, image: getMenuImage('og-gold-coffee', 'cremes'), isVeg: true, containsNut: false },
    { id: 131, name: 'Peanut Butter Creme', description: 'Creamy peanut butter whipped', price: 360, image: getMenuImage('peanut-butter-creme', 'cremes'), isVeg: true, containsNut: true },
    { id: 132, name: 'Brookie', description: 'Lotus biscoff whipped creme', price: 360, image: getMenuImage('brookie', 'cremes'), isVeg: true, containsNut: true },
    { id: 133, name: 'Hazelnut Creme', description: 'Rich hazelnut whipped creme', price: 360, image: getMenuImage('hazelnut-creme', 'cremes'), isVeg: true, containsNut: true },
    { id: 134, name: 'Matcha Creme', description: 'Japanese matcha whipped creme', price: 420, image: getMenuImage('matcha-creme', 'cremes'), isVeg: true, containsNut: false },
  ],

  smoothie_bowls: [
    { id: 140, name: 'Berry Bowl', description: 'Fresh berry smoothie bowl', price: 400, image: getMenuImage('berry-bowl', 'smoothie_bowls'), isVeg: true, containsNut: false },
    { id: 141, name: 'Chocolate Bowl', description: 'Rich chocolate smoothie bowl', price: 400, image: getMenuImage('chocolate-bowl', 'smoothie_bowls'), isVeg: true, containsNut: false },
    { id: 142, name: 'Green Bowl', description: 'Healthy green smoothie bowl', price: 420, image: getMenuImage('green-bowl', 'smoothie_bowls'), isVeg: true, containsNut: false },
    { id: 143, name: 'Yogurt Bowl', description: 'Creamy yogurt smoothie bowl', price: 420, image: getMenuImage('yogurt-bowl', 'smoothie_bowls'), isVeg: true, containsNut: false },
  ],

  non_coffee: [
    { id: 150, name: 'True Chocolate Hot', description: 'Rich hot chocolate', price: 300, image: getMenuImage('hot-chocolate', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 151, name: 'Strawberry Latte', description: 'Fresh strawberry latte', price: 350, image: getMenuImage('strawberry-latte', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 152, name: 'Kombu INF Iced', description: 'Kombucha infused iced tea', price: 310, image: getMenuImage('kombu-inf-iced', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 153, name: 'Rose Oolong Iced', description: 'Floral rose oolong iced tea', price: 370, image: getMenuImage('rose-oolong-iced', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 154, name: 'Orange Refresher Iced', description: 'Citrus orange refresher', price: 350, image: getMenuImage('orange-refresher-iced', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 155, name: 'Chamomile Tea', description: 'Calming chamomile tea', price: 280, image: getMenuImage('chamomile-tea', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 156, name: 'Turmeric Ginger', description: 'Spiced turmeric ginger tea', price: 280, image: getMenuImage('turmeric-ginger', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 157, name: 'Blossom Chai', description: 'Aromatic blossom chai', price: 280, image: getMenuImage('blossom-chai', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 158, name: 'Watermelon Juice', description: 'Fresh watermelon juice', price: 280, image: getMenuImage('watermelon-juice', 'non_coffee'), isVeg: true, containsNut: false },
    { id: 159, name: 'Orange Juice', description: 'Fresh orange juice', price: 280, image: getMenuImage('orange-juice', 'non_coffee'), isVeg: true, containsNut: false },
  ],

  matcha: [
    { id: 160, name: 'Matcha Latte Hot', description: 'Hot Japanese matcha latte', price: 360, image: getMenuImage('matcha-latte-hot', 'matcha'), isVeg: true, containsNut: false },
    { id: 161, name: 'Matcha Latte Iced', description: 'Iced Japanese matcha latte', price: 360, image: getMenuImage('matcha-latte-iced', 'matcha'), isVeg: true, containsNut: false },
    { id: 162, name: 'Cocoa Matcha', description: 'Chocolate matcha fusion', price: 390, image: getMenuImage('cocoa-matcha', 'matcha'), isVeg: true, containsNut: false },
  ],

  breakfast_toast: [
    { id: 170, name: 'Avocado Toast', description: 'Fresh avocado on sourdough', price: 440, image: getMenuImage('avocado-toast', 'breakfast_toast'), isVeg: true, containsNut: false },
    { id: 171, name: 'Black Summer Toast', description: 'Seasonal black summer toast', price: 450, image: getMenuImage('black-summer-toast', 'breakfast_toast'), isVeg: true, containsNut: false },
    { id: 172, name: 'Red Pepper Hummus Toast', description: 'Homemade hummus with peppers', price: 420, image: getMenuImage('red-pepper-hummus-toast', 'breakfast_toast'), isVeg: true, containsNut: false },
    { id: 173, name: 'Eggplant Toast', description: 'Roasted eggplant on sourdough', price: 420, image: getMenuImage('eggplant-toast', 'breakfast_toast'), isVeg: true, containsNut: false },
    { id: 175, name: 'Eggs on Toast', description: 'Perfectly cooked eggs on sourdough', price: 430, image: getMenuImage('eggs-on-toast', 'breakfast_toast'), isVeg: true, containsNut: false },
    { id: 176, name: 'Tumago Egg Toast', description: 'Japanese-style egg on sourdough', price: 440, image: getMenuImage('tumago-egg-toast', 'breakfast_toast'), isVeg: false, containsNut: false },
    { id: 177, name: 'Pesto Chicken Toast', description: 'Pesto grilled chicken on sourdough', price: 460, image: getMenuImage('pesto-chicken-toast', 'breakfast_toast'), isVeg: false, containsNut: true },
  ],

  french_toast: [
    { id: 180, name: 'Original', description: 'Classic French toast', price: 440, image: getMenuImage('french-toast-original', 'french_toast'), isVeg: true, containsNut: false },
    { id: 181, name: 'Chocolate', description: 'Rich chocolate French toast', price: 460, image: getMenuImage('french-toast-chocolate', 'french_toast'), isVeg: true, containsNut: false },
    { id: 182, name: 'Tiramisu', description: 'Tiramisu-inspired French toast', price: 485, image: getMenuImage('french-toast-tiramisu', 'french_toast'), isVeg: true, containsNut: false },
  ],

  burgers: [
    { id: 190, name: 'Veg Burger', description: 'Delicious vegetarian burger', price: 430, image: getMenuImage('veg-burger', 'burgers'), isVeg: true, containsNut: false },
    { id: 191, name: 'Grilled Chicken Burger', description: 'Juicy grilled chicken burger', price: 450, image: getMenuImage('grilled-chicken-burger', 'burgers'), isVeg: false, containsNut: false },
    { id: 192, name: 'Crispy Chicken Burger', description: 'Crispy fried chicken burger', price: 460, image: getMenuImage('crispy-chicken-burger', 'burgers'), isVeg: false, containsNut: false },
  ],

  sandwiches: [
    { id: 200, name: 'Veg Sandwich', description: 'Fresh vegetable sandwich', price: 380, image: getMenuImage('veg-sandwich', 'sandwiches'), isVeg: true, containsNut: false },
    { id: 201, name: 'Chicken Salad Sandwich', description: 'Chicken salad sandwich', price: 400, image: getMenuImage('chicken-salad-sandwich', 'sandwiches'), isVeg: false, containsNut: false },
  ],

  focaccia: [
    { id: 210, name: 'Spiced Honey Bean', description: 'Honey beans on focaccia', price: 440, image: getMenuImage('spiced-honey-bean-focaccia', 'focaccia'), isVeg: true, containsNut: false },
    { id: 211, name: 'Pesto Paneer', description: 'Pesto paneer on focaccia', price: 470, image: getMenuImage('pesto-paneer-focaccia', 'focaccia'), isVeg: true, containsNut: true },
    { id: 212, name: 'Pepperoni', description: 'Classic pepperoni focaccia', price: 460, image: getMenuImage('pepperoni-focaccia', 'focaccia'), isVeg: false, containsNut: false },
    { id: 213, name: 'Chicken Ham', description: 'Chicken ham focaccia', price: 460, image: getMenuImage('chicken-ham-focaccia', 'focaccia'), isVeg: false, containsNut: false },
  ],

  croissant_sandwich: [
    { id: 220, name: 'Mushroom Egg Croissant', description: 'Mushroom and egg in croissant', price: 440, image: getMenuImage('mushroom-egg-croissant', 'croissant_sandwich'), isVeg: true, containsNut: false },
    { id: 221, name: 'Chicken Ham Croissant', description: 'Chicken ham in croissant', price: 420, image: getMenuImage('chicken-ham-croissant', 'croissant_sandwich'), isVeg: false, containsNut: false },
    { id: 222, name: 'Cottage Cheese Croissant', description: 'Cottage cheese in croissant', price: 470, image: getMenuImage('cottage-cheese-croissant', 'croissant_sandwich'), isVeg: true, containsNut: false },
  ],

  mains: [
    { id: 230, name: 'Red Sauce Pasta', description: 'Classic red sauce pasta', price: 430, vegPrice: 430, nonVegPrice: 460, image: getMenuImage('red-sauce-pasta', 'mains'), isVeg: true, hasNonVegOption: true, containsNut: false },
    { id: 231, name: 'White Sauce Pasta', description: 'Creamy white sauce pasta', price: 430, vegPrice: 430, nonVegPrice: 460, image: getMenuImage('white-sauce-pasta', 'mains'), isVeg: true, hasNonVegOption: true, containsNut: false },
    { id: 232, name: 'Pesto Aglio Olio Pasta', description: 'Pesto garlic oil pasta', price: 430, vegPrice: 430, nonVegPrice: 460, image: getMenuImage('pesto-aglio-olio-pasta', 'mains'), isVeg: true, hasNonVegOption: true, containsNut: true },
    { id: 233, name: 'Pesto Grilled Chicken', description: 'Pesto chicken with sides', price: 495, image: getMenuImage('pesto-grilled-chicken', 'mains'), isVeg: false, containsNut: true },
    { id: 234, name: 'Pesto Grilled Paneer', description: 'Pesto paneer with sides', price: 495, image: getMenuImage('pesto-grilled-paneer', 'mains'), isVeg: true, containsNut: true },
  ],

  bagels: [
    { id: 240, name: 'Jalapeno Cream Cheese', description: 'Spicy jalapeno cream cheese bagel', price: 290, image: getMenuImage('jalapeno-cream-cheese-bagel', 'bagels'), isVeg: true, containsNut: false },
    { id: 241, name: 'Classic Cream Cheese', description: 'Classic cream cheese bagel', price: 280, image: getMenuImage('classic-cream-cheese-bagel', 'bagels'), isVeg: true, containsNut: false },
    { id: 242, name: 'Japanese Style', description: 'Japanese-inspired bagel', price: 380, image: getMenuImage('japanese-style-bagel', 'bagels'), isVeg: true, containsNut: false },
    { id: 243, name: 'Scrambled Egg', description: 'Fluffy scrambled eggs bagel', price: 330, image: getMenuImage('scrambled-egg-bagel', 'bagels'), isVeg: true, containsNut: false },
  ],

  sides: [
    { id: 250, name: 'Classic Fries', description: 'Crispy golden fries', price: 250, image: getMenuImage('classic-fries', 'sides'), isVeg: true, containsNut: false },
    { id: 251, name: 'Peri Peri Fries', description: 'Spicy peri peri fries', price: 280, image: getMenuImage('peri-peri-fries', 'sides'), isVeg: true, containsNut: false },
    { id: 252, name: 'Cheesy Peri Peri Fries', description: 'Cheesy spicy peri peri fries', price: 330, image: getMenuImage('cheesy-peri-peri-fries', 'sides'), isVeg: true, containsNut: false },
  ],
};

// ===========================================
// STORE SPECIFIC MENUS (All use same menu)
// ===========================================

const KOMPALLY_MENU = { ...COMPLETE_MENU };
const JUBILEE_HILLS_MENU = { ...COMPLETE_MENU };
const LOFT_MENU = { ...COMPLETE_MENU };
const FILM_NAGAR_MENU = { ...COMPLETE_MENU };
const KOKAPET_MENU = { ...COMPLETE_MENU };

// ===========================================
// MARKETPLACE ITEMS
// ===========================================

export const MARKETPLACE_ITEMS = [
  { id: 'MP001', name: 'Coffee Scrub', description: '100% Arabica coffee body scrub', price: 550, image: require('../assets/images/marketplace/coffee-scrub.jpg'), category: 'Body Care' },
  { id: 'MP002', name: 'Dune Mug', description: 'Handcrafted ceramic mug', price: 850, image: require('../assets/images/marketplace/dune-mug.jpg'), category: 'Drinkware' },
  { id: 'MP003', name: 'Dune Cup', description: 'Artisan ceramic cup', price: 650, image: require('../assets/images/marketplace/dune.jpg'), category: 'Drinkware' },
  { id: 'MP004', name: 'Kinto Tumbler Beige', description: 'Insulated travel tumbler', price: 1250, image: require('../assets/images/marketplace/kinto-tumblr-beige.jpg'), category: 'Drinkware' },
  { id: 'MP005', name: 'Kinto Tumbler Steel', description: 'Stainless steel tumbler', price: 1450, image: require('../assets/images/marketplace/kinto-tumblr-stainless-steel.jpg'), category: 'Drinkware' },
  { id: 'MP006', name: 'Moonlight Cup', description: 'Elegant ceramic cup', price: 750, image: require('../assets/images/marketplace/moonlight-cup.jpg'), category: 'Drinkware' },
  { id: 'MP007', name: 'True Mocha Soap', description: 'Coffee & cocoa natural soap', price: 350, image: require('../assets/images/marketplace/true-mocha-soap.jpg'), category: 'Body Care' },
  { id: 'MP008', name: 'Valencia Orange Soap', description: 'Valencia orange natural soap', price: 350, image: require('../assets/images/marketplace/valencia-orange-soap.jpg'), category: 'Body Care' },
];

// ===========================================
// STORE INFORMATION WITH SPACE IMAGES
// ===========================================

export const STORES = [
  {
    id: 1,
    name: 'Kompally',
    spaceName: 'Soft Sand',
    area: 'Kompally',
    address: 'Financial District, Kompally, Hyderabad',
    latitude: 17.5401,
    longitude: 78.4892,
    image: require('../assets/images/spaces/softsand.jpg'),
    hours: '7:00 AM - 11:00 PM',
    phone: '+91 98765 43210',
  },
  {
    id: 2,
    name: 'Jubilee Hills',
    spaceName: 'Modern Beige',
    area: 'Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    latitude: 17.4326,
    longitude: 78.4071,
    image: require('../assets/images/spaces/modernbeige.jpg'),
    hours: '7:00 AM - 11:00 PM',
    phone: '+91 98765 43211',
  },
  {
    id: 3,
    name: 'Loft',
    spaceName: 'Oakmoss',
    area: 'Hi-Tech City',
    address: 'HITEC City, Madhapur, Hyderabad',
    latitude: 17.4485,
    longitude: 78.3908,
    image: require('../assets/images/spaces/oakmoss.jpg'),
    hours: '7:00 AM - 11:00 PM',
    phone: '+91 98765 43212',
  },
  {
    id: 4,
    name: 'Film Nagar',
    spaceName: 'Burnt Earth',
    area: 'Film Nagar',
    address: 'Film Nagar, Jubilee Hills, Hyderabad',
    latitude: 17.4178,
    longitude: 78.4425,
    image: require('../assets/images/spaces/burntearth.jpg'),
    hours: '7:00 AM - 11:00 PM',
    phone: '+91 98765 43213',
  },
  {
    id: 5,
    name: 'Kokapet',
    spaceName: 'Travertine',
    area: 'Kokapet',
    address: 'Financial District, Kokapet, Hyderabad',
    latitude: 17.4239,
    longitude: 78.3461,
    image: require('../assets/images/spaces/travertine.jpg'),
    hours: '7:00 AM - 11:00 PM',
    phone: '+91 98765 43214',
  },
];

// ===========================================
// STORE MENU MAPPING
// ===========================================

export const STORE_MENUS = {
  1: KOMPALLY_MENU,
  2: JUBILEE_HILLS_MENU,
  3: LOFT_MENU,
  4: FILM_NAGAR_MENU,
  5: KOKAPET_MENU,
};

// ===========================================
// MENU CATEGORIES
// ===========================================

export const CATEGORIES = [
  { id: 1, key: 'espresso_hot', name: 'ESPRESSO HOT', icon: 'cafe' },
  { id: 2, key: 'espresso_iced', name: 'ESPRESSO ICED', icon: 'snow' },
  { id: 3, key: 'cold_brew', name: 'COLD BREW', icon: 'water' },
  { id: 4, key: 'cremes', name: 'CREMES', icon: 'wine' },
  { id: 5, key: 'smoothie_bowls', name: 'SMOOTHIE BOWLS', icon: 'restaurant' },
  { id: 6, key: 'non_coffee', name: 'NON COFFEE/TEA', icon: 'leaf' },
  { id: 7, key: 'matcha', name: 'MATCHA', icon: 'leaf' },
  { id: 8, key: 'breakfast_toast', name: 'ALL DAY BREAKFAST', icon: 'restaurant' },
  { id: 9, key: 'french_toast', name: 'FRENCH TOAST', icon: 'restaurant' },
  { id: 10, key: 'burgers', name: 'BURGERS', icon: 'fast-food' },
  { id: 11, key: 'sandwiches', name: 'SANDWICHES', icon: 'fast-food' },
  { id: 12, key: 'focaccia', name: 'FOCACCIA', icon: 'pizza' },
  { id: 13, key: 'croissant_sandwich', name: 'CROISSANT SANDWICH', icon: 'fast-food' },
  { id: 14, key: 'mains', name: 'MAINS', icon: 'restaurant' },
  { id: 15, key: 'bagels', name: 'BAGELS', icon: 'pizza' },
  { id: 16, key: 'sides', name: 'SIDES', icon: 'fast-food' },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export const getMenuForStore = (storeId) => {
  return STORE_MENUS[storeId] || STORE_MENUS[1];
};

export const getStoreById = (storeId) => {
  return STORES.find(store => store.id === storeId) || STORES[0];
};

export const getAllCategories = () => CATEGORIES;

export const getMarketplaceItems = () => MARKETPLACE_ITEMS;

export default STORE_MENUS;
