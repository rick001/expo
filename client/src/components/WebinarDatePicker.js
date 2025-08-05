import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, X, Clock, AlertCircle } from 'lucide-react';

const WebinarDatePicker = ({ exhibitor, onUpdate }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (exhibitor.paymentStatus === 'Paid in Full') {
      fetchAvailableDates();
    }
  }, [exhibitor.paymentStatus]);

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/exhibitors/webinar-dates');
      setAvailableDates(response.data.availableDates);
    } catch (error) {
      setError('Failed to fetch available dates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/exhibitors/webinar-date', {
        webinarDate: selectedDate
      });
      setSuccess('Webinar date selected successfully!');
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to select webinar date');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasSelectedDate = exhibitor.webinarDate;

  if (exhibitor.paymentStatus !== 'Paid in Full') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Webinar Date Selection</h3>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Payment Required</h4>
              <p className="text-sm text-amber-700 mt-1">
                Webinar booking is only available for exhibitors with "Paid in Full" status. 
                Your current payment status is: <strong>{exhibitor.paymentStatus}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Webinar Date Selection</h3>
        {hasSelectedDate && (
          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
        )}
      </div>

      {hasSelectedDate ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Webinar Scheduled</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your webinar is scheduled for: <strong>{formatDate(exhibitor.webinarDate)}</strong>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">What to expect:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive a confirmation email with webinar details</li>
              <li>• A calendar invitation will be sent to your email</li>
              <li>• Technical support will be available 15 minutes before the session</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Available Webinar Slots</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Select a date and time for your promotional webinar session.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner mr-2"></div>
              <span className="text-sm text-gray-600">Loading available dates...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Webinar Date & Time *
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a date and time...</option>
                  {availableDates.map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedDate}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="spinner mr-2"></div>
                ) : (
                  'Schedule Webinar'
                )}
              </button>
            </form>
          )}
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

export default WebinarDatePicker; 