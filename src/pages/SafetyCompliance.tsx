
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Shield, AlertTriangle, Users, Calendar, FileText } from "lucide-react";
import { SafetyIncident, SafetyTraining, EmployeeTraining } from "@/types/safety";

const SafetyCompliance = () => {
  const [incidents] = useState<SafetyIncident[]>([
    {
      id: "inc-001",
      type: "near-miss",
      severity: "medium",
      description: "Worker almost struck by backing vehicle",
      location: "Main Street Project Site",
      jobId: "JOB-001",
      vehicleId: "vehicle-1",
      injuredPersons: [],
      witnessNames: ["John Doe", "Jane Smith"],
      immediateActions: "Stopped work, reviewed safety protocols",
      correctiveActions: ["Install backup alarms", "Mandatory spotter training"],
      followUpRequired: true,
      reportedBy: "Site Supervisor",
      status: "investigating",
      reportDate: "2024-01-25T00:00:00Z",
      incidentDate: "2024-01-25T09:30:00Z",
      photos: [],
      documents: []
    }
  ]);

  const [trainings] = useState<SafetyTraining[]>([
    {
      id: "train-001",
      title: "OSHA 10-Hour Construction Safety",
      description: "Basic construction safety training covering OSHA standards",
      type: "certification",
      duration: 10,
      expiryPeriod: 36,
      required: true,
      materials: ["OSHA handbook", "Safety videos", "Online modules"],
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "train-002",
      title: "Equipment Operation Safety",
      description: "Safe operation procedures for heavy equipment",
      type: "specialized",
      duration: 4,
      expiryPeriod: 12,
      required: true,
      materials: ["Equipment manuals", "Safety checklist"],
      createdAt: "2024-01-01T00:00:00Z"
    }
  ]);

  const [employeeTrainings] = useState<EmployeeTraining[]>([
    {
      id: "emp-train-001",
      employeeId: "driver-1",
      trainingId: "train-001",
      status: "completed",
      completedDate: "2024-01-15T00:00:00Z",
      expiryDate: "2027-01-15T00:00:00Z",
      score: 95,
      certificateUrl: "/certificates/cert-001.pdf",
      notes: "Excellent performance"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompliancePercentage = () => {
    const completedTrainings = employeeTrainings.filter(et => et.status === 'completed').length;
    const totalRequired = employeeTrainings.length;
    return totalRequired > 0 ? (completedTrainings / totalRequired) * 100 : 0;
  };

  const stats = {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter(i => i.status !== 'closed').length,
    criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
    complianceRate: getCompliancePercentage()
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Safety & Compliance</h1>
        <p className="text-muted-foreground mt-2">
          Manage safety incidents, training, and compliance requirements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalIncidents}</div>
                <div className="text-sm text-muted-foreground">Total Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.openIncidents}</div>
                <div className="text-sm text-muted-foreground">Open Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.criticalIncidents}</div>
                <div className="text-sm text-muted-foreground">Critical Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.complianceRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>
        </div>

        <TabsContent value="incidents" className="space-y-4">
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {incident.type.replace('-', ' ')} - {incident.location}
                        </h3>
                        <Badge className={getSeverityColor(incident.severity)} variant="secondary">
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      
                      <div className="text-sm space-y-1">
                        <div><strong>Reported by:</strong> {incident.reportedBy}</div>
                        <div><strong>Date:</strong> {new Date(incident.incidentDate).toLocaleDateString()}</div>
                        {incident.witnessNames.length > 0 && (
                          <div><strong>Witnesses:</strong> {incident.witnessNames.join(', ')}</div>
                        )}
                        <div><strong>Immediate Actions:</strong> {incident.immediateActions}</div>
                      </div>

                      {incident.correctiveActions.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium">Corrective Actions:</div>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {incident.correctiveActions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Photos
                      </Button>
                      <Button size="sm">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4">
            {trainings.map((training) => (
              <Card key={training.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{training.title}</h3>
                        <Badge variant={training.required ? 'default' : 'secondary'}>
                          {training.required ? 'Required' : 'Optional'}
                        </Badge>
                        <Badge variant="outline">{training.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{training.description}</p>
                      
                      <div className="text-sm space-y-1">
                        <div><strong>Duration:</strong> {training.duration} hours</div>
                        {training.expiryPeriod && (
                          <div><strong>Valid for:</strong> {training.expiryPeriod} months</div>
                        )}
                        <div><strong>Materials:</strong> {training.materials.join(', ')}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                      <Button size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Compliance Overview</CardTitle>
              <CardDescription>Current compliance status across all employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Compliance Rate</span>
                  <span className="font-bold">{stats.complianceRate.toFixed(0)}%</span>
                </div>
                <Progress value={stats.complianceRate} className="h-3" />
                
                <div className="grid gap-4 mt-6">
                  {employeeTrainings.map((empTraining) => {
                    const training = trainings.find(t => t.id === empTraining.trainingId);
                    return (
                      <div key={empTraining.id} className="flex justify-between items-center p-4 border rounded">
                        <div>
                          <div className="font-medium">{training?.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Employee ID: {empTraining.employeeId}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(empTraining.status)} variant="secondary">
                            {empTraining.status}
                          </Badge>
                          {empTraining.expiryDate && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Expires: {new Date(empTraining.expiryDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Incident Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Monthly Incident Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Incident Trends Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Safety Performance Metrics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Training Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Training Compliance Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Certification Expiry Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Training Effectiveness Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyCompliance;
