import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Clock,
  Paperclip,
  Send,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Tag,
  UserPlus
} from 'lucide-react';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState('');
  
  // In a real app, this would be fetched from an API
  const ticket = {
    id: 'TKT-001',
    title: 'Unable to access WhatsApp API',
    description: 'Getting authentication errors when trying to connect to WhatsApp Business API. I have verified the API key and all other credentials but still getting 401 unauthorized errors.',
    status: 'open',
    priority: 'high',
    category: 'Technical',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    customer: {
      name: 'Michael Roberts',
      email: 'michael.roberts@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    createdAt: '2025-06-10T10:30:00Z',
    updatedAt: '2025-06-10T14:25:00Z',
    comments: [
      {
        id: '1',
        author: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Support Agent'
        },
        content: 'Hi Michael, I\'ll help you with the WhatsApp API issue. Can you please share your API configuration settings?',
        createdAt: '2025-06-10T11:00:00Z'
      },
      {
        id: '2',
        author: {
          name: 'Michael Roberts',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Customer'
        },
        content: 'Here are my settings:\nAPI Key: ****\nPhone Number: +1234567890\nBusiness Account ID: 123456789',
        createdAt: '2025-06-10T11:15:00Z'
      }
    ],
    activity: [
      {
        id: '1',
        type: 'status_change',
        content: 'Status changed from New to Open',
        actor: 'Sarah Johnson',
        timestamp: '2025-06-10T10:35:00Z'
      },
      {
        id: '2',
        type: 'assignment',
        content: 'Assigned to Sarah Johnson',
        actor: 'System',
        timestamp: '2025-06-10T10:32:00Z'
      }
    ]
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    console.log('New comment:', newComment);
    setNewComment('');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/tickets" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Tickets
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">{ticket.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">{ticket.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-5 sm:px-6">
              <div className="prose max-w-none">
                <p className="text-gray-700">{ticket.description}</p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Comments</h2>
                <div className="flow-root mt-6">
                  <ul className="-mb-8">
                    {ticket.comments.map((comment, commentIdx) => (
                      <li key={comment.id}>
                        <div className="relative pb-8">
                          {commentIdx !== ticket.comments.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <img
                                className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full"
                                src={comment.author.avatar}
                                alt={comment.author.name}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">
                                    {comment.author.name}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <form onSubmit={handleSubmitComment}>
                    <div>
                      <label htmlFor="comment" className="sr-only">
                        Add your comment
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Ticket Details</h2>
            </div>
            <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={ticket.assignee.avatar}
                        alt={ticket.assignee.name}
                      />
                      <span className="ml-2 text-sm text-gray-900">{ticket.assignee.name}</span>
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customer</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={ticket.customer.avatar}
                        alt={ticket.customer.name}
                      />
                      <div className="ml-2">
                        <div className="text-sm text-gray-900">{ticket.customer.name}</div>
                        <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                      </div>
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ticket.category}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-4 border-t border-gray-200 sm:px-6">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Reassign
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Activity</h2>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <ul className="space-y-4">
                {ticket.activity.map((activity) => (
                  <li key={activity.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'status_change' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Tag className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.content}</p>
                      <p className="text-xs text-gray-500">
                        by {activity.actor} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;