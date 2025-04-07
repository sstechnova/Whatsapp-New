import React from 'react';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const messageData = [
  { name: 'Jan', sent: 4000, received: 2400 },
  { name: 'Feb', sent: 3000, received: 1398 },
  { name: 'Mar', sent: 2000, received: 9800 },
  { name: 'Apr', sent: 2780, received: 3908 },
  { name: 'May', sent: 1890, received: 4800 },
  { name: 'Jun', sent: 2390, received: 3800 },
  { name: 'Jul', sent: 3490, received: 4300 },
];

const campaignData = [
  { name: 'Campaign 1', success: 85, failed: 15 },
  { name: 'Campaign 2', success: 75, failed: 25 },
  { name: 'Campaign 3', success: 92, failed: 8 },
  { name: 'Campaign 4', success: 65, failed: 35 },
  { name: 'Campaign 5', success: 88, failed: 12 },
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <MessageSquare className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Messages</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">24,521</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                12.5%
              </span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                <Users className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Contacts</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">1,325</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                5.2%
              </span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <BarChart3 className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Campaigns</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">12</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                25%
              </span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-md">
                <TrendingUp className="w-6 h-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">24.8%</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-sm font-medium text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                2.3%
              </span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Message Activity</h2>
          <div className="mt-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={messageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sent" stackId="1" stroke="#25D366" fill="#25D366" fillOpacity={0.8} />
                <Area type="monotone" dataKey="received" stackId="1" stroke="#34B7F1" fill="#34B7F1" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Campaign Performance</h2>
          <div className="mt-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" stackId="a" fill="#25D366" />
                <Bar dataKey="failed" stackId="a" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="mt-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="flow-root mt-6">
            <ul className="-my-5 divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
                    <p className="text-sm text-gray-500 truncate">Responded to your message about product pricing</p>
                  </div>
                  <div>
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      Just now
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Michael Roberts</p>
                    <p className="text-sm text-gray-500 truncate">New lead from Summer Sale campaign</p>
                  </div>
                  <div>
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      10 minutes ago
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Jessica Wilson</p>
                    <p className="text-sm text-gray-500 truncate">Campaign "Spring Discount" completed with 89% success rate</p>
                  </div>
                  <div>
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                      1 hour ago
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">David Anderson</p>
                    <p className="text-sm text-gray-500 truncate">Bot flow "Customer Support" triggered 24 times today</p>
                  </div>
                  <div>
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                      3 hours ago
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-6">
            <a href="#" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              View all
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;