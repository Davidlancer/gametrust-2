import React, { useState } from 'react';
import { Mail, Clock, MessageCircle, Send, Upload, CheckCircle, Twitter, ExternalLink, ArrowRight, HelpCircle, Phone, MapPin } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    reason: '',
    message: '',
    attachment: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactReasons = [
    { value: '', label: 'Select a reason...' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'account', label: 'Account Problem' },
    { value: 'dispute', label: 'Escrow/Dispute' },
    { value: 'business', label: 'Business/Partnership' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback/Suggestion' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      attachment: file
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        reason: '',
        message: '',
        attachment: null
      });
    }, 3000);
  };

  const quickFAQs = [
    {
      question: 'How does escrow work?',
      answer: 'Your payment is held securely until you confirm the account works as described.',
      link: 'help-center'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Most accounts are delivered within 2-24 hours depending on the seller.',
      link: 'help-center'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, if the account doesn\'t match the description within 48 hours.',
      link: 'help-center'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Need help? We're here for you. Send us a message and we'll respond as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                <p className="text-gray-400">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reason for Contact *
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {contactReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe your issue or question in detail..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Attach Screenshot (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 cursor-pointer transition-colors"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        {formData.attachment ? formData.attachment.name : 'Choose file...'}
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG, JPG up to 10MB. Screenshots help us understand your issue better.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Support Info Sidebar */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Direct Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-sm">support@gametrust.gg</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-gray-400 text-sm">+234 xxx xxx xxxx</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Support Hours</p>
                    <p className="text-gray-400 text-sm">Mon–Fri, 9 AM – 6 PM WAT</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-gray-400 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                  <Twitter className="h-5 w-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center hover:bg-indigo-500/30 transition-colors">
                  <MessageCircle className="h-5 w-5 text-indigo-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                  <ExternalLink className="h-5 w-5 text-purple-400" />
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                Follow us for updates, tips, and community news.
              </p>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Quick Answers</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('help-center')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {quickFAQs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                    <p className="text-gray-400 text-sm mb-2">{faq.answer}</p>
                    <button 
                      onClick={() => onNavigate('help-center')}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-500/10 border-red-500/20">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
                  <HelpCircle className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold mb-2">Urgent Issues?</h4>
                  <p className="text-red-300/80 text-sm mb-3">
                    For account security issues or payment disputes, contact us immediately.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Emergency Contact
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Response Time Banner */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold text-blue-400">Fast Response Guarantee</span>
            </div>
            <p className="text-gray-300 mb-4">
              We typically respond to all inquiries within 24 hours. Urgent issues are handled immediately.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <span>📧 Email: 24 hours</span>
              <span>💬 Live Chat: 5 minutes</span>
              <span>🚨 Urgent: Immediate</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;