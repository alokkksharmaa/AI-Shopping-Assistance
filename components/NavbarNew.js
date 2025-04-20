import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { theme, isDarkTheme } = useContext(ThemeContext);
  
  // Initialize cart and listen for add-to-cart events
  useEffect(() => {
    // Initialize with a demo item
    const demoItems = [
      {
        id: 'electronics-1',
        title: 'Smartphone X Pro',
        price: 74999,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ];
    
    setCartItems(demoItems);
    
    // Listen for add-to-cart events
    const handleAddToCart = (event) => {
      const { product } = event.detail;
      
      // Check if the product is already in the cart
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += product.quantity;
          return updatedItems;
        } else {
          // Add new item to cart
          return [...prevItems, product];
        }
      });
      
      // Open the cart to show the added item
      setCartOpen(true);
    };
    
    window.addEventListener('add-to-cart', handleAddToCart);
    
    // Cleanup
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      console.log('Searching for:', searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <NavContainer scrolled={scrolled}>
      <NavContent>
        <Logo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          scrolled={scrolled}
        >
          ShopSmart
        </Logo>

        <NavLinks>
          <NavLink 
            href="#" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            scrolled={scrolled}
          >
            Home
          </NavLink>
          <NavLink 
            href="#products" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            scrolled={scrolled}
          >
            Products
          </NavLink>
          <NavLink 
            href="#" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            scrolled={scrolled}
          >
            Categories
          </NavLink>
        </NavLinks>

        <NavActions>
          <SearchContainer>
            <SearchForm onSubmit={handleSearch}>
              {searchOpen && (
                <SearchInput 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              )}
              {searchOpen && searchQuery && (
                <ClearButton
                  onClick={() => setSearchQuery('')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </ClearButton>
              )}
            </SearchForm>
            <ActionButton 
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen && searchQuery) {
                  handleSearch({ preventDefault: () => {} });
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              aria-label="Search"
              scrolled={scrolled}
            >
              <FaSearch />
            </ActionButton>
          </SearchContainer>
          
          <ThemeToggle />
          
          <ActionButton 
            onClick={toggleCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            scrolled={scrolled}
          >
            <FaShoppingCart />
            <CartBadge>{cartItems.length}</CartBadge>
          </ActionButton>
          
          <AnimatePresence>
            {cartOpen && (
              <CartPanel
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CartHeader>
                  <CartTitle>Your Cart</CartTitle>
                  <CloseCartButton onClick={toggleCart}>
                    <FaTimes />
                  </CloseCartButton>
                </CartHeader>
                
                {cartItems.length === 0 ? (
                  <EmptyCart>Your cart is empty</EmptyCart>
                ) : (
                  <CartItemsList>
                    {cartItems.map(item => (
                      <CartItem key={item.id}>
                        <CartItemImage>
                          <img src={item.image} alt={item.title} />
                        </CartItemImage>
                        <CartItemInfo>
                          <CartItemTitle>{item.title}</CartItemTitle>
                          <CartItemPrice>₹{item.price.toLocaleString('en-IN')}</CartItemPrice>
                          <CartItemQuantity>
                            <QuantityValue>Qty: {item.quantity}</QuantityValue>
                          </CartItemQuantity>
                        </CartItemInfo>
                        <RemoveButton
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash />
                        </RemoveButton>
                      </CartItem>
                    ))}
                  </CartItemsList>
                )}
                
                {cartItems.length > 0 && (
                  <CartFooter>
                    <CartTotal>
                      <span>Total:</span>
                      <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                    </CartTotal>
                    <CheckoutButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Checkout
                    </CheckoutButton>
                  </CartFooter>
                )}
              </CartPanel>
            )}
          </AnimatePresence>
        </NavActions>
      </NavContent>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.5rem 2rem;
  background-color: ${props => props.scrolled ? 
    `rgba(${props.theme.isDarkTheme ? '18, 18, 18, 0.85' : '255, 255, 255, 0.85'})` : 
    'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.scrolled ? 
    `0 4px 20px rgba(0, 0, 0, ${props.theme.isDarkTheme ? '0.3' : '0.1'})` : 
    'none'};
  border-bottom: ${props => props.scrolled ? 
    `1px solid rgba(${props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'})` : 
    'none'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 0.5rem 2rem;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${props => props.theme.isDarkTheme ? 
    (props.scrolled ? '#fff' : '#fff') : 
    (props.scrolled ? props.theme.primary : '#fff')};
  cursor: pointer;
  transition: color 0.3s ease;
  background: ${props => props.scrolled ? 'none' : 'linear-gradient(to right, #ffffff, #e0e0ff)'};
  -webkit-background-clip: ${props => props.scrolled ? 'none' : 'text'};
  -webkit-text-fill-color: ${props => props.scrolled ? 'initial' : 'transparent'};
  text-shadow: ${props => props.scrolled ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.2)'};
  letter-spacing: -0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  margin: 0 1rem;
  color: ${props => props.theme.isDarkTheme ? 
    (props.scrolled ? '#fff' : '#fff') : 
    (props.scrolled ? props.theme.navText : '#fff')};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0.5rem 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 2px;
    opacity: 0.8;
  }
  
  &:hover {
    color: ${props => props.theme.primary};
    transform: translateY(-2px);
    
    &:after {
      width: 80%;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  position: relative;
  z-index: 2;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 3;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  position: relative;
`;

const SearchInput = styled.input`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 30px;
  margin-right: 0.5rem;
  background: rgba(${props => props.theme.isDarkTheme ? '50, 50, 50, 0.8' : '255, 255, 255, 0.8'});
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: ${props => props.theme.text};
  width: 220px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'});
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.primary}, 0 5px 15px rgba(0, 0, 0, 0.1);
    width: 250px;
  }
  
  @media (max-width: 480px) {
    width: 150px;
    
    &:focus {
      width: 180px;
    }
  }
`;

const ClearButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.textLight};
  cursor: pointer;
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.scrolled ? 
    `rgba(${props.theme.isDarkTheme ? '50, 50, 50, 0.3' : '255, 255, 255, 0.3'})` : 
    'rgba(255, 255, 255, 0.2)'};
  border: none;
  color: ${props => props.theme.isDarkTheme ? 
    (props.scrolled ? '#fff' : '#fff') : 
    (props.scrolled ? props.theme.navText : '#fff')};
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    background: ${props => props.theme.primary};
    color: white;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid ${props => props.theme.isDarkTheme ? '#222' : 'white'};
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  ${ActionButton}:hover & {
    transform: scale(1.1);
  }
`;

const CartPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 350px;
  background: rgba(${props => props.theme.isDarkTheme ? '30, 30, 30, 0.9' : '255, 255, 255, 0.9'});
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  z-index: 100;
  max-height: 450px;
  overflow-y: auto;
  border: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'});
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.2' : '0, 0, 0, 0.2'});
    border-radius: 3px;
  }
  
  @media (max-width: 480px) {
    width: 300px;
    right: -50px;
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.1' : '0, 0, 0, 0.1'});
`;

const CartTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CloseCartButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textLight};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.1' : '0, 0, 0, 0.05'});
    color: ${props => props.theme.primary};
  }
`;

const EmptyCart = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
`;

const CartItemsList = styled.div`
  overflow-y: auto;
  max-height: 300px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.05' : '0, 0, 0, 0.05'});
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  background: rgba(${props => props.theme.isDarkTheme ? '50, 50, 50, 0.5' : '245, 245, 245, 0.5'});
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CartItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  margin-bottom: 0.3rem;
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
`;

const QuantityValue = styled.span`
  font-weight: 500;
`;

const RemoveButton = styled(motion.button)`
  background: rgba(${props => props.theme.isDarkTheme ? '50, 50, 50, 0.3' : '245, 245, 245, 0.5'});
  border: none;
  color: ${props => props.theme.textLight};
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const CartFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(${props => props.theme.isDarkTheme ? '255, 255, 255, 0.1' : '0, 0, 0, 0.1'});
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  
  span:last-child {
    color: ${props => props.theme.primary};
    font-size: 1.1rem;
  }
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.heroGradient};
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

export default Navbar;
