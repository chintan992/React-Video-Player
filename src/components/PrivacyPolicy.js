import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TableOfContents = ({ sections }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav aria-label="Table of contents" className="mb-8 p-4 bg-gray-50 dark:bg-[#000e14] rounded-lg">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Table of Contents</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

TableOfContents.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  ) : null;
};

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = [
    { id: 'collection', title: '1. Information We Collect' },
    { id: 'usage', title: '2. How We Use Your Information' },
    { id: 'cookies', title: '3. Cookies and Tracking' },
    { id: 'sharing', title: '4. Information Sharing' },
    { id: 'security', title: '5. Security Measures' },
    { id: 'rights', title: '6. Your Rights and Choices' },
    { id: 'retention', title: '7. Data Retention' },
    { id: 'contact', title: '8. Contact Information' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen dark:bg-[#000e14]">
      <article className="max-w-4xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300">Last updated: {lastUpdated}</p>
        
        <TableOfContents sections={sections} />

        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section id="collection" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">1. Information We Collect</h2>
            <p>We collect the following types of information when you use our video player service:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Account information (email, username, preferences)</li>
              <li>Usage data (viewing history, interactions)</li>
              <li>Device information (browser type, IP address)</li>
              <li>Optional profile information you choose to provide</li>
            </ul>
          </section>

          <section id="usage" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide and personalize our services</li>
              <li>Improve user experience and content recommendations</li>
              <li>Maintain service security and prevent abuse</li>
              <li>Communicate important updates and announcements</li>
              <li>Analyze service performance and usage patterns</li>
            </ul>
          </section>

          <section id="cookies" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">3. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Remember your preferences and settings</li>
              <li>Maintain your session security</li>
              <li>Analyze site traffic and performance</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="mt-2">You can manage cookie preferences through your browser settings.</p>
          </section>

          <section id="sharing" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">4. Information Sharing</h2>
            <p>We share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With service providers under strict confidentiality agreements</li>
              <li>In the event of a business transfer or acquisition</li>
            </ul>
          </section>

          <section id="security" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">5. Security Measures</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Continuous monitoring for potential threats</li>
            </ul>
          </section>

          <section id="rights" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section id="retention" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">7. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="mt-2">You can request deletion of your account and associated data at any time.</p>
          </section>

          <section id="contact" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">8. Contact Information</h2>
            <p>For privacy-related inquiries, please contact us at:</p>
            <div className="mt-2">
              <p>Email: privacy@example.com</p>
              <p>Address: 123 Privacy Street, Secure City, 12345</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>
      </article>
      <BackToTop />
    </div>
  );
};

export default PrivacyPolicy;
