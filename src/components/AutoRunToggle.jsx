import React, { useState } from 'react';

const AutoRunToggle = () => {
  const [autoRun, setAutoRun] = useState(false);

  const handleToggle = () => {
    setAutoRun(!autoRun);
    // Call an API or update state to change the auto-run status
  };

  return (
    <div className="flex items-center">
      <label htmlFor="autoRun" className="mr-2 font-medium">
        Auto-run Agents:
      </label>
      <input
        id="autoRun"
        type="checkbox"
        checked={autoRun}
        onChange={handleToggle}
        className="toggle-checkbox"
      />
    </div>
  );
};

export default AutoRunToggle;