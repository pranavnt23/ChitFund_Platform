import React, { useEffect, useState } from 'react';
import './Home.css';  // Import the CSS file
import homeImage from './images/img2.jpg'; // Ensure this path is correct

function Home() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Trigger the animation when component mounts
  }, []);

  return (
    <div className="home-container">
      <div className="home-image">
        <img src={homeImage} alt="Financial illustration" />
      </div>
      <div className="home-text">
        <h1 className={animate ? 'fadeInUp' : 'hidden'}>WELCOME TO FUNDVERSE!!</h1>
        <p className={animate ? 'fadeInUp' : 'hidden'}>
          Your trusted platform for investment schemes and financial growth.
          Join us to explore various financial schemes tailored to your needs.
        </p>
      </div>
    </div>
  );
}

export default Home;
