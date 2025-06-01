import React from 'react';

interface CrackDetectionARProps {
  onDetect: (result: string) => void;
  onScorePCI: (score: number) => void;
  region?: string | null;
}

const CrackDetectionAR: React.FC<CrackDetectionARProps> = ({ onDetect, onScorePCI, region }) => {
  return (
    <div className="p-4 border rounded bg-gray-50">
      <div className="mb-2 font-bold">AR Crack Detection (Region: {region || 'N/A'})</div>
      <div className="h-48 bg-black/70 flex items-center justify-center text-white mb-2">[Camera Feed Placeholder]</div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          onDetect('crack-detected');
          onScorePCI(Math.floor(Math.random() * 100));
        }}
      >
        Run Detection
      </button>
    </div>
  );
};

export default CrackDetectionAR; 