import { useState, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ThemeContext } from '../contexts/ThemeContext';
import GlassmorphicCard from './GlassmorphicCard';
import { FaShoppingCart, FaHeart, FaSearch, FaRegHeart } from 'react-icons/fa';

const ProductGrid = ({ products }) => {
  const { theme, isDarkTheme } = useContext(ThemeContext);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    // Add animation effect
    const button = e.currentTarget;
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 300);
    
    // Dispatch add to cart event
    window.dispatchEvent(new CustomEvent('add-to-cart', { 
      detail: { product: { ...product, quantity: 1 } }
    }));
  };
  
  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };
  
  const handleQuickView = (product, e) => {
    e.stopPropagation();
    // In a real app, this would open a modal with product details
    console.log('Quick view:', product.title);
  };

  return (
    <GridContainer>
      {products.length === 0 ? (
        <NoProducts>No products found in this category.</NoProducts>
      ) : (
        products.map((product) => (
          <ProductCard 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleQuickView(product, event)}
            opacity={0.85}
            blur="8px"
          >
            <WishlistButton
              onClick={(e) => toggleWishlist(product.id, e)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Add to wishlist"
            >
              {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
            </WishlistButton>
            
            <ProductImageContainer>
              <ProductImage
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                objectFit="contain"
              />
              <AnimatePresence>
                {hoveredProduct === product.id && (
                  <ActionOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuickViewButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleQuickView(product, e)}
                    >
                      <FaSearch /> Quick View
                    </QuickViewButton>
                  </ActionOverlay>
                )}
              </AnimatePresence>
            </ProductImageContainer>
            
            <ProductContent>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>₹{product.price.toLocaleString('en-IN')}</ProductPrice>
              
              <AddToCartButton
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAddToCart(product, e)}
              >
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
            </ProductContent>
          </ProductCard>
        ))
      )}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
`;

const NoProducts = styled(GlassmorphicCard)`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 2rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const ProductCard = styled(GlassmorphicCard)`
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  padding: 1rem;
  height: 100%;
  min-height: 380px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: ${props => `rgba(${props.theme.isDarkTheme ? '40, 40, 40' : '250, 250, 250'}, 0.5)`};
  transition: all 0.3s ease;
`;

const ProductImage = styled(Image)`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  
  ${ProductImageContainer}:hover & {
    transform: scale(1.08);
  }
`;

const ActionOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`;

const QuickViewButton = styled(motion.button)`
  background-color: ${props => props.theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  svg {
    font-size: 0.9rem;
  }
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0.5rem;
`;

const ProductCategory = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: ${props => props.theme.text};
  height: 2.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin: 0.5rem 0 1rem 0;
  margin-top: auto;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 2px;
    background: ${props => props.theme.primary};
    margin-right: 0.5rem;
    transition: width 0.3s ease;
  }
  
  ${ProductCard}:hover &::before {
    width: 30px;
  }
`;

const AddToCartButton = styled(motion.button)`
  background: ${props => props.theme.heroGradient};
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  
  svg {
    font-size: 0.9rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
  
  &.clicked {
    animation: pulse 0.3s ease-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
`;

const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => `rgba(${props.theme.isDarkTheme ? '40, 40, 40' : '255, 255, 255'}, 0.8)`};
  color: ${props => props.theme.primary};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

ProductImageContainer.displayName = 'ProductImageContainer';
ActionOverlay.displayName = 'ActionOverlay';
QuickViewButton.displayName = 'QuickViewButton';

const StyledProductGrid = styled.div`
  /* Styles for product grid */
`;

export default ProductGrid;
