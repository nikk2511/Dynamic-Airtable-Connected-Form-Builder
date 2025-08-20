import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CheckCircle, AlertCircle, FileText, Send } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const FormViewerPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch form data
  const { data: formData, isLoading, error } = useQuery(
    ['form', id],
    async () => {
      const response = await axios.get(`/forms/${id}`);
      return response.data.form;
    },
    {
      retry: (failureCount, error) => {
        return error?.response?.status !== 404 && failureCount < 3;
      }
    }
  );

  const handleInputChange = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const isFieldVisible = (field) => {
    if (!field.conditional || !field.conditional.fieldId) {
      return true;
    }

    const conditionValue = responses[field.conditional.fieldId];
    const targetValue = field.conditional.value;
    const operator = field.conditional.operator || 'equals';

    switch (operator) {
      case 'equals':
        return conditionValue === targetValue;
      case 'contains':
        return Array.isArray(conditionValue) 
          ? conditionValue.includes(targetValue)
          : String(conditionValue || '').includes(targetValue);
      case 'not_equals':
        return conditionValue !== targetValue;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`/forms/${id}/submit`, { responses });
      setIsSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit form';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading form..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Form Not Found
            </h2>
            <p className="text-gray-600">
              {error?.response?.status === 404 
                ? 'This form does not exist or has been deleted.'
                : 'Unable to load the form. Please try again later.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600">
              {formData?.settings?.successMessage || 'Your response has been submitted successfully.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const form = formData;
  const visibleFields = form?.fields?.filter(isFieldVisible) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {form?.title || 'Untitled Form'}
              </h1>
              <p className="text-sm text-gray-500">
                Connected to {form?.airtableBaseName} → {form?.airtableTableName}
              </p>
            </div>
          </div>
          
          {form?.description && (
            <p className="text-gray-600 leading-relaxed">
              {form.description}
            </p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="space-y-6">
              {visibleFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No fields to display</p>
                </div>
              ) : (
                visibleFields.map((field) => (
                  <div key={field.airtableFieldId} className="field-transition">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'singleLineText' && (
                      <input
                        type="text"
                        value={responses[field.airtableFieldId] || ''}
                        onChange={(e) => handleInputChange(field.airtableFieldId, e.target.value)}
                        required={field.required}
                        className="input-field"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    
                    {field.type === 'multiLineText' && (
                      <textarea
                        value={responses[field.airtableFieldId] || ''}
                        onChange={(e) => handleInputChange(field.airtableFieldId, e.target.value)}
                        required={field.required}
                        rows={4}
                        className="input-field resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    
                    {field.type === 'singleSelect' && (
                      <select
                        value={responses[field.airtableFieldId] || ''}
                        onChange={(e) => handleInputChange(field.airtableFieldId, e.target.value)}
                        required={field.required}
                        className="input-field"
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option.id} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'multipleSelect' && (
                      <div className="space-y-2">
                        {field.options?.map((option) => (
                          <label key={option.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={(responses[field.airtableFieldId] || []).includes(option.name)}
                              onChange={(e) => {
                                const currentValues = responses[field.airtableFieldId] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.name]
                                  : currentValues.filter(v => v !== option.name);
                                handleInputChange(field.airtableFieldId, newValues);
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{option.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {field.type === 'attachment' && (
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          handleInputChange(field.airtableFieldId, files);
                        }}
                        className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          {visibleFields.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Form</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Form Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by Airtable Form Builder
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormViewerPage;
