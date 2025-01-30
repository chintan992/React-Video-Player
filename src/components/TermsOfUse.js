import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const TermsOfUse = ({ lastUpdated = new Date().toLocaleDateString() }) => {
  const [activeSection, setActiveSection] = useState('');
  const sectionsRef = useRef({});

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: 'By accessing and using this video player, you accept and agree to be bound by these Terms of Use. Please read these terms carefully before using our service.'
    },
    {
      id: 'responsibilities',
      title: '2. User Responsibilities',
      content: `Users are responsible for ensuring they have the right to upload and share content through our service. This includes:
      • Maintaining accurate account information
      • Protecting account credentials
      • Ensuring uploaded content doesn't violate any laws or rights
      • Taking responsibility for all activities under their account`
    },
    {
      id: 'prohibited',
      title: '3. Prohibited Activities',
      content: `Users must not engage in any illegal or unauthorized use of the service, including but not limited to:
      • Uploading copyrighted material without permission
      • Attempting to breach security measures
      • Sharing account access with unauthorized users
      • Using the service to distribute malicious content`
    },
    {
      id: 'changes',
      title: '4. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Users will be notified of significant changes via email or through the service.'
    }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const currentSections = Object.values(sectionsRef.current);
    
    currentSections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      currentSections.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen dark:bg-[#000e14]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Table of Contents */}
        <nav className="lg:col-span-1 hidden lg:block sticky top-4 h-fit bg-white dark:bg-gray-700 rounded-lg p-4 shadow-lg" aria-label="Table of contents">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Contents</h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`block py-1 px-2 rounded transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Terms of Use</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>
          
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => (sectionsRef.current[section.id] = el)}
              className="mb-8 scroll-mt-16"
            >
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">{section.title}</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

TermsOfUse.propTypes = {
  lastUpdated: PropTypes.string
};

export default TermsOfUse;
