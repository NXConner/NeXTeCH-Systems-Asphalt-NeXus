import React, { useState } from 'react';

export default function CreateJobForm() {
  const [formData, setFormData] = useState({ projectType: '', priority: '' });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <select
        id="projectType"
        value={formData.projectType}
        onChange={(e) => handleInputChange('projectType', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Project type select"
        title="Project type select"
      >
        <option value="Road Repair">Road Repair</option>
        <option value="Parking Lot">Parking Lot</option>
        <option value="Driveway">Driveway</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Striping">Striping</option>
      </select>

      <select
        id="priority"
        value={formData.priority}
        onChange={(e) => handleInputChange('priority', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Priority select"
        title="Priority select"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
    </>
  );
} 