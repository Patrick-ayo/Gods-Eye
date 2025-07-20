// Settings Store for Gods Eye System Status
import { useState, useEffect } from 'react';

// Custom hook for persistent settings
export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('gods-eye-settings');
    return saved ? JSON.parse(saved) : {
      showSystemStatus: true,
      statusPosition: 'top-right', // top-left, top-right, bottom-left, bottom-right
      showBatteryInfo: true,
      showChargingStatus: true,
      showWorldClock: true,
      selectedTimezones: [
        { name: 'Local', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'London', timezone: 'Europe/London' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' }
      ],
      refreshInterval: 1000, // 1 second
      compactMode: false
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gods-eye-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return [settings, updateSettings];
};

// Timezone data for world clock
export const TIMEZONE_OPTIONS = [
  { name: 'Local', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Auckland', timezone: 'Pacific/Auckland' }
];

// Position styles for the status widget
export const POSITION_STYLES = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4'
};
