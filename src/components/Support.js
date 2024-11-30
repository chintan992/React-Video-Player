import React from 'react';

const Support = React.memo(() => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg" aria-label="Support Section">
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">Support</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300 mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside">
          <li className="mb-4">
            <h3 className="text-lg font-semibold" aria-label="FAQ: How do I use Let's Stream?">How do I use Let's Stream?</h3>
            <p>Simply enter the ID of the movie or TV series you want to watch, along with any necessary season and episode information, and click submit.</p>
          </li>
          <li className="mb-4">
            <h3 className="text-lg font-semibold" aria-label="FAQ: Is Let's Stream free to use?">Is Let's Stream free to use?</h3>
            <p>Yes, Let's Stream is a free service. We do not charge for access to our platform.</p>
          </li>
          <li className="mb-4">
            <h3 className="text-lg font-semibold" aria-label="FAQ: What do I do if a stream isn't working?">What do I do if a stream isn't working?</h3>
            <p>Try refreshing the page or selecting a different source if available. If the problem persists, the content may no longer be available.</p>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300 mb-4">Contact Us</h2>
        <p>If you have any questions or concerns that aren't addressed in our FAQ, please feel free to contact us at <a href="mailto:support@letsstream.netlify.app" className="text-blue-600 dark:text-blue-400 underline">support@letsstream.netlify.app</a></p>
      </section>

      <section className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold text-blue-500 dark:text-blue-300 mb-4">DMCA Disclaimer</h2>
        <p>Let's Stream is a platform that provides easy access to content hosted on third-party websites. We do not host, upload, or distribute any content ourselves. We are not responsible for and have no control over the content, accuracy, copyright compliance, legality, decency, or any other aspect of the content provided through our service.</p>
        <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please contact the third-party content providers directly. Let's Stream is not responsible for the removal of any allegedly infringing content.</p>
        <p>Let's Stream respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please follow the procedures set forth in the Digital Millennium Copyright Act (DMCA) and contact the hosting providers of the content directly.</p>
        <p>By using Let's Stream, you acknowledge and agree that you are solely responsible for your use of the service and any content you access through it.</p>
      </section>
    </div>
  );
});

export default Support;
