import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useObjectives } from '@/hooks/useObjectives';

interface Objective {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  assignedTo?: string;
  progress: number;
}

export function ObjectivesWidget({ assignedTo = 'emp-1' }) {
  const { objectives, isLoading, error, addObjective, updateObjective } = useObjectives(assignedTo);

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const toggleObjective = (id: string) => {
    updateObjective(id, { completed: !objectives.find(obj => obj.id === id)?.completed });
    toast.success("Objective updated");
  };

  const dailyObjectives = objectives.filter(obj => obj.type === 'daily');
  const weeklyObjectives = objectives.filter(obj => obj.type === 'weekly');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const currentObjectives = activeTab === 'daily' ? dailyObjectives : weeklyObjectives;
  const completedCount = currentObjectives.filter(obj => obj.completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objectives & Priorities
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant={activeTab === 'daily' ? 'default' : 'outline'}
            onClick={() => setActiveTab('daily')}
          >
            Daily ({dailyObjectives.filter(obj => obj.completed).length}/{dailyObjectives.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'weekly' ? 'default' : 'outline'}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly ({weeklyObjectives.filter(obj => obj.completed).length}/{weeklyObjectives.length})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {currentObjectives.map((objective) => (
            <div key={objective.id} className="flex items-start space-x-3 p-3 border rounded">
              <Checkbox
                checked={objective.completed}
                onCheckedChange={() => toggleObjective(objective.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${objective.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {objective.title}
                  </span>
                  <Badge variant={getPriorityColor(objective.priority)} className="text-xs">
                    {objective.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                {objective.progress > 0 && objective.progress < 100 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{objective.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${objective.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {objective.dueDate}
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="font-medium mb-3">Add New Objective</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addObjective({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                type: activeTab,
                priority: formData.get('priority') as 'high' | 'medium' | 'low',
                completed: false,
                dueDate: formData.get('dueDate') as string,
                progress: 0,
              });
            }}>
              <div className="space-y-3">
                <Input name="title" placeholder="Objective title" required />
                <Input name="description" placeholder="Description" required />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Objective status select"
                    title="Objective status select"
                    name="priority"
                    required
                    className="p-2 border rounded"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <Input name="dueDate" type="date" required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Add Objective</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
