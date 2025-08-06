import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  LogOut, 
  CheckCircle, 
  Building2, 
  Calendar,
  Image,
  MessageCircle,
  Settings,
  RefreshCw
} from 'lucide-react';
import LogoUpload from './LogoUpload';
import CompanyInfoForm from './CompanyInfoForm';
import WebinarDatePicker from './WebinarDatePicker';
import MarketingBanner from './MarketingBanner';
import BoothUpgrade from './BoothUpgrade';
import Chatbot from './Chatbot';

const ExhibitorDashboard = () => {
  const { logout } = useAuth();
  const [exhibitor, setExhibitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 30 seconds to catch updates from admin
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/exhibitors/dashboard');
      setExhibitor(response.data.exhibitor);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getChecklistProgress = () => {
    if (!exhibitor) return 0;
    const items = Object.values(exhibitor.onboardingChecklist);
    const completed = items.filter(item => item).length;
    return Math.round((completed / items.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!exhibitor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/sbe-logo-greenblock-resized.png" 
                alt="Smart Exhibitor Portal Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain mr-3 sm:mr-4"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Smart Exhibitor Portal
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Welcome, {exhibitor.contactName} ({exhibitor.companyName})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Refresh Dashboard"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title="Help & FAQ"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Building2 },
              { id: 'onboarding', label: 'Onboarding', icon: CheckCircle },
              { id: 'services', label: 'Services', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Small Business Expo 2024!
              </h2>
              <p className="text-gray-600 mb-4">
                Complete your onboarding checklist to ensure a successful exhibition experience.
              </p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Onboarding Progress</span>
                  <span className="text-sm text-gray-500">{getChecklistProgress()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getChecklistProgress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Booth Number</p>
                      <p className="text-lg font-semibold text-gray-900">{exhibitor.boothNumber || 'TBD'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="text-lg font-semibold text-gray-900">{exhibitor.paymentStatus}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Booth Size</p>
                      <p className="text-lg font-semibold text-gray-900">{exhibitor.boothSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding Checklist */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
                <span className="text-sm font-medium text-green-600">{getChecklistProgress()}% Complete</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{getChecklistProgress()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getChecklistProgress()}%` }}
                  ></div>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Onboarding Checklist</p>
                    <p className="text-xs text-gray-500">Complete all steps to get ready for the event</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <div className="space-y-6">
            <LogoUpload exhibitor={exhibitor} onUpdate={fetchDashboardData} />
            <CompanyInfoForm exhibitor={exhibitor} onUpdate={fetchDashboardData} />
            <WebinarDatePicker exhibitor={exhibitor} onUpdate={fetchDashboardData} />
            <MarketingBanner exhibitor={exhibitor} onUpdate={fetchDashboardData} />
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <BoothUpgrade exhibitor={exhibitor} onUpdate={fetchDashboardData} />
          </div>
        )}
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default ExhibitorDashboard; 