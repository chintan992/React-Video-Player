import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen dark:bg-gray-800">
      <div className="max-w-4xl mx-auto prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>Last updated: [Date]</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when using our video player service.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">2. How We Use Your Information</h2>
            <p>We use the collected information to provide and improve our services, communicate with you, and ensure security.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">3. Information Sharing</h2>
            <p>We do not sell or share your personal information with third parties except as described in this policy.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">4. Security</h2>
            <p>We implement appropriate security measures to protect your personal information.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
