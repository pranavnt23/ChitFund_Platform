import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './FooterComponent.css'; // Assuming you're using a separate CSS file for the footer styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section company">
        <h4>Company</h4>
        <ul>
          <li>About Us</li>
          <li>Our Services</li>
          <li>Privacy Policy</li>
          <li>Affiliate Program</li>
        </ul>
      </div>
      <div className="footer-section help">
        <h4>Get Help</h4>
        <ul>
          <li>FAQ</li>
          <li>Shipping</li>
          <li>Returns</li>
          <li>Order Status</li>
          <li>Payment Options</li>
        </ul>
      </div>
      <div className="footer-section shop">
        <h4>Online Shop</h4>
        <ul>
          <li>Watch</li>
          <li>Bag</li>
          <li>Shoes</li>
          <li>Dress</li>
        </ul>
      </div>
      <div className="footer-section follow-us">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="icon facebook" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="icon twitter" />
          </a>
          <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} className="icon whatsapp" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="icon instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
