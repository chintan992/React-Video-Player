import React, { useState } from 'react';
import { FiMessageCircle, FiAlertCircle, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useDarkMode } from './DarkModeContext';
import Squares from '../background/Squares';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`mb-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/90'} shadow-lg overflow-hidden backdrop-blur-sm`}>
      <button
        className={`w-full px-6 py-4 text-left flex items-center justify-between ${
          isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-50 text-gray-900'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? (
          <FiChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <FiChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </button>
      {isOpen && (
        <div className={`px-6 py-4 ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Support = () => {
  const { isDarkMode } = useDarkMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const faqs = [
    {
      question: "How do I use Let's Stream?",
      answer: "Simply enter the ID of the movie or TV series you want to watch, along with any necessary season and episode information, and click submit. Our platform will fetch the content from available sources and present them to you for streaming."
    },
    {
      question: "Is Let's Stream free to use?",
      answer: "Yes, Let's Stream is completely free to use. We believe in providing accessible entertainment to everyone. However, some features might require you to create a free account."
    },
    {
      question: "What do I do if a stream isn't working?",
      answer: "If you encounter streaming issues, try these steps: 1) Refresh the page, 2) Clear your browser cache, 3) Try a different source if available, 4) Check your internet connection. If the problem persists, the content may no longer be available."
    },
    {
      question: "Can I download content for offline viewing?",
      answer: "Currently, Let's Stream is a streaming-only platform and does not support downloading content for offline viewing. We focus on providing the best possible streaming experience."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you come across any inappropriate or concerning content, please use our contact form below and select 'Report Content' as the category. Our team will investigate and take appropriate action promptly."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log({ name, email, message, category });
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setCategory('general');
    // Show success message
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="relative min-h-screen">
      {/* Squares Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Squares 
          direction="diagonal"
          speed={0.5}
          borderColor={isDarkMode ? '#333333' : '#e5e7eb'}
          squareSize={50}
          hoverFillColor={isDarkMode ? '#222222' : '#f3f4f6'}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className={`text-4xl text-white md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How Can We Help?
            </h1>
            <p className={`text-xl text-white ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Find answers to common questions or reach out to our support team
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className={`p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-lg'
            }`}>
              <FiHelpCircle className={`w-10 h-10 mx-auto mb-4 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <h3 className="text-xl font-semibold mb-2">FAQ</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Find quick answers to common questions
              </p>
            </div>
            <div className={`p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-lg'
            }`}>
              <FiMessageCircle className={`w-10 h-10 mx-auto mb-4 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get in touch with our support team
              </p>
            </div>
            <div className={`p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-lg'
            }`}>
              <FiAlertCircle className={`w-10 h-10 mx-auto mb-4 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Report technical problems or content issues
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Support
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-primary-500 focus:border-primary-500`}
                />
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-primary-500 focus:border-primary-500`}
                />
              </div>
              <div>
                <label htmlFor="category" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-primary-500 focus:border-primary-500`}
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="content">Content Related</option>
                  <option value="report">Report Content</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-primary-500 focus:border-primary-500`}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isDarkMode
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* DMCA Section */}
          <div className={`max-w-3xl mx-auto mt-16 p-8 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              DMCA Notice & Takedown Policy
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                Let's Stream respects the intellectual property rights of others and expects its users to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us.
              </p>
              <p>
                If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please contact the third-party content providers directly. Let's Stream is not responsible for the removal of any allegedly infringing content.
              </p>
              <p>
                By using Let's Stream, you acknowledge and agree that you are solely responsible for your use of the service and any content you access through it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
