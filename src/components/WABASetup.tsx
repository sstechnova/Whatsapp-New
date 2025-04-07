import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Globe, 
  Building2, 
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import WhatsAppQRCode from './WhatsAppQRCode';

interface WABASetupProps {
  onComplete?: () => void;
}

const WABASetup: React.FC<WABASetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    category: 'retail',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleVerificationComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter your business details to get started with WhatsApp Business API
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Business Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Business Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Business Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="retail">Retail</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="services">Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Business Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Verify WhatsApp Account</h3>
              <p className="mt-1 text-sm text-gray-500">
                Link your WhatsApp account to start using the Business API
              </p>
            </div>

            <div className="flex justify-center">
              <WhatsAppQRCode onVerified={handleVerificationComplete} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Setup Complete</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your WhatsApp Business API account is ready to use
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Setup Successful</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Business account verified
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        WhatsApp connection established
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        API access enabled
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Next Steps</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Start using the WhatsApp Business API to send messages, create templates,
                      and manage your conversations.
                    </p>
                  </div>
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
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute left-0 top-2 w-full h-0.5 bg-gray-200">
          <div
            className="absolute h-0.5 bg-green-500 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
        <div className="relative flex justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <Building2 className={`w-5 h-5 ${step >= 1 ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className="mt-2 text-xs font-medium text-gray-500">Business Info</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <MessageSquare className={`w-5 h-5 ${step >= 2 ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className="mt-2 text-xs font-medium text-gray-500">WhatsApp Setup</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${step >= 3 ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <span className="mt-2 text-xs font-medium text-gray-500">Complete</span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mt-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-auto"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default WABASetup;