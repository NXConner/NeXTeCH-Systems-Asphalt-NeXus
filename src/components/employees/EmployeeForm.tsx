import React, { useState } from 'react';

export const EmployeeForm = ({ employee, onSave, onCancel }: { employee?: any, onSave: (emp: any) => void, onCancel: () => void }) => {
  const [form, setForm] = useState(employee || { name: '', email: '', role: '' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border p-2 rounded w-full" />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border p-2 rounded w-full" />
      <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role" className="border p-2 rounded w-full" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}; 