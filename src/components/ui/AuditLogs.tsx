import React, { useState, useEffect } from 'react';

const actions = [
  { id: 1, action: 'User logged in', timestamp: new Date().toISOString() },
  { id: 2, action: 'Data exported', timestamp: new Date().toISOString() },
  { id: 3, action: 'Comment submitted', timestamp: new Date().toISOString() }
];

export default function AuditLogs() {
  const [logs, setLogs] = useState(actions);

  useEffect(() => {
    console.log('Audit logs:', logs);
  }, [logs]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Audit Logs</h2>
      <ul className="space-y-1">
        {logs.map(log => (
          <li key={log.id} className="flex justify-between">
            <span>{log.action}</span>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 