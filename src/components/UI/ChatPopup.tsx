import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Smile, Phone, Video, Info, Mic, MicOff, Reply, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useEscrow } from '../../hooks/useEscrow';
import Button from './Button';
import CallDisputeModal from './CallDisputeModal';

interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'seller';
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  status?: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
  duration?: number;
  replyTo?: {
    id: string;
    text: string;
    sender: 'user' | 'seller';
  };
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

interface MessageItemProps {
  msg: Message;
  index: number;
  seller: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  startReply: (message: Message) => void;
  renderMessageContent: (msg: Message) => React.ReactNode;
  formatTime: (date: Date) => string;
}

// Separate MessageItem component to avoid hook violations
const MessageItem: React.FC<MessageItemProps> = ({ 
  msg, 
  index, 
  seller, 
  startReply, 
  renderMessageContent, 
  formatTime 
}) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => startReply(msg),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  return (
    <motion.div 
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
        <div {...swipeHandlers} className="group relative">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border relative ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-white/20 shadow-indigo-500/25' 
                : 'bg-gray-700/80 text-gray-100 border-gray-600/50 shadow-gray-900/50'
            }`}
          >
            {renderMessageContent(msg)}
            
            {/* Desktop Reply Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden group-hover:block md:block p-1 bg-gray-600/80 hover:bg-gray-500/80 rounded-full transition-all duration-200"
              onClick={() => startReply(msg)}
            >
              <Reply className="h-3 w-3 text-gray-300" />
            </motion.button>
            
            {/* Message glow effect */}
            {msg.sender === 'user' && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-sm" />
            )}
          </motion.div>
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
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-8 h-8 rounded-full overflow-hidden ml-2 order-2 border-2 border-gray-600/50 shadow-lg"
        >
          <img 
            src={seller?.avatar || '/default-avatar.png'} 
            alt={seller?.username || 'User'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MzYzNjMiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTJDMTAuMjA5MSAxMiAxMiAxMC4yMDkxIDEyIDhDMTIgNS43OTA5IDEwLjIwOTEgNCA4IDRDNS43OTA5IDQgNCA1Ljc5MDkgNCA4QzQgMTAuMjA5MSA1Ljc5MDkgMTIgOCAxMloiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=';
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

const ChatPopup: React.FC<ChatPopupProps> = ({ 
  isOpen, 
  onClose, 
  seller, 
  onSendMessage 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { updateEscrowStatus } = useEscrow();
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
    try {
      if (message.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: message,
          sender: 'user',
          timestamp: new Date(),
          type: 'text',
          status: 'sent',
          replyTo: replyTo ? {
            id: replyTo.id || '',
            text: replyTo.text || '',
            sender: replyTo.sender
          } : undefined
        };
        
        setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
        setMessage('');
        setReplyTo(null);
        onSendMessage?.(message);
      
      // Simulate seller typing and response
        setIsTyping(true);
        setTimeout(() => {
          try {
            setIsTyping(false);
            const sellerResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: 'Thanks for your message! I\'ll get back to you shortly.',
              sender: 'seller',
              timestamp: new Date(),
              type: 'text'
            };
            setMessages(prev => Array.isArray(prev) ? [...prev, sellerResponse] : [sellerResponse]);
          } catch (error) {
            console.error('Error sending seller response:', error);
            setIsTyping(false);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Reset states on error
      setMessage('');
      setReplyTo(null);
    }
  };

  const startReply = (messageToReply: Message) => {
    setReplyTo(messageToReply);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const handleDispute = () => {
    updateEscrowStatus('disputed', 'User initiated dispute from chat');
    setShowDisputeModal(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          timestamp: new Date(),
          type: 'audio',
          fileUrl: audioUrl,
          duration: recordingTime,
          status: 'sent'
        };
        
        setMessages(prev => [...prev, audioMessage]);
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingTime(0);
      
      recorder.start();
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setIsRecording(false);
    setRecordingTime(0);
  };
  
  // Emoji Functions
  const emojis = ['😂', '🔥', '❤️', '👍', '😍', '😊', '🎉', '💯', '😎', '🤔', '😢', '😡'];
  
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // File Upload Functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    let messageType: Message['type'] = 'file';
    
    if (file.type.startsWith('image/')) {
      messageType = 'image';
    } else if (file.type.startsWith('video/')) {
      messageType = 'video';
    }
    
    const fileMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date(),
      type: messageType,
      fileUrl,
      fileName: file.name,
      status: 'sent'
    };
    
    setMessages(prev => [...prev, fileMessage]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);
  
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEmojiPicker(false);
    };
    
    if (showEmojiPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showEmojiPicker]);
  
  // Render different message types
  const renderMessageContent = (msg: Message) => {
    // Safety check for message object
    if (!msg) {
      return (
        <div className="text-gray-400 italic text-sm">
          [Message unavailable]
        </div>
      );
    }

    return (
      <div>
        {/* Reply preview */}
        {msg.replyTo && (
          <div className="text-xs text-gray-300 border-l-2 border-gray-500 pl-2 mb-2 bg-gray-600/20 rounded p-2">
            <span className="font-medium">
              @{msg.replyTo.sender === 'user' ? 'You' : (seller?.username || 'Unknown')}:
            </span>
            <span className="ml-1 opacity-75">
              {msg.replyTo.text && msg.replyTo.text.length > 50 
                ? `${msg.replyTo.text.substring(0, 50)}...` 
                : (msg.replyTo.text || '[No text]')}
            </span>
          </div>
        )}
        
        {/* Main message content */}
        {(() => {
          switch (msg.type) {
            case 'text':
              return (
                <p className="text-sm leading-relaxed">
                  {msg.text || '[No message text]'}
                </p>
              );
      
            case 'image':
              return (
                <div className="space-y-2">
                  {msg.fileUrl ? (
                    <img 
                      src={msg.fileUrl} 
                      alt="Shared image" 
                      className="max-w-xs rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => msg.fileUrl && window.open(msg.fileUrl, '_blank')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.insertAdjacentHTML('beforebegin', '<div class="text-gray-400 italic text-sm">[Image failed to load]</div>');
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 italic text-sm">[Image unavailable]</div>
                  )}
                  {msg.fileName && <p className="text-xs text-gray-300">{msg.fileName}</p>}
                </div>
              );
      
            case 'video':
              return (
                <div className="space-y-2">
                  {msg.fileUrl ? (
                    <video 
                      controls 
                      src={msg.fileUrl} 
                      className="max-w-xs rounded-lg shadow-lg"
                      preload="metadata"
                      onError={() => {
                        console.error('Video failed to load:', msg.fileUrl);
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 italic text-sm">[Video unavailable]</div>
                  )}
                  {msg.fileName && <p className="text-xs text-gray-300">{msg.fileName}</p>}
                </div>
              );
        
            case 'audio':
              return (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 bg-gray-600/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {msg.fileUrl ? (
                        <audio 
                          controls 
                          src={msg.fileUrl} 
                          className="w-full"
                          onError={() => {
                            console.error('Audio failed to load:', msg.fileUrl);
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 italic text-sm">[Audio unavailable]</div>
                      )}
                      <p className="text-xs text-gray-300 mt-1">
                        Voice message • {msg.duration || 0}s
                      </p>
                    </div>
                  </div>
                </div>
              );
      
            default:
              return (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 bg-gray-600/30 rounded-lg p-3">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{msg.fileName}</span>
                  </div>
                </div>
              );
          }
        })()
        }
      </div>
    );
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
        className="fixed bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-600/50 shadow-2xl z-50 flex flex-col overflow-hidden
          lg:bottom-4 lg:right-4 lg:w-96 lg:h-[600px] lg:rounded-2xl
          max-lg:inset-2 max-lg:rounded-xl
          sm:max-lg:inset-4
          max-sm:inset-1 max-sm:rounded-lg"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 sm:p-4 flex items-center justify-between overflow-hidden flex-shrink-0">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="relative">
                  <img 
                    src={seller?.avatar || '/default-avatar.png'} 
                    alt={seller?.username || 'User'}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM2MzYzNjMiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDE4QzE1LjMxMzcgMTggMTggMTUuMzEzNyAxOCAxMkMxOCA4LjY4NjI5IDE1LjMxMzcgNiAxMiA2QzguNjg2MjkgNiA2IDguNjg2MjkgNiAxMkM2IDE1LjMxMzcgOC42ODYyOSAxOCAxMiAxOFoiIGZpbGw9IndoaXRlIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                  {/* Avatar glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                </div>
                {seller?.isOnline && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                  >
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </motion.div>
                )}
              </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm sm:text-base truncate">{seller?.username || 'Unknown User'}</h3>
              <p className="text-xs text-white/70 truncate">
                {seller?.isOnline ? 'Online now' : `Last seen ${seller?.lastSeen || '2 hours ago'}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30 hidden sm:block"
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30 hidden sm:block"
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/30 hidden md:block"
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
            </motion.button>
            <motion.button 
              onClick={handleDispute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-red-400/50"
              title="Call Dispute"
            >
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 drop-shadow-sm" />
            </motion.button>
            <motion.button 
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-red-400/50"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
            </motion.button>
          </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900 backdrop-blur-sm relative min-h-0">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
          <div className="relative z-10">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              // Safety check for individual message
              if (!msg || !msg.id) {
                console.warn('Invalid message found at index:', index);
                return (
                  <div key={`invalid-${index}`} className="text-gray-400 italic text-sm p-2">
                    [Invalid message]
                  </div>
                );
              }
            
              return (
                <MessageItem 
                  key={msg.id}
                  msg={msg}
                  index={index}
                  seller={seller}
                  startReply={startReply}
                  renderMessageContent={renderMessageContent}
                  formatTime={formatTime}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-400 italic text-sm">No messages found.</p>
            </div>
          )}
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

        {/* Reply Preview */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-700/80 backdrop-blur-sm border-t border-gray-600/50 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">Replying to</div>
                  <div className="text-sm text-gray-200">
                    <span className="font-medium text-indigo-400">
                      @{replyTo.sender === 'user' ? 'You' : seller.username}:
                    </span>
                    <span className="ml-2 opacity-75">
                      {replyTo.text && replyTo.text.length > 60 
                        ? `${replyTo.text.substring(0, 60)}...` 
                        : replyTo.text}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={cancelReply}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-xl border-t border-gray-600/50 relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent" />
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          
          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-20 right-4 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl p-4 shadow-2xl z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center space-x-3 relative z-10">
            {/* File Attachment Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerFileUpload}
              className="p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50"
            >
              <Paperclip className="h-5 w-5" />
            </motion.button>
            
            {/* Voice Recording Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 transition-all duration-200 rounded-xl backdrop-blur-sm border ${
                isRecording 
                  ? 'text-red-400 bg-red-500/20 border-red-500/50 animate-pulse' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50'
              }`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>
            
            {/* Recording Timer */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-red-400 text-sm font-medium"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>{recordingTime}s / 30s</span>
              </motion.div>
            )}
            
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker(!showEmojiPicker);
                }}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-200 rounded-lg ${
                  showEmojiPicker 
                    ? 'text-indigo-400 bg-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                <Smile className="h-4 w-4" />
              </motion.button>
            </div>
            
            {!isRecording && (
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
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Call Dispute Modal */}
      <CallDisputeModal 
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        onConfirm={() => {
          // Additional logic can be added here if needed
          console.log('Dispute confirmed and logged');
        }}
      />
    </AnimatePresence>
  );
};

export default ChatPopup;