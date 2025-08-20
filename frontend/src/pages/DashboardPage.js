import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  BarChart3,
  Calendar,
  Users,
  Copy,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch forms
  const { data: formsData, isLoading, error } = useQuery(
    ['forms', currentPage, searchTerm],
    async () => {
      const response = await axios.get('/forms', {
        params: { 
          page: currentPage, 
          limit: 10, 
          search: searchTerm 
        }
      });
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  );

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/forms/${formId}`);
      queryClient.invalidateQueries(['forms']);
      toast.success('Form deleted successfully');
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  const handleCopyFormUrl = (formId) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success('Form URL copied to clipboard');
  };

  const handleTogglePublish = async (formId, isPublished) => {
    try {
      await axios.patch(`/forms/${formId}/publish`, {
        isPublished: !isPublished
      });
      queryClient.invalidateQueries(['forms']);
      toast.success(isPublished ? 'Form unpublished' : 'Form published successfully');
    } catch (error) {
      toast.error('Failed to update form status');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading your forms..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">
          Failed to load forms
        </div>
        <p className="text-gray-600 mt-2">
          {error.response?.data?.message || 'Please try again later'}
        </p>
      </div>
    );
  }

  const forms = formsData?.forms || [];
  const pagination = formsData?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your forms and track their performance
          </p>
        </div>
        <Link
          to="/forms/new"
          className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create New Form</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-3xl font-bold text-gray-900">{pagination.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {forms.filter(form => form.isPublished).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-purple-600">
                {forms.reduce((total, form) => total + (form.submissionCount || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-orange-600">
                {forms.filter(form => {
                  const formDate = new Date(form.createdAt);
                  const now = new Date();
                  return formDate.getMonth() === now.getMonth() && 
                         formDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Forms List */}
      {forms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No forms yet
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No forms found matching "${searchTerm}"`
              : 'Get started by creating your first form'
            }
          </p>
          {!searchTerm && (
            <Link to="/forms/new" className="btn-primary">
              Create Your First Form
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {forms.map((form) => (
              <div key={form._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {form.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {form.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        {form.airtableBaseName} → {form.airtableTableName}
                      </span>
                      <span>•</span>
                      <span>{form.fields?.length || 0} fields</span>
                      <span>•</span>
                      <span>{form.submissionCount || 0} submissions</span>
                      <span>•</span>
                      <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {form.description && (
                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {form.isPublished && (
                      <button
                        onClick={() => handleCopyFormUrl(form._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Copy form URL"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                    
                    <Link
                      to={`/form/${form._id}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="View form"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    
                    <Link
                      to={`/forms/${form._id}/edit`}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Edit form"
                    >
                      <Edit size={16} />
                    </Link>
                    
                    <button
                      onClick={() => handleTogglePublish(form._id, form.isPublished)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title={form.isPublished ? 'Unpublish form' : 'Publish form'}
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteForm(form._id)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete form"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} forms
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
