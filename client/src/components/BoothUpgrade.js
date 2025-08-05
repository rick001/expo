import React, { useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, CheckCircle, X, Building2, AlertCircle } from 'lucide-react';

const BoothUpgrade = ({ exhibitor, onUpdate }) => {
  const [requestedSize, setRequestedSize] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const boothSizes = [
    { value: '10x20', label: '10x20 ft', price: '+$500' },
    { value: '20x20', label: '20x20 ft', price: '+$1,200' },
    { value: 'Custom', label: 'Custom Size', price: 'Contact Sales' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedSize) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/exhibitors/booth-upgrade', {
        requestedSize
      });
      setSuccess('Booth upgrade request submitted successfully!');
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit upgrade request');
    } finally {
      setSubmitting(false);
    }
  };

  const hasRequested = exhibitor.boothUpgrade && exhibitor.boothUpgrade.requested;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Booth Upgrade</h3>
        {hasRequested && exhibitor.boothUpgrade.approved && (
          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
        )}
      </div>

      {hasRequested ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Upgrade Request</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Current: {exhibitor.boothUpgrade.currentSize} → Requested: {exhibitor.boothUpgrade.requestedSize}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-amber-50 rounded-md">
            <span className="text-sm text-amber-800">
              Status: {exhibitor.boothUpgrade.approved ? 'Approved' : 'Pending Approval'}
            </span>
            {exhibitor.boothUpgrade.approved && (
              <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
            )}
          </div>

          {exhibitor.boothUpgrade.approved && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Upgrade Approved!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your booth has been upgraded to {exhibitor.boothSize}. You'll receive updated booth information shortly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <ArrowUpRight className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Upgrade Your Booth</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Current booth size: <strong>{exhibitor.boothSize}</strong>. Request a larger booth for more space and visibility.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Booth Size *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {boothSizes.map((size) => (
                  <div
                    key={size.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      requestedSize === size.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setRequestedSize(size.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{size.label}</p>
                        <p className="text-sm text-gray-500">{size.price}</p>
                      </div>
                      {requestedSize === size.value && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {requestedSize === 'Custom' && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Custom Size Request</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      For custom booth sizes, our sales team will contact you to discuss availability and pricing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !requestedSize}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="spinner mr-2"></div>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Request Booth Upgrade
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <X className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoothUpgrade; 