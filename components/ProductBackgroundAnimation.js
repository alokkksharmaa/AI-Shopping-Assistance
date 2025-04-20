import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getAllProducts } from '../utils/api';

const ProductBackgroundAnimation = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // Select 10 random products with images
        const randomProducts = allProducts
          .filter(product => product.image)
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching products for background:', error);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <AnimationContainer>
      {products.map((product, index) => (
        <FloatingProduct
          key={`floating-${product.id}-${index}`}
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 80}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 15}s`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0.5, 0.7, 0],
            scale: [0, 1, 1.2, 1, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -100, Math.random() * 100, 0],
            rotate: [0, Math.random() * 360, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15 + Math.random() * 15,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            delay: Math.random() * 5,
          }}
        >
          <ProductImage src={product.image} alt="" />
        </FloatingProduct>
      ))}
    </AnimationContainer>
  );
};

const AnimationContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const FloatingProduct = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
`;

const ProductImage = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
`;

export default ProductBackgroundAnimation;
