import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const categories = ['All', 'Repairs', 'Sustainability', 'Showcase'];

export default function ForumBoard() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[1]);
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      let query = supabase.from('forum_posts').select('*').order('created_at', { ascending: false });
      if (category !== 'All') query = query.eq('category', category);
      const { data } = await query;
      setTopics(data || []);
      setLoading(false);
    };
    fetchTopics();
  }, [category, showCreate]);

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    await supabase.from('forum_posts').insert({
      title: newTitle,
      content: newContent,
      category: newCategory,
      user_id: user.id
    });
    setShowCreate(false);
    setNewTitle('');
    setNewContent('');
    setPosting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Forum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-1/2"
          />
          <label htmlFor="forum-category-select" className="sr-only">Category</label>
          <select
            id="forum-category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border rounded px-2 py-1"
            aria-label="Category"
            title="Category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button onClick={() => setShowCreate(true)}>Create Post</Button>
        </div>
        {loading ? (
          <div>Loading topics...</div>
        ) : (
          <ul className="space-y-2">
            {filteredTopics.map(t => (
              <li
                key={t.id}
                className="flex justify-between items-center hover:bg-muted px-2 py-1 rounded cursor-pointer"
                onClick={() => navigate(`/forum/${t.id}`)}
              >
                <span>{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.category} &middot; {new Date(t.created_at).toLocaleDateString()}</span>
              </li>
            ))}
            {filteredTopics.length === 0 && <li className="text-muted-foreground">No topics found.</li>}
          </ul>
        )}
        {showCreate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-2">Create New Post</h2>
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="mb-2"
              />
              <label htmlFor="new-category-select" className="sr-only">Category</label>
              <select
                id="new-category-select"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="border rounded px-2 py-1 mb-2 w-full"
                aria-label="Category"
                title="Category"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea
                placeholder="Content"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="border rounded px-2 py-1 mb-2 w-full min-h-[80px]"
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="ml-2" onClick={handleCreate} disabled={posting || !newTitle.trim() || !newContent.trim()}>{posting ? 'Posting...' : 'Post'}</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 