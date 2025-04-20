import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';

const Chatbot = ({ onClose, products }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your ShopSmart assistant. I can help you find products in electronics, food, clothing, medicine, household goods, stationery, books, and sports equipment. I can also add items to your cart. What are you looking for today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const messagesEndRef = useRef(null);
  const controls = useAnimation();
  
  // Welcome animation
  useEffect(() => {
    if (showWelcomeAnimation) {
      controls.start({
        scale: [0.9, 1.05, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      });
      
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomeAnimation, controls]);

  // Categories and their keywords for matching
  const categories = {
    'electronics': ['electronics', 'gadget', 'phone', 'laptop', 'computer', 'tv', 'headphone', 'camera', 'tech', 'electronic'],
    'food': ['food', 'snack', 'drink', 'grocery', 'meal', 'fruit', 'vegetable', 'meat', 'dairy', 'eat', 'edible'],
    'clothing': ['clothing', 'clothes', 'shirt', 'pant', 'dress', 'jacket', 'shoe', 'fashion', 'wear', 'outfit', 'apparel', 'garment'],
    'medicine': ['medicine', 'drug', 'health', 'pill', 'vitamin', 'supplement', 'pharmacy', 'medical', 'healthcare', 'prescription'],
    'household': ['household', 'home', 'kitchen', 'bathroom', 'furniture', 'cleaning', 'decor', 'appliance', 'house', 'living'],
    'stationery': ['stationery', 'office', 'pen', 'paper', 'notebook', 'pencil', 'marker', 'school', 'supply', 'write', 'drawing'],
    'books': ['book', 'novel', 'textbook', 'reading', 'literature', 'fiction', 'nonfiction', 'cookbook', 'biography', 'history', 'science', 'business', 'self-help', 'education'],
    'sports': ['sport', 'fitness', 'exercise', 'gym', 'yoga', 'running', 'swimming', 'basketball', 'tennis', 'cycling', 'workout', 'athletic', 'training', 'equipment']
  };
  
  // Actions and their keywords for matching
  const actions = {
    'add_to_cart': ['add to cart', 'buy', 'purchase', 'get', 'order', 'want', 'add', 'cart'],
    'search': ['search', 'find', 'look for', 'looking for', 'where is', 'where are', 'locate', 'show me'],
    'explore': ['explore', 'browse', 'show all', 'display', 'list', 'view', 'see']
  };

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Process the user's message and generate a response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Add user message with the suggestion
    const userMessage = {
      id: messages.length + 1,
      text: suggestion.text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setSuggestions([]);
    
    // Process the suggestion and show products
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `Here are some ${suggestion.category} products you might like:`,
        sender: 'bot',
        timestamp: new Date(),
        products: suggestion.products
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let matchedCategory = null;
    let highestCategoryScore = 0;
    let matchedAction = null;
    let highestActionScore = 0;
    
    // Find the best matching category based on keywords
    Object.entries(categories).forEach(([category, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return input.includes(keyword) ? acc + 1 : acc;
      }, 0);
      
      if (score > highestCategoryScore) {
        highestCategoryScore = score;
        matchedCategory = category;
      }
    });
    
    // Find the best matching action based on keywords
    Object.entries(actions).forEach(([action, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return input.includes(keyword) ? acc + 1 : acc;
      }, 0);
      
      if (score > highestActionScore) {
        highestActionScore = score;
        matchedAction = action;
      }
    });
    
    // Handle add to cart action
    if (matchedAction === 'add_to_cart' && matchedCategory && highestCategoryScore > 0) {
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase().includes(matchedCategory)
      ).slice(0, 1);
      
      if (categoryProducts.length > 0) {
        // Simulate adding to cart
        const product = categoryProducts[0];
        
        return {
          id: messages.length + 2,
          text: `I've added ${product.title} to your cart for ₹${product.price}. Would you like to continue shopping?`,
          sender: 'bot',
          timestamp: new Date(),
          products: [product],
          action: 'added_to_cart'
        };
      }
    }
    
    // Handle search action
    if (matchedAction === 'search' && matchedCategory && highestCategoryScore > 0) {
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase().includes(matchedCategory)
      ).slice(0, 3);
      
      return {
        id: messages.length + 2,
        text: `Here are some ${matchedCategory} products I found for you:`,
        sender: 'bot',
        timestamp: new Date(),
        products: categoryProducts
      };
    }
    
    // Handle explore action
    if (matchedAction === 'explore' && matchedCategory && highestCategoryScore > 0) {
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase().includes(matchedCategory)
      ).slice(0, 5);
      
      return {
        id: messages.length + 2,
        text: `Here's a selection of our ${matchedCategory} products:`,
        sender: 'bot',
        timestamp: new Date(),
        products: categoryProducts
      };
    }
    
    // If a category is matched but no specific action
    if (matchedCategory && highestCategoryScore > 0) {
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase().includes(matchedCategory)
      ).slice(0, 3);
      
      return {
        id: messages.length + 2,
        text: `Here are some ${matchedCategory} products you might like:`,
        sender: 'bot',
        timestamp: new Date(),
        products: categoryProducts
      };
    }
    
    // If asking for recommendations or suggestions
    if (input.includes('recommend') || input.includes('suggest') || input.includes('show me')) {
      // Generate suggestions for different categories
      setSuggestions([
        { 
          text: 'Show me electronics', 
          category: 'electronics',
          products: products.filter(p => p.category.toLowerCase().includes('electronics')).slice(0, 3)
        },
        { 
          text: 'I need clothing items', 
          category: 'clothing',
          products: products.filter(p => p.category.toLowerCase().includes('clothing')).slice(0, 3)
        },
        { 
          text: 'Show household products', 
          category: 'household',
          products: products.filter(p => p.category.toLowerCase().includes('household')).slice(0, 3)
        }
      ]);
      
      return {
        id: messages.length + 2,
        text: "What kind of products are you interested in? Here are some options:",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Handle cart-related queries
    if (input.includes('cart') || input.includes('basket') || input.includes('shopping list')) {
      return {
        id: messages.length + 2,
        text: "You can view your cart by clicking the cart icon in the top right corner. Would you like to add something to your cart?",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Handle search-related queries without category
    if (matchedAction === 'search' && !matchedCategory) {
      setSuggestions([
        { text: 'Search electronics', category: 'electronics' },
        { text: 'Search clothing', category: 'clothing' },
        { text: 'Search food items', category: 'food' },
        { text: 'Search medicine', category: 'medicine' },
        { text: 'Search household goods', category: 'household' },
        { text: 'Search stationery', category: 'stationery' }
      ]);
      
      return {
        id: messages.length + 2,
        text: "What category would you like to search in?",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Default response if no category or action is matched
    return {
      id: messages.length + 2,
      text: "I can help you find products in electronics, food, clothing, medicine, household goods, and stationery. I can also add items to your cart. What would you like to do?",
      sender: 'bot',
      timestamp: new Date()
    };
  };

  return (
    <ChatbotContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <ChatHeader>
        <ChatTitle>ShopSmart Assistant</ChatTitle>
        <CloseButton 
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes />
        </CloseButton>
      </ChatHeader>
      
      <ChatMessages>
        <AnimatePresence>
          {messages.map((message) => (
            <MessageContainer
              key={message.id}
              sender={message.sender}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              action={message.action}
            >
              {message.sender === 'bot' && (
                <BotAvatar animate={message.id === 1 && showWelcomeAnimation ? controls : {}}>
                  <FaRobot size={22} color="#6e8efb" />
                </BotAvatar>
              )}
              {message.sender === 'user' && (
                <UserAvatar>
                  <FaUser size={18} color="#ffffff" />
                </UserAvatar>
              )}
              <MessageBubble sender={message.sender}>
                <MessageText>{message.text}</MessageText>
                {message.products && (
                  <ProductSuggestions>
                    {message.products.map((product) => (
                      <ProductSuggestion key={product.id}>
                        <ProductImage>
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            width={60} 
                            height={60}
                            style={{ objectFit: "contain" }}
                          />
                        </ProductImage>
                        <ProductInfo>
                          <ProductName>{product.title}</ProductName>
                          <ProductPrice>₹{product.price}</ProductPrice>
                          <AddToCartButton 
                            onClick={() => {
                              // Add the product to cart
                              window.dispatchEvent(new CustomEvent('add-to-cart', { 
                                detail: { product: { ...product, quantity: 1 } }
                              }));
                              
                              // Add a confirmation message
                              setMessages(prev => [
                                ...prev,
                                {
                                  id: prev.length + 1,
                                  text: `Added ${product.title} to your cart for ₹${product.price}.`,
                                  sender: 'bot',
                                  timestamp: new Date()
                                }
                              ]);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaShoppingCart size={10} /> Add to Cart
                          </AddToCartButton>
                        </ProductInfo>
                      </ProductSuggestion>
                    ))}
                  </ProductSuggestions>
                )}
                <MessageTime>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MessageTime>
              </MessageBubble>
            </MessageContainer>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <MessageContainer sender="bot">
            <BotAvatar>
              <FaRobot size={22} color="#6e8efb" />
            </BotAvatar>
            <TypingIndicator>
              <TypingDot delay="0s" />
              <TypingDot delay="0.2s" />
              <TypingDot delay="0.4s" />
            </TypingIndicator>
          </MessageContainer>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      {suggestions.length > 0 && (
        <SuggestionsContainer>
          {suggestions.map((suggestion, index) => (
            <Suggestion 
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {suggestion.text}
            </Suggestion>
          ))}
        </SuggestionsContainer>
      )}
      
      <ChatInputContainer>
        <ChatInput 
          type="text" 
          placeholder="Type your message..." 
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <SendButton 
          onClick={handleSendMessage}
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: input.trim() !== '' ? -5 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          disabled={input.trim() === ''}
        >
          <FaPaperPlane />
        </SendButton>
      </ChatInputContainer>
    </ChatbotContainer>
  );
};

const ChatbotContainer = styled(motion.div)`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  border: 1px solid rgba(110, 142, 251, 0.1);
  backdrop-filter: blur(10px);
  
  @media (max-width: 480px) {
    width: 90%;
    right: 5%;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    opacity: 0.6;
    pointer-events: none;
  }
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #4ade80;
    border-radius: 50%;
    margin-right: 4px;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(74, 222, 128, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
    }
  }
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const MessageContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  justify-content: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  margin-bottom: 0.5rem;
  ${props => props.action === 'added_to_cart' && `
    position: relative;
    &:after {
      content: '✓ Added to cart';
      position: absolute;
      top: -15px;
      left: 50px;
      background: #4caf50;
      color: white;
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      animation: fadeIn 0.5s ease-in;
    }
  `}
`;

const BotAvatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.5rem;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(110, 142, 251, 0.3);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 0.5rem;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.9rem 1rem;
  border-radius: ${props => props.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0'};
  background-color: ${props => props.sender === 'user' ? 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)' : '#f5f7fa'};
  background: ${props => props.sender === 'user' ? 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)' : '#f5f7fa'};
  color: ${props => props.sender === 'user' ? 'white' : '#333'};
  position: relative;
  box-shadow: ${props => props.sender === 'user' ? '0 2px 8px rgba(110, 142, 251, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  
  &:before {
    content: '';
    position: absolute;
    bottom: ${props => props.sender === 'user' ? '0' : '10px'};
    ${props => props.sender === 'user' ? 'right: -6px' : 'left: -6px'};
    width: 12px;
    height: 12px;
    background: ${props => props.sender === 'user' ? '#a777e3' : '#f5f7fa'};
    transform: rotate(45deg);
    display: ${props => props.products ? 'none' : 'block'};
  }
`;

const MessageText = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  text-align: right;
  margin-top: 0.3rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-radius: 18px 18px 18px 0;
  background-color: #f5f7fa;
  width: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    bottom: 10px;
    left: -6px;
    width: 12px;
    height: 12px;
    background: #f5f7fa;
    transform: rotate(45deg);
  }
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #6e8efb;
  border-radius: 50%;
  margin: 0 2px;
  animation: typing 1.4s infinite;
  animation-delay: ${props => props.delay};
  opacity: 0.7;
  
  @keyframes typing {
    0%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-5px);
      opacity: 1;
    }
  }
`;

const ProductSuggestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ProductSuggestion = styled(motion.div)`
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: rgba(110, 142, 251, 0.3);
  }
`;

const AddToCartButton = styled(motion.button)`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  margin-top: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.5s ease;
  }

  &:hover {
    background-color: #3a5ce5;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(74, 108, 247, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  background-color: #f9f9f9;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductInfo = styled.div`
  flex: 1;
  margin-left: 0.5rem;
`;

const ProductName = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #6e8efb;
  margin-top: 0.2rem;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f9f9f9;
`;

const Suggestion = styled(motion.button)`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    border-color: #d0d0d0;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: #6e8efb;
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Chatbot;
