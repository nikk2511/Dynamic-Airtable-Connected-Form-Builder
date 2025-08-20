import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Table, Plus, Settings } from 'lucide-react';

const FormBuilderPage = () => {
  const navigate = useNavigate();
  const [currentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Select Base', icon: Database },
    { id: 2, name: 'Choose Table', icon: Table },
    { id: 3, name: 'Build Form', icon: Plus },
    { id: 4, name: 'Configure', icon: Settings }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
          <p className="text-gray-600">Build a form connected to your Airtable data</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-400'
                  }
                `}>
                  <Icon size={20} />
                </div>
                <span className={`
                  ml-3 text-sm font-medium
                  ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                `}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    mx-8 h-0.5 w-16 transition-colors
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Builder Coming Soon
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The visual form builder interface is currently under development. 
            It will allow you to create forms with drag-and-drop functionality 
            and conditional logic.
          </p>
          <div className="text-sm text-gray-500">
            <p>Planned features:</p>
            <ul className="mt-2 space-y-1">
              <li>• Connect to any Airtable base and table</li>
              <li>• Drag-and-drop field arrangement</li>
              <li>• Conditional field visibility</li>
              <li>• Real-time form preview</li>
              <li>• Custom styling options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
