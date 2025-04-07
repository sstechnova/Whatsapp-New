import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  MoreVertical,
  Settings,
  Power,
  Copy,
  ExternalLink,
  Code,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';

interface ChatBot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  type: 'customer_support' | 'lead_generation' | 'faq' | 'custom';
  triggers: string[];
  stats: {
    conversations: number;
    users: number;
    responseRate: number;
    avgResponseTime: string;
  };
  lastModified: string;
  createdAt: string;
}

const ChatBotMenu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showNewBotModal, setShowNewBotModal] = useState(false);

  const [chatbots] = useState<ChatBot[]>([
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles common customer inquiries and support requests',
      status: 'active',
      type: 'customer_support',
      triggers: ['help', 'support', 'assistance'],
      stats: {
        conversations: 1245,
        users: 856,
        responseRate: 92,
        avgResponseTime: '45s'
      },
      lastModified: '2025-03-15T10:30:00Z',
      createdAt: '2025-03-01T08:00:00Z'
    },
    {
      id: '2',
      name: 'Lead Generation Bot',
      description: 'Qualifies leads and collects contact information',
      status: 'active',
      type: 'lead_generation',
      triggers: ['quote', 'pricing', 'demo'],
      stats: {
        conversations: 876,
        users: 432,
        responseRate: 88,
        avgResponseTime: '30s'
      },
      lastModified: '2025-03-14T15:45:00Z',
      createdAt: '2025-03-02T09:30:00Z'
    },
    {
      id: '3',
      name: 'FAQ Bot',
      description: 'Answers frequently asked questions about products and services',
      status: 'draft',
      type: 'faq',
      triggers: ['faq', 'question', 'info'],
      stats: {
        conversations: 0,
        users: 0,
        responseRate: 0,
        avgResponseTime: '0s'
      },
      lastModified: '2025-03-13T11:20:00Z',
      createdAt: '2025-03-13T11:20:00Z'
    }
  ]);

  const filteredChatbots = chatbots.filter(bot => {
    const matchesSearch = 
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || bot.status === selectedStatus;
    const matchesType = selectedType === 'all' || bot.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">ChatBots</h1>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowNewBotModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Bot
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Bots</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {chatbots.filter(bot => bot.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Conversations</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {chatbots.reduce((sum, bot) => sum + bot.stats.conversations, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {chatbots.reduce((sum, bot) => sum + bot.stats.users, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-md">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(
                      chatbots.reduce((sum, bot) => sum + bot.stats.responseRate, 0) / chatbots.length
                    )}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Search chatbots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative inline-block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="relative inline-block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="customer_support">Customer Support</option>
              <option value="lead_generation">Lead Generation</option>
              <option value="faq">FAQ</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* ChatBots Grid */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChatbots.map((bot) => (
          <div key={bot.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 text-gray-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">{bot.name}</h3>
                </div>
                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusBadgeClass(bot.status)}`}>
                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">{bot.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Triggers</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bot.triggers.map((trigger) => (
                    <span
                      key={trigger}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversations</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{bot.stats.conversations.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Users</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{bot.stats.users.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Response Rate</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{bot.stats.responseRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{bot.stats.avgResponseTime}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    API
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBotMenu;