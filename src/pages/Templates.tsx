import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Trash2, 
  Edit,
  MessageSquare,
  Image,
  Video,
  File
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'media' | 'document' | 'interactive';
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

const Templates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  
  const sampleTemplates: Template[] = [
    {
      id: '1',
      name: 'Welcome Message',
      category: 'Onboarding',
      type: 'text',
      content: "Hello {{1}}, welcome to our service! We're excited to have you on board. If you have any questions, feel free to reply to this message.",
      createdAt: '2025-06-01',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Order Confirmation',
      category: 'Transactional',
      type: 'text',
      content: 'Hi {{1}}, your order #{{2}} has been confirmed and is being processed. Expected delivery: {{3}}. Thank you for shopping with us!',
      createdAt: '2025-05-28',
      status: 'approved'
    },
    {
      id: '3',
      name: 'Appointment Reminder',
      category: 'Notifications',
      type: 'text',
      content: 'Reminder: You have an appointment scheduled for {{1}} at {{2}}. Please reply YES to confirm or NO to reschedule.',
      createdAt: '2025-05-25',
      status: 'approved'
    },
    {
      id: '4',
      name: 'Product Showcase',
      category: 'Marketing',
      type: 'media',
      content: 'Check out our new product line! {{1}} is now available starting at ${{2}}. Limited time offer!',
      createdAt: '2025-05-20',
      status: 'approved'
    },
    {
      id: '5',
      name: 'Feedback Request',
      category: 'Customer Service',
      type: 'interactive',
      content: 'We value your opinion! How would you rate your recent experience with us? Reply with a number from 1-5, with 5 being excellent.',
      createdAt: '2025-05-15',
      status: 'approved'
    },
    {
      id: '6',
      name: 'Product Manual',
      category: 'Support',
      type: 'document',
      content: 'Here is the user manual for your {{1}}. Please let us know if you have any questions.',
      createdAt: '2025-05-10',
      status: 'approved'
    }
  ];
  
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'media':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'document':
        return <File className="w-5 h-5 text-yellow-500" />;
      case 'interactive':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Message Templates</h1>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowNewTemplateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Template
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Search templates..."
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Transactional">Transactional</option>
              <option value="Notifications">Notifications</option>
              <option value="Marketing">Marketing</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Support">Support</option>
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
              <option value="text">Text</option>
              <option value="media">Media</option>
              <option value="document">Document</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTypeIcon(template.type)}
                  <h3 className="ml-2 text-lg font-medium text-gray-900 truncate">{template.name}</h3>
                </div>
                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusBadgeClass(template.status)}`}>
                  {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {template.category} • {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{template.content}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">Created: {template.createdAt}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* New template modal */}
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Template</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Create a new message template for your WhatsApp communications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        id="template-name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Welcome Message"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="template-category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <select
                        id="template-category"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        defaultValue="Marketing"
                      >
                        <option value="Onboarding">Onboarding</option>
                        <option value="Transactional">Transactional</option>
                        <option value="Notifications">Notifications</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="template-type" className="block text-sm font-medium text-gray-700">
                        Template Type *
                      </label>
                      <select
                        id="template-type"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        defaultValue="text"
                      >
                        <option value="text">Text</option>
                        <option value="media">Media</option>
                        <option value="document">Document</option>
                        <option value="interactive">Interactive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="template-content" className="block text-sm font-medium text-gray-700">
                        Template Content *
                      </label>
                      <textarea
                        id="template-content"
                        rows={4}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Hello {{1}}, welcome to our service! We're excited to have you on board."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use {'{{'} 1 {'}}' }, {'{{'} 2 {'}}' }, etc. as placeholders for dynamic content.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Example Values
                      </label>
                      <div className="p-3 mt-1 bg-gray-50 rounded-md">
                        <div className="flex items-center mb-2">
                          <span className="w-12 text-xs font-medium text-gray-500">{'{{'} 1 {'}}'}</span>
                          <input
                            type="text"
                            className="block w-full ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="John"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="w-12 text-xs font-medium text-gray-500">{'{{'} 2 {'}}'}</span>
                          <input
                            type="text"
                            className="block w-full ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="123456"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowNewTemplateModal(false)}
                >
                  Create Template
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowNewTemplateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;