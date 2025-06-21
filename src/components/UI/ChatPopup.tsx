import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Smile, Phone, Video, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'seller';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  onSendMessage?: (message: string) => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ 
  isOpen, 
  onClose, 
  seller, 
  onSendMessage 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m interested in your CODM account. Is it still available?',
      sender: 'user',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello! Yes, the account is still available. It has all mythic weapons and legendary skins as described.',
      sender: 'seller',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      text: 'Can you provide more screenshots of the inventory?',
      sender: 'user',
      timestamp: new Date(Date.now() - 180000),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      text: 'Of course! I\'ll send you detailed screenshots in a moment. The account also includes all battle pass rewards from Season 1.',
      sender: 'seller',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      onSendMessage?.(message);
      
      // Simulate seller typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const sellerResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! I\'ll get back to you shortly.',
          sender: 'seller',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, sellerResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Chat Popup */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 right-4 w-96 h-[600px] bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden lg:w-96 lg:h-[600px] max-lg:inset-4 max-lg:w-auto max-lg:h-auto max-lg:bottom-0 max-lg:right-0 max-lg:left-0 max-lg:top-0 max-lg:rounded-none"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 flex items-center justify-between overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="relative">
                  <img 
                    src={seller.avatar} 
                    alt={seller.username}
                    className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
                  />
                  {/* Avatar glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                </div>
                {seller.isOnline && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                  >
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </motion.div>
                )}
              </div>
            <div>
              <h3 className="font-semibold text-white">{seller.username}</h3>
              <p className="text-xs text-white/70">
                {seller.isOnline ? 'Online now' : `Last seen ${seller.lastSeen || '2 hours ago'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
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
                delay: index * 0.1 
              }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-white/20 shadow-indigo-500/25' 
                      : 'bg-gray-700/80 text-gray-100 border-gray-600/50 shadow-gray-900/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {/* Message glow effect */}
                  {msg.sender === 'user' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-sm" />
                  )}
                </motion.div>
                <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-400 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.sender === 'user' && msg.status && (
                    <span className={`${
                      msg.status === 'read' ? 'text-blue-400' : 
                      msg.status === 'delivered' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
              
              {msg.sender === 'seller' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-8 h-8 rounded-full overflow-hidden ml-2 order-2 border-2 border-gray-600/50 shadow-lg"
                >
                  <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
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
                  <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
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
        <div className="p-4 bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-xl border-t border-gray-600/50 relative">
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
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPopup;