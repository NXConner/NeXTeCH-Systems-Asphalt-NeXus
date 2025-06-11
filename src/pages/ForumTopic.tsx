import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function ForumTopic() {
  const { id } = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: topicData } = await supabase.from('forum_posts').select('*').eq('id', id).single();
      const { data: postData } = await supabase.from('forum_replies').select('*').eq('topic_id', id).order('created_at', { ascending: true });
      setTopic(topicData);
      setPosts(postData || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setPosting(true);
    await supabase.from('forum_replies').insert({ topic_id: id, user_id: user.id, content: reply });
    setReply('');
    // Refresh posts
    const { data: postData } = await supabase.from('forum_replies').select('*').eq('topic_id', id).order('created_at', { ascending: true });
    setPosts(postData || []);
    setPosting(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!topic) return <div className="p-8">Topic not found.</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <div className="text-xs text-muted-foreground">Posted by {topic.user_id} on {new Date(topic.created_at).toLocaleString()}</div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">{topic.content}</div>
        <div className="mb-4 font-bold">Replies</div>
        <ul className="space-y-4 mb-6">
          {posts.map(post => (
            <li key={post.id} className="border-b pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{post.user_id}</span>
                <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</span>
              </div>
              <div>{post.content}</div>
            </li>
          ))}
          {posts.length === 0 && <li className="text-muted-foreground">No replies yet.</li>}
        </ul>
        {user && (
          <div className="flex gap-2">
            <Input
              placeholder="Write a reply..."
              value={reply}
              onChange={e => setReply(e.target.value)}
              className="flex-1"
              disabled={posting}
            />
            <Button onClick={handleReply} disabled={posting || !reply.trim()}>Reply</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 