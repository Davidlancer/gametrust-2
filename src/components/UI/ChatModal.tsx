import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Smile, Phone, Video, Info } from 'lucide-react';
import Button from './Button';

interface Message {
  id: string;
  from: 'seller' | 'buyer';
  msg: string;
  time: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  userRole: 'seller' | 'buyer';
  otherUser: {
    id: string;
    username: string;
    avatar: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  onSendMessage?: (message: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ 
  isOpen, 
  onClose, 
  orderId,
  userRole,
  otherUser,
  onSendMessage 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatKey = `chat_orderId_${orderId}`;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen) {
      const storedChat = localStorage.getItem(chatKey);
      if (storedChat) {
        try {
          const parsedChat = JSON.parse(storedChat);
          setMessages(parsedChat);
        } catch (error) {
          console.error('Error loading chat history:', error);
          setMessages([]);
        }
      } else {
        // Initialize with a welcome message
        const welcomeMessage: Message = {
          id: 'welcome_' + Date.now(),
          from: userRole === 'seller' ? 'buyer' : 'seller',
          msg: `Hi! This is about Order #${orderId}. Feel free to ask any questions!`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]));
      }
    }
  }, [isOpen, chatKey, orderId, userRole]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Simulate incoming messages for DEVMODE
  useEffect(() => {
    if (localStorage.getItem('devMode') === 'true' && isOpen) {
      const interval = setInterval(() => {
        // Random chance of receiving a message (20% every 30 seconds)
        if (Math.random() < 0.2) {
          const incomingMessages = [
            'Hi! I have a question about the account.',
            'Is the account still available?',
            'Can you provide more details about the credentials?',
            'When will the delivery be completed?',
            'Thank you for the quick response!',
            'I\'ve confirmed the account access. Everything looks good!'
          ];
          
          const randomMessage = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
          const otherUser = userRole === 'buyer' ? 'seller' : 'buyer';
          
          const newMessage: Message = {
            id: Date.now().toString(),
            from: otherUser,
            msg: randomMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            timestamp: Date.now(),
            status: 'delivered'
          };
          
          setMessages(prev => {
            const updated = [...prev, newMessage];
            localStorage.setItem(chatKey, JSON.stringify(updated));
            return updated;
          });
          
          // Dispatch notification event
          const event = new CustomEvent('newChatMessage', {
            detail: {
              orderId,
              message: randomMessage,
              fromUser: otherUser,
              userRole
            }
          });
          window.dispatchEvent(event);
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isOpen, orderId, userRole, chatKey]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        from: userRole,
        msg: message.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        timestamp: Date.now(),
        status: 'sent'
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
      
      setMessage('');
      onSendMessage?.(message);
      
      // Simulate other user receiving message and responding (DEVMODE)
      if (localStorage.getItem('devMode') === 'true') {
        simulateResponse(newMessage);
      }
    }
  };

  const simulateResponse = (userMessage: Message) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "Thanks for your message! I'll get back to you shortly.",
        "Got it! Let me check on that for you.",
        "Sure thing! I'll take care of that right away.",
        "Perfect! Everything looks good on my end.",
        "Thanks for the update! I appreciate it.",
        "No problem at all! Happy to help."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: userRole === 'seller' ? 'buyer' : 'seller',
        msg: randomResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        timestamp: Date.now()
      };
      
      const updatedMessages = [...messages, userMessage, responseMessage];
      setMessages(updatedMessages);
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
      
      // Trigger notification for the other user
      triggerNewMessageNotification(responseMessage);
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
  };

  const triggerNewMessageNotification = (newMessage: Message) => {
    // Dispatch custom event to trigger notification
    const notificationEvent = new CustomEvent('newChatMessage', {
      detail: {
        orderId,
        message: newMessage,
        fromUser: otherUser.username,
        userRole: newMessage.from
      }
    });
    window.dispatchEvent(notificationEvent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (!isOpen) return null;

  const modalClasses = isMobile 
    ? "fixed inset-0 z-50 bg-gray-900"
    : "fixed inset-0 z-50 flex items-center justify-center p-4";

  const contentClasses = isMobile
    ? "w-full h-full flex flex-col"
    : "w-full max-w-md h-[600px] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden";

  return (
    <AnimatePresence>
      {/* Backdrop */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}
      
      {/* Chat Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: isMobile ? 1 : 0.9, y: isMobile ? '100%' : 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={modalClasses}
      >
        <div className={contentClasses}>
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 flex items-center justify-between overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.username}
                    className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg"
                  />
                  {otherUser.isOnline && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"
                    >
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Chat with @{otherUser.username}</h3>
                  <p className="text-xs text-white/70">
                    Order #{orderId} • {otherUser.isOnline ? 'Online now' : `Last seen ${otherUser.lastSeen || '2 hours ago'}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {!isMobile && (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30"
                    >
                      <Phone className="h-4 w-4 text-white drop-shadow-sm" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30"
                    >
                      <Video className="h-4 w-4 text-white drop-shadow-sm" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30"
                    >
                      <Info className="h-4 w-4 text-white drop-shadow-sm" />
                    </motion.button>
                  </>
                )}
                <motion.button 
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-red-400/50"
                >
                  <X className="h-4 w-4 text-white drop-shadow-sm" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900 backdrop-blur-sm relative">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
            <div className="relative z-10">
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.05
                  }}
                  className={`flex ${msg.from === userRole ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.from === userRole ? 'order-2' : 'order-1'}`}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                        msg.from === userRole
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-white/20 shadow-indigo-500/25' 
                          : 'bg-gray-700/80 text-gray-100 border-gray-600/50 shadow-gray-900/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.msg}</p>
                      {/* Message glow effect */}
                      {msg.from === userRole && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-sm" />
                      )}
                    </motion.div>
                    <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-400 ${
                      msg.from === userRole ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(msg.time)}</span>
                      {msg.from === userRole && msg.status && (
                        <span className={`${
                          msg.status === 'read' ? 'text-blue-400' : 
                          msg.status === 'delivered' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {msg.from !== userRole && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-8 h-8 rounded-full overflow-hidden ml-2 order-2 border-2 border-gray-600/50 shadow-lg"
                    >
                      <img src={otherUser.avatar} alt={otherUser.username} className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start relative z-10"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-lg"
                    >
                      <img src={otherUser.avatar} alt={otherUser.username} className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gray-700/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-600/50 shadow-lg"
                    >
                      <div className="flex space-x-1">
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-300 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-300 rounded-full"
                        />
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-300 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-xl border-t border-gray-600/50 relative ${
            isMobile ? 'pb-safe' : ''
          }`}>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent" />
            
            <div className="flex items-center space-x-3 relative z-10">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50"
              >
                <Paperclip className="h-5 w-5" />
              </motion.button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-lg"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-600/50 rounded-lg"
                >
                  <Smile className="h-4 w-4" />
                </motion.button>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Send className="h-5 w-5 text-white drop-shadow-sm" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatModal;