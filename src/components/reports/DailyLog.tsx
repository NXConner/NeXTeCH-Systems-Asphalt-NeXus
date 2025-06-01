import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock, CheckSquare } from "lucide-react";
import { toast } from "sonner";

interface DailyLogEntry {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  projectId?: string;
  projectName?: string;
  tasks: TaskItem[];
  materials: MaterialUsage[];
  equipment: EquipmentUsage[];
  weather: string;
  notes: string;
  safetyIncidents: boolean;
  safetyNotes?: string;
  submitted: boolean;
  submittedAt?: string;
}

interface TaskItem {
  id: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeSpent: number;
}

interface MaterialUsage {
  id: string;
  material: string;
  quantity: number;
  unit: string;
}

interface EquipmentUsage {
  id: string;
  equipment: string;
  hoursUsed: number;
  condition: 'good' | 'fair' | 'needs-repair';
}

export function DailyLog() {
  const [currentLog, setCurrentLog] = useState<DailyLogEntry>({
    id: `log-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    startTime: '',
    endTime: '',
    totalHours: 0,
    tasks: [
      { id: '1', description: 'Set up work zone safety', completed: false, priority: 'high', timeSpent: 0 },
      { id: '2', description: 'Prepare asphalt materials', completed: false, priority: 'high', timeSpent: 0 },
      { id: '3', description: 'Paving operations', completed: false, priority: 'high', timeSpent: 0 },
      { id: '4', description: 'Clean up work area', completed: false, priority: 'medium', timeSpent: 0 },
    ],
    materials: [],
    equipment: [],
    weather: '',
    notes: '',
    safetyIncidents: false,
    submitted: false,
  });

  const [savedLogs, setSavedLogs] = useState<DailyLogEntry[]>([]);

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updated = { ...currentLog, [field]: value };
    updated.totalHours = calculateHours(updated.startTime, updated.endTime);
    setCurrentLog(updated);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCurrentLog(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const addMaterial = () => {
    const newMaterial: MaterialUsage = {
      id: `mat-${Date.now()}`,
      material: '',
      quantity: 0,
      unit: 'tons',
    };
    setCurrentLog(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const addEquipment = () => {
    const newEquipment: EquipmentUsage = {
      id: `eq-${Date.now()}`,
      equipment: '',
      hoursUsed: 0,
      condition: 'good',
    };
    setCurrentLog(prev => ({
      ...prev,
      equipment: [...prev.equipment, newEquipment]
    }));
  };

  const submitLog = () => {
    const submittedLog = {
      ...currentLog,
      submitted: true,
      submittedAt: new Date().toISOString(),
    };
    
    setSavedLogs(prev => [...prev, submittedLog]);
    setCurrentLog({
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      employeeId: 'emp-1',
      employeeName: 'John Doe',
      startTime: '',
      endTime: '',
      totalHours: 0,
      tasks: [
        { id: '1', description: 'Set up work zone safety', completed: false, priority: 'high', timeSpent: 0 },
        { id: '2', description: 'Prepare asphalt materials', completed: false, priority: 'high', timeSpent: 0 },
        { id: '3', description: 'Paving operations', completed: false, priority: 'high', timeSpent: 0 },
        { id: '4', description: 'Clean up work area', completed: false, priority: 'medium', timeSpent: 0 },
      ],
      materials: [],
      equipment: [],
      weather: '',
      notes: '',
      safetyIncidents: false,
      submitted: false,
    });
    
    toast.success("Daily log submitted successfully");
  };

  const downloadLog = (log: DailyLogEntry) => {
    const logText = `
DAILY WORK LOG
Date: ${log.date}
Employee: ${log.employeeName}
Hours: ${log.startTime} - ${log.endTime} (${log.totalHours} hours)
Project: ${log.projectName || 'N/A'}

TASKS COMPLETED:
${log.tasks.map(task => `- ${task.completed ? '✓' : '○'} ${task.description} (${task.timeSpent}h)`).join('\n')}

MATERIALS USED:
${log.materials.map(mat => `- ${mat.material}: ${mat.quantity} ${mat.unit}`).join('\n')}

EQUIPMENT USED:
${log.equipment.map(eq => `- ${eq.equipment}: ${eq.hoursUsed}h (${eq.condition})`).join('\n')}

WEATHER: ${log.weather}
SAFETY INCIDENTS: ${log.safetyIncidents ? 'YES' : 'NO'}
${log.safetyNotes ? `Safety Notes: ${log.safetyNotes}` : ''}

NOTES: ${log.notes}
    `;
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-log-${log.date}-${log.employeeName}.txt`;
    link.click();
    
    toast.success("Daily log downloaded");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daily Work Log - {currentLog.date}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={currentLog.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={currentLog.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
              />
            </div>
            <div>
              <Label>Total Hours</Label>
              <Input
                value={currentLog.totalHours.toFixed(1)}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Project Info */}
          <div>
            <Label>Project/Location</Label>
            <Input
              placeholder="Enter project name or location"
              value={currentLog.projectName || ''}
              onChange={(e) => setCurrentLog({...currentLog, projectName: e.target.value})}
            />
          </div>

          {/* Daily Tasks Checklist */}
          <div>
            <Label className="text-base font-semibold">Daily Tasks & Objectives</Label>
            <div className="space-y-3 mt-2">
              {currentLog.tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border rounded">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <div className="flex-1">
                    <span className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.description}
                    </span>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="ml-2">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="Hours"
                      step="0.5"
                      value={task.timeSpent}
                      onChange={(e) => {
                        const timeSpent = parseFloat(e.target.value) || 0;
                        setCurrentLog(prev => ({
                          ...prev,
                          tasks: prev.tasks.map(t =>
                            t.id === task.id ? { ...t, timeSpent } : t
                          )
                        }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materials Used */}
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Materials Used</Label>
              <Button size="sm" onClick={addMaterial}>Add Material</Button>
            </div>
            <div className="space-y-2 mt-2">
              {currentLog.materials.map((material, index) => (
                <div key={material.id} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Material name"
                    value={material.material}
                    onChange={(e) => {
                      const updated = [...currentLog.materials];
                      updated[index].material = e.target.value;
                      setCurrentLog({...currentLog, materials: updated});
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={material.quantity}
                    onChange={(e) => {
                      const updated = [...currentLog.materials];
                      updated[index].quantity = parseFloat(e.target.value) || 0;
                      setCurrentLog({...currentLog, materials: updated});
                    }}
                  />
                  <select
                    value={material.unit}
                    onChange={(e) => {
                      const updated = [...currentLog.materials];
                      updated[index].unit = e.target.value;
                      setCurrentLog({...currentLog, materials: updated});
                    }}
                    className="p-2 border rounded"
                    aria-label="Unit"
                    title="Unit"
                  >
                    <option value="tons">Tons</option>
                    <option value="yards">Cubic Yards</option>
                    <option value="gallons">Gallons</option>
                    <option value="bags">Bags</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Used */}
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Equipment Used</Label>
              <Button size="sm" onClick={addEquipment}>Add Equipment</Button>
            </div>
            <div className="space-y-2 mt-2">
              {currentLog.equipment.map((equipment, index) => (
                <div key={equipment.id} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Equipment name"
                    value={equipment.equipment}
                    onChange={(e) => {
                      const updated = [...currentLog.equipment];
                      updated[index].equipment = e.target.value;
                      setCurrentLog({...currentLog, equipment: updated});
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Hours used"
                    step="0.5"
                    value={equipment.hoursUsed}
                    onChange={(e) => {
                      const updated = [...currentLog.equipment];
                      updated[index].hoursUsed = parseFloat(e.target.value) || 0;
                      setCurrentLog({...currentLog, equipment: updated});
                    }}
                  />
                  <select
                    value={equipment.condition}
                    onChange={(e) => {
                      const updated = [...currentLog.equipment];
                      updated[index].condition = e.target.value as any;
                      setCurrentLog({...currentLog, equipment: updated});
                    }}
                    className="p-2 border rounded"
                    aria-label="Condition"
                    title="Condition"
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs-repair">Needs Repair</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Weather & Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Weather Conditions</Label>
              <Input
                placeholder="Clear, Rainy, Hot, etc."
                value={currentLog.weather}
                onChange={(e) => setCurrentLog({...currentLog, weather: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={currentLog.safetyIncidents}
                onCheckedChange={(checked) => setCurrentLog({...currentLog, safetyIncidents: !!checked})}
              />
              <Label>Safety Incidents Occurred</Label>
            </div>
          </div>

          {currentLog.safetyIncidents && (
            <div>
              <Label>Safety Incident Details</Label>
              <Textarea
                placeholder="Describe any safety incidents or concerns"
                value={currentLog.safetyNotes || ''}
                onChange={(e) => setCurrentLog({...currentLog, safetyNotes: e.target.value})}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Any additional notes, observations, or issues"
              value={currentLog.notes}
              onChange={(e) => setCurrentLog({...currentLog, notes: e.target.value})}
            />
          </div>

          <Button onClick={submitLog} className="w-full">
            Submit Daily Log
          </Button>
        </CardContent>
      </Card>

      {/* Submitted Logs */}
      {savedLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Daily Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">{log.date}</span>
                    <span className="text-muted-foreground ml-2">
                      {log.totalHours}h • {log.tasks.filter(t => t.completed).length}/{log.tasks.length} tasks
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadLog(log)}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
