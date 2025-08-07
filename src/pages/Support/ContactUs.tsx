import React, { useState } from 'react';

interface ContactUsProps {
  onNavigate?: (page: string) => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button 
                onClick={() => onNavigate?.('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-indigo-400">Contact Us</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            📞 Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get in touch with our support team - we're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-white">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="dispute">Transaction Dispute</option>
                  <option value="account">Account Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                  placeholder="Describe your question or issue in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-indigo-400 mt-1">📧</div>
                  <div>
                    <h3 className="font-semibold text-white">Email Support</h3>
                    <p className="text-gray-300">
                      <a href="mailto:support@gametrust.com" className="text-indigo-400 hover:text-indigo-300 underline">
                        support@gametrust.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-400">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-indigo-400 mt-1">💬</div>
                  <div>
                    <h3 className="font-semibold text-white">Live Chat</h3>
                    <p className="text-gray-300">Available 24/7 for urgent issues</p>
                    <button className="text-indigo-400 hover:text-indigo-300 underline text-sm">
                      Start Live Chat
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-indigo-400 mt-1">🕒</div>
                  <div>
                    <h3 className="font-semibold text-white">Response Time</h3>
                    <p className="text-gray-300">General inquiries: 24-48 hours</p>
                    <p className="text-gray-300">Urgent issues: 2-4 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Quick Links</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate?.('support/help-center')}
                  className="block w-full text-left text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  📘 Help Center →
                </button>
                <button 
                  onClick={() => onNavigate?.('support/safety-guidelines')}
                  className="block w-full text-left text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  🔐 Safety Guidelines →
                </button>
                <button 
                  onClick={() => onNavigate?.('support/terms-of-service')}
                  className="block w-full text-left text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  📄 Terms of Service →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;