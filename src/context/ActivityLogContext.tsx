import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ActivityLogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'user' | 'listing' | 'dispute' | 'system';
  severity: 'info' | 'warning' | 'success' | 'error';
}

interface ActivityLogContextType {
  log: ActivityLogEntry[];
  addActivity: (message: string, type?: ActivityLogEntry['type'], severity?: ActivityLogEntry['severity']) => void;
  clearLog: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | null>(null);

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};

export const ActivityLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [log, setLog] = useState<ActivityLogEntry[]>(() => {
    // Load from localStorage on initialization
    try {
      const savedLog = localStorage.getItem('adminActivityLog');
      return savedLog ? JSON.parse(savedLog) : [];
    } catch {
      return [];
    }
  });

  const addActivity = (
    message: string, 
    type: ActivityLogEntry['type'] = 'system', 
    severity: ActivityLogEntry['severity'] = 'info'
  ) => {
    const entry: ActivityLogEntry = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date().toLocaleString(),
      type,
      severity,
    };
    
    setLog((prev) => {
      const newLog = [entry, ...prev].slice(0, 1000); // Keep only last 1000 entries
      // Save to localStorage
      try {
        localStorage.setItem('adminActivityLog', JSON.stringify(newLog));
      } catch {
        // Handle localStorage errors silently
      }
      return newLog;
    });
  };

  const clearLog = () => {
    setLog([]);
    try {
      localStorage.removeItem('adminActivityLog');
    } catch {
      // Handle localStorage errors silently
    }
  };

  return (
    <ActivityLogContext.Provider value={{ log, addActivity, clearLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export default ActivityLogContext;