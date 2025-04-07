import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical,
  Upload,
  Download,
  Lock,
  XCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { hasPermission, canManageUser } from '../lib/permissions';

type BadgeType = 'diamond' | 'platinum' | 'gold' | 'silver';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  badge: BadgeType;
}

interface User {
  id: string;
  name: string;
  userId: string;
  designation: string;
  address: string;
  email: string;
  phone: string;
  photo: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  roleDetails: UserRole;
  status: 'active' | 'inactive';
}

interface NewUser {
  name: string;
  userId: string;
  designation: string;
  address: string;
  email: string;
  phone: string;
  photo: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
}

const defaultRoles: Record<string, UserRole> = {
  super_admin: {
    id: '1',
    name: 'Super Admin',
    permissions: ['all'],
    description: 'Full system access with all permissions',
    badge: 'diamond'
  },
  admin: {
    id: '2',
    name: 'Admin',
    permissions: ['manage_users', 'manage_content', 'view_reports'],
    description: 'Administrative access with user management',
    badge: 'platinum'
  },
  manager: {
    id: '3',
    name: 'Manager',
    permissions: ['manage_content', 'view_reports'],
    description: 'Team management and reporting access',
    badge: 'gold'
  },
  user: {
    id: '4',
    name: 'User',
    permissions: ['view_content'],
    description: 'Basic user access',
    badge: 'silver'
  }
};

const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    userId: '',
    designation: '',
    address: '',
    email: '',
    phone: '',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'user',
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles (
            id,
            name,
            permissions
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setIsLoading(false);
    }
  };

  const validateForm = (user: NewUser | User) => {
    const errors: Record<string, string> = {};
    
    if (!user.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!user.userId.trim()) {
      errors.userId = 'User ID is required';
    } else if (users.some(u => u.userId === user.userId && u.id !== (user as User).id)) {
      errors.userId = 'User ID already exists';
    }
    
    if (!user.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Invalid email format';
    } else if (users.some(u => u.email === user.email && u.id !== (user as User).id)) {
      errors.email = 'Email already exists';
    }
    
    if (!user.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!user.designation.trim()) {
      errors.designation = 'Job designation is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateForm(newUser)) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;

      setUsers([data, ...users]);
      setShowAddUserModal(false);
      toast.success('User added successfully');
      
      setNewUser({
        name: '',
        userId: '',
        designation: '',
        address: '',
        email: '',
        phone: '',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'user',
        status: 'active'
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !validateForm(selectedUser)) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(selectedUser)
        .eq('id', selectedUser.id)
        .select()
        .single();

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === selectedUser.id ? data : user
      ));
      setShowEditUserModal(false);
      setSelectedUser(null);
      setFormErrors({});
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (showEditUserModal && selectedUser) {
      setSelectedUser(prev => ({
        ...prev!,
        [name]: value
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size must be less than 2MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setFileError('Only JPG, PNG, and GIF files are allowed');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    
    if (showEditUserModal && selectedUser) {
      setSelectedUser(prev => ({
        ...prev!,
        photo: objectUrl
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        photo: objectUrl
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const event = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFileUpload(event);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getBadgeStyles = (badge: BadgeType) => {
    switch (badge) {
      case 'diamond':
        return 'bg-purple-100 text-purple-800 ring-2 ring-purple-500';
      case 'platinum':
        return 'bg-blue-100 text-blue-800 ring-2 ring-blue-500';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500';
      case 'silver':
        return 'bg-gray-100 text-gray-800 ring-2 ring-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(user => user.status === 'active').length}
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
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(user => user.role === 'admin').length}
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
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Regular Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(user => user.role === 'user').length}
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
              placeholder="Search users..."
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
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
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

        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Contact
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.photo}
                        alt={user.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.userId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getBadgeStyles(user.roleDetails.badge)}`}>
                      {user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    {!canManageUser(user.role, user.role) && <Lock className="w-4 h-4 ml-1 text-gray-400" />}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{user.designation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    {canManageUser(user.role, user.role) && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Add/Edit User Modal */}
      {(showAddUserModal || showEditUserModal) && (
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
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {showEditUserModal ? 'Edit User' : 'Add New User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {showEditUserModal
                          ? 'Edit the user details below.'
                          : 'Fill in the details to create a new user.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                          formErrors.name ? 'border-red-300' : ''
                        }`}
                        value={showEditUserModal ? selectedUser?.name : newUser.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                        User ID *
                      </label>
                      <input
                        type="text"
                        id="userId"
                        name="userId"
                        className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                          formErrors.userId ? 'border-red-300' : ''
                        }`}
                        value={showEditUserModal ? selectedUser?.userId : newUser.userId}
                        onChange={handleInputChange}
                        placeholder="JD001"
                      />
                      {formErrors.userId && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.userId}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                          formErrors.email ? 'border-red-300' : ''
                        }`}
                        value={showEditUserModal ? selectedUser?.email : newUser.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                          formErrors.phone ? 'border-red-300' : ''
                        }`}
                        value={showEditUserModal ? selectedUser?.phone : newUser.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Job Designation *
                      </label>
                      <input
                        type="text"
                        id="designation"
                        name="designation"
                        className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                          formErrors.designation ? 'border-red-300' : ''
                        }`}
                        value={showEditUserModal ? selectedUser?.designation : newUser.designation}
                        onChange={handleInputChange}
                        placeholder="Senior Software Engineer"
                      />
                      {formErrors.designation && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.designation}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={2}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={showEditUserModal ? selectedUser?.address : newUser.address}
                        onChange={handleInputChange}
                        placeholder="123 Business St, City, State, ZIP"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={showEditUserModal ? selectedUser?.role : newUser.role}
                        onChange={handleInputChange}
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={showEditUserModal ? selectedUser?.status : newUser.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Photo
                        <span className="ml-1 text-sm text-gray-500">(Max 2MB)</span>
                      </label>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-1 text-center">
                          {(showEditUserModal ? selectedUser?.photo : newUser.photo) ? (
                            <div className="relative inline-block">
                              <img
                                src={showEditUserModal ? selectedUser?.photo : newUser.photo}
                                alt="User photo"
                                className="w-20 h-20 rounded-full object-cover"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                onClick={() => {
                                  if (showEditUserModal && selectedUser) {
                                    setSelectedUser(prev => ({
                                      ...prev!,
                                      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                    }));
                                  } else {
                                    setNewUser(prev => ({
                                      ...prev,
                                      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                    }));
                                  }
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          )}
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/jpeg,image/png,image/gif"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 2MB
                          </p>
                          {fileError && (
                            <p className="text-xs text-red-600 mt-1">{fileError}</p>
                          )}
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
                  onClick={showEditUserModal ? handleEditUser : handleAddUser}
                >
                  {showEditUserModal ? 'Save Changes' : 'Add User'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (showEditUserModal) {
                      setShowEditUserModal(false);
                      setSelectedUser(null);
                    } else {
                      setShowAddUserModal(false);
                      setNewUser({
                        name: '',
                        userId: '',
                        designation: '',
                        address: '',
                        email: '',
                        phone: '',
                        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        role: 'user',
                        status: 'active'
                      });
                    }
                    setFormErrors({});
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

export default Users;