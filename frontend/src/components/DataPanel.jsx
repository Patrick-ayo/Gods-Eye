import React from "react";
import { Sidebar, ExpansionPanel } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import SystemStatus from "./SystemStatus";

function DataPanel() {
  return (
    <div className="DataPanel">
      <Sidebar position="right" className="bg-white border-l border-gray-300">
        <ExpansionPanel open title="INFO">
          <p>⚠️ AI flagged a risky file</p>
          <p>
            📄 File name: <strong>log_77.png</strong>
          </p>
          <p>
            Status:{" "}
            <span className="text-yellow-600 font-semibold">Warning</span>
          </p>
        </ExpansionPanel>

        <ExpansionPanel title="MEDIA">
          <p>📷 No media shared yet.</p>
        </ExpansionPanel>

        <ExpansionPanel title="DATA ACCESS">
          <p>🔐 Access logs available</p>
          <p>🗓️ Last accessed: 24 June, 5:42 PM</p>
          <p>👤 By: Patrick</p>
        </ExpansionPanel>

        <ExpansionPanel title="SCREENSHOTS">
          <p>🖼️ 3 screenshots saved</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>dashboard_ss1.png</li>
            <li>error_trace.png</li>
            <li>user_activity.png</li>
          </ul>
        </ExpansionPanel>

        <ExpansionPanel title="LOGS / VISUALIZATION">
          <p>📊 5 logs available</p>
          <p>📈 Visualization: Active | Errors | Access Pattern</p>
        </ExpansionPanel>

        <ExpansionPanel title="ALERTS">
          <p>📅 Upcoming meeting: 25 June @ 11:00 AM</p>
          <p>🚨 AI Alert: Anomalous token detected at 5:12 PM</p>
        </ExpansionPanel>
        {/* SystemStatus pinned at bottom */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-10">
          <SystemStatus />
        </div> */}
      </Sidebar>
    </div>
  );
}

export default DataPanel;
