import React, { useState } from 'react';
import { 
  Reply, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Clock,
  Tag,
  MessageSquare,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface AutoReplyRule {
  id: string;
  name: string;
  trigger: {
    type: 'keyword' | 'time' | 'contact' | 'custom';
    value: string;
  };
  response: {
    type: 'text' | 'template' | 'bot';
    content: string;
  };
  schedule: {
    active: boolean;
    days: string[];
    timeStart: string;
    timeEnd: string;
  };
  status: 'active' | 'inactive';
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AutoReply: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoReplyRule | null>(null);

  const [newRule, setNewRule] = useState<Partial<AutoReplyRule>>({
    name: '',
    trigger: {
      type: 'keyword',
      value: ''
    },
    response: {
      type: 'text',
      content: ''
    },
    schedule: {
      active: false,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeStart: '09:00',
      timeEnd: '17:00'
    },
    status: 'active',
    priority: 1,
    tags: []
  });

  const sampleRules: AutoReplyRule[] = [
    {
      id: '1',
      name: 'Business Hours Welcome',
      trigger: {
        type: 'time',
        value: 'business_hours'
      },
      response: {
        type: 'text',
        content: 'Welcome! Our team is here to help. How can we assist you today?'
      },
      schedule: {
        active: true,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeStart: '09:00',
        timeEnd: '17:00'
      },
      status: 'active',
      priority: 1,
      tags: ['welcome', 'business-hours'],
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z'
    },
    {
      id: '2',
      name: 'After Hours Response',
      trigger: {
        type: 'time',
        value: 'after_hours'
      },
      response: {
        type: 'text',
        content: 'Thank you for your message. Our team is currently away but we\'ll respond to your message as soon as we return.'
      },
      schedule: {
        active: true,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeStart: '17:00',
        timeEnd: '09:00'
      },
      status: 'active',
      priority: 2,
      tags: ['after-hours', 'automated'],
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z'
    },
    {
      id: '3',
      name: 'Product Inquiry',
      trigger: {
        type: 'keyword',
        value: 'price, cost, pricing, how much'
      },
      response: {
        type: 'template',
        content: 'template_pricing_info'
      },
      schedule: {
        active: false,
        days: [],
        timeStart: '',
        timeEnd: ''
      },
      status: 'active',
      priority: 3,
      tags: ['pricing', 'product'],
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z'
    }
  ];

  const [rules, setRules] = useState<AutoReplyRule[]>(sampleRules);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.trigger.value.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || rule.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.trigger?.value || !newRule.response?.content) {
      return;
    }

    if (selectedRule) {
      // Update existing rule
      setRules(rules.map(rule => 
        rule.id === selectedRule.id 
          ? { ...selectedRule, ...newRule, updatedAt: new Date().toISOString() } as AutoReplyRule
          : rule
      ));
    } else {
      // Create new rule
      const rule: AutoReplyRule = {
        id: `${rules.length + 1}`,
        ...newRule as AutoReplyRule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRules([...rules, rule]);
    }

    setShowAddRuleModal(false);
    setSelectedRule(null);
    setNewRule({
      name: '',
      trigger: {
        type: 'keyword',
        value: ''
      },
      response: {
        type: 'text',
        content: ''
      },
      schedule: {
        active: false,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeStart: '09:00',
        timeEnd: '17:00'
      },
      status: 'active',
      priority: 1,
      tags: []
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const handleEditRule = (rule: AutoReplyRule) => {
    setSelectedRule(rule);
    setNewRule(rule);
    setShowAddRuleModal(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Auto Reply Rules</h1>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowAddRuleModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Rule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <Reply className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Rules</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rules.filter(r => r.status === 'active').length}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Auto Replies Today</dt>
                  <dd className="text-lg font-medium text-gray-900">124</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-md">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                  <dd className="text-lg font-medium text-gray-900">2.5s</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">98.5%</dd>
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
              placeholder="Search rules..."
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
            </select>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRules.map((rule) => (
            <li key={rule.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Reply className="w-5 h-5 text-gray-400" />
                    <p className="ml-2 text-sm font-medium text-gray-900">{rule.name}</p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditRule(rule)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      <span>Trigger: {rule.trigger.type}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>Response: {rule.response.type}</span>
                    </div>
                    {rule.schedule.active && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {rule.schedule.timeStart} - {rule.schedule.timeEnd}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {rule.response.content}
                    </p>
                  </div>
                  {rule.tags.length > 0 && (
                    <div className="flex mt-2 space-x-2">
                      {rule.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Rule Modal */}
      {showAddRuleModal && (
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
                    <Reply className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedRule ? 'Edit Rule' : 'Create New Rule'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedRule
                          ? 'Edit the auto-reply rule details below.'
                          : 'Set up a new auto-reply rule by filling out the details below.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      id="rule-name"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="Business Hours Welcome"
                    />
                  </div>

                  <div>
                    <label htmlFor="trigger-type" className="block text-sm font-medium text-gray-700">
                      Trigger Type
                    </label>
                    <select
                      id="trigger-type"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.trigger?.type}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        trigger: { ...newRule.trigger!, type: e.target.value as any }
                      })}
                    >
                      <option value="keyword">Keyword</option>
                      <option value="time">Time-based</option>
                      <option value="contact">Contact Status</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="trigger-value" className="block text-sm font-medium text-gray-700">
                      Trigger Value *
                    </label>
                    <input
                      type="text"
                      id="trigger-value"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.trigger?.value}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        trigger: { ...newRule.trigger!, value: e.target.value }
                      })}
                      placeholder={
                        newRule.trigger?.type === 'keyword'
                          ? 'price, cost, pricing'
                          : newRule.trigger?.type === 'time'
                          ? 'business_hours'
                          : 'Enter trigger value'
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="response-type" className="block text-sm font-medium text-gray-700">
                      Response Type
                    </label>
                    <select
                      id="response-type"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.response?.type}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        response: { ...newRule.response!, type: e.target.value as any }
                      })}
                    >
                      <option value="text">Text</option>
                      <option value="template">Template</option>
                      <option value="bot">Bot Flow</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="response-content" className="block text-sm font-medium text-gray-700">
                      Response Content *
                    </label>
                    <textarea
                      id="response-content"
                      rows={3}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.response?.content}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        response: { ...newRule.response!, content: e.target.value }
                      })}
                      placeholder="Enter your response message or template ID"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Schedule
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          checked={newRule.schedule?.active}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            schedule: { ...newRule.schedule!, active: e.target.checked }
                          })}
                        />
                        <span className="ml-2 text-sm text-gray-500">Enable scheduling</span>
                      </div>
                    </div>
                    {newRule.schedule?.active && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <label htmlFor="time-start" className="block text-sm font-medium text-gray-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            id="time-start"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={newRule.schedule?.timeStart}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              schedule: { ...newRule.schedule!, timeStart: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <label htmlFor="time-end" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            id="time-end"
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={newRule.schedule?.timeEnd}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              schedule: { ...newRule.schedule!, timeEnd: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.tags?.join(', ')}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        tags: e.target.value.split(',').map(tag => tag.trim())
                      })}
                      placeholder="welcome, business-hours"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveRule}
                >
                  {selectedRule ? 'Save Changes' : 'Create Rule'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAddRuleModal(false);
                    setSelectedRule(null);
                    setNewRule({
                      name: '',
                      trigger: {
                        type: 'keyword',
                        value: ''
                      },
                      response: {
                        type: 'text',
                        content: ''
                      },
                      schedule: {
                        active: false,
                        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                        timeStart: '09:00',
                        timeEnd: '17:00'
                      },
                      status: 'active',
                      priority: 1,
                      tags: []
                    });
                  }}
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

export default AutoReply;