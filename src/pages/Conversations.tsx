import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Phone, 
  Video, 
  User, 
  MoreVertical,
  Star,
  Reply,
  Share2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  online: boolean;
  tags: string[];
}

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'document' | 'contact' | 'location';
    url: string;
    name: string;
    metadata?: any;
  }[];
  replyTo?: {
    content: string;
    sender: string;
  };
  isStarred?: boolean;
}

const Conversations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy');
  };
  
  const sampleContacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastMessage: "I'll check the pricing and get back to you.",
      lastMessageTime: new Date(2025, 5, 10, 10, 30),
      unread: 2,
      online: true,
      tags: ['customer', 'support']
    },
    {
      id: '2',
      name: 'Michael Roberts',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastMessage: 'Thanks for the information!',
      lastMessageTime: new Date(2025, 5, 10, 9, 15),
      unread: 0,
      online: false,
      tags: ['lead', 'sales']
    },
    {
      id: '3',
      name: 'Jessica Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastMessage: 'When will the new product be available?',
      lastMessageTime: new Date(2025, 5, 9, 18, 45),
      unread: 1,
      online: true,
      tags: ['customer']
    }
  ];
  
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  
  const sampleMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1-1',
        sender: 'contact',
        content: "Hi there! I'm interested in your premium plan. Can you tell me more about the pricing?",
        timestamp: new Date(2025, 5, 10, 10, 15),
        status: 'read'
      },
      {
        id: '1-2',
        sender: 'user',
        content: 'Hello Sarah! Our premium plan is $49.99/month and includes all features plus priority support.',
        timestamp: new Date(2025, 5, 10, 10, 20),
        status: 'read'
      },
      {
        id: '1-3',
        sender: 'contact',
        content: 'That sounds good. Is there a discount for annual billing?',
        timestamp: new Date(2025, 5, 10, 10, 25),
        status: 'read',
        attachments: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            name: 'pricing_screenshot.jpg'
          }
        ]
      },
      {
        id: '1-4',
        sender: 'user',
        content: 'Yes, we offer a 20% discount for annual billing, which brings it down to $479.90 for the year.',
        timestamp: new Date(2025, 5, 10, 10, 28),
        status: 'read',
        replyTo: {
          content: 'That sounds good. Is there a discount for annual billing?',
          sender: 'Sarah Johnson'
        }
      },
      {
        id: '1-5',
        sender: 'contact',
        content: "I'll check the pricing and get back to you.",
        timestamp: new Date(2025, 5, 10, 10, 30),
        status: 'delivered'
      }
    ]
  };
  
  const [messages, setMessages] = useState<Record<string, Message[]>>(sampleMessages);
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || contact.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark messages as read
    if (contact.unread > 0) {
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      ));
    }
  };
  
  const handleSendMessage = (message: string, attachments?: File[], metadata?: any) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: `${selectedContact.id}-${Date.now()}`,
      sender: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sent'
    };

    if (attachments && attachments.length > 0) {
      newMessage.attachments = attachments.map(file => {
        const type = file.type.split('/')[0] as 'image' | 'video' | 'audio' | 'document';
        return {
          type,
          url: URL.createObjectURL(file),
          name: file.name,
          metadata: metadata?.attachmentMetadata?.find((m: any) => m.type === type)?.metadata
        };
      });
    }

    if (metadata?.replyTo) {
      newMessage.replyTo = metadata.replyTo;
    }

    if (metadata?.location) {
      newMessage.attachments = [
        ...(newMessage.attachments || []),
        {
          type: 'location',
          url: '#',
          name: 'Location',
          metadata: metadata.location
        }
      ];
    }

    // Add message to conversation
    const updatedMessages = {
      ...messages,
      [selectedContact.id]: [
        ...(messages[selectedContact.id] || []),
        newMessage
      ]
    };
    
    setMessages(updatedMessages);
    
    // Update last message in contacts list
    setContacts(contacts.map(contact => 
      contact.id === selectedContact.id
        ? {
            ...contact,
            lastMessage: message,
            lastMessageTime: new Date()
          }
        : contact
    ));
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 2000);
  };

  const handleStartTyping = () => {
    setIsTyping(true);
  };

  const handleStopTyping = () => {
    setIsTyping(false);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleForward = (message: Message) => {
    // Implement message forwarding
    console.log('Forward message:', message);
  };

  const handleDelete = (messageId: string) => {
    if (!selectedContact) return;
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].filter(msg => msg.id !== messageId)
      }));
    }
  };

  const handleStar = (messageId: string) => {
    if (!selectedContact) return;
    
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: prev[selectedContact.id].map(msg => 
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    }));
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
      
      <div className="flex flex-col mt-6 overflow-hidden bg-white rounded-lg shadow md:flex-row md:h-[calc(100vh-220px)]">
        {/* Contacts sidebar */}
        <div className="w-full md:w-1/3 md:border-r md:border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {['all', 'customer', 'lead', 'support', 'sales'].map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-y-auto md:h-[calc(100%-73px)]">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <MessageSquare className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No conversations found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className={`cursor-pointer ${
                      selectedContact?.id === contact.id ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="relative px-6 py-5">
                      <div className="flex items-center">
                        <div className="relative flex-shrink-0">
                          <img
                            className="w-10 h-10 rounded-full"
                            src={contact.avatar}
                            alt={contact.name}
                          />
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 ml-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                            <p className="text-xs text-gray-500">{formatTime(contact.lastMessageTime)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                            {contact.unread > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-600 rounded-full">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex flex-col flex-1">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="relative flex-shrink-0">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                    />
                    {selectedContact.online && (
                      <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white"></span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedContact.online ? 'Online' : 'Offline'}
                      {isTyping && ' • Typing...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                {messages[selectedContact.id] ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {formatDate(messages[selectedContact.id][0].timestamp)}
                      </span>
                    </div>
                    
                    {messages[selectedContact.id].map((message) => (
                      <MessageBubble
                        key={message.id}
                        content={message.content}
                        timestamp={message.timestamp}
                        sender={message.sender}
                        status={message.status}
                        attachments={message.attachments}
                        replyTo={message.replyTo}
                        isStarred={message.isStarred}
                        onReply={() => handleReply(message)}
                        onForward={() => handleForward(message)}
                        onDelete={() => handleDelete(message.id)}
                        onStar={() => handleStar(message.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No messages yet</p>
                  </div>
                )}
              </div>
              
              {/* Chat input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                onStartTyping={handleStartTyping}
                onStopTyping={handleStopTyping}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-16 h-16 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;