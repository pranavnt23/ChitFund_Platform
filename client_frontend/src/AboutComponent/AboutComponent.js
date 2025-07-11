import React, { useState } from 'react';
import './AboutComponent.css';

const ContentCard = ({ title, content, isActive }) => (
  <div className={`content-card ${isActive ? 'active' : ''}`}>
    <h2 className="card-title">{title}</h2>
    <p className={`card-content ${isActive ? 'scrollable' : ''}`}>{content}</p>
  </div>
);

const AboutComponent = () => {
  const contentSections = [
    {
      title: "OUR VISION AND VALUES",
      content: "At FundVerse, we are committed to revolutionizing how people manage their savings and investments through chit funds. Our vision is to create a transparent, accessible, and secure platform that empowers individuals to achieve their financial goals."
    },
    {
      title: "OUR COMMITMENT TO INNOVATION",
      content: "With FundVerse, we bring a fresh approach to chit funds by blending the traditional savings mechanism with cutting-edge technology. We're constantly innovating to provide our users with the best possible experience and financial outcomes."
    },
    {
      title: "OUR MILESTONES",
      content: "With the trust and support of our ever-growing community, FundVerse has reached significant milestones in its journey. We've successfully facilitated thousands of chit funds, helping our users save and invest wisely."
    },
    {
      title: "LEVERAGING INDIA'S DIGITAL INFRASTRUCTURE",
      content: "As leaders in the chit fund industry, FundVerse utilizes India's advanced digital infrastructure, including UPI payments, eKYC, and digital signatures. This ensures a seamless and secure experience for all our users."
    },
    {
      title: "EMPOWERING FINANCIAL INCLUSION",
      content: "At FundVerse, we are passionate about promoting financial inclusion. We are aligned with key national initiatives to bring formal financial services to every Indian, regardless of their economic background."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(2);

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + contentSections.length) % contentSections.length);
  };

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % contentSections.length);
  };

  return (
    <div className="autoplay-card-slider">
      <div className="slider-container">
        <div className="slider-wrapper">
          {contentSections.map((section, index) => (
            <ContentCard
              key={index}
              {...section}
              isActive={index === activeIndex}
            />
          ))}
        </div>
        <button onClick={goToPrevSlide} className="nav-button prev-button">&lt;</button>
        <button onClick={goToNextSlide} className="nav-button next-button">&gt;</button>
      </div>
    </div>
  );
};

export default AboutComponent;
