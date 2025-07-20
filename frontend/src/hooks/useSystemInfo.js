// Custom hooks for system information
import { useState, useEffect, useCallback } from 'react';

// Hook for battery information
export const useBatteryInfo = (refreshInterval = 1000) => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    supported: false
  });

  const updateBatteryInfo = useCallback(async (battery) => {
    if (battery) {
      setBatteryInfo({
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        supported: true
      });
    }
  }, []);

  useEffect(() => {
    let intervalId;
    
    const initBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          
          // Initial update
          updateBatteryInfo(battery);
          
          // Set up event listeners
          battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
          battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
          battery.addEventListener('chargingtimechange', () => updateBatteryInfo(battery));
          battery.addEventListener('dischargingtimechange', () => updateBatteryInfo(battery));
          
          // Set up periodic updates
          intervalId = setInterval(() => {
            updateBatteryInfo(battery);
          }, refreshInterval);
          
        } catch (error) {
          console.warn('Battery API not available:', error);
          setBatteryInfo(prev => ({ ...prev, supported: false }));
        }
      } else {
        // Fallback: Try to get battery info from Electron if available
        if (window.electronAPI && window.electronAPI.getBatteryInfo) {
          const initElectronBattery = async () => {
            try {
              const batteryData = await window.electronAPI.getBatteryInfo();
              if (batteryData && batteryData.supported) {
                setBatteryInfo({
                  level: batteryData.level,
                  charging: batteryData.charging,
                  chargingTime: null,
                  dischargingTime: null,
                  supported: true
                });
              } else {
                setBatteryInfo(prev => ({ ...prev, supported: false }));
              }
            } catch (error) {
              console.warn('Failed to get battery info from Electron:', error);
              setBatteryInfo(prev => ({ ...prev, supported: false }));
            }
          };
          
          // Initial call
          initElectronBattery();
          
          // Set up interval
          intervalId = setInterval(initElectronBattery, refreshInterval);
        } else {
          // Demo battery for testing (remove this in production)
          setBatteryInfo({
            level: 75,
            charging: false,
            chargingTime: null,
            dischargingTime: null,
            supported: true
          });
        }
      }
    };

    initBattery();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshInterval, updateBatteryInfo]);

  return batteryInfo;
};

// Hook for world clock
export const useWorldClock = (timezones = [], refreshInterval = 1000) => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    if (timezones.length === 0) return;

    const updateTimes = () => {
      const newTimes = {};
      const now = new Date();
      
      timezones.forEach(({ name, timezone }) => {
        try {
          const time = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);
          
          const date = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            month: 'short',
            day: 'numeric'
          }).format(now);
          
          newTimes[name] = { time, date, timezone };
        } catch (error) {
          console.warn(`Invalid timezone ${timezone}:`, error);
          newTimes[name] = { time: '--:--:--', date: 'Invalid', timezone };
        }
      });
      
      setTimes(newTimes);
    };

    // Initial update
    updateTimes();
    
    // Set up interval
    const intervalId = setInterval(updateTimes, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [timezones, refreshInterval]);

  return times;
};

// Hook for system performance info (if available through Electron)
export const useSystemPerformance = (refreshInterval = 5000) => {
  const [performance, setPerformance] = useState({
    cpu: null,
    memory: null,
    supported: false
  });

  useEffect(() => {
    if (!window.electronAPI || !window.electronAPI.getSystemInfo) {
      setPerformance(prev => ({ ...prev, supported: false }));
      return;
    }

    const updatePerformance = async () => {
      try {
        const systemInfo = await window.electronAPI.getSystemInfo();
        setPerformance({
          cpu: systemInfo.cpu,
          memory: systemInfo.memory,
          supported: true
        });
      } catch (error) {
        console.warn('Failed to get system performance:', error);
        setPerformance(prev => ({ ...prev, supported: false }));
      }
    };

    // Initial update
    updatePerformance();
    
    // Set up interval
    const intervalId = setInterval(updatePerformance, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return performance;
};
