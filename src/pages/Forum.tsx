import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForumBoard from '../components/community/ForumBoard';
import ForumTopic from './ForumTopic';

export default function ForumPage() {
  return (
    <Routes>
      <Route path="/" element={<ForumBoard />} />
      <Route path=":id" element={<ForumTopic />} />
    </Routes>
  );
} 