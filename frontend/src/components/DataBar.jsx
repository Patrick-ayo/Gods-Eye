import "./style.css";

import DataPanel from "./DataPanel";
import SystemStatus from "./SystemStatus";

function DataBar() {
  return (
    <div>
      <DataPanel />
      <div className="status">
        <SystemStatus />
      </div>
    </div>
  );
}

export default DataBar;
