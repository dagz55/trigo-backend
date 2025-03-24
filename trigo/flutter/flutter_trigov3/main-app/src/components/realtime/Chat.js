import { getDatabase, off, onValue, push, ref, serverTimestamp } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Real-time chat component for communication between driver and passenger
 * @param {Object} props
 * @param {string} props.rideId - ID of the current ride
 */
const Chat = ({ rideId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (!rideId) return;
    
    const db = getDatabase();
    const messagesRef = ref(db, `chats/${rideId}/messages`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesList = Object.entries(messagesData).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        
        // Sort messages by timestamp
        messagesList.sort((a, b) => {
          // Handle serverTimestamp() that might be null initially
          const timestampA = a.timestamp || 0;
          const timestampB = b.timestamp || 0;
          return timestampA - timestampB;
        });
        
        setMessages(messagesList);
        
        // Scroll to bottom on new messages
        setTimeout(scrollToBottom, 100);
      } else {
        setMessages([]);
      }
    }, (error) => {
      console.error('Error loading messages:', error);
      setLoading(false);
      toast.error('Failed to load chat messages');
    });
    
    return () => {
      off(messagesRef);
    };
  }, [rideId]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    if (!rideId || !currentUser) {
      toast.error('Unable to send message at this time');
      return;
    }
    
    try {
      const db = getDatabase();
      const messagesRef = ref(db, `chats/${rideId}/messages`);
      
      // Create message object
      const messageData = {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        senderPhoto: currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        status: 'sent'
      };
      
      // Send message to Firebase
      await push(messagesRef, messageData);
      
      // Clear input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      }) + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-md">
      {/* Chat header */}
      <div className="px-4 py-3 bg-white border-b">
        <h3 className="text-lg font-semibold">
          Chat
        </h3>
        <p className="text-sm text-gray-500">
          Ride #{rideId?.slice(0, 8)}
        </p>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!loading && messages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderId !== currentUser?.uid && message.senderPhoto && (
              <div className="flex-shrink-0 mr-2">
                <img 
                  src={message.senderPhoto} 
                  alt={message.senderName} 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
            
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                message.senderId === currentUser?.uid 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border rounded-tl-none'
              }`}
            >
              {message.senderId !== currentUser?.uid && (
                <p className="text-xs text-gray-600 font-medium mb-1">{message.senderName}</p>
              )}
              <p className="break-words">{message.text}</p>
              <p 
                className={`text-xs mt-1 text-right ${
                  message.senderId === currentUser?.uid ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
            
            {message.senderId === currentUser?.uid && message.senderPhoto && (
              <div className="flex-shrink-0 ml-2">
                <img 
                  src={message.senderPhoto} 
                  alt={message.senderName} 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t bg-white p-3">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary text-white p-2 rounded-r-md disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 