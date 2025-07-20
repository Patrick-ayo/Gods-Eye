// Advanced Settings Panel for System Status Widget
import React, { useState } from 'react';
import { 
  CogIcon, 
  XMarkIcon, 
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useSettings } from '../stores/settingsStore';
import TimezoneSelector from './TimezoneSelector';

const SystemStatusSettings = ({ isOpen, onClose }) => {
  const [settings, updateSettings] = useSettings();
  const [activeTab, setActiveTab] = useState('display');

  if (!isOpen) return null;

  const tabs = [
    { id: 'display', label: 'Display' },
    { id: 'timezones', label: 'Timezones' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <CogIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">System Status Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              {/* Widget Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.showSystemStatus ? (
                    <EyeIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-gray-900 font-medium">Show System Status</span>
                </div>
                <button
                  onClick={() => updateSettings({ showSystemStatus: !settings.showSystemStatus })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showSystemStatus ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showSystemStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Component Toggles */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Components</h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Battery Information</span>
                  <input
                    type="checkbox"
                    checked={settings.showBatteryInfo}
                    onChange={(e) => updateSettings({ showBatteryInfo: e.target.checked })}
                    className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Charging Status</span>
                  <input
                    type="checkbox"
                    checked={settings.showChargingStatus}
                    onChange={(e) => updateSettings({ showChargingStatus: e.target.checked })}
                    className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">World Clock</span>
                  <input
                    type="checkbox"
                    checked={settings.showWorldClock}
                    onChange={(e) => updateSettings({ showWorldClock: e.target.checked })}
                    className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                </label>
              </div>

              {/* Compact Mode */}
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">Compact Mode</div>
                  <div className="text-xs text-gray-500">Smaller widget with minimal information</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => updateSettings({ compactMode: e.target.checked })}
                  className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-600"
                />
              </label>
            </div>
          )}

          {/* Timezone Settings */}
          {activeTab === 'timezones' && (
            <div className="space-y-4">
              <TimezoneSelector
                selectedTimezones={settings.selectedTimezones}
                onUpdateTimezones={(timezones) => updateSettings({ selectedTimezones: timezones })}
              />
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              {/* Refresh Interval */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Refresh Interval: {settings.refreshInterval / 1000}s
                </label>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="1000"
                  value={settings.refreshInterval}
                  onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1s</span>
                  <span>30s</span>
                </div>
              </div>

              {/* Reset Settings */}
              <div className="pt-4 border-t border-gray-300">
                <button
                  onClick={() => {
                    localStorage.removeItem('gods-eye-settings');
                    window.location.reload();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Reset to Default Settings
                </button>
              </div>

              {/* Export/Import Settings */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const settingsData = JSON.stringify(settings, null, 2);
                    const blob = new Blob([settingsData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'gods-eye-settings.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Export Settings
                </button>
                
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        try {
                          const importedSettings = JSON.parse(e.target.result);
                          updateSettings(importedSettings);
                        } catch (error) {
                          alert('Invalid settings file');
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                  id="import-settings"
                />
                <label
                  htmlFor="import-settings"
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors text-center cursor-pointer"
                >
                  Import Settings
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusSettings;
