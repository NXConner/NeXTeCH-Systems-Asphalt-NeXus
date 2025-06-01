import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

export default function QRCodeScanner({ onScan, onClose }: { onScan: (data: string) => void; onClose: () => void }) {
  const [error, setError] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow flex flex-col items-center">
        <QrReader
          delay={300}
          onError={err => setError(err?.message || 'Scan error')}
          onScan={data => {
            if (data) onScan(data);
          }}
          style={{ width: '100%' }}
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
} 