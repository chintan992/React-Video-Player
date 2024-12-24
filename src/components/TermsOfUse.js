import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen dark:bg-gray-800">
      <div className="max-w-4xl mx-auto prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Terms of Use</h1>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>Last updated: [Date]</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using this video player, you accept and agree to be bound by these Terms of Use.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">2. User Responsibilities</h2>
            <p>Users are responsible for ensuring they have the right to upload and share content through our service.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">3. Prohibited Activities</h2>
            <p>Users must not engage in any illegal or unauthorized use of the service.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 dark:text-white">4. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
