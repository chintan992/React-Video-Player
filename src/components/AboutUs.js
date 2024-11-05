// src/components/AboutUs.js

// Import necessary dependencies
import React from 'react';
// Import the CSS file for styling
import './AboutUs.css';

// Define the AboutUs component as a functional component
const AboutUs = () => {
  // The component returns JSX, which describes what will be rendered
  return (
    // Main container for the About Us page
    <div className="about-us-container">
      {/* Main heading for the page */}
      <h1>About Let's Stream</h1>

      {/* Section for describing the mission */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Let's Stream, we're passionate about bringing you the best streaming experience possible. 
          Our mission is to provide a user-friendly platform that connects you with your favorite movies 
          and TV series, all in one place.
        </p>
      </section>

      {/* Section listing what the service offers */}
      <section className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Access to a wide range of movies and TV series</li>
          <li>User-friendly interface for easy navigation</li>
          <li>High-quality streaming from multiple sources</li>
          <li>Regular updates to our content library</li>
          <li>Personalized recommendations based on your viewing history</li>
        </ul>
      </section>

      {/* Section describing the technology used */}
      <section className="about-section">
        <h2>Our Technology</h2>
        <p>
          Let's Stream utilizes cutting-edge web technologies to ensure a smooth and responsive 
          user experience. We've built our platform using React, which allows for fast and 
          efficient updates to our user interface.
        </p>
      </section>

      {/* Section about future plans */}
      <section className="about-section">
        <h2>Looking Forward</h2>
        <p>
          We're constantly working to improve Let's Stream and bring you new features. Our team 
          is dedicated to enhancing your streaming experience and expanding our content offerings.
        </p>
      </section>
    </div>
  );
};

// Export the component so it can be used in other parts of the application
export default AboutUs;