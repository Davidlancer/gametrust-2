import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastProvider';

interface SupportMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'document';
    url: string;
  }[];
}

interface SupportThreadProps {
  disputeId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock support messages data
const mockSupportMessages: Record<string, SupportMessage[]> = {
  'DISP-001': [
    {
      id: 'msg-1',
      sender: 'buyer',
      senderName: 'You',
      message: 'Hi, I need help with my dispute case GT-2024-001. The account credentials provided by the seller are not working.',
      timestamp: '2024-01-18T10:30:00Z',
    },
    {
      id: 'msg-2',
      sender: 'support',
      senderName: 'Sarah (Support)',
      message: 'Hello! I\'ve reviewed your case and I can see the issue. Let me contact the seller to get this resolved for you. Can you please provide a screenshot of the error you\'re encountering?',
      timestamp: '2024-01-18T11:15:00Z',
    },
    {
      id: 'msg-3',
      sender: 'buyer',
      senderName: 'You',
      message: 'Sure, here\'s the screenshot of the login error I keep getting.',
      timestamp: '2024-01-18T11:45:00Z',
      attachments: [
        {
          id: 'att-1',
          name: 'login-error.png',
          type: 'image',
          url: '/screenshots/login-error.png'
        }
      ]
    },
    {
      id: 'msg-4',
      sender: 'support',
      senderName: 'Sarah (Support)',
      message: 'Thank you for the screenshot. I can see the issue now. I\'ve escalated this to our technical team and contacted the seller. We should have this resolved within 24 hours. I\'ll keep you updated on the progress.',
      timestamp: '2024-01-18T14:20:00Z',
    }
  ],
  'DISP-002': [
    {
      id: 'msg-5',
      sender: 'buyer',
      senderName: 'You',
      message: 'The PUBG account I purchased got banned just 2 hours after I received it. This seems suspicious.',
      timestamp: '2024-01-15T14:20:00Z',
    },
    {
      id: 'msg-6',
      sender: 'support',
      senderName: 'Mike (Support)',
      message: 'I understand your concern. Account bans shortly after purchase can indicate prior violations. Let me investigate this case thoroughly. Can you provide the ban notification screenshot?',
      timestamp: '2024-01-15T15:30:00Z',
    },
    {
      id: 'msg-7',
      sender: 'buyer',
      senderName: 'You',
      message: 'Here\'s the ban notification I received.',
      timestamp: '2024-01-15T16:00:00Z',
      attachments: [
        {
          id: 'att-2',
          name: 'ban-notice.jpg',
          type: 'image',
          url: '/screenshots/ban-notice.jpg'
        }
      ]
    },
    {
      id: 'msg-8',
      sender: 'support',
      senderName: 'Mike (Support)',
      message: 'After thorough investigation, we found evidence of prior violations on this account. The seller failed to disclose this information. We\'ve processed a full refund for you and taken action against the seller. You should see the refund in your account within 3-5 business days.',
      timestamp: '2024-01-17T16:45:00Z',
    }
  ],
  'DISP-003': [
    {
      id: 'msg-9',
      sender: 'buyer',
      senderName: 'You',
      message: 'The Free Fire account is missing several skins that were listed in the description.',
      timestamp: '2024-01-12T09:15:00Z',
    },
    {
      id: 'msg-10',
      sender: 'support',
      senderName: 'Emma (Support)',
      message: 'I\'ll help you resolve this. Can you please list the specific skins that are missing? I\'ll cross-reference with the original listing.',
      timestamp: '2024-01-12T10:30:00Z',
    },
    {
      id: 'msg-11',
      sender: 'buyer',
      senderName: 'You',
      message: 'Missing: Alok character, Dragon AK skin, and the Samurai X outfit. These were specifically mentioned in the listing.',
      timestamp: '2024-01-12T11:00:00Z',
    },
    {
      id: 'msg-12',
      sender: 'support',
      senderName: 'Emma (Support)',
      message: 'I\'ve reviewed the seller\'s evidence video and confirmed all listed items are present in the account. The Alok character might be in a different tab, and the skins might need to be equipped. I\'ve sent you a detailed guide on how to locate these items. Please check and let me know if you still can\'t find them.',
      timestamp: '2024-01-14T11:30:00Z',
    }
  ]
};

const SupportThread: React.FC<SupportThreadProps> = ({ disputeId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showSuccess } = useToast();

  // Fetch messages when component mounts or disputeId changes
  useEffect(() => {
    if (isOpen && disputeId) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const threadMessages = mockSupportMessages[disputeId] || [];
        setMessages(threadMessages);
        setIsLoading(false);
      }, 1000);
    }
  }, [disputeId, isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    showSuccess('Message sent successfully!');

    // Simulate support response
    setIsTyping(true);
    setTimeout(() => {
      const supportResponse: SupportMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'support',
        senderName: 'Support Team',
        message: 'Thank you for your message. We\'ve received your update and will review it shortly. We\'ll get back to you within 2-4 hours.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, supportResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      showSuccess(`${files.length} file(s) uploaded successfully!`);
      // Here you would typically upload the files to your server
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'support':
        return <ShieldCheckIcon className="w-5 h-5 text-blue-400" />;
      case 'seller':
        return <UserIcon className="w-5 h-5 text-green-400" />;
      default:
        return <UserIcon className="w-5 h-5 text-purple-400" />;
    }
  };

  const getSenderBgColor = (sender: string) => {
    switch (sender) {
      case 'support':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'seller':
        return 'bg-green-500/20 border-green-500/30';
      default:
        return 'bg-purple-500/20 border-purple-500/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Support Thread</h2>
                <p className="text-gray-400 text-sm">Dispute ID: {disputeId}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading messages...</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'buyer' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-4 rounded-2xl border ${getSenderBgColor(message.sender)} backdrop-blur-sm`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {getSenderIcon(message.sender)}
                          <span className="text-sm font-medium text-white">{message.senderName}</span>
                          <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-200 leading-relaxed">{message.message}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg">
                                {attachment.type === 'image' ? (
                                  <PhotoIcon className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <DocumentIcon className="w-4 h-4 text-green-400" />
                                )}
                                <span className="text-sm text-gray-300">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%]">
                      <div className="p-4 rounded-2xl border bg-blue-500/20 border-blue-500/30 backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-white">Support Team</span>
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-400 ml-2">typing...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-700 bg-gray-800/50">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors">
                    <PaperClipIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </label>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SupportThread;