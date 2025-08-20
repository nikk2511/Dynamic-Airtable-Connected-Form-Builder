import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Settings } from 'lucide-react';

const FormEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
          <p className="text-gray-600">Modify your form configuration and fields</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="text-orange-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Editor Coming Soon
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The form editing interface is currently under development. 
            It will allow you to modify existing forms, update fields, 
            and adjust conditional logic.
          </p>
          <div className="text-sm text-gray-500">
            <p>Form ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditPage;
