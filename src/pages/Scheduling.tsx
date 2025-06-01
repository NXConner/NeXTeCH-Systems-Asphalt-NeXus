
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays, Clock, Users, MapPin, Plus, Filter } from "lucide-react";

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'job' | 'maintenance' | 'meeting' | 'training';
  date: string;
  time: string;
  duration: number;
  location: string;
  assignedCrew: string[];
  equipment: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const Scheduling = () => {
  const [events] = useState<ScheduleEvent[]>([
    {
      id: "sch-001",
      title: "Parking Lot Sealcoating - City Mall",
      type: "job",
      date: "2024-01-28",
      time: "08:00",
      duration: 6,
      location: "123 Commerce Drive",
      assignedCrew: ["John Smith", "Mike Wilson"],
      equipment: ["Sealcoat Machine", "Pressure Washer"],
      status: "scheduled",
      priority: "high"
    },
    {
      id: "sch-002", 
      title: "Fleet Maintenance Check",
      type: "maintenance",
      date: "2024-01-28",
      time: "14:00",
      duration: 2,
      location: "Main Depot",
      assignedCrew: ["Dave Johnson"],
      equipment: ["Truck #001", "Paver #003"],
      status: "scheduled",
      priority: "medium"
    }
  ]);

  const [selectedDate, setSelectedDate] = useState("2024-01-28");
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");

  const getStatusColor = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ScheduleEvent['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => event.date === selectedDate);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scheduling & Dispatching</h1>
        <p className="text-muted-foreground mt-2">
          Manage jobs, crews, and equipment with intelligent scheduling
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
            <Button 
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
          </div>
          
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock Calendar Grid */}
              <div className="bg-slate-50 rounded-lg p-6 min-h-96">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium p-2 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNum = i - 6; // Start from previous month
                    const isToday = dayNum === 28;
                    const hasEvents = dayNum === 28 || dayNum === 29;
                    
                    return (
                      <div 
                        key={i} 
                        className={`
                          aspect-square p-2 border rounded text-sm cursor-pointer
                          ${isToday ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-gray-50'}
                          ${dayNum < 1 || dayNum > 31 ? 'text-gray-300' : ''}
                        `}
                        onClick={() => dayNum > 0 && dayNum <= 31 && setSelectedDate(`2024-01-${dayNum.toString().padStart(2, '0')}`)}
                      >
                        <div className="font-medium">{dayNum > 0 && dayNum <= 31 ? dayNum : ''}</div>
                        {hasEvents && (
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="h-1 bg-blue-500 rounded-full"></div>
                            {dayNum === 28 && <div className="h-1 bg-orange-500 rounded-full"></div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Schedule */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Daily Schedule
              </CardTitle>
              <CardDescription>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No events scheduled
                  </p>
                ) : (
                  filteredEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge className={getPriorityColor(event.priority)} variant="secondary">
                          {event.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {event.time} ({event.duration}h)
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {event.assignedCrew.join(', ')}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Badge className={getStatusColor(event.status)} variant="secondary">
                          {event.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{filteredEvents.length}</div>
                <div className="text-sm text-muted-foreground">Scheduled Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Array.from(new Set(filteredEvents.flatMap(e => e.assignedCrew))).length}
                </div>
                <div className="text-sm text-muted-foreground">Crew Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {filteredEvents.reduce((total, event) => total + event.duration, 0)}h
                </div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Array.from(new Set(filteredEvents.map(e => e.location))).length}
                </div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scheduling;
