import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { apiService } from '../../services/apiService';

export default function IncidentCustomerPanel() {
  const [incident, setIncident] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.createIncident({ description: incident });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident & Safety Reporting</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-green-600">Incident report submitted!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border rounded p-2 mb-2"
              value={incident}
              onChange={e => setIncident(e.target.value)}
              placeholder="Describe the incident..."
              rows={4}
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        )}
      </CardContent>
    </Card>
  );
} 