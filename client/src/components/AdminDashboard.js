import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  LogOut, 
  Users, 
  CheckCircle, 
  X, 
  Clock, 
  Building2,
  Image,
  FileText,
  ArrowUpRight,
  Eye,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [exhibitors, setExhibitors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [exhibitorsResponse, statsResponse] = await Promise.all([
        axios.get('/api/admin/exhibitors'),
        axios.get('/api/admin/dashboard')
      ]);
      setExhibitors(exhibitorsResponse.data.exhibitors);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleApprove = async (exhibitorId, type, approved) => {
    try {
      await axios.put(`/api/admin/exhibitors/${exhibitorId}/${type}`, { approved });
      fetchAdminData();
    } catch (error) {
      console.error('Failed to update approval status:', error);
    }
  };

  const handlePaymentUpdate = async (exhibitorId, paymentStatus) => {
    try {
      await axios.put(`/api/admin/exhibitors/${exhibitorId}/payment`, { paymentStatus });
      fetchAdminData();
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid in Full': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
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
                  Smart Exhibitor Portal - Admin
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {user?.contactName}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'exhibitors', label: 'Exhibitors', icon: Users },
              { id: 'approvals', label: 'Approvals', icon: CheckCircle }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Exhibitors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalExhibitors || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Image className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Logos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingLogos || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Info</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingCompanyInfo || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ArrowUpRight className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Paid in Full</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.paidInFull || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {exhibitors.slice(0, 5).map((exhibitor) => (
                  <div key={exhibitor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{exhibitor.companyName}</p>
                        <p className="text-sm text-gray-500">{exhibitor.contactName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exhibitor.paymentStatus)}`}>
                        {exhibitor.paymentStatus}
                      </span>
                      <button
                        onClick={() => setSelectedExhibitor(exhibitor)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exhibitors Tab */}
        {activeTab === 'exhibitors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Exhibitors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exhibitors.map((exhibitor) => (
                    <tr key={exhibitor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{exhibitor.companyName}</div>
                          <div className="text-sm text-gray-500">{exhibitor.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exhibitor.contactName}</div>
                        <div className="text-sm text-gray-500">{exhibitor.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={exhibitor.paymentStatus}
                          onChange={(e) => handlePaymentUpdate(exhibitor._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Partial">Partial</option>
                          <option value="Paid in Full">Paid in Full</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exhibitor.boothNumber || 'TBD'}</div>
                        <div className="text-sm text-gray-500">{exhibitor.boothSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedExhibitor(exhibitor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            {/* Pending Logos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Logo Approvals</h3>
              <div className="space-y-3">
                {exhibitors.filter(e => e.logo?.filename && !e.logo?.approved).map((exhibitor) => (
                  <div key={exhibitor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Image className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{exhibitor.companyName}</p>
                        <p className="text-sm text-gray-500">{exhibitor.logo.originalName}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(exhibitor._id, 'logo', true)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(exhibitor._id, 'logo', false)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {exhibitors.filter(e => e.logo?.filename && !e.logo?.approved).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No pending logo approvals</p>
                )}
              </div>
            </div>

            {/* Pending Company Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Company Info Approvals</h3>
              <div className="space-y-3">
                {exhibitors.filter(e => e.companyInfo?.description && !e.companyInfo?.approved).map((exhibitor) => (
                  <div key={exhibitor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{exhibitor.companyName}</p>
                        <p className="text-sm text-gray-500">{exhibitor.companyInfo.description.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(exhibitor._id, 'company-info', true)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(exhibitor._id, 'company-info', false)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {exhibitors.filter(e => e.companyInfo?.description && !e.companyInfo?.approved).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No pending company info approvals</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exhibitor Detail Modal */}
      {selectedExhibitor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedExhibitor.companyName}
              </h3>
              <button
                onClick={() => setSelectedExhibitor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Name</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.contactName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.website}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Booth Number</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.boothNumber || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Booth Size</p>
                  <p className="text-sm text-gray-900">{selectedExhibitor.boothSize}</p>
                </div>
              </div>

              {selectedExhibitor.companyInfo?.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Company Description</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedExhibitor.companyInfo.description}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedExhibitor(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 