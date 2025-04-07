import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart,
  Calendar,
  Clock,
  Download,
  Filter,
  Users,
  Tag,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('overview');

  // Sample data - in a real app, this would come from your API
  const ticketsByStatus = [
    { name: 'Open', value: 25, color: '#FCD34D' },
    { name: 'In Progress', value: 15, color: '#60A5FA' },
    { name: 'Resolved', value: 35, color: '#34D399' },
    { name: 'Closed', value: 25, color: '#9CA3AF' }
  ];

  const ticketsByPriority = [
    { name: 'Low', value: 20, color: '#34D399' },
    { name: 'Medium', value: 30, color: '#FCD34D' },
    { name: 'High', value: 35, color: '#F97316' },
    { name: 'Urgent', value: 15, color: '#EF4444' }
  ];

  const ticketTrends = [
    { name: 'Mon', created: 12, resolved: 8 },
    { name: 'Tue', created: 19, resolved: 15 },
    { name: 'Wed', created: 15, resolved: 12 },
    { name: 'Thu', created: 22, resolved: 18 },
    { name: 'Fri', created: 18, resolved: 16 },
    { name: 'Sat', created: 10, resolved: 8 },
    { name: 'Sun', created: 8, resolved: 6 }
  ];

  const responseTimeData = [
    { name: '< 1h', tickets: 45 },
    { name: '1-4h', tickets: 30 },
    { name: '4-8h', tickets: 15 },
    { name: '8-24h', tickets: 8 },
    { name: '> 24h', tickets: 2 }
  ];

  const agentPerformance = [
    { name: 'Sarah', resolved: 45, avgResponse: '1.5h', satisfaction: 4.8 },
    { name: 'Mike', resolved: 38, avgResponse: '2h', satisfaction: 4.6 },
    { name: 'Emily', resolved: 42, avgResponse: '1.8h', satisfaction: 4.7 },
    { name: 'David', resolved: 35, avgResponse: '2.2h', satisfaction: 4.5 }
  ];

  const commonTags = [
    { name: 'technical', count: 125 },
    { name: 'billing', count: 98 },
    { name: 'feature-request', count: 76 },
    { name: 'bug', count: 65 },
    { name: 'urgent', count: 45 }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                reportType === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setReportType('overview')}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-1" />
              Overview
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                reportType === 'performance'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setReportType('performance')}
            >
              <Users className="w-5 h-5 mx-auto mb-1" />
              Agent Performance
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                reportType === 'trends'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setReportType('trends')}
            >
              <PieChart className="w-5 h-5 mx-auto mb-1" />
              Trends & Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {reportType === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Tickets
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            1,482
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Avg Response Time
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            2.5h
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Open Tickets
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            25
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <Tag className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Resolution Rate
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            94%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">Tickets by Status</h3>
                  <div className="mt-4" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={ticketsByStatus}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ticketsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900">Tickets by Priority</h3>
                  <div className="mt-4" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={ticketsByPriority}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ticketsByPriority.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'performance' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Agent Performance Metrics
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets Resolved
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Response Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfaction Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agentPerformance.map((agent) => (
                        <tr key={agent.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {agent.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.resolved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.avgResponse}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.satisfaction}/5.0
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Response Time Distribution</h3>
                <div className="mt-4" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tickets" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {reportType === 'trends' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Ticket Trends</h3>
                <div className="mt-4" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="created" fill="#60A5FA" name="Created" />
                      <Bar dataKey="resolved" fill="#34D399" name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Common Tags
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {commonTags.map((tag) => (
                      <li key={tag.name} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Tag className="h-5 w-5 text-gray-400" />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {tag.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {tag.count} tickets
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;