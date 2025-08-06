import React, { useState } from 'react';
import axios from 'axios';
import { Image, CheckCircle, X, Download, Sparkles, RefreshCw } from 'lucide-react';

const MarketingBanner = ({ exhibitor, onUpdate }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateBanner = async () => {
    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/exhibitors/generate-banner');
      setSuccess('Marketing banner generated successfully!');
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate banner');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadBanner = () => {
    if (exhibitor.marketingBanner && exhibitor.marketingBanner.imagePath) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = `/${exhibitor.marketingBanner.imagePath}`;
      link.download = `marketing-banner-${exhibitor.companyName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const hasLogo = exhibitor.logo && exhibitor.logo.filename;
  const hasApprovedLogo = exhibitor.logo && exhibitor.logo.filename && exhibitor.logo.approved;
  const hasBanner = exhibitor.marketingBanner && exhibitor.marketingBanner.generated;

  if (!hasLogo) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Image className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Marketing Banner</h3>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <Image className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Logo Required</h4>
              <p className="text-sm text-amber-700 mt-1">
                Please upload your company logo first before generating a marketing banner.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasApprovedLogo) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Image className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Marketing Banner</h3>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <Image className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Logo Pending Approval</h4>
              <p className="text-sm text-amber-700 mt-1">
                Your logo has been uploaded and is pending admin approval. Once approved, you can generate your marketing banner.
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
        <Image className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Marketing Banner</h3>
        {hasBanner && (
          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
        )}
      </div>

      {hasBanner ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-6 text-white text-center">
            <div className="mb-4">
              <h4 className="text-xl font-bold mb-2">{exhibitor.marketingBanner.eventName}</h4>
              <p className="text-green-100">Featuring</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
              <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                {hasApprovedLogo ? (
                  <img 
                    src={`/uploads/logos/${exhibitor.logo.filename}`}
                    alt={`${exhibitor.companyName} logo`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-green-600 font-bold text-lg ${hasApprovedLogo ? 'hidden' : ''}`}>
                  {exhibitor.companyName.charAt(0)}
                </span>
              </div>
              <p className="font-semibold">{exhibitor.companyName}</p>
            </div>
            <div className="mt-4 text-sm text-green-100">
              <p>Booth {exhibitor.boothNumber} • {exhibitor.boothSize}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleGenerateBanner}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </button>
            <button
              onClick={handleDownloadBanner}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Banner
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <Sparkles className="h-5 w-5 text-green-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Generate Marketing Banner</h4>
                <p className="text-sm text-green-700 mt-1">
                  Create a professional marketing banner featuring your logo and company information for the event.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-4 text-white text-center">
              <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">Small Business Expo 2024</h4>
                <p className="text-green-100">Featuring</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 inline-block">
                <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                  {hasApprovedLogo ? (
                    <img 
                      src={`/uploads/logos/${exhibitor.logo.filename}`}
                      alt={`${exhibitor.companyName} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className={`text-green-600 font-bold ${hasApprovedLogo ? 'hidden' : ''}`}>
                    {exhibitor.companyName.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-sm">{exhibitor.companyName}</p>
              </div>
              <div className="mt-3 text-xs text-green-100">
                <p>Booth {exhibitor.boothNumber || 'TBD'} • {exhibitor.boothSize}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateBanner}
            disabled={generating}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <div className="spinner mr-2"></div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Marketing Banner
              </>
            )}
          </button>
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

export default MarketingBanner; 