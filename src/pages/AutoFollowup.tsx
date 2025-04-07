import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Clock,
  Tag,
  MessageSquare,
  Save,
  Calendar,
  Users,
  CheckCircle2,
  Phone,
  X
} from 'lucide-react';

interface AutoFollowupRule {
  id: string;
  name: string;
  trigger: {
    type: 'time' | 'status' | 'event';
    value: string;
    number?: number;
    sendingOption?: string;
  };
  message: {
    type: 'text' | 'template';
    content: string;
  };
  conditions: {
    status?: string[];
    tags?: string[];
    lastActivity?: number;
  };
  phoneNumbers: string[];
  sendingMethod: 'sequential' | 'random' | 'all';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const AutoFollowup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoFollowupRule | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [newRule, setNewRule] = useState<Partial<AutoFollowupRule>>({
    name: '',
    trigger: {
      type: 'time',
      value: '',
      number: 0,
      sendingOption: 'hours'
    },
    message: {
      type: 'text',
      content: ''
    },
    conditions: {
      status: [],
      tags: [],
      lastActivity: 24
    },
    phoneNumbers: [],
    sendingMethod: 'sequential',
    status: 'active'
  });

  const sampleRules: AutoFollowupRule[] = [
    {
      id: '1',
      name: 'No Response Follow-up',
      trigger: {
        type: 'time',
        value: 'no_response',
        number: 24,
        sendingOption: 'hours'
      },
      message: {
        type: 'text',
        content: 'Hi {{name}}, I noticed you haven\'t responded to our last message. Is there anything I can help you with?'
      },
      conditions: {
        status: ['open'],
        tags: [],
        lastActivity: 24
      },
      phoneNumbers: ['+1234567890', '+1987654321'],
      sendingMethod: 'sequential',
      status: 'active',
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z'
    },
    {
      id: '2',
      name: 'Post-Purchase Survey',
      trigger: {
        type: 'status',
        value: 'purchase_completed',
        number: 2,
        sendingOption: 'days'
      },
      message: {
        type: 'template',
        content: 'template_post_purchase_survey'
      },
      conditions: {
        status: ['completed'],
        tags: ['customer'],
        lastActivity: 48
      },
      phoneNumbers: ['+1234567890'],
      sendingMethod: 'all',
      status: 'active',
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z'
    }
  ];

  const [rules, setRules] = useState<AutoFollowupRule[]>(sampleRules);

  const handleAddPhoneNumber = () => {
    if (!phoneNumber.trim()) return;
    
    setNewRule(prev => ({
      ...prev,
      phoneNumbers: [...(prev.phoneNumbers || []), phoneNumber.trim()]
    }));
    setPhoneNumber('');
  };

  const handleRemovePhoneNumber = (numberToRemove: string) => {
    setNewRule(prev => ({
      ...prev,
      phoneNumbers: (prev.phoneNumbers || []).filter(num => num !== numberToRemove)
    }));
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || rule.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.trigger?.value || !newRule.message?.content) {
      return;
    }

    if (selectedRule) {
      setRules(rules.map(rule => 
        rule.id === selectedRule.id 
          ? { ...selectedRule, ...newRule, updatedAt: new Date().toISOString() } as AutoFollowupRule
          : rule
      ));
    } else {
      const rule: AutoFollowupRule = {
        id: `${rules.length + 1}`,
        ...newRule as AutoFollowupRule,
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
        type: 'time',
        value: '',
        number: 0,
        sendingOption: 'hours'
      },
      message: {
        type: 'text',
        content: ''
      },
      conditions: {
        status: [],
        tags: [],
        lastActivity: 24
      },
      phoneNumbers: [],
      sendingMethod: 'sequential',
      status: 'active'
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const handleEditRule = (rule: AutoFollowupRule) => {
    setSelectedRule(rule);
    setNewRule(rule);
    setShowAddRuleModal(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Auto Follow-up Rules</h1>
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

      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <Bell className="w-6 h-6 text-green-600" />
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Follow-ups Today</dt>
                  <dd className="text-lg font-medium text-gray-900">85</dd>
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
                  <dd className="text-lg font-medium text-gray-900">3.2h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">92.5%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRules.map((rule) => (
            <li key={rule.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-400" />
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
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        After {rule.trigger.number} {rule.trigger.sendingOption}
                      </span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>Type: {rule.message.type}</span>
                    </div>
                    {rule.conditions.status && rule.conditions.status.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          <span>
                            Status: {rule.conditions.status.join(', ')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {rule.message.content}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
                    <Bell className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedRule ? 'Edit Rule' : 'Create New Rule'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedRule
                          ? 'Edit the follow-up rule details below.'
                          : 'Set up a new follow-up rule by filling out the details below.'}
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
                      placeholder="No Response Follow-up"
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
                      <option value="time">Time-based</option>
                      <option value="status">Status Change</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="trigger-number" className="block text-sm font-medium text-gray-700">
                        Number *
                      </label>
                      <input
                        type="number"
                        id="trigger-number"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newRule.trigger?.number}
                        onChange={(e) => setNewRule({
                          ...newRule,
                          trigger: { ...newRule.trigger!, number: parseInt(e.target.value) }
                        })}
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="sending-option" className="block text-sm font-medium text-gray-700">
                        Sending Option
                      </label>
                      <select
                        id="sending-option"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newRule.trigger?.sendingOption}
                        onChange={(e) => setNewRule({
                          ...newRule,
                          trigger: { ...newRule.trigger!, sendingOption: e.target.value }
                        })}
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message-type" className="block text-sm font-medium text-gray-700">
                      Message Type
                    </label>
                    <select
                      id="message-type"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.message?.type}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        message: { ...newRule.message!, type: e.target.value as any }
                      })}
                    >
                      <option value="text">Text</option>
                      <option value="template">Template</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message-content" className="block text-sm font-medium text-gray-700">
                      Message Content *
                    </label>
                    <textarea
                      id="message-content"
                      rows={3}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.message?.content}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        message: { ...newRule.message!, content: e.target.value }
                      })}
                      placeholder="Enter your follow-up message or template ID"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Numbers
                    </label>
                    <div className="flex mt-1 space-x-2">
                      <input
                        type="tel"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddPhoneNumber}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {newRule.phoneNumbers && newRule.phoneNumbers.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {newRule.phoneNumbers.map((number) => (
                          <div key={number} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="ml-2 text-sm text-gray-900">{number}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoneNumber(number)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Sending Method
                    </label>
                    <select
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newRule.sendingMethod}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        sendingMethod: e.target.value as 'sequential' | 'random' | 'all'
                      })}
                    >
                      <option value="sequential">Sequential (One by one)</option>
                      <option value="random">Random</option>
                      <option value="all">All at once</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {newRule.sendingMethod === 'sequential' && 'Messages will be sent to numbers in order'}
                      {newRule.sendingMethod === 'random' && 'Messages will be sent to randomly selected numbers'}
                      {newRule.sendingMethod === 'all' && 'Messages will be sent to all numbers simultaneously'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Conditions
                    </label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <label htmlFor="status-conditions" className="block text-sm font-medium text-gray-500">
                          Status
                        </label>
                        <select
                          id="status-conditions"
                          multiple
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newRule.conditions?.status}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setNewRule({
                              ...newRule,
                              conditions: { ...newRule.conditions!, status: selected }
                            });
                          }}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-500">
                          Tags
                        </label>
                        <input
                          type="text"
                          id="tags"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newRule.conditions?.tags?.join(', ')}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            conditions: {
                              ...newRule.conditions!,
                              tags: e.target.value.split(',').map(tag => tag.trim())
                            }
                          })}
                          placeholder="customer, prospect"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Separate tags with commas
                        </p>
                      </div>

                      <div>
                        <label htmlFor="last-activity" className="block text-sm font-medium text-gray-500">
                          Last Activity (hours)
                        </label>
                        <input
                          type="number"
                          id="last-activity"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newRule.conditions?.lastActivity}
                          onChange={(e) => setNewRule({
                            ...newRule,
                            conditions: {
                              ...newRule.conditions!,
                              lastActivity: parseInt(e.target.value)
                            }
                          })}
                          min="0"
                        />
                      </div>
                    </div>
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
                        type: 'time',
                        value: '',
                        number: 0,
                        sendingOption: 'hours'
                      },
                      message: {
                        type: 'text',
                        content: ''
                      },
                      conditions: {
                        status: [],
                        tags: [],
                        lastActivity: 24
                      },
                      phoneNumbers: [],
                      sendingMethod: 'sequential',
                      status: 'active'
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

export default AutoFollowup;