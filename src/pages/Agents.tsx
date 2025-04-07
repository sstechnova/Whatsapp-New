import React, { useState } from 'react';
import { 
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Shield,
  CheckCircle2,
  XCircle,
  Lock,
  UserPlus,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Agent {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  role: 'super_admin' | 'admin' | 'agent';
  status: 'active' | 'inactive';
  permissions: string[];
  assignedTo?: string; // Admin ID if agent is assigned to an admin
  createdAt: string;
  updatedAt: string;
}

const Agents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showEditAgentModal, setShowEditAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Current user - in a real app, this would come from auth context
  const currentUser = {
    role: 'super_admin',
    id: '1'
  };

  const [agents] = useState<Agent[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      role: 'super_admin',
      status: 'active',
      permissions: ['all'],
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z'
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Michael Roberts',
        email: 'michael.roberts@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      role: 'admin',
      status: 'active',
      permissions: ['manage_agents', 'manage_tickets', 'view_reports'],
      assignedTo: '1',
      createdAt: '2025-03-02T00:00:00Z',
      updatedAt: '2025-03-02T00:00:00Z'
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Emily Thompson',
        email: 'emily.thompson@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      role: 'agent',
      status: 'active',
      permissions: ['handle_tickets', 'view_reports'],
      assignedTo: '2',
      createdAt: '2025-03-03T00:00:00Z',
      updatedAt: '2025-03-03T00:00:00Z'
    }
  ]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || agent.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const canManageAgents = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const canManageAdmins = currentUser.role === 'super_admin';

  const handleAddAgent = async () => {
    // Implementation for adding a new agent
  };

  const handleEditAgent = async () => {
    // Implementation for editing an agent
  };

  const handleDeleteAgent = async (agentId: string) => {
    // Implementation for deleting an agent
  };

  const getPermissionBadgeClass = (permission: string) => {
    switch (permission) {
      case 'all':
        return 'bg-purple-100 text-purple-800';
      case 'manage_agents':
        return 'bg-blue-100 text-blue-800';
      case 'manage_tickets':
        return 'bg-green-100 text-green-800';
      case 'view_reports':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
        {canManageAgents && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setShowAddAgentModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Agent
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Agents</dt>
                  <dd className="text-lg font-medium text-gray-900">{agents.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {agents.filter(a => a.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {agents.filter(a => a.role === 'admin').length}
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
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Super Admins</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {agents.filter(a => a.role === 'super_admin').length}
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
              placeholder="Search agents..."
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
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {canManageAdmins && <option value="super_admin">Super Admin</option>}
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
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

      {/* Agents List */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Agent
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Permissions
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Reports To
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={agent.user.avatar}
                        alt={agent.user.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{agent.user.name}</div>
                      <div className="text-sm text-gray-500">{agent.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      agent.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : agent.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    {!canManageAgents && <Lock className="w-4 h-4 ml-1 text-gray-400" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {agent.permissions.map((permission) => (
                      <span
                        key={permission}
                        className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getPermissionBadgeClass(permission)}`}
                      >
                        {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {agent.assignedTo ? (
                    <div className="flex items-center">
                      <img
                        className="w-6 h-6 rounded-full"
                        src={agents.find(a => a.id === agent.assignedTo)?.user.avatar}
                        alt=""
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {agents.find(a => a.id === agent.assignedTo)?.user.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    {canManageAgents && (agent.role !== 'super_admin' || currentUser.role === 'super_admin') && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setShowEditAgentModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Agent Modal */}
      {(showAddAgentModal || showEditAgentModal) && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal content */}
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                {/* Modal implementation */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;