import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your Smart Exhibitor Portal assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqData = {
    'payment': {
      keywords: ['payment', 'pay', 'paid', 'billing', 'invoice', 'cost'],
      response: "Payment status can be viewed on your dashboard. For payment issues, contact our billing team at billing@expo.com or call (555) 123-4567."
    },
    'booth': {
      keywords: ['booth', 'space', 'size', 'upgrade', 'location'],
      response: "Your booth information is displayed on your dashboard. You can request booth upgrades in the Services tab. For booth location questions, contact booth@expo.com."
    },
    'webinar': {
      keywords: ['webinar', 'presentation', 'session', 'schedule'],
      response: "Webinar scheduling is available for exhibitors with 'Paid in Full' status. You can select your preferred date in the Onboarding tab."
    },
    'logo': {
      keywords: ['logo', 'upload', 'image', 'brand'],
      response: "Logo upload is available in the Onboarding tab. Supported formats: JPEG, PNG, GIF (max 5MB). Uploaded logos require admin approval."
    },
    'banner': {
      keywords: ['banner', 'marketing', 'promotional', 'generate'],
      response: "Marketing banners can be generated after uploading your logo. The banner will feature your company name and event details."
    },
    'contact': {
      keywords: ['contact', 'help', 'support', 'assistance', 'phone', 'email'],
      response: "For general support: support@expo.com or (555) 123-4567. For technical issues: tech@expo.com. For sales: sales@expo.com."
    },
    'event': {
      keywords: ['event', 'expo', 'show', 'date', 'time', 'location'],
      response: "Small Business Expo 2024 will be held on March 15-17, 2024 at the Convention Center. Doors open at 9 AM each day."
    },
    'default': {
      response: "I'm here to help! You can ask about payments, booth information, webinars, logo uploads, marketing banners, or general event details. For specific assistance, contact our support team."
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    for (const [key, data] of Object.entries(faqData)) {
      if (key === 'default') continue;
      
      if (data.keywords.some(keyword => input.includes(keyword))) {
        return data.response;
      }
    }
    
    return faqData.default.response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = findResponse(inputText);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <span className="font-medium">Smart Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="spinner h-3 w-3"></div>
                <span className="text-sm">Typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot; 