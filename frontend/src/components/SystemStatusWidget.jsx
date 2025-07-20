// System Status Widget - Shows battery, charging status, and world clock
import React, { useState } from 'react';
import { 
  Battery0Icon, 
  BoltIcon, 
  ClockIcon, 
  CogIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useBatteryInfo, useWorldClock } from '../hooks/useSystemInfo';
import { useSettings, POSITION_STYLES } from '../stores/settingsStore';

const SystemStatusWidget = () => {
  const [settings, updateSettings] = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const batteryInfo = useBatteryInfo(settings.refreshInterval);
  const worldTimes = useWorldClock(settings.selectedTimezones, settings.refreshInterval);

  if (!settings.showSystemStatus) {
    return null;
  }

  const getBatteryIcon = () => {
    if (!batteryInfo.supported || batteryInfo.level === null) {
      return <Battery0Icon className="w-5 h-5 text-gray-400" />;
    }

    const level = batteryInfo.level;
    let colorClass = 'text-green-500';
    
    if (level <= 20) colorClass = 'text-red-500';
    else if (level <= 50) colorClass = 'text-yellow-500';
    
    return (
      <div className="relative">
        <Battery0Icon className={`w-5 h-5 ${colorClass}`} />
        {batteryInfo.charging && (
          <BoltIcon className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
        )}
      </div>
    );
  };

  const formatTime = (time) => {
    return time || '--:--:--';
  };

  // Always position in bottom-right with reserved space
  const positionClass = 'bottom-4 right-4';

  return (
    <div className="fixed bottom-4 right-[5%] w-72 z-50 select-none">
      <div className="bg-white/95 backdrop-blur-md border border-gray-300 rounded-lg shadow-xl">
        {/* Main Status Bar */}
        <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {/* Battery Info */}
          {settings.showBatteryInfo && batteryInfo.supported && (
            <div className="flex items-center gap-2">
              {getBatteryIcon()}
              <span className="text-gray-900 text-sm font-medium">
                {batteryInfo.level !== null ? `${batteryInfo.level}%` : '--'}
              </span>
            </div>
          )}

          {/* Charging Status */}
          {settings.showChargingStatus && batteryInfo.supported && batteryInfo.charging && (
            <div className="flex items-center gap-1">
              <BoltIcon className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 text-xs">Charging</span>
            </div>
          )}

          {/* Primary Time */}
          {settings.showWorldClock && settings.selectedTimezones.length > 0 && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <div className="text-gray-900">
                <div className="text-sm font-medium">
                  {formatTime(worldTimes[settings.selectedTimezones[0]?.name]?.time)}
                </div>
                <div className="text-xs text-gray-600">
                  {settings.selectedTimezones[0]?.name || 'Local'}
                </div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Icon */}
          <div className="ml-2">
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <CogIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-300 p-3 space-y-3">
            {/* All World Clocks */}
            {settings.showWorldClock && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  World Clock
                </h3>
                {settings.selectedTimezones.map(({ name }) => {
                  const timeData = worldTimes[name];
                  return (
                    <div key={name} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{name}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(timeData?.time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {timeData?.date || '--'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Detailed Battery Info */}
            {settings.showBatteryInfo && batteryInfo.supported && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Battery Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="ml-2 text-gray-900 font-medium">
                      {batteryInfo.level !== null ? `${batteryInfo.level}%` : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium ${batteryInfo.charging ? 'text-orange-600' : 'text-green-600'}`}>
                      {batteryInfo.charging ? 'Charging' : 'Discharging'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-gray-700 p-3 space-y-3 min-w-64">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">System Status Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Position Settings */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Position</label>
              <select
                value={settings.statusPosition}
                onChange={(e) => updateSettings({ statusPosition: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showBatteryInfo}
                  onChange={(e) => updateSettings({ showBatteryInfo: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Show Battery Info</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showChargingStatus}
                  onChange={(e) => updateSettings({ showChargingStatus: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Show Charging Status</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showWorldClock}
                  onChange={(e) => updateSettings({ showWorldClock: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Show World Clock</span>
              </label>
            </div>

            {/* Refresh Interval */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">
                Refresh Interval: {settings.refreshInterval / 1000}s
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={settings.refreshInterval}
                onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Note */}
            <div className="text-xs text-gray-500 text-center">
              Click the settings icon above to configure this widget
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatusWidget;
