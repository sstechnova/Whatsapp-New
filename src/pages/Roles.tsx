import React, { useState } from 'react';
import { 
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

const defaultPermissions: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Create and manage user roles' },
  { id: 'manage_campaigns', name: 'Manage Campaigns', description: 'Create and manage marketing campaigns' },
  { id: 'view_reports', name: 'View Reports', description: 'Access analytics and reports' },
  { id: 'manage_templates', name: 'Manage Templates', description: 'Create and edit message templates' },
  { id: 'manage_support', name: 'Manage Support', description: 'Handle customer support tickets' }
];

const Roles: React.FC = () => {
  // Simulated current user - in a real app, this would come from auth context
  const currentUser = {
    role: 'super_admin'
  };

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['manage_users', 'manage_roles', 'manage_campaigns', 'view_reports', 'manage_templates', 'manage_support'],
      userCount: 1,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with limited permissions',
      permissions: ['manage_users', 'manage_campaigns', 'view_reports', 'manage_templates'],
      userCount: 3,
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'Marketing Manager',
      description: 'Access to marketing features and campaigns',
      permissions: ['manage_campaigns', 'view_reports', 'manage_templates'],
      userCount: 5,
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-03T00:00:00Z'
    },
    {
      id: '4',
      name: 'Support Agent',
      description: 'Access to customer support features',
      permissions: ['manage_support', 'view_reports'],
      userCount: 8,
      createdAt: '2025-01-04T00:00:00Z',
      updatedAt: '2025-01-04T00:00:00Z'
    }
  ]);

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const handleCreateRole = () => {
    if (currentUser.role === 'super_admin') {
      if (selectedRole) {
        // Handle role update
        setRoles(roles.map(role => 
          role.id === selectedRole.id ? {
            ...selectedRole,
            name: newRoleName || selectedRole.name,
            description: newRoleDescription || selectedRole.description,
            permissions: selectedPermissions,
            updatedAt: new Date().toISOString()
          } : role
        ));
        setSelectedRole(null);
      } else {
        // Handle new role creation
        if (newRoleName.toLowerCase() !== 'admin') {
          setFormError('Super Admin can only create Admin roles');
          return;
        }

        const newRole: Role = {
          id: `${roles.length + 1}`,
          name: newRoleName,
          description: newRoleDescription,
          permissions: selectedPermissions,
          userCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setRoles([...roles, newRole]);
      }
      setShowAddRoleModal(false);
      resetForm();
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const resetForm = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setFormError('');
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setSelectedPermissions(role.permissions);
    setShowAddRoleModal(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
        {currentUser.role === 'super_admin' && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setShowAddRoleModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Admin Role
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">{role.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {(currentUser.role === 'super_admin' && (
                    role.name === 'Admin' || 
                    role.name === 'Marketing Manager' || 
                    role.name === 'Support Agent'
                  )) && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(role)}
                        className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role.id)}
                        className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">{role.description}</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Users</span>
                    </div>
                    <span>{role.userCount}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Permissions</span>
                    </div>
                    <span>{role.permissions.length}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Created</span>
                    </div>
                    <span>{new Date(role.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {role.permissions.map((permissionId) => {
                      const permission = defaultPermissions.find(p => p.id === permissionId);
                      return permission ? (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {permission.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit role modal */}
      {showAddRoleModal && (
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
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedRole ? `Edit ${selectedRole.name} Role` : 'Create Admin Role'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedRole
                          ? 'Edit the role details and permissions below.'
                          : 'Super Admin can only create Admin roles with specific permissions.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {formError && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
                        Role Name
                      </label>
                      <input
                        type="text"
                        id="role-name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Admin"
                      />
                    </div>

                    <div>
                      <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="role-description"
                        rows={3}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        placeholder="Describe the role's responsibilities"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Permissions
                      </label>
                      <div className="mt-2 space-y-2">
                        {defaultPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPermissions([...selectedPermissions, permission.id]);
                                  } else {
                                    setSelectedPermissions(selectedPermissions.filter(id => id !== permission.id));
                                  }
                                }}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label className="font-medium text-gray-700">{permission.name}</label>
                              <p className="text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateRole}
                >
                  {selectedRole ? 'Save Changes' : 'Create Role'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAddRoleModal(false);
                    setSelectedRole(null);
                    resetForm();
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

export default Roles;