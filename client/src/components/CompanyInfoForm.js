import React, { useState } from 'react';
import axios from 'axios';
import { Building2, CheckCircle, X, Plus, Trash2 } from 'lucide-react';

const CompanyInfoForm = ({ exhibitor, onUpdate }) => {
  const [formData, setFormData] = useState({
    description: exhibitor.companyInfo?.description || '',
    products: exhibitor.companyInfo?.products || [''],
    targetAudience: exhibitor.companyInfo?.targetAudience || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = value;
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, '']
    }));
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Filter out empty products
    const filteredProducts = formData.products.filter(product => product.trim() !== '');

    try {
      await axios.post('/api/exhibitors/company-info', {
        description: formData.description,
        products: filteredProducts,
        targetAudience: formData.targetAudience
      });
      setSuccess('Company information submitted successfully! Pending admin approval.');
      onUpdate();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit company information');
    } finally {
      setSubmitting(false);
    }
  };

  const hasSubmitted = exhibitor.companyInfo && exhibitor.companyInfo.description;
  const hasCompanyInfo = exhibitor.companyInfo && exhibitor.companyInfo.description;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Building2 className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        {hasCompanyInfo && (
          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
        )}
      </div>

      {hasSubmitted ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Company Description</h4>
            <p className="text-gray-700">{exhibitor.companyInfo.description}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Products/Services</h4>
            <ul className="list-disc list-inside text-gray-700">
              {exhibitor.companyInfo.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
            <p className="text-gray-700">{exhibitor.companyInfo.targetAudience}</p>
          </div>

          <div className="flex items-center p-3 bg-amber-50 rounded-md">
            <span className="text-sm text-amber-800">
              Status: {exhibitor.companyInfo.approved ? 'Approved' : 'Pending Approval'}
            </span>
            {exhibitor.companyInfo.approved && (
              <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Company Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Describe your company, what you do, and what makes you unique..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products/Services *
            </label>
            {formData.products.map((product, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={product}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={`Product/Service ${index + 1}`}
                  required={index === 0}
                />
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center text-sm text-green-600 hover:text-green-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add another product/service
            </button>
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <input
              type="text"
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Small business owners, IT professionals, etc."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="spinner mr-2"></div>
            ) : (
              'Submit Company Information'
            )}
          </button>
        </form>
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

export default CompanyInfoForm; 