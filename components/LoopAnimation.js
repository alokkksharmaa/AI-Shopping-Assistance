import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const LoopAnimation = () => {
  const containerRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const animateLoop = async () => {
      // Infinite animation loop
      while (true) {
        // Animate floating products
        await controls.start({
          y: [0, -15, 0],
          transition: { 
            duration: 3, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: 1
          }
        });
      }
    };

    animateLoop();
  }, [controls]);

  return (
    <AnimationContainer ref={containerRef}>
      <AnimationOverlay />
      <AnimationContent>
        <AnimationTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Discover Amazing Products
        </AnimationTitle>
        
        <ProductsRow>
          {productItems.map((item, index) => (
            <ProductItem 
              key={index}
              custom={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={controls}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                staggerChildren: 0.1
              }}
            >
              <ProductImage src={item.image} alt={item.name} />
              <ProductName>{item.name}</ProductName>
              <ProductPrice>₹{item.price}</ProductPrice>
            </ProductItem>
          ))}
        </ProductsRow>
        
        <AnimationSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Over 1000+ Products Available
        </AnimationSubtitle>
      </AnimationContent>
    </AnimationContainer>
  );
};

// Sample product items for the animation
const productItems = [
  {
    name: "Smartphone",
    price: "24,999",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Headphones",
    price: "8,999",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Smart Watch",
    price: "12,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Laptop",
    price: "56,999",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Camera",
    price: "45,999",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const AnimationContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #4a6cf7 0%, #6e8efb 100%);
  margin: 2rem 0;
  border-radius: 12px;
`;

const AnimationOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
`;

const AnimationContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  color: white;
  text-align: center;
`;

const AnimationTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const AnimationSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProductsRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ProductItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  width: 140px;
  
  @media (max-width: 768px) {
    width: 110px;
    padding: 0.75rem;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ProductPrice = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

export default LoopAnimation;
