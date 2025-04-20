import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>ShopSmart</FooterLogo>
          <FooterDescription>
            Your one-stop shop for electronics, food, clothing, medicine, household goods, stationery, books, and sports equipment.
            Powered by AI to give you the best shopping experience.
          </FooterDescription>
          <ContactInfo>
            <ContactItem>
              <FaEnvelope />
              <span>support@shopsmart.com</span>
            </ContactItem>
            <ContactItem>
              <FaPhone />
              <span>+1 (800) 123-4567</span>
            </ContactItem>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>123 Commerce St, Business City</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLinks>
            <FooterLink href="#">Home</FooterLink>
            <FooterLink href="#products">Products</FooterLink>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Categories</FooterTitle>
          <FooterLinks>
            <FooterLink href="#">Electronics</FooterLink>
            <FooterLink href="#">Food & Groceries</FooterLink>
            <FooterLink href="#">Clothing & Fashion</FooterLink>
            <FooterLink href="#">Medicine & Health</FooterLink>
            <FooterLink href="#">Household Goods</FooterLink>
            <FooterLink href="#">Stationery</FooterLink>
            <FooterLink href="#">Books</FooterLink>
            <FooterLink href="#">Sports Equipment</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact Us</FooterTitle>
          <ContactInfo>
            <ContactItem>
              <ContactIcon><FaMapMarkerAlt /></ContactIcon>
              <span>123 Shopping Street, Commerce City, CC 12345</span>
            </ContactItem>
            <ContactItem>
              <ContactIcon><FaPhone /></ContactIcon>
              <span>+1 (555) 123-4567</span>
            </ContactItem>
            <ContactItem>
              <ContactIcon><FaEnvelope /></ContactIcon>
              <span>support@shopsmart.com</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>&copy; {new Date().getFullYear()} ShopSmart. All rights reserved.</Copyright>
        <FooterBottomLinks>
          <FooterBottomLink href="#">Privacy Policy</FooterBottomLink>
          <FooterBottomLink href="#">Terms of Service</FooterBottomLink>
        </FooterBottomLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
  color: #fff;
  padding: 3rem 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const FooterDescription = styled.p`
  color: #b3b3cc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  display: block;
  position: relative;
  padding-left: 0.5rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 0 4px 4px;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0);
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: #4a6cf7;
    transform: translateX(5px);
    
    &:before {
      border-color: transparent transparent transparent #4a6cf7;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  gap: 0.8rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
  
  &:hover {
    color: #4a6cf7;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ContactIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(110, 142, 251, 0.08);
  font-size: 1.2rem;
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: #b3b3cc;
  font-size: 0.9rem;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterBottomLink = styled.a`
  color: #b3b3cc;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #6e8efb;
  }
`;

export default Footer;
