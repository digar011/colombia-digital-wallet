'use client';

import { useState } from 'react';
import {
  Settings,
  Key,
  Bell,
  Globe,
  Shield,
  Database,
  Save,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'country', label: 'Country Config', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-colombia-blue text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Mi Colombia Digital"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@micolombiadigital.gov.co"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Default Country
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
                      <option value="CO">Colombia</option>
                      <option value="EC">Ecuador</option>
                      <option value="GT">Guatemala</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo Mode</p>
                      <p className="text-xs text-gray-500">Enable mock data for demonstrations</p>
                    </div>
                    <button className="relative w-11 h-6 bg-colombia-blue rounded-full">
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-colombia-blue text-white rounded-lg hover:bg-colombia-blue-dark transition-colors text-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Keys</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Supabase URL
                    </label>
                    <input
                      type="text"
                      defaultValue="https://••••••••.supabase.co"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Anon Key
                    </label>
                    <input
                      type="password"
                      defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <Database className="w-4 h-4 text-yellow-600 shrink-0" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      API keys are managed through environment variables. Edit .env.local to update.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                <div className="space-y-3">
                  {[
                    { label: 'New citizen registrations', enabled: true },
                    { label: 'Document verification requests', enabled: true },
                    { label: 'System alerts', enabled: true },
                    { label: 'Weekly analytics report', enabled: false },
                    { label: 'Security incidents', enabled: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      <div className={`relative w-11 h-6 rounded-full ${item.enabled ? 'bg-colombia-blue' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'country' && (
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Country Configuration</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia', active: true },
                      { flag: '\u{1F1EA}\u{1F1E8}', name: 'Ecuador', active: false },
                      { flag: '\u{1F1EC}\u{1F1F9}', name: 'Guatemala', active: false },
                    ].map((country) => (
                      <button
                        key={country.name}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          country.active
                            ? 'border-colombia-blue bg-colombia-blue/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl block mb-2">{country.flag}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{country.name}</span>
                        {country.active && (
                          <span className="block text-xs text-colombia-blue mt-1">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Select the active country to configure document types, agencies, and branding.
                    Changes affect the demo mode presentation.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <div className="relative w-11 h-6 bg-colombia-blue rounded-full">
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout</p>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Audit Logging</p>
                      <p className="text-xs text-gray-500">Log all admin actions</p>
                    </div>
                    <div className="relative w-11 h-6 bg-colombia-blue rounded-full">
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      All security features are currently active. RLS policies enforced on all tables.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
