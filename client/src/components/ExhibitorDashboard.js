import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  LogOut, 
  Upload, 
  CheckCircle, 
  Circle, 
  Building2, 
  Calendar,
  Image,
  ArrowUpRight,
  MessageCircle,
  Settings
} from 'lucide-react';
import LogoUpload from './LogoUpload';
import CompanyInfoForm from './CompanyInfoForm';
import WebinarDatePicker from './WebinarDatePicker';
import MarketingBanner from './MarketingBanner';
import BoothUpgrade from './BoothUpgrade';
import Chatbot from './Chatbot';

const ExhibitorDashboard = () => {
  const { user, logout } = useAuth();
  const [exhibitor, setExhibitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchDashboardData();
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
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Smart Exhibitor Portal
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {exhibitor.contactName} ({exhibitor.companyName})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
                      ? 'bg-blue-100 text-blue-700'
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
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getChecklistProgress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
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
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 text-purple-600 mr-3" />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Checklist</h3>
              <div className="space-y-3">
                {[
                  { key: 'logoUploaded', label: 'Upload Company Logo', icon: Upload },
                  { key: 'companyInfoSubmitted', label: 'Submit Company Information', icon: Building2 },
                  { key: 'webinarDateSelected', label: 'Select Webinar Date', icon: Calendar },
                  { key: 'marketingBannerGenerated', label: 'Generate Marketing Banner', icon: Image }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCompleted = exhibitor.onboardingChecklist[item.key];
                  return (
                    <div key={item.key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <Icon className="h-4 w-4 text-gray-500 mr-3" />
                      <span className={`flex-1 ${isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                      {isCompleted && (
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      )}
                    </div>
                  );
                })}
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