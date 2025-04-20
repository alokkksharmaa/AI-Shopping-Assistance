import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import Chatbot from '../components/Chatbot';
// Footer removed as requested
import LoopAnimation from '../components/LoopAnimation';
import TypewriterAnimation from '../components/TypewriterAnimation';
import ProductBackgroundAnimation from '../components/ProductBackgroundAnimation';
import { ThemeContext } from '../contexts/ThemeContext';
import { getAllProducts } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Filter by category if needed
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query if present
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, products, searchQuery]);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Automatically show all products when searching
    setSelectedCategory('all');
  };

  return (
    <Container>
      <Head>
        <title>ShopSmart - Your Smart Shopping Assistant</title>
        <meta name="description" content="E-commerce site with smart product recommendations" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar onSearch={handleSearch} />

      <Hero
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroOverlay />
        <ProductBackgroundAnimation />
        <HeroTitle
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            textShadow: [
              '0 5px 15px rgba(0, 0, 0, 0.3)',
              '0 5px 25px rgba(110, 142, 251, 0.5)',
              '0 5px 15px rgba(0, 0, 0, 0.3)'
            ]
          }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2,
            textShadow: {
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut'
            }
          }}
        >
          <TitleSpan
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Shop
          </TitleSpan>{' '}
          <TitleSpan
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Smart
          </TitleSpan>{' '}
          <TitleSpan
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            with
          </TitleSpan>{' '}
          <TitleSpan
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="highlight"
          >
            AI Assistance
          </TitleSpan>
        </HeroTitle>
        <HeroGlassPanel
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 1.5, 
            duration: 1, 
            type: 'spring', 
            stiffness: 50,
            damping: 15
          }}
        >
          <HeroContent>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Discover products across electronics, food, clothing, medicine, household goods, stationery, books, and sports equipment
            </HeroSubtitle>
            <HeroButton 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 10px 25px rgba(110, 142, 251, 0.4)',
                transition: { duration: 0.3, ease: 'easeOut' }
              }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.7, type: 'spring', stiffness: 200 }}
            >
              <ButtonText>Explore Products</ButtonText>
              <ButtonIcon>→</ButtonIcon>
            </HeroButton>
          </HeroContent>
        </HeroGlassPanel>
        <HeroScrollIndicator 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1,
            y: 0,
            boxShadow: [
              '0 4px 15px rgba(0, 0, 0, 0.1)',
              '0 8px 25px rgba(110, 142, 251, 0.3)',
              '0 4px 15px rgba(0, 0, 0, 0.1)'
            ]
          }}
          transition={{ 
            opacity: { delay: 2.5, duration: 0.8 },
            y: { delay: 2.5, duration: 0.8, type: 'spring' },
            boxShadow: {
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut'
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
        >
          <ScrollIcon>↓</ScrollIcon>
        </HeroScrollIndicator>
      </Hero>

      <CategorySection id="products">
        <CategoryTitle>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Categories'}
          {searchQuery && (
            <ClearSearchButton 
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </ClearSearchButton>
          )}
        </CategoryTitle>
        
        {!searchQuery && (
          <CategoryContainer>
            <CategoryButton 
              active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Products
            </CategoryButton>
            {categories.map((category) => (
              <CategoryButton 
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CategoryButton>
            ))}
          </CategoryContainer>
        )}
      </CategorySection>

      <ProductSection>
        {loading ? (
          <LoadingSpinner>Loading products...</LoadingSpinner>
        ) : filteredProducts.length === 0 ? (
          <NoResults>
            {searchQuery ? 
              `No products found matching "${searchQuery}"` : 
              `No products found in the ${selectedCategory} category`}
          </NoResults>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </ProductSection>

      <ChatbotToggle 
        onClick={toggleChatbot}
        whileHover={{ scale: 1.1, rotate: 5, boxShadow: '0 8px 20px rgba(110, 142, 251, 0.4)' }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        initial={{ rotate: 0, y: 0 }}
        animate={{ 
          rotate: [0, -5, 0, 5, 0],
          y: [0, -5, 0],
          transition: { 
            rotate: { repeat: Infinity, repeatType: 'loop', duration: 5, ease: 'easeInOut' },
            y: { repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'easeInOut' }
          }
        }}
      >
        <ChatbotIcon
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2,
              ease: 'easeInOut'
            }
          }}
        >💬</ChatbotIcon>
      </ChatbotToggle>

      {showChatbot && <Chatbot onClose={toggleChatbot} products={products} />}

      {/* Footer removed as requested */}
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Hero = styled(motion.div)`
  height: 85vh;
  background: ${props => props.theme.heroGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px ${props => props.theme.shadow};
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 2;
`;

const HeroGlassPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 3rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  max-width: 900px;
  width: 90%;
  position: relative;
  z-index: 10;
  overflow: hidden;
  margin-top: 10rem;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    opacity: 0.5;
    z-index: -1;
    transform: rotate(30deg);
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  position: relative;
  z-index: 10;
  margin: 0 auto;
  padding-top: 0.5rem;
`;

const TitleSpan = styled(motion.span)`
  display: inline-block;
  
  &.highlight {
    background: linear-gradient(to right, #ffffff, #a0d8ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 20;
  margin: 0;
  padding: 0 2rem;
  
  /* Add a subtle glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    filter: blur(20px);
    opacity: 0.5;
    background: ${props => props.theme.primary};
    animation: pulse 4s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.3; filter: blur(20px); }
    50% { opacity: 0.6; filter: blur(25px); }
    100% { opacity: 0.3; filter: blur(20px); }
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    top: 15%;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

const HeroButton = styled(motion.button)`
  background-color: white;
  color: #6e8efb;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    transition: 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${HeroButton}:hover & {
    transform: translateX(5px);
  }
`;

const HeroScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

const ScrollIcon = styled.span`
  font-size: 1.2rem;
  color: white;
`;

const CategorySection = styled.section`
  padding: 4rem 2rem;
  background-color: ${props => props.theme.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -150px;
    right: -150px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(110, 142, 251, 0.1) 0%, rgba(110, 142, 251, 0) 70%);
    z-index: 1;
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(167, 119, 227, 0.1) 0%, rgba(167, 119, 227, 0) 70%);
    z-index: 1;
    opacity: 0.5;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 1rem;
`;

const CategoryCard = styled(motion.div)`
  background: rgba(${props => props.theme.isDarkTheme ? '40, 40, 40, 0.7' : '255, 255, 255, 0.7'});
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'});
  position: relative;
  
  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const CategoryImage = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.5) 0%, rgba(195, 207, 226, 0.5) 100%);
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.1) 100%);
    pointer-events: none;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
  }
  
  ${CategoryCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CategoryInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #6e8efb, #a777e3);
    border-radius: 3px;
    opacity: 0.7;
  }
`;

const CategoryName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  ${CategoryCard}:hover & {
    color: ${props => props.theme.primary};
  }
`;

const CategoryDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
  line-height: 1.5;
  transition: opacity 0.3s ease;
  
  ${CategoryCard}:hover & {
    opacity: 0.9;
  }
`;

const CategoryTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  position: relative;
  z-index: 2;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #6e8efb, #a777e3);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ClearSearchButton = styled(motion.button)`
  background-color: rgba(${props => props.theme.isDarkTheme ? '60, 60, 60, 0.7' : '245, 245, 245, 0.7'});
  color: ${props => props.theme.textLight};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'});
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryButton = styled(motion.button)`
  background-color: ${props => props.active ? props.theme.primary : props.theme.cardBackground};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? `0 4px 10px ${props.theme.shadow}` : `0 2px 5px ${props.theme.shadow}`};
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProductSection = styled.section`
  padding: 2rem;
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textLight};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textLight};
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  margin: 2rem 0;
`;

const ChatbotToggle = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.heroGradient};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  z-index: 100;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%);
    opacity: 0.7;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    border-radius: 50%;
  }
`;

const ChatbotIcon = styled(motion.span)`
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
`;
