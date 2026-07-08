"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Camera, 
  Save,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          Account Settings
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Manage your personal information, security preferences, and account configurations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] sticky top-32">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              ))}
              
              <div className="h-px bg-slate-100 my-4 mx-2"></div>
              
              <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5 text-red-400" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-slate-800 font-marcellus mb-8">Personal Information</h3>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
                    <Image 
                      src="https://i.pravatar.cc/150?img=11" 
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors group-hover:scale-110 duration-300">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Profile Picture</h4>
                  <p className="text-sm text-slate-500 mt-1 mb-3">PNG, JPG or GIF up to 5MB.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                      Upload New
                    </button>
                    <button className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-xl transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="John"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      defaultValue="john.doe@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        defaultValue="+1 (555) 123-4567"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="New York, USA"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-lg shadow-slate-200">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-slate-800 font-marcellus mb-2">Security Settings</h3>
              <p className="text-slate-500 mb-8">Ensure your account stays secure by updating your password and enabling 2FA.</p>
              
              <form className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Current Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">New Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="button" className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium rounded-xl transition-colors">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'payment') && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'notifications' ? <Bell className="w-8 h-8 text-slate-400" /> : <CreditCard className="w-8 h-8 text-slate-400" />}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {activeTab === 'notifications' ? 'Notification Preferences' : 'Payment Methods'}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                This section is currently under development. Check back soon for advanced {activeTab} configurations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
