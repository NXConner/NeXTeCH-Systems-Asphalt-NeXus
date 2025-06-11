import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateProfile({ name });
      setMessage('Profile updated!');
    } catch (e) {
      setMessage('Failed to update profile.');
    }
    setSaving(false);
  };

  const handlePassword = async () => {
    if (!password) return;
    setSaving(true);
    setMessage('');
    try {
      await updatePassword(password);
      setMessage('Password updated!');
      setPassword('');
    } catch (e) {
      setMessage('Failed to update password.');
    }
    setSaving(false);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl mb-2">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user?.email?.[0]?.toUpperCase() || '?'}</span>
            )}
          </div>
          <div className="text-lg font-bold">{name || email}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={saving} className="mb-4">Save Profile</Button>
        <div className="mb-4">
          <label className="block mb-1 font-medium">New Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <Button onClick={handlePassword} disabled={saving || !password}>Change Password</Button>
        {message && <div className="mt-4 text-center text-muted-foreground">{message}</div>}
      </CardContent>
    </Card>
  );
} 