import React, { useState } from 'react';
import { Label } from '../ui/label';

export const EstimateFormEnhanced = () => {
  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    description: ''
  });
  return (
    <form>
      <div>
        <Label htmlFor="client">Client</Label>
        <input id="client" name="client" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="Client name" aria-label="Client name" title="Client name" />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <input id="amount" name="amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="Estimate amount" aria-label="Estimate amount" title="Estimate amount" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea id="description" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the estimate" aria-label="Estimate description" title="Estimate description" />
      </div>
      <button type="submit" aria-label="Save Estimate" title="Save Estimate">Save</button>
    </form>
  );
}; 