"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Lock,
  Edit2
} from 'lucide-react';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 font-marcellus mb-2">
          My Profile
        </h2>
        <p className="text-slate-500 max-w-2xl">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-blue-50 to-white"></div>
            
            <div className="relative group mt-4 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src="https://i.pravatar.cc/150?img=11" 
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="absolute bottom-1 right-1 p-3 bg-black text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 group-hover:scale-110">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 font-marcellus mb-1">John Doe</h3>
            <p className="text-blue-600 font-medium text-sm mb-6">MEMBER-9824</p>

            <div className="w-full h-px bg-slate-100 mb-6"></div>

            <button 
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Lock className="w-4 h-4" />
              {isChangingPassword ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>
        </div>

        {/* Right Column: Contact Info Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {isChangingPassword ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 font-marcellus">Security Settings</h3>
              </div>
              
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
                
                <div className="pt-4 flex gap-4">
                  <button type="button" className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium rounded-xl transition-colors">
                    Update Password
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsChangingPassword(false)}
                    className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 font-marcellus">Contact Information</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing 
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Details"}
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="John Doe"
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all ${
                          isEditing 
                            ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                            : "border-transparent bg-slate-50 text-slate-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        defaultValue="+1 (555) 123-4567"
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all ${
                          isEditing 
                            ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                            : "border-transparent bg-slate-50 text-slate-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      defaultValue="john.doe@example.com"
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all ${
                        isEditing 
                          ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                          : "border-transparent bg-slate-50 text-slate-600"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Residential Address</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
                    <textarea 
                      defaultValue="123 Luxury Lane, Apt 4B\nManhattan, New York, 10001\nUnited States"
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all resize-none ${
                        isEditing 
                          ? "border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" 
                          : "border-transparent bg-slate-50 text-slate-600"
                      }`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)} 
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-200"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
