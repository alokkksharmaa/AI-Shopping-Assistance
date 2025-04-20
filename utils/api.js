import axios from 'axios';
import { getStaticBooks } from './bookProducts';
import { getStaticSports } from './sportsProducts';

// Flag to determine whether to use expanded product set (1000+ products)
const USE_EXPANDED_PRODUCTS = true;

// Function to fetch all products from multiple APIs and combine them
export const getAllProducts = async () => {
  try {
    // Define our product categories
    const categories = {
      electronics: fetchElectronics(),
      clothing: fetchClothing(),
      food: fetchFood(),
      medicine: fetchMedicine(),
      household: fetchHousehold(),
      stationery: fetchStationery(),
      books: getStaticBooks(),
      sports: getStaticSports()
    };

    // Fetch all categories in parallel
    const results = await Promise.all(Object.values(categories));
    
    // Combine all products into a single array
    let allProducts = results.flat();
    
    // If expanded products flag is on, generate more products
    if (USE_EXPANDED_PRODUCTS) {
      allProducts = expandProductSet(allProducts);
      console.log(`Generated expanded product set: ${allProducts.length} products`);
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

// Function to expand the product set to 1000+ products
const expandProductSet = (baseProducts) => {
  // We'll use the base products as templates to generate variations
  const expandedProducts = [];
  
  // Add the original products first
  expandedProducts.push(...baseProducts);
  
  // For each base product, create multiple variations
  baseProducts.forEach((product, index) => {
    // Create variations for each product
    const variations = generateProductVariations(product, index);
    expandedProducts.push(...variations);
  });
  
  return expandedProducts;
};

// Generate variations of a product
const generateProductVariations = (baseProduct, baseIndex) => {
  const variations = [];
  const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Purple', 'Yellow', 'Orange', 'Pink', 'Gray'];
  const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
  const models = ['Standard', 'Pro', 'Ultra', 'Lite', 'Plus', 'Max', 'Mini'];
  const years = [2022, 2023, 2024, 2025];
  
  // Generate different variations based on product category
  if (baseProduct.category === 'electronics') {
    models.forEach((model, modelIndex) => {
      years.forEach((year, yearIndex) => {
        variations.push({
          id: `${baseProduct.id}-${model}-${year}-${modelIndex}-${yearIndex}`,
          title: `${baseProduct.title} ${model} (${year})`,
          price: Math.round(baseProduct.price * (1 + (modelIndex * 0.2) + (yearIndex * 0.1))),
          description: `${model} version of ${baseProduct.description}. Released in ${year}.`,
          category: baseProduct.category,
          image: baseProduct.image
        });
      });
    });
  } else if (baseProduct.category === 'clothing') {
    colors.forEach((color, colorIndex) => {
      sizes.forEach((size, sizeIndex) => {
        variations.push({
          id: `${baseProduct.id}-${color}-${size}-${colorIndex}-${sizeIndex}`,
          title: `${baseProduct.title} - ${color}, ${size}`,
          price: Math.round(baseProduct.price * (1 + (sizeIndex * 0.1))),
          description: `${baseProduct.description} Available in ${color} color and ${size} size.`,
          category: baseProduct.category,
          image: baseProduct.image
        });
      });
    });
  } else {
    // For other categories, just create some variations with different options
    for (let i = 1; i <= 10; i++) {
      variations.push({
        id: `${baseProduct.id}-variant-${i}`,
        title: `${baseProduct.title} - Variant ${i}`,
        price: Math.round(baseProduct.price * (1 + (i * 0.05))),
        description: `${baseProduct.description} Variant ${i} with additional features.`,
        category: baseProduct.category,
        image: baseProduct.image
      });
    }
  }
  
  return variations;
};

// Electronics products from FakeStoreAPI
const fetchElectronics = async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products/category/electronics');
    
    // Map the response to our standard product format and convert price to rupees
    return response.data.map(item => ({
      id: `electronics-${item.id}`,
      title: item.title,
      price: Math.round(item.price * 75), // Convert USD to INR
      description: item.description,
      category: 'electronics',
      image: item.image
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching electronics:', error);
    // Fallback to static data if API fails
    return getStaticElectronics();
  }
};

// Clothing products from FakeStoreAPI
const fetchClothing = async () => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products/category/men's clothing");
    const womenResponse = await axios.get("https://fakestoreapi.com/products/category/women's clothing");
    
    // Combine men's and women's clothing
    const allClothing = [...response.data, ...womenResponse.data];
    
    // Map the response to our standard product format and convert price to rupees
    return allClothing.map(item => ({
      id: `clothing-${item.id}`,
      title: item.title,
      price: Math.round(item.price * 75), // Convert USD to INR
      description: item.description,
      category: 'clothing',
      image: item.image
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching clothing:', error);
    // Fallback to static data if API fails
    return getStaticClothing();
  }
};

// Food products from DummyJSON
const fetchFood = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products/category/groceries');
    
    // Map the response to our standard product format and convert price to rupees
    return response.data.products.map(item => ({
      id: `food-${item.id}`,
      title: item.title,
      price: Math.round(item.price * 75), // Convert USD to INR
      description: item.description,
      category: 'food',
      image: item.thumbnail
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching food:', error);
    // Fallback to static data if API fails
    return getStaticFood();
  }
};

// Medicine products (static data as no free API available)
const fetchMedicine = async () => {
  return getStaticMedicine();
};

// Household products from DummyJSON
const fetchHousehold = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products/category/home-decoration');
    const furnitureResponse = await axios.get('https://dummyjson.com/products/category/furniture');
    
    // Combine home decoration and furniture
    const allHousehold = [...response.data.products, ...furnitureResponse.data.products];
    
    // Map the response to our standard product format and convert price to rupees
    return allHousehold.map(item => ({
      id: `household-${item.id}`,
      title: item.title,
      price: Math.round(item.price * 75), // Convert USD to INR
      description: item.description,
      category: 'household',
      image: item.thumbnail
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching household items:', error);
    // Fallback to static data if API fails
    return getStaticHousehold();
  }
};

// Stationery products (static data as no free API available)
const fetchStationery = async () => {
  return getStaticStationery();
};

// Books products (static data as no free API available)
const fetchBooks = async () => {
  return getStaticBooks();
};

// Sports products (static data as no free API available)
const fetchSports = async () => {
  return getStaticSports();
};

// Static data fallbacks for when APIs fail or are unavailable

const getStaticElectronics = () => [
  // Smartphones
  {
    id: 'electronics-1',
    title: 'Smartphone X Pro',
    price: 74999,
    description: 'Latest smartphone with 6.7" OLED display, 5G, and 128GB storage',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-phone-1',
    title: 'Galaxy Ultra S24',
    price: 109999,
    description: 'Premium smartphone with 6.8" Dynamic AMOLED display, 200MP camera, and 512GB storage',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-phone-2',
    title: 'Pixel 8 Pro',
    price: 82999,
    description: 'Google flagship with advanced AI features, 50MP camera system, and 120Hz display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-phone-3',
    title: 'OnePlus 12',
    price: 64999,
    description: 'Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera, and 100W fast charging',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-phone-4',
    title: 'Nothing Phone (2)',
    price: 44999,
    description: 'Innovative smartphone with Glyph interface, transparent design, and clean Android experience',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  
  // Laptops
  {
    id: 'electronics-2',
    title: 'Laptop Ultra Slim',
    price: 97499,
    description: 'Ultra-slim laptop with 16GB RAM, 512GB SSD, and 14" display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-laptop-1',
    title: 'MacBook Pro M3 Max',
    price: 249999,
    description: 'Professional laptop with M3 Max chip, 32GB unified memory, and 14" Liquid Retina XDR display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-laptop-2',
    title: 'Dell XPS 15',
    price: 159999,
    description: 'Premium Windows laptop with Intel Core i9, RTX 4070, and 15.6" OLED touch display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-laptop-3',
    title: 'ASUS ROG Zephyrus G14',
    price: 134999,
    description: 'Gaming laptop with AMD Ryzen 9, RTX 4060, and 14" 165Hz display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-laptop-4',
    title: 'Microsoft Surface Laptop Studio',
    price: 179999,
    description: 'Versatile laptop with unique hinge design, Intel Core i7, and 14.4" 120Hz touch display',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  
  // Audio Products
  {
    id: 'electronics-3',
    title: 'Wireless Headphones',
    price: 14999,
    description: 'Noise-cancelling wireless headphones with 30-hour battery life',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-6',
    title: 'Wireless Earbuds Pro',
    price: 12999,
    description: 'True wireless earbuds with active noise cancellation and water resistance',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-audio-1',
    title: 'Sony WH-1000XM5',
    price: 34999,
    description: 'Premium noise-cancelling headphones with LDAC support and 30-hour battery life',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-audio-2',
    title: 'Sonos Era 300',
    price: 42999,
    description: 'Spatial audio smart speaker with Dolby Atmos and multi-room capability',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  
  // Wearables
  {
    id: 'electronics-4',
    title: 'Smart Watch Series 5',
    price: 26249,
    description: 'Smart watch with health monitoring, GPS, and water resistance',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-wearable-1',
    title: 'Apple Watch Ultra 2',
    price: 89999,
    description: 'Rugged smartwatch with titanium case, precision GPS, and advanced health sensors',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-wearable-2',
    title: 'Garmin Fenix 7X Solar',
    price: 79999,
    description: 'Premium multisport GPS watch with solar charging and up to 37 days battery life',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  
  // Other Electronics
  {
    id: 'electronics-5',
    title: '4K Smart TV 55"',
    price: 52499,
    description: '55-inch 4K Smart TV with HDR and built-in streaming apps',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-7',
    title: 'Digital Camera 4K',
    price: 45999,
    description: 'Professional digital camera with 4K video recording and 24MP sensor',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-other-1',
    title: 'iPad Pro M2',
    price: 119999,
    description: 'Powerful tablet with M2 chip, 12.9" Liquid Retina XDR display, and Apple Pencil support',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-other-2',
    title: 'DJI Mavic 3 Pro',
    price: 179999,
    description: 'Professional drone with Hasselblad camera, 4/3 CMOS sensor, and 46-minute flight time',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-other-3',
    title: 'PlayStation 5 Pro',
    price: 59999,
    description: 'Next-gen gaming console with enhanced GPU, 2TB SSD, and 8K support',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-other-4',
    title: 'Dyson V15 Detect',
    price: 54999,
    description: 'Cordless vacuum with laser dust detection, HEPA filtration, and 60-minute runtime',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1584792286782-377701c8b5aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-8',
    title: 'Gaming Console Pro',
    price: 49999,
    description: 'Next-gen gaming console with 1TB storage and 4K gaming capability',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-9',
    title: 'Smart Home Speaker',
    price: 8999,
    description: 'Voice-controlled smart speaker with premium sound quality',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'electronics-10',
    title: 'Tablet Pro 12.9"',
    price: 65999,
    description: 'Professional tablet with 12.9" Retina display and powerful processor',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const getStaticClothing = () => [
  {
    id: 'clothing-1',
    title: 'Men\'s Casual T-Shirt',
    price: 1874,
    description: 'Comfortable cotton t-shirt for everyday wear',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-2',
    title: 'Women\'s Summer Dress',
    price: 3749,
    description: 'Light and flowy summer dress with floral pattern',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-3',
    title: 'Men\'s Slim-Fit Jeans',
    price: 4499,
    description: 'Classic slim-fit jeans for a modern look',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-4',
    title: 'Women\'s Leather Jacket',
    price: 9749,
    description: 'Stylish leather jacket for all seasons',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-5',
    title: 'Unisex Hoodie',
    price: 2999,
    description: 'Comfortable hoodie for casual wear',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-6',
    title: 'Women\'s Yoga Pants',
    price: 2499,
    description: 'Stretchy and comfortable yoga pants for active lifestyle',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1552881407-43a3e2c437e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-7',
    title: 'Men\'s Formal Shirt',
    price: 3299,
    description: 'Crisp formal shirt for professional settings',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-8',
    title: 'Women\'s Winter Coat',
    price: 8499,
    description: 'Warm winter coat with faux fur lining',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1548624313-0396c75f3f2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-9',
    title: 'Men\'s Running Shoes',
    price: 5999,
    description: 'Lightweight running shoes with cushioned soles',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'clothing-10',
    title: 'Women\'s Handbag',
    price: 4999,
    description: 'Stylish leather handbag with multiple compartments',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const getStaticFood = () => [
  {
    id: 'food-1',
    title: 'Organic Fruit Basket',
    price: 2624,
    description: 'Assortment of fresh organic fruits',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-2',
    title: 'Gourmet Coffee Beans',
    price: 1499,
    description: 'Premium coffee beans from sustainable sources',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-3',
    title: 'Artisan Chocolate Box',
    price: 2249,
    description: 'Handcrafted chocolates with various fillings',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-4',
    title: 'Organic Pasta Set',
    price: 1199,
    description: 'Set of organic pasta varieties',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-5',
    title: 'Spice Collection',
    price: 1874,
    description: 'Collection of premium cooking spices',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-6',
    title: 'Organic Honey Jar',
    price: 899,
    description: 'Pure organic honey from wildflower meadows',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-7',
    title: 'Premium Tea Collection',
    price: 1299,
    description: 'Assortment of loose-leaf teas from around the world',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-8',
    title: 'Artisan Cheese Selection',
    price: 2499,
    description: 'Selection of fine artisan cheeses from local dairies',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-9',
    title: 'Organic Olive Oil',
    price: 1699,
    description: 'Cold-pressed extra virgin olive oil from organic farms',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'food-10',
    title: 'Dried Fruit Mix',
    price: 999,
    description: 'Assorted dried fruits with no added sugar',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const getStaticMedicine = () => [
  {
    id: 'medicine-1',
    title: 'Multivitamin Complex',
    price: 1499,
    description: 'Daily multivitamin supplement for overall health',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-2',
    title: 'First Aid Kit',
    price: 2249,
    description: 'Comprehensive first aid kit for emergencies',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-3',
    title: 'Digital Thermometer',
    price: 974,
    description: 'Accurate digital thermometer for temperature readings',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-4',
    title: 'Pain Relief Gel',
    price: 749,
    description: 'Topical gel for muscle and joint pain relief',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1584308666999-b85cdf88d68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-5',
    title: 'Herbal Sleep Aid',
    price: 1124,
    description: 'Natural supplement to improve sleep quality',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-6',
    title: 'Immune Support Tablets',
    price: 1299,
    description: 'Herbal supplement to boost immune system function',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-7',
    title: 'Blood Pressure Monitor',
    price: 3499,
    description: 'Digital blood pressure monitor for home use',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-8',
    title: 'Ayurvedic Digestive Aid',
    price: 899,
    description: 'Traditional herbal remedy for digestive health',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-9',
    title: 'Diabetic Test Strips',
    price: 1799,
    description: 'Blood glucose test strips for diabetes monitoring',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicine-10',
    title: 'Joint Support Supplement',
    price: 1599,
    description: 'Glucosamine and chondroitin formula for joint health',
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const getStaticHousehold = () => [
  {
    id: 'household-1',
    title: 'Scented Candle Set',
    price: 1874,
    description: 'Set of 3 premium scented candles',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1603913996638-c01100417b4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-2',
    title: 'Throw Pillow Covers',
    price: 1499,
    description: 'Set of 2 decorative throw pillow covers',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-3',
    title: 'Kitchen Utensil Set',
    price: 2624,
    description: 'Complete set of stainless steel kitchen utensils',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-4',
    title: 'Bathroom Organizer',
    price: 2249,
    description: 'Modern bathroom organizer for toiletries',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-5',
    title: 'Decorative Wall Clock',
    price: 2999,
    description: 'Stylish wall clock for home decoration',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1594387695168-dce0ee92e60b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-6',
    title: 'Bamboo Cutting Board',
    price: 1799,
    description: 'Eco-friendly bamboo cutting board for kitchen use',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1594282486552-05a3b6fbfdb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-7',
    title: 'Ceramic Dinner Set',
    price: 4999,
    description: 'Complete ceramic dinner set for 6 people',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-8',
    title: 'Cotton Bed Sheets',
    price: 2499,
    description: '100% cotton bed sheets with 300 thread count',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-9',
    title: 'Air Purifier',
    price: 7999,
    description: 'HEPA air purifier for cleaner indoor air',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1585157603291-a3250b5e2e8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household-10',
    title: 'Stainless Steel Cookware Set',
    price: 6499,
    description: 'Premium stainless steel cookware set with 10 pieces',
    category: 'household',
    image: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a6c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const getStaticStationery = () => [
  {
    id: 'stationery-1',
    title: 'Premium Notebook Set',
    price: 1124,
    description: 'Set of 3 premium notebooks with lined pages',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'stationery-2',
    title: 'Fountain Pen',
    price: 1874,
    description: 'Elegant fountain pen with smooth ink flow',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'stationery-3',
    title: 'Desk Organizer',
    price: 1499,
    description: 'Wooden desk organizer for office supplies',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'stationery-4',
    title: 'Colored Pencil Set',
    price: 974,
    description: 'Set of 24 premium colored pencils for artists',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'stationery-5',
    title: 'Sticky Notes Pack',
    price: 599,
    description: 'Pack of colorful sticky notes in various sizes',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'stationery-6',
    title: 'Leather Journal',
    price: 2499,
    description: 'Handcrafted leather journal with refillable pages',
    category: 'stationery',
    image: 'https://images.unsplash.com/photo-1544112559-349e1e049fb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];
