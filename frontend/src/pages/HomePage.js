import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  CheckCircle, 
  Database, 
  Zap, 
  Share2,
  BarChart3,
  Shield,
  Smartphone,
  X,
  Play
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Database,
      title: 'Connect to Airtable',
      description: 'Seamlessly integrate with your existing Airtable bases and tables'
    },
    {
      icon: Zap,
      title: 'Smart Form Builder',
      description: 'Drag-and-drop interface with conditional logic and field validation'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share forms via link and embed them anywhere on the web'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track submissions and analyze data with built-in reporting'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays in Airtable, we never store sensitive information'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Forms work perfectly on any device, any screen size'
    }
  ];

  const benefits = [
    'No coding required - visual form builder',
    'Direct integration with Airtable bases',
    'Conditional logic and field dependencies',
    'Custom branding and styling options',
    'Real-time form analytics and insights',
    'Mobile-responsive form designs'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Airtable Form Builder
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Beautiful Forms
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Connected to Airtable
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create dynamic, intelligent forms that automatically sync with your Airtable bases. 
            Add conditional logic, customize designs, and collect responses effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user && (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Building Forms</span>
                <ArrowRight size={20} />
              </Link>
            )}
            
                         <button 
               onClick={() => setShowDemo(true)}
               className="btn-outline px-8 py-4 text-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
             >
               <Play size={20} />
               <span>Watch Demo</span>
             </button>
          </div>
          
          <div className="mt-16">
            <div className="mx-auto w-full max-w-4xl h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">📝</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Form Builder Interface</h3>
                <p className="text-gray-600">Create beautiful forms with Airtable integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing forms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make form building simple and data collection seamless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why choose our form builder?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Built specifically for Airtable users who want to create professional forms 
                without the complexity of traditional form builders.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to get started?
                </h3>
                <p className="text-blue-100 mb-6">
                  Connect your Airtable account and start building forms in minutes
                </p>
                {!user && (
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 inline-flex items-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AF</span>
                </div>
                <span className="text-xl font-bold">Airtable Form Builder</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Create beautiful, functional forms that connect directly to your Airtable bases. 
                No coding required.
              </p>
            </div>
            
                         <div>
               <h4 className="font-semibold mb-4">Product</h4>
               <ul className="space-y-2 text-gray-400">
                 <li><button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
                 <li><button onClick={() => alert('Pricing: Free tier available, Premium plans coming soon!')} className="hover:text-white transition-colors cursor-pointer">Pricing</button></li>
                 <li><button onClick={() => window.open('https://github.com/your-repo/docs', '_blank')} className="hover:text-white transition-colors cursor-pointer">Documentation</button></li>
               </ul>
             </div>
             
             <div>
               <h4 className="font-semibold mb-4">Support</h4>
               <ul className="space-y-2 text-gray-400">
                 <li><button onClick={() => alert('Help Center: Check our README.md file for setup instructions!')} className="hover:text-white transition-colors cursor-pointer">Help Center</button></li>
                 <li><button onClick={() => alert('Contact: support@bustbrainlabs.com')} className="hover:text-white transition-colors cursor-pointer">Contact Us</button></li>
                 <li><button onClick={() => alert('Status: All systems operational! 🟢')} className="hover:text-white transition-colors cursor-pointer">Status</button></li>
               </ul>
             </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BustBrain Labs. All rights reserved.</p>
                     </div>
         </div>
       </footer>

       {/* Demo Modal */}
       {showDemo && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="flex justify-between items-center p-6 border-b border-gray-200">
               <h2 className="text-2xl font-bold text-gray-900">Form Builder Demo</h2>
               <button
                 onClick={() => setShowDemo(false)}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <X size={24} className="text-gray-500" />
               </button>
             </div>

             {/* Demo Content */}
             <div className="p-6">
               <div className="grid lg:grid-cols-2 gap-8">
                 {/* Left Side - Demo Steps */}
                 <div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
                   <div className="space-y-4">
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                       <div>
                         <h4 className="font-medium text-gray-900">Connect Airtable</h4>
                         <p className="text-gray-600 text-sm">Link your Airtable account securely</p>
                       </div>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                       <div>
                         <h4 className="font-medium text-gray-900">Select Base & Table</h4>
                         <p className="text-gray-600 text-sm">Choose from your existing Airtable bases</p>
                       </div>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                       <div>
                         <h4 className="font-medium text-gray-900">Build Form</h4>
                         <p className="text-gray-600 text-sm">Drag & drop fields with conditional logic</p>
                       </div>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                       <div>
                         <h4 className="font-medium text-gray-900">Share & Collect</h4>
                         <p className="text-gray-600 text-sm">Responses automatically sync to Airtable</p>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Right Side - Interactive Preview */}
                 <div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Preview</h3>
                   <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-gray-200">
                     <div className="text-center">
                       <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                         <span className="text-white text-2xl">📝</span>
                       </div>
                       <h4 className="text-lg font-semibold text-gray-700 mb-2">Sample Form</h4>
                       <p className="text-gray-600 text-sm mb-4">This is how your forms will look</p>
                       
                       {/* Sample Form Fields */}
                       <div className="space-y-3 text-left">
                         <div className="bg-white rounded-lg p-3 border border-gray-200">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                           <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled />
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-gray-200">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                           <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled />
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-gray-200">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                           <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                             <option>Select your role</option>
                             <option>Developer</option>
                             <option>Designer</option>
                             <option>Manager</option>
                           </select>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Call to Action */}
               <div className="mt-8 text-center">
                 <p className="text-gray-600 mb-4">Ready to create your first form?</p>
                 <Link
                   to="/login"
                   onClick={() => setShowDemo(false)}
                   className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
                 >
                   <span>Get Started Free</span>
                   <ArrowRight size={16} />
                 </Link>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default HomePage;
