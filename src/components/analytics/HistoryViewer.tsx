import React, { useEffect, useState } from 'react';
import { fetchEvents, AnalyticsEvent } from '@/services/analyticsService';

const HistoryViewer: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  return (
    <div className="history-viewer">
      <h3>Analytics History</h3>
      <ul>
        {events.map((e, idx) => (
          <li key={idx}>
            [{new Date(e.timestamp!).toLocaleString()}] User: {e.userId}, Action: {e.action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryViewer;
