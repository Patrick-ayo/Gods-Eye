// Timezone Selector Component for World Clock Settings
import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import { TIMEZONE_OPTIONS } from '../stores/settingsStore';

const TimezoneSelector = ({ selectedTimezones, onUpdateTimezones }) => {
  const [isAddingTimezone, setIsAddingTimezone] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTimezones = TIMEZONE_OPTIONS.filter(tz => 
    !selectedTimezones.some(selected => selected.timezone === tz.timezone) &&
    (tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tz.timezone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addTimezone = (timezone) => {
    onUpdateTimezones([...selectedTimezones, timezone]);
    setIsAddingTimezone(false);
    setSearchTerm('');
  };

  const removeTimezone = (timezoneToRemove) => {
    onUpdateTimezones(
      selectedTimezones.filter(tz => tz.timezone !== timezoneToRemove.timezone)
    );
  };

  const moveTimezone = (index, direction) => {
    const newTimezones = [...selectedTimezones];
    const targetIndex = index + direction;
    
    if (targetIndex >= 0 && targetIndex < newTimezones.length) {
      [newTimezones[index], newTimezones[targetIndex]] = 
      [newTimezones[targetIndex], newTimezones[index]];
      onUpdateTimezones(newTimezones);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <GlobeAltIcon className="w-4 h-4" />
          World Clock Timezones
        </h4>
        <button
          onClick={() => setIsAddingTimezone(!isAddingTimezone)}
          className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
        >
          <PlusIcon className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Current Timezones */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {selectedTimezones.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No timezones selected</p>
        ) : (
          selectedTimezones.map((timezone, index) => (
            <div key={timezone.timezone} className="flex items-center justify-between bg-gray-100 rounded p-2">
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{timezone.name}</div>
                <div className="text-xs text-gray-600">{timezone.timezone}</div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Move Up/Down Buttons */}
                <button
                  onClick={() => moveTimezone(index, -1)}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveTimezone(index, 1)}
                  disabled={index === selectedTimezones.length - 1}
                  className="p-1 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="Move down"
                >
                  ↓
                </button>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeTimezone(timezone)}
                  className="p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-700 transition-colors"
                  title="Remove timezone"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Timezone Panel */}
      {isAddingTimezone && (
        <div className="border-t border-gray-300 pt-3">
          <input
            type="text"
            placeholder="Search timezones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 mb-2"
            autoFocus
          />
          
          <div className="max-h-32 overflow-y-auto space-y-1">
            {filteredTimezones.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No matching timezones found</p>
            ) : (
              filteredTimezones.slice(0, 10).map((timezone) => (
                <button
                  key={timezone.timezone}
                  onClick={() => addTimezone(timezone)}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div className="text-sm text-gray-900">{timezone.name}</div>
                  <div className="text-xs text-gray-600">{timezone.timezone}</div>
                </button>
              ))
            )}
          </div>
          
          {filteredTimezones.length > 10 && (
            <p className="text-xs text-gray-500 mt-2">
              Showing first 10 results. Continue typing to narrow down...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
