import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';

export default function EditProfile() {
  const [form, setForm] = useState({ name: '', email: '', avatar: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getCurrentUser().then(user => {
      setForm({ name: user.name, email: user.email, avatar: null });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile({
        name: form.name,
        email: form.email,
        avatar: form.avatar,
      });
      toast.success('Profile updated!');
      navigate('/settings');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow max-w-md w-full space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="avatar">Profile Picture</Label>
          <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
} 