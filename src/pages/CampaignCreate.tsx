import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MessageSquare,
  Users,
  Calendar,
  CheckCircle2,
  Upload,
  Clock,
  FileText
} from 'lucide-react';
import CSVReader from 'react-csv-reader';
import { toast } from 'react-toastify';

const CampaignCreate: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('promotional');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [audienceSource, setAudienceSource] = useState('contacts');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCSVUpload = (data: any[], fileInfo: any) => {
    setCsvData(data);
    toast.success(`Successfully uploaded ${data.length} contacts`);
  };

  const handleCSVError = (error: any) => {
    toast.error('Error uploading CSV file');
    console.error('CSV Upload Error:', error);
  };

  const nextStep = () => {
    if (step === 1 && !campaignName) {
      toast.error('Please enter a campaign name');
      return;
    }

    if (step === 2 && !messageTemplate) {
      toast.error('Please select a message template');
      return;
    }

    if (step === 3 && audienceSource === 'csv' && csvData.length === 0) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (step === 4 && scheduleType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select both date and time for scheduled campaign');
      return;
    }

    if (step === 5) {
      if (!termsAccepted) {
        toast.error('Please accept the terms to continue');
        return;
      }
      
      // Handle campaign creation
      toast.success('Campaign created successfully!');
      // Redirect to campaigns list
      navigate('/marketing/campaigns');
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Campaign Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter the basic information about your campaign.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="campaign-name"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Summer Sale Announcement"
                />
              </div>
              
              <div>
                <label htmlFor="campaign-type" className="block text-sm font-medium text-gray-700">
                  Campaign Type
                </label>
                <select
                  id="campaign-type"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                >
                  <option value="promotional">Promotional</option>
                  <option value="transactional">Transactional</option>
                  <option value="announcement">Announcement</option>
                  <option value="survey">Survey</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Message Template</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a message template for your campaign.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {['Welcome Message', 'Product Announcement', 'Special Offer', 'Customer Survey'].map((template) => (
                <div
                  key={template}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer ${
                    messageTemplate === template
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMessageTemplate(template)}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      checked={messageTemplate === template}
                      onChange={() => setMessageTemplate(template)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{template}</label>
                    <p className="text-gray-500">Sample template description goes here</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Select Audience</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose how you want to select your campaign audience.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Audience Source</label>
                <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                  <div
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer ${
                      audienceSource === 'contacts'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAudienceSource('contacts')}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={audienceSource === 'contacts'}
                        onChange={() => setAudienceSource('contacts')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Existing Contacts</label>
                      <p className="text-gray-500">Select from your contact database</p>
                    </div>
                  </div>
                  
                  <div
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer ${
                      audienceSource === 'csv'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAudienceSource('csv')}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={audienceSource === 'csv'}
                        onChange={() => setAudienceSource('csv')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">CSV Upload</label>
                      <p className="text-gray-500">Import contacts from a CSV file</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {audienceSource === 'contacts' ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Available Contact Lists</h3>
                  <div className="mt-2 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">All Contacts</p>
                        <p className="text-sm text-gray-500">1,245 contacts</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Newsletter Subscribers</p>
                        <p className="text-sm text-gray-500">856 contacts</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recent Customers</p>
                        <p className="text-sm text-gray-500">423 contacts</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Upload CSV File</h3>
                  <div className="mt-2">
                    <CSVReader
                      onFileLoaded={handleCSVUpload}
                      onError={handleCSVError}
                      parserOptions={{ header: true }}
                    />
                    {csvData.length > 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        {csvData.length} contacts loaded successfully
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Campaign Schedule</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose when to send your campaign.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Sending Time</label>
                <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                  <div
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer ${
                      scheduleType === 'immediate'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setScheduleType('immediate')}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={scheduleType === 'immediate'}
                        onChange={() => setScheduleType('immediate')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Send Immediately</label>
                      <p className="text-gray-500">Your campaign will start right away</p>
                    </div>
                  </div>
                  
                  <div
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer ${
                      scheduleType === 'scheduled'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setScheduleType('scheduled')}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={scheduleType === 'scheduled'}
                        onChange={() => setScheduleType('scheduled')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Schedule for Later</label>
                      <p className="text-gray-500">Choose a specific date and time</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {scheduleType === 'scheduled' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="scheduled-date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      id="scheduled-date"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="scheduled-time" className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      id="scheduled-time"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="p-4 border border-yellow-300 rounded-md bg-yellow-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Sending Time Optimization</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Messages will be sent according to each recipient's local time zone when possible.
                        This helps ensure better engagement rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Review Campaign</h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your campaign details before sending.
              </p>
            </div>
            
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Campaign Summary</h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Campaign Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{campaignName}</dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Campaign Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize sm:mt-0 sm:col-span-2">{campaignType}</dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Message Template</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{messageTemplate}</dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Audience Source</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize sm:mt-0 sm:col-span-2">
                      {audienceSource === 'contacts' ? 'Existing Contacts' : 'CSV Upload'}
                      {audienceSource === 'csv' && csvData.length > 0 && ` (${csvData.length} contacts)`}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Schedule</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {scheduleType === 'immediate' ? (
                        'Send Immediately'
                      ) : (
                        `Scheduled for ${scheduledDate} at ${scheduledTime}`
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I confirm that this campaign complies with WhatsApp's Business Policy
                  </label>
                  <p className="text-gray-500">
                    By accepting, you confirm that your message content and recipient list comply with all
                    applicable terms of service and messaging policies.
                  </p>
                </div>
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
      <div className="flex items-center mb-6">
        <Link to="/marketing/campaigns" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Campaigns
        </Link>
        <h1 className="ml-4 text-2xl font-semibold text-gray-900">Create Campaign</h1>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="relative">
              <div className="absolute left-0 top-2 w-full h-0.5 bg-gray-200">
                <div
                  className="absolute h-0.5 bg-green-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                ></div>
              </div>
              <div className="relative flex justify-between">
                {[1, 2, 3, 4, 5].map((number) => (
                  <div
                    key={number}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= number ? 'bg-green-600' : 'bg-gray-200'
                    } transition-colors duration-300`}
                  >
                    {step > number ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span className={`text-sm font-medium ${step >= number ? 'text-white' : 'text-gray-700'}`}>
                        {number}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-xs font-medium text-gray-500">Details</div>
              <div className="text-xs font-medium text-gray-500">Template</div>
              <div className="text-xs font-medium text-gray-500">Audience</div>
              <div className="text-xs font-medium text-gray-500">Schedule</div>
              <div className="text-xs font-medium text-gray-500">Review</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Step content */}
      <div className="p-6 bg-white rounded-lg shadow">
        {renderStepContent()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {step === 5 ? 'Launch Campaign' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreate;