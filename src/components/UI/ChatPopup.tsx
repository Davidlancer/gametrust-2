import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Smile, Phone, Video, Info } from 'lucide-react';
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Chat Popup */}
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden lg:w-96 lg:h-[600px] max-lg:inset-4 max-lg:w-auto max-lg:h-auto max-lg:bottom-0 max-lg:right-0 max-lg:left-0 max-lg:top-0 max-lg:rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={seller.avatar} 
                alt={seller.username}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              {seller.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{seller.username}</h3>
              <p className="text-xs text-white/70">
                {seller.isOnline ? 'Online now' : `Last seen ${seller.lastSeen || '2 hours ago'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Phone className="h-4 w-4 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Video className="h-4 w-4 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Info className="h-4 w-4 text-white" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
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
                <div className="w-8 h-8 rounded-full overflow-hidden ml-2 order-2">
                  <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gray-700 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                <Smile className="h-4 w-4" />
              </button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPopup;