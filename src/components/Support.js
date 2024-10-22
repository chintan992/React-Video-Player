// src/components/Support.js
import React from 'react';
import './Support.css';

const Support = () => {
  return (
    <div className="support-container">
      <h1>Support</h1>
      
      <section className="support-section">
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li>
            <h3>How do I use Let's Stream?</h3>
            <p>Simply enter the ID of the movie or TV series you want to watch, along with any necessary season and episode information, and click submit.</p>
          </li>
          <li>
            <h3>Is Let's Stream free to use?</h3>
            <p>Yes, Let's Stream is a free service. We do not charge for access to our platform.</p>
          </li>
          <li>
            <h3>What do I do if a stream isn't working?</h3>
            <p>Try refreshing the page or selecting a different source if available. If the problem persists, the content may no longer be available.</p>
          </li>
        </ul>
      </section>

      <section className="support-section">
        <h2>Contact Us</h2>
        <p>If you have any questions or concerns that aren't addressed in our FAQ, please feel free to contact us at support@letsstream.netlify.app</p>
      </section>

      <section className="support-section dmca-disclaimer">
        <h2>DMCA Disclaimer</h2>
        <p>Let's Stream is a platform that provides easy access to content hosted on third-party websites. We do not host, upload, or distribute any content ourselves. We are not responsible for and have no control over the content, accuracy, copyright compliance, legality, decency, or any other aspect of the content provided through our service.</p>
        <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please contact the third-party content providers directly. Let's Stream is not responsible for the removal of any allegedly infringing content.</p>
        <p>Let's Stream respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please follow the procedures set forth in the Digital Millennium Copyright Act (DMCA) and contact the hosting providers of the content directly.</p>
        <p>By using Let's Stream, you acknowledge and agree that you are solely responsible for your use of the service and any content you access through it.</p>
      </section>
    </div>
  );
};

export default Support;