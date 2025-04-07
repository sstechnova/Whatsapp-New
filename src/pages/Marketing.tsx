import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  PlusCircle,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const Marketing: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
        <div className="mt-4 md:mt-0">
          <Link
            to="/marketing/campaigns/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Campaign
          </Link>
        </div>
      </div>
      
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Campaigns</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">12</div>
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
                <Users className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reached Contacts</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">8,521</div>
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
                <BarChart3 className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">24.8%</div>
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
                <FileText className="w-6 h-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Templates Used</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">8</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Marketing Features */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Marketing Features</h2>
        <div className="grid grid-cols-1 gap-5 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                  <MessageSquare className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp Cloud API</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Send bulk messages to large groups effortlessly using WhatsApp's official Cloud API.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/settings"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Configure API →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                  <Users className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Targeted Campaigns</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Send personalized bulk campaigns with targeted greetings, offers, and updates.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/marketing/campaigns"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  View Campaigns →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                  <FileText className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">CSV Bulk Sending</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Upload CSV files to launch bulk campaigns without adding entries to your database.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/marketing/campaigns/create"
                  className="text-sm font-medium text-green-600 hover:text-green-500"
                >
                  Create Campaign →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Campaigns */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Campaigns</h2>
          <Link
            to="/marketing/campaigns"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Campaign
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Sent
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Delivered
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Summer Sale Announcement</div>
                            <div className="text-sm text-gray-500">Promotional</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        1,245
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        1,198 (96%)
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        June 8, 2025
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">New Product Launch</div>
                            <div className="text-sm text-gray-500">Announcement</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        2,500
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        2,356 (94%)
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        May 22, 2025
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Customer Feedback Survey</div>
                            <div className="text-sm text-gray-500">Survey</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                          In Progress
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        850 / 1,500
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        842 (99%)
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        June 10, 2025
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;