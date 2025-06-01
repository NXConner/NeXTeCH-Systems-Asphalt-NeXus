import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-green-600">Thank you for your feedback!</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
            <textarea
              className="w-full border rounded p-2 mb-2"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Enter your feedback, suggestion, or bug report..."
              required
            />
            <Button type="submit">Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 