import React, { useEffect, useState } from "react";

function SystemStatus() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Get battery info if supported
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () =>
          setBatteryLevel(Math.round(battery.level * 100));
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
      });
    } else {
      setBatteryLevel("N/A");
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="system mt-auto p-3 border-t border-gray-200 bg-white text-sm text-gray-700">
      <div>
        Battery: {batteryLevel !== null ? `${batteryLevel}%` : "Loading..."}
      </div>
      <div>
        {" "}
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    </div>
  );
}

export default SystemStatus;
