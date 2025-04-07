import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Bot, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  BellRing,
  MessageCircle,
  Brain,
  LayoutGrid,
  Briefcase,
  Monitor,
  Clock,
  Globe,
  Mail,
  Search,
  UserPlus,
  Shield,
  Ticket,
  PieChart,
  Reply,
  Bell,
  CreditCard
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTopIcon, setActiveTopIcon] = useState('grid');
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Marketing', href: '/marketing', icon: MessageSquare },
    { name: 'Auto Reply', href: '/auto-reply', icon: Reply },
    { name: 'Auto Follow-up', href: '/auto-followup', icon: Bell },
    { name: 'Conversations', href: '/conversations', icon: MessageCircle },
    { name: 'Bot Builder', href: '/bot-builder', icon: Bot },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Brain },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Reports', href: '/reports', icon: PieChart },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Users', href: '/users', icon: UserPlus },
    { name: 'Roles', href: '/roles', icon: Shield },
    { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={toggleSidebar}></div>
        
        <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
          <div className="absolute top-0 right-0 pt-2 -mr-12">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-green-600">WhatsApp CRM</h1>
            </div>
            <nav className="px-2 mt-5 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-green-100 text-green-600'
                
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      location.pathname === item.href ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
            <Link to="/login" className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">John Doe</p>
                <div className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                  <LogOut className="w-4 h-4 mr-1" />
                  <span>Logout</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 min-h-0 border-r border-gray-200 bg-white">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-green-600">WhatsApp CRM</h1>
              </div>
              <nav className="flex-1 px-2 mt-5 space-y-1 bg-white">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-green-100 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        location.pathname === item.href ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
              <Link to="/login" className="flex items-center w-full group">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    <LogOut className="w-3 h-3 mr-1" />
                    <span>Logout</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white sm:px-6 lg:px-8">
            <h1 className="text-lg font-medium text-green-600">WhatsApp CRM</h1>
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto focus:outline-none">
          {/* Top Navigation Bar */}
          <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:border-none">
            <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
              {/* Left side icons */}
              <div className="flex items-center space-x-4">
                <button 
                  className={`p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    activeTopIcon === 'grid' 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-400 bg-white hover:text-gray-500'
                  }`}
                  onClick={() => setActiveTopIcon('grid')}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  className={`p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    activeTopIcon === 'briefcase' 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-400 bg-white hover:text-gray-500'
                  }`}
                  onClick={() => setActiveTopIcon('briefcase')}
                >
                  <Briefcase className="w-5 h-5" />
                </button>
                <button 
                  className={`p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    activeTopIcon === 'monitor' 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-400 bg-white hover:text-gray-500'
                  }`}
                  onClick={() => setActiveTopIcon('monitor')}
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              {/* Center search bar */}
              <div className="flex items-center flex-1 max-w-2xl mx-4">
                <div className="w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>

              {/* Right side icons */}
              <div className="flex items-center space-x-4">
                <button className="p-1.5 text-gray-400 bg-white rounded-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <Clock className="w-5 h-5" />
                </button>
                <button className="p-1.5 text-gray-400 bg-white rounded-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="p-1.5 text-gray-400 bg-white rounded-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <BellRing className="w-5 h-5" />
                </button>
                <button className="p-1.5 text-gray-400 bg-white rounded-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <Mail className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0 ml-4">
                  <div>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="User avatar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;