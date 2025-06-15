import React from 'react';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ActivityListProps {
  activities: Activity[];
  loading: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, loading }) => {
  if (loading) {
    return <div className="animate-pulse">Loading activities...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activities</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b pb-3 last:border-b-0">
              <div className="flex items-center gap-2 mb-1">
                {activity.user.avatar && (
                  <img 
                    src={activity.user.avatar} 
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-medium">{activity.user.name}</span>
              </div>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
