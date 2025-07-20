# Gods Eye - System Status Widget

The System Status Widget is a comprehensive monitoring overlay that displays real-time system information and world clock functionality across all pages of the Gods Eye application.

## Features

### Battery & Charging Information
- **Battery Level**: Shows current battery percentage with color-coded indicators:
  - 🟢 Green: >50% charge
  - 🟡 Yellow: 21-50% charge  
  - 🔴 Red: ≤20% charge
- **Charging Status**: Displays charging indicator with bolt icon when device is plugged in
- **Cross-Platform Support**: Works with both browser Battery API and Electron system calls

### World Clock
- **Multiple Timezones**: Display time for multiple countries/cities simultaneously
- **Customizable Selection**: Add/remove timezones from over 13 predefined options
- **Real-Time Updates**: Updates every second by default (configurable)
- **Primary Time Display**: Shows the first selected timezone prominently in the main widget

### Positioning & Display
- **Corner Positioning**: Choose from 4 corner positions:
  - Top Left
  - Top Right (default)
  - Bottom Left  
  - Bottom Right
- **Expandable Interface**: Click to expand and see detailed information
- **Compact Mode**: Minimal display option for smaller footprint

## Usage

### Quick Access
The System Status Widget appears as a floating overlay in the corner of every page. It shows:
- Battery percentage and charging status (if available)
- Primary timezone clock
- Expand/collapse button
- Quick settings button

### Accessing Settings
1. **Via Widget**: Click the gear icon (⚙️) in the widget itself
2. **Via Sidebar**: Click "System Settings" in the main application sidebar

### Configuration Options

#### Display Tab
- Toggle widget visibility on/off
- Choose corner position
- Enable/disable individual components:
  - Battery Information
  - Charging Status  
  - World Clock
- Compact mode toggle

#### Timezones Tab
- Add new timezones from preset list
- Remove existing timezones
- Reorder timezones (first one shows as primary)
- Search functionality for easy timezone selection

#### Advanced Tab
- **Refresh Interval**: Adjust update frequency (1-30 seconds)
- **Reset Settings**: Restore all settings to defaults
- **Export/Import**: Backup and restore your configuration

## Technical Implementation

### Browser Support
- Uses Battery API when available in modern browsers
- Gracefully degrades when Battery API is unavailable
- Intl.DateTimeFormat for accurate timezone calculations

### Electron Integration  
- Native system calls for battery information on Windows
- PowerShell integration for detailed system metrics
- IPC communication between renderer and main processes

### Data Persistence
- Settings stored in localStorage as `gods-eye-settings`
- Automatic save on every configuration change
- Settings persist across browser sessions and app restarts

## Available Timezones

The widget includes these predefined timezone options:
- Local (system timezone)
- New York (America/New_York)
- Los Angeles (America/Los_Angeles)  
- London (Europe/London)
- Paris (Europe/Paris)
- Berlin (Europe/Berlin)
- Moscow (Europe/Moscow)
- Dubai (Asia/Dubai)
- Mumbai (Asia/Kolkata)
- Singapore (Asia/Singapore)
- Tokyo (Asia/Tokyo)
- Sydney (Australia/Sydney)
- Auckland (Pacific/Auckland)

## Default Configuration

```json
{
  "showSystemStatus": true,
  "statusPosition": "top-right",
  "showBatteryInfo": true,
  "showChargingStatus": true, 
  "showWorldClock": true,
  "selectedTimezones": [
    { "name": "Local", "timezone": "[System Timezone]" },
    { "name": "New York", "timezone": "America/New_York" },
    { "name": "London", "timezone": "Europe/London" },
    { "name": "Tokyo", "timezone": "Asia/Tokyo" }
  ],
  "refreshInterval": 1000,
  "compactMode": false
}
```

## Privacy & Security

- All timezone calculations performed client-side
- No external API calls required for world clock functionality
- Battery information accessed through standard browser/system APIs
- Settings stored locally only - no data transmission

## Troubleshooting

### Battery Information Not Showing
- **Browser**: Battery API may not be available in your browser
- **Electron**: Ensure PowerShell execution is allowed on Windows
- Check console for any error messages

### Timezone Display Issues
- Verify timezone identifiers are valid IANA timezone names
- Check browser support for Intl.DateTimeFormat
- Clear localStorage and reset settings if problems persist

### Performance Considerations
- Increase refresh interval if experiencing performance issues
- Use compact mode to reduce visual overhead
- Disable unused components (battery, charging, world clock)

## Keyboard Shortcuts

- **Settings Access**: Click gear icon in widget or use sidebar menu
- **Quick Toggle**: No keyboard shortcut (use settings to hide/show)
- **Widget Interaction**: Click anywhere on widget to expand/collapse

This feature enhances situational awareness by providing essential system and time information without interrupting your workflow in the Gods Eye monitoring application.
