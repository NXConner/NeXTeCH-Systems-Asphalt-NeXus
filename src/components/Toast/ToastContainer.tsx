import React from 'react';
import { useToast } from '@/contexts/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center justify-between p-2 rounded shadow ${
            t.type === 'success' ? 'bg-green-100 text-green-800' :
            t.type === 'error' ? 'bg-red-100 text-red-800' :
            t.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
