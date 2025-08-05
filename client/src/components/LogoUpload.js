import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, CheckCircle, X, Image } from 'lucide-react';

const LogoUpload = ({ exhibitor, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('logo', file);

    try {
      await axios.post('/api/exhibitors/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Logo uploaded successfully! Pending admin approval.');
      setShowUpload(false);
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  }, [onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const hasLogo = exhibitor.logo && exhibitor.logo.filename;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Upload className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Upload Company Logo</h3>
        {hasLogo && exhibitor.logo.approved && (
          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
        )}
      </div>

      {hasLogo && !showUpload ? (
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Image className="h-8 w-8 text-gray-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {exhibitor.logo.originalName}
              </p>
              <p className="text-sm text-gray-500">
                Status: {exhibitor.logo.approved ? 'Approved' : 'Pending Approval'}
              </p>
            </div>
            {exhibitor.logo.approved && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
          
          {!exhibitor.logo.approved && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Your logo has been uploaded and is pending admin approval. You'll be notified once it's approved.
            </p>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace Logo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the logo here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {hasLogo ? 'Replace your company logo' : 'Upload your company logo'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your logo here, or click to browse files
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPEG, PNG, GIF (max 5MB)
                </p>
              </div>
            )}
          </div>

          {hasLogo && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="spinner mr-2"></div>
          <span className="text-sm text-gray-600">Uploading...</span>
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

export default LogoUpload; 