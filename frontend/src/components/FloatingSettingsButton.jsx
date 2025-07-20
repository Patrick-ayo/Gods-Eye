// Floating Settings Button - Global access to system settings
import React, { useState } from 'react';
import { CogIcon, EyeIcon } from '@heroicons/react/24/outline';
import SystemStatusSettings from './SystemStatusSettings';
import { useSettings } from '../stores/settingsStore';

const FloatingSettingsButton = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, updateSettings] = useSettings();

  return (
    <>
      {/* Show Widget Button - Only visible when widget is hidden */}
      {!settings.showSystemStatus && (
        <button
          onClick={() => updateSettings({ showSystemStatus: true })}
          className="fixed bottom-12 right-2 z-40 group"
          title="Show System Status Widget"
        >
          <div className="relative">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <EyeIcon className="w-4 h-4" />
            </div>
            <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-25"></div>
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Show Widget
            </div>
          </div>
        </button>
      )}
      
      {/* Floating Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-2 right-2 z-40 group"
        title="System Settings"
      >
        <div className="relative">
          {/* Main Button */}
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CogIcon className="w-4 h-4" />
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Settings
          </div>
        </div>
      </button>
      
      {/* Settings Modal */}
      <SystemStatusSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default FloatingSettingsButton;
