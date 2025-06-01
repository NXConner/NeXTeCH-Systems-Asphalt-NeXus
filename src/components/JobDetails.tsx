
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  Phone, 
  Mail,
  Edit,
  Save,
  X,
  Plus,
  CheckCircle
} from 'lucide-react';
import { Job, JobTimelineEvent } from '@/types/job';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface JobDetailsProps {
  job: Job;
  onUpdate: (updatedJob: Job) => void;
  onClose: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [progressUpdate, setProgressUpdate] = useState(job.progress.toString());

  const handleUpdateProgress = () => {
    const newProgress = parseInt(progressUpdate);
    if (newProgress < 0 || newProgress > 100) {
      toast({
        title: "Invalid Progress",
        description: "Progress must be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    const timelineEvent: JobTimelineEvent = {
      id: `timeline-${Date.now()}`,
      type: 'progress',
      title: 'Progress Updated',
      description: `Progress updated to ${newProgress}%`,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };

    const updatedJob = {
      ...job,
      progress: newProgress,
      timeline: [timelineEvent, ...job.timeline],
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedJob);
    toast({
      title: "Progress Updated",
      description: `Job progress updated to ${newProgress}%.`
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const timelineEvent: JobTimelineEvent = {
      id: `timeline-${Date.now()}`,
      type: 'note',
      title: 'Note Added',
      description: newNote,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };

    const updatedJob = {
      ...job,
      timeline: [timelineEvent, ...job.timeline],
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedJob);
    setNewNote('');
    toast({
      title: "Note Added",
      description: "Note has been added to the job timeline."
    });
  };

  const handleMarkComplete = () => {
    const timelineEvent: JobTimelineEvent = {
      id: `timeline-${Date.now()}`,
      type: 'completed',
      title: 'Job Completed',
      description: 'Job has been marked as completed',
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };

    const updatedJob = {
      ...job,
      status: 'completed' as const,
      progress: 100,
      timeline: [timelineEvent, ...job.timeline],
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedJob);
    toast({
      title: "Job Completed",
      description: "Job has been marked as completed."
    });
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimelineIcon = (type: JobTimelineEvent['type']) => {
    switch (type) {
      case 'created': return '🆕';
      case 'scheduled': return '📅';
      case 'started': return '▶️';
      case 'progress': return '📊';
      case 'completed': return '✅';
      case 'note': return '📝';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(job.status)}>
              {job.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline">
              {job.priority} priority
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {job.status !== 'completed' && job.status !== 'cancelled' && (
            <Button onClick={handleMarkComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          {job.status === 'in-progress' && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress</span>
                    <span>{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-3" />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={progressUpdate}
                    onChange={(e) => setProgressUpdate(e.target.value)}
                    placeholder="Update progress %"
                  />
                  <Button onClick={handleUpdateProgress}>
                    <Save className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>
                Project timeline and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Note */}
              <div className="space-y-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or update..."
                  rows={2}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>

              <Separator />

              {/* Timeline Events */}
              <div className="space-y-4">
                {job.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                      {getTimelineIcon(event.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">by {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{job.client.name}</span>
              </div>
              {job.client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.client.email}</span>
                </div>
              )}
              {job.client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.client.phone}</span>
                </div>
              )}
              {job.client.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.client.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Type:</span>
                <p className="text-sm text-muted-foreground capitalize">{job.project.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Location:</span>
                <p className="text-sm text-muted-foreground">{job.project.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Area:</span>
                <p className="text-sm text-muted-foreground">{job.project.estimatedArea.toLocaleString()} sq ft</p>
              </div>
              <div>
                <span className="text-sm font-medium">Estimated Cost:</span>
                <p className="text-sm text-muted-foreground">${job.project.estimatedCost.toLocaleString()}</p>
              </div>
              {job.project.description && (
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm text-muted-foreground">{job.project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(job.schedule.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(job.schedule.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{job.schedule.estimatedDuration} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
