import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'paused' | 'failed';
  sent: number;
  total: number;
  delivered: number;
  opened: number;
  responded: number;
  date: string;
}

const CampaignList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Sale Announcement',
      type: 'Promotional',
      status: 'completed',
      sent: 1245,
      total: 1245,
      delivered: 1198,
      opened: 987,
      responded: 342,
      date: '2025-06-08'
    },
    {
      id: '2',
      name: 'New Product Launch',
      type: 'Announcement',
      status: 'completed',
      sent: 2500,
      total: 2500,
      delivered: 2356,
      opened: 1890,
      responded: 567,
      date: '2025-05-22'
    },
    {
      id: '3',
      name: 'Customer Feedback Survey',
      type: 'Survey',
      status: 'in_progress',
      sent: 850,
      total: 1500,
      delivered: 842,
      opened: 523,
      responded: 189,
      date: '2025-06-10'
    },
    {
      id: '4',
      name: 'Holiday Special Offer',
      type: 'Promotional',
      status: 'scheduled',
      sent: 0,
      total: 3000,
      delivered: 0,
      opened: 0,
      responded: 0,
      date: '2025-06-15'
    },
    {
      id: '5',
      name: 'Product Restock Notification',
      type: 'Announcement',
      status: 'paused',
      sent: 450,
      total: 1200,
      delivered: 445,
      opened: 320,
      responded: 98,
      date: '2025-06-05'
    },
    {
      id: '6',
      name: 'Abandoned Cart Reminder',
      type: 'Transactional',
      status: 'failed',
      sent: 120,
      total: 500,
      delivered: 110,
      opened: 45,
      responded: 12,
      date: '2025-06-02'
    }
  ];
  
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    const matchesType = selectedType === 'all' || campaign.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'paused':
        return <PauseCircle className="w-5 h-5 text-gray-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/marketing" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Marketing
        </Link>
        <h1 className="ml-4 text-2xl font-semibold text-gray-900">Campaigns</h1>
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
                    <div className="text-lg font-medium text-gray-900">{campaigns.length}</div>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Recipients</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {campaigns.reduce((sum, campaign) => sum + campaign.total, 0).toLocaleString()}
                    </div>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Open Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {Math.round(
                        (campaigns.reduce((sum, campaign) => sum + campaign.opened, 0) /
                        campaigns.reduce((sum, campaign) => sum + campaign.delivered, 0)) * 100
                      )}%
                    </div>
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
                <MessageSquare className="w-6 h-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {Math.round(
                        (campaigns.reduce((sum, campaign) => sum + campaign.responded, 0) /
                        campaigns.reduce((sum, campaign) => sum + campaign.delivered, 0)) * 100
                      )}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Search campaigns..."
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
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="relative inline-block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="block w-full py-2 pl-10 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="promotional">Promotional</option>
              <option value="announcement">Announcement</option>
              <option value="survey">Survey</option>
              <option value="transactional">Transactional</option>
            </select>
          </div>
        </div>
        
        <div>
          <Link
            to="/marketing/campaigns/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Campaign
          </Link>
        </div>
      </div>
      
      {/* Campaigns table */}
      <div className="flex flex-col mt-6">
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
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Performance
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(campaign.status)}
                          <span className={`ml-1.5 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                            {campaign.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[150px]">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.round((campaign.sent / campaign.total) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {campaign.sent}/{campaign.total} ({Math.round((campaign.sent / campaign.total) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.sent > 0 ? (
                            <>
                              <div className="flex items-center">
                                <span className="w-20 text-xs text-gray-500">Delivered:</span>
                                <span className="ml-2 text-sm font-medium">
                                  {Math.round((campaign.delivered / campaign.sent) * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className="w-20 text-xs text-gray-500">Opened:</span>
                                <span className="ml-2 text-sm font-medium">
                                  {Math.round((campaign.opened / campaign.delivered) * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className="w-20 text-xs text-gray-500">Responded:</span>
                                <span className="ml-2 text-sm font-medium">
                                  {Math.round((campaign.responded / campaign.delivered) * 100)}%
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Not started</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(campaign.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignList;