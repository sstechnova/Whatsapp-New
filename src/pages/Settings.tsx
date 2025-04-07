import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  MessageSquare, 
  Bell, 
  Lock,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [apiKey, setApiKey] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to the backend
    alert('Settings saved successfully!');
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your account details and preferences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  defaultValue="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  defaultValue="john.doe@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  defaultValue="Acme Inc."
                />
              </div>
              
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  defaultValue="America/New_York"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About
              </label>
              <textarea
                id="about"
                rows={3}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                defaultValue="Marketing manager at Acme Inc."
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="marketing-emails"
                name="marketing-emails"
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                defaultChecked
              />
              <label htmlFor="marketing-emails" className="block ml-2 text-sm text-gray-900">
                Receive marketing emails and product updates
              </label>
            </div>
          </div>
        );
      
      case 'whatsapp':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">WhatsApp API Configuration</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure your WhatsApp Business API connection.
              </p>
            </div>
            
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                WhatsApp API Key
              </label>
              <div className="flex mt-1">
                <input
                  type="password"
                  id="api-key"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your WhatsApp API key"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Verify
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                You can find your API key in the WhatsApp Business Platform dashboard.
              </p>
            </div>
            
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                WhatsApp Business Phone Number
              </label>
              <input
                type="text"
                id="phone-number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                Business Display Name
              </label>
              <input
                type="text"
                id="business-name"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">WhatsApp Business Account Health</h4>
              <div className="p-4 mt-2 bg-green-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Account Active</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your WhatsApp Business Account is active and in good standing. Message quality score: 98/100
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Token Information</h4>
              <div className="p-4 mt-2 border border-gray-200 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Token Status</p>
                    <p className="text-sm font-medium text-gray-900">Active</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expiration</p>
                    <p className="text-sm font-medium text-gray-900">June 15, 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rate Limit</p>
                    <p className="text-sm font-medium text-gray-900">250 messages/second</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Verified</p>
                    <p className="text-sm font-medium text-gray-900">Today at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh Token
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage how you receive notifications and alerts.
              </p>
            </div>
            
            <div>
              <label htmlFor="notification-email" className="block text-sm font-medium text-gray-700">
                Notification Email
              </label>
              <input
                type="email"
                id="notification-email"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="notifications@example.com"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Notification Channels</h4>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <label htmlFor="email-notifications" className="block ml-2 text-sm text-gray-900">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="sound-notifications"
                    name="sound-notifications"
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={soundNotifications}
                    onChange={(e) => setSoundNotifications(e.target.checked)}
                  />
                  <label htmlFor="sound-notifications" className="block ml-2 text-sm text-gray-900">
                    Sound Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="browser-notifications"
                    name="browser-notifications"
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={browserNotifications}
                    onChange={(e) => setBrowserNotifications(e.target.checked)}
                  />
                  <label htmlFor="browser-notifications" className="block ml-2 text-sm text-gray-900">
                    Browser Notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Notification Events</h4>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="new-message" className="text-sm text-gray-900">
                    New Message
                  </label>
                  <select
                    id="new-message"
                    className="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    defaultValue="all"
                  >
                    <option value="all">All channels</option>
                    <option value="email">Email only</option>
                    <option value="sound">Sound only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="campaign-completed" className="text-sm text-gray-900">
                    Campaign Completed
                  </label>
                  <select
                    id="campaign-completed"
                    className="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    defaultValue="all"
                  >
                    <option value="all">All channels</option>
                    <option value="email">Email only</option>
                    <option value="sound">Sound only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="new-lead" className="text-sm text-gray-900">
                    New Lead
                  </label>
                  <select
                    id="new-lead"
                    className="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    defaultValue="all"
                  >
                    <option value="all">All channels</option>
                    <option value="email">Email only</option>
                    <option value="sound">Sound only</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account security and password.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Change Password</h4>
              <div className="mt-2 space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
              <div className="p-4 mt-2 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-factor authentication is disabled</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Session Management</h4>
              <div className="mt-2 overflow-hidden border border-gray-200 rounded-md">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                        <p className="text-xs text-gray-500">Last active: Just now</p>
                      </div>
                      <p className="text-xs text-green-600">Current session</p>
                    </div>
                  </li>
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                        <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-red-600 hover:text-red-500"
                      >
                        Revoke
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="account">Account</option>
            <option value="whatsapp">WhatsApp API</option>
            <option value="notifications">Notifications</option>
            <option value="security">Security</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'account'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                Account
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'whatsapp'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('whatsapp')}
              >
                <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                WhatsApp API
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="w-5 h-5 mx-auto mb-1" />
                Notifications
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Lock className="w-5 h-5 mx-auto mb-1" />
                Security
              </button>
            </nav>
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
          
          {activeTab !== 'security' && (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleSaveSettings}
              >
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;