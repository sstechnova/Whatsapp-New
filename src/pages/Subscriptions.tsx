import React, { useState } from 'react';
import { 
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  DollarSign,
  Clock,
  Users,
  Settings,
  Star,
  Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { currencies, defaultCurrency, formatPrice, convertPrice, type Currency } from '../lib/currency';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: string;
  features: string[];
  limits: {
    contacts: number;
    messages_per_day: number;
    templates: number;
  };
  is_active: boolean;
}

const Subscriptions: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrency);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    price: 0,
    billing_period: 'monthly',
    features: [],
    limits: {
      contacts: 0,
      messages_per_day: 0,
      templates: 0
    },
    is_active: true
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Free',
      description: 'Basic features for small businesses',
      price: 0,
      billing_period: 'monthly',
      features: ['Basic chat support', 'Standard templates', 'Single user'],
      limits: {
        contacts: 100,
        messages_per_day: 50,
        templates: 5
      },
      is_active: true
    },
    {
      id: '2',
      name: 'Starter',
      description: 'Essential features for growing businesses',
      price: 29.99,
      billing_period: 'monthly',
      features: [
        'Priority chat support',
        'Custom templates',
        '3 team members',
        'Basic analytics'
      ],
      limits: {
        contacts: 500,
        messages_per_day: 200,
        templates: 15
      },
      is_active: true
    },
    {
      id: '3',
      name: 'Professional',
      description: 'Advanced features for established businesses',
      price: 79.99,
      billing_period: 'monthly',
      features: [
        '24/7 Priority support',
        'Advanced templates',
        '10 team members',
        'Advanced analytics',
        'API access'
      ],
      limits: {
        contacts: 2000,
        messages_per_day: 1000,
        templates: 50
      },
      is_active: true
    },
    {
      id: '4',
      name: 'Business',
      description: 'Comprehensive solution for large businesses',
      price: 199.99,
      billing_period: 'monthly',
      features: [
        'Dedicated support',
        'Custom integrations',
        'Unlimited team members',
        'Advanced analytics',
        'API access',
        'Custom branding'
      ],
      limits: {
        contacts: 10000,
        messages_per_day: 5000,
        templates: 200
      },
      is_active: true
    },
    {
      id: '5',
      name: 'Enterprise',
      description: 'Custom solutions for enterprise needs',
      price: 499.99,
      billing_period: 'monthly',
      features: [
        'Dedicated account manager',
        'Custom development',
        'Unlimited everything',
        'White-label solution',
        'Priority API access',
        'Custom analytics'
      ],
      limits: {
        contacts: -1,
        messages_per_day: -1,
        templates: -1
      },
      is_active: true
    }
  ]);

  const displayPrice = (price: number) => {
    return formatPrice(price, selectedCurrency);
  };

  const handlePriceChange = (inputPrice: number) => {
    const priceInINR = convertPrice(inputPrice, selectedCurrency, defaultCurrency);
    setNewPlan({ ...newPlan, price: priceInINR });
  };

  const getInputPrice = () => {
    return newPlan.price ? convertPrice(newPlan.price, defaultCurrency, selectedCurrency) : 0;
  };

  const handleSavePlan = async () => {
    if (!newPlan.name || !newPlan.description || newPlan.price === undefined) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedPlan) {
        const { data, error } = await supabase
          .from('subscription_plans')
          .update({
            name: newPlan.name,
            description: newPlan.description,
            price: newPlan.price,
            billing_period: newPlan.billing_period,
            features: newPlan.features,
            limits: newPlan.limits,
            is_active: newPlan.is_active
          })
          .eq('id', selectedPlan.id)
          .select()
          .single();

        if (error) throw error;

        setPlans(plans.map(plan => 
          plan.id === selectedPlan.id ? data : plan
        ));
      } else {
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert([{
            name: newPlan.name,
            description: newPlan.description,
            price: newPlan.price,
            billing_period: newPlan.billing_period,
            features: newPlan.features,
            limits: newPlan.limits,
            is_active: newPlan.is_active
          }])
          .select()
          .single();

        if (error) throw error;

        setPlans([...plans, data]);
      }

      setShowAddPlanModal(false);
      setSelectedPlan(null);
      setNewPlan({
        name: '',
        description: '',
        price: 0,
        billing_period: 'monthly',
        features: [],
        limits: {
          contacts: 0,
          messages_per_day: 0,
          templates: 0
        },
        is_active: true
      });
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setPlans(plans.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setNewPlan(plan);
    setShowAddPlanModal(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }));
  };

  const handleAddFeature = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</h1>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center">
            <Globe className="w-5 h-5 text-gray-400 mr-2" />
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={selectedCurrency.code}
              onChange={(e) => setSelectedCurrency(
                currencies.find(c => c.code === e.target.value) || defaultCurrency
              )}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowAddPlanModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm border ${
              plan.is_active ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditPlan(plan)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <div className="flex items-baseline mt-4">
                <span className="text-2xl font-semibold text-gray-900">
                  {displayPrice(plan.price)}
                </span>
                <span className="ml-1 text-sm text-gray-500">/{plan.billing_period}</span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Contacts</span>
                  <span className="text-sm font-medium text-gray-900">
                    {plan.limits.contacts === -1 ? 'Unlimited' : plan.limits.contacts.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Messages/day</span>
                  <span className="text-sm font-medium text-gray-900">
                    {plan.limits.messages_per_day === -1 ? 'Unlimited' : plan.limits.messages_per_day.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Templates</span>
                  <span className="text-sm font-medium text-gray-900">
                    {plan.limits.templates === -1 ? 'Unlimited' : plan.limits.templates}
                  </span>
                </div>
              </div>

              {!plan.is_active && (
                <div className="mt-4 p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 text-center">This plan is inactive</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddPlanModal && (
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
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedPlan
                          ? 'Edit the subscription plan details below.'
                          : 'Set up a new subscription plan by filling out the details below.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      id="plan-name"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      placeholder="Professional"
                    />
                  </div>

                  <div>
                    <label htmlFor="plan-description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      id="plan-description"
                      rows={3}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      placeholder="Advanced features for established businesses"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="plan-price" className="block text-sm font-medium text-gray-700">
                        Price *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">{selectedCurrency.symbol}</span>
                        </div>
                        <input
                          type="number"
                          id="plan-price"
                          className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={getInputPrice()}
                          onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                          placeholder="79.99"
                          step="0.01"
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">{selectedCurrency.code}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="billing-period" className="block text-sm font-medium text-gray-700">
                        Billing Period
                      </label>
                      <select
                        id="billing-period"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newPlan.billing_period}
                        onChange={(e) => setNewPlan({ ...newPlan, billing_period: e.target.value })}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <div className="mt-2 space-y-2">
                      {newPlan.features?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Feature description"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Feature
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Limits
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label htmlFor="contacts-limit" className="block text-sm font-medium text-gray-500">
                          Contacts
                        </label>
                        <input
                          type="number"
                          id="contacts-limit"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newPlan.limits?.contacts}
                          onChange={(e) => setNewPlan({
                            ...newPlan,
                            limits: { ...newPlan.limits!, contacts: parseInt(e.target.value) }
                          })}
                          min="-1"
                          placeholder="Enter -1 for unlimited"
                        />
                      </div>
                      <div>
                        <label htmlFor="messages-limit" className="block text-sm font-medium text-gray-500">
                          Messages/day
                        </label>
                        <input
                          type="number"
                          id="messages-limit"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newPlan.limits?.messages_per_day}
                          onChange={(e) => setNewPlan({
                            ...newPlan,
                            limits: { ...newPlan.limits!, messages_per_day: parseInt(e.target.value) }
                          })}
                          min="-1"
                          placeholder="Enter -1 for unlimited"
                        />
                      </div>
                      <div>
                        <label htmlFor="templates-limit" className="block text-sm font-medium text-gray-500">
                          Templates
                        </label>
                        <input
                          type="number"
                          id="templates-limit"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={newPlan.limits?.templates}
                          onChange={(e) => setNewPlan({
                            ...newPlan,
                            limits: { ...newPlan.limits!, templates: parseInt(e.target.value) }
                          })}
                          min="-1"
                          placeholder="Enter -1 for unlimited"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is-active"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      checked={newPlan.is_active}
                      onChange={(e) => setNewPlan({ ...newPlan, is_active: e.target.checked })}
                    />
                    <label htmlFor="is-active" className="block ml-2 text-sm text-gray-900">
                      Plan is active
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleSavePlan}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : selectedPlan ? 'Save Changes' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAddPlanModal(false);
                    setSelectedPlan(null);
                    setNewPlan({
                      name: '',
                      description: '',
                      price: 0,
                      billing_period: 'monthly',
                      features: [],
                      limits: {
                        contacts: 0,
                        messages_per_day: 0,
                        templates: 0
                      },
                      is_active: true
                    });
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

export default Subscriptions;