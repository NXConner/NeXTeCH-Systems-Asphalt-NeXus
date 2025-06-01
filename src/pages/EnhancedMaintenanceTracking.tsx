import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Plus,
  Bell,
  CheckCircle,
  Clock,
  Car
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MaintenanceItem {
  id: string;
  vehicle_id: string;
  item_type: string;
  description: string;
  interval_type: string;
  interval_value: number;
  last_service_date?: string;
  last_service_mileage?: number;
  next_due_date?: string;
  next_due_mileage?: number;
  priority: string;
  cost_estimate?: number;
  vendor_id?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  expiry_date?: string;
  issued_date?: string;
  issuing_authority?: string;
  document_number?: string;
  notes?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

interface MaintenanceNotification {
  id: string;
  vehicle_id: string;
  maintenance_item_id?: string;
  notification_type: string;
  message: string;
  due_date?: string;
  is_read: boolean;
  created_at: string;
}

export default function EnhancedMaintenanceTracking() {
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const queryClient = useQueryClient();

  // Standard maintenance checklist items
  const standardMaintenanceItems = [
    { type: "engine", description: "Oil Change", intervalType: "mileage", intervalValue: 3000, priority: "high" },
    { type: "engine", description: "Air Filter Replacement", intervalType: "mileage", intervalValue: 12000, priority: "medium" },
    { type: "engine", description: "Spark Plugs", intervalType: "mileage", intervalValue: 30000, priority: "medium" },
    { type: "engine", description: "Spark Plug Wires", intervalType: "mileage", intervalValue: 60000, priority: "medium" },
    { type: "fluids", description: "Transmission Fluid", intervalType: "mileage", intervalValue: 30000, priority: "high" },
    { type: "fluids", description: "Brake Fluid", intervalType: "time", intervalValue: 24, priority: "high" },
    { type: "fluids", description: "Coolant Flush", intervalType: "mileage", intervalValue: 30000, priority: "high" },
    { type: "fluids", description: "Power Steering Fluid", intervalType: "mileage", intervalValue: 60000, priority: "medium" },
    { type: "tires", description: "Tire Rotation", intervalType: "mileage", intervalValue: 6000, priority: "medium" },
    { type: "tires", description: "Tire Replacement", intervalType: "mileage", intervalValue: 50000, priority: "high" },
    { type: "brakes", description: "Brake Pad Inspection", intervalType: "mileage", intervalValue: 12000, priority: "high" },
    { type: "brakes", description: "Brake Pad Replacement", intervalType: "mileage", intervalValue: 25000, priority: "critical" },
    { type: "safety", description: "Safety Inspection", intervalType: "time", intervalValue: 12, priority: "critical" },
    { type: "registration", description: "Vehicle Registration Renewal", intervalType: "time", intervalValue: 12, priority: "critical" },
    { type: "insurance", description: "Insurance Renewal", intervalType: "time", intervalValue: 6, priority: "critical" },
    { type: "emissions", description: "Emissions Test", intervalType: "time", intervalValue: 24, priority: "high" }
  ];

  // Fetch maintenance items
  const { data: maintenanceItems } = useQuery({
    queryKey: ['maintenance-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_items')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceItem[];
    }
  });

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['maintenance-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceNotification[];
    }
  });

  // Fetch vehicle documents
  const { data: vehicleDocuments } = useQuery({
    queryKey: ['vehicle-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .select('*')
        .order('expiry_date');
      
      if (error) throw error;
      return data as VehicleDocument[];
    }
  });

  // Add bulk maintenance items mutation
  const addBulkMaintenanceMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const itemsToAdd = standardMaintenanceItems.map(item => ({
        vehicle_id: vehicleId,
        item_type: item.type,
        description: item.description,
        interval_type: item.intervalType,
        interval_value: item.intervalValue,
        priority: item.priority,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('maintenance_items')
        .insert(itemsToAdd)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-items'] });
      toast.success("Standard maintenance checklist added");
    },
    onError: (error) => {
      toast.error("Failed to add maintenance items: " + error.message);
    }
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async (documentData: Partial<VehicleDocument>) => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .insert([{
          vehicle_id: documentData.vehicle_id || '',
          document_type: documentData.document_type || '',
          document_name: documentData.document_name || '',
          document_url: documentData.document_url || '',
          expiry_date: documentData.expiry_date,
          issued_date: documentData.issued_date,
          issuing_authority: documentData.issuing_authority,
          document_number: documentData.document_number,
          notes: documentData.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-documents'] });
      setShowAddDocument(false);
      toast.success("Document added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add document: " + error.message);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Car className="h-4 w-4" />;
      case 'insurance': return <FileText className="h-4 w-4" />;
      case 'inspection': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isDocumentExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isDocumentExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            Enhanced Maintenance Tracking
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive vehicle maintenance, documentation, and compliance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDocument(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
          <Button onClick={() => setShowAddItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Maintenance Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="checklist">Standard Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {notifications?.filter(n => n.notification_type === 'overdue').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Overdue Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {notifications?.filter(n => n.notification_type === 'due_soon').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Due Soon</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {vehicleDocuments?.filter(d => isDocumentExpiringSoon(d.expiry_date)).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Documents Expiring</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {maintenanceItems?.filter(item => {
                        if (!item.next_due_date) return false;
                        const dueDate = new Date(item.next_due_date);
                        const today = new Date();
                        return dueDate > today;
                      }).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Up to Date</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-6">
            {maintenanceItems?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.description}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{item.vehicle_id}</Badge>
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority}
                        </Badge>
                        <Badge variant="outline">{item.item_type}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-medium">Interval</Label>
                      <p className="text-sm">
                        Every {item.interval_value} {item.interval_type === 'mileage' ? 'miles' : 'months'}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Last Service</Label>
                      <p className="text-sm">
                        {item.last_service_date 
                          ? new Date(item.last_service_date).toLocaleDateString()
                          : 'Not recorded'
                        }
                        {item.last_service_mileage && (
                          <span className="block">{item.last_service_mileage.toLocaleString()} miles</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Next Due</Label>
                      <p className="text-sm">
                        {item.next_due_date 
                          ? new Date(item.next_due_date).toLocaleDateString()
                          : 'Not scheduled'
                        }
                        {item.next_due_mileage && (
                          <span className="block">{item.next_due_mileage.toLocaleString()} miles</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="mt-4">
                      <Label className="font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground">{item.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            {vehicleDocuments?.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getDocumentTypeIcon(doc.document_type)}
                        {doc.document_name}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{doc.vehicle_id}</Badge>
                        <Badge variant="outline">{doc.document_type}</Badge>
                        {doc.expiry_date && (
                          <Badge 
                            variant={isDocumentExpired(doc.expiry_date) ? "destructive" : 
                                   isDocumentExpiringSoon(doc.expiry_date) ? "default" : "secondary"}
                          >
                            {isDocumentExpired(doc.expiry_date) ? "Expired" :
                             isDocumentExpiringSoon(doc.expiry_date) ? "Expiring Soon" : "Valid"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-medium">Document Number</Label>
                      <p className="text-sm">{doc.document_number || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Issued Date</Label>
                      <p className="text-sm">
                        {doc.issued_date 
                          ? new Date(doc.issued_date).toLocaleDateString()
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Expiry Date</Label>
                      <p className="text-sm">
                        {doc.expiry_date 
                          ? new Date(doc.expiry_date).toLocaleDateString()
                          : 'No expiry'
                        }
                      </p>
                    </div>
                  </div>
                  {doc.issuing_authority && (
                    <div className="mt-4">
                      <Label className="font-medium">Issuing Authority</Label>
                      <p className="text-sm">{doc.issuing_authority}</p>
                    </div>
                  )}
                  {doc.notes && (
                    <div className="mt-4">
                      <Label className="font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground">{doc.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Bell className={`h-5 w-5 mt-0.5 ${
                      notification.notification_type === 'overdue' ? 'text-red-500' :
                      notification.notification_type === 'due_soon' ? 'text-orange-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{notification.vehicle_id}</Badge>
                        <Badge 
                          variant={notification.notification_type === 'overdue' ? "destructive" : "default"}
                        >
                          {notification.notification_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Standard Maintenance Checklist</CardTitle>
              <p className="text-muted-foreground">
                Add comprehensive maintenance checklist for any vehicle
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle_select">Select Vehicle</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle} title="Select vehicle" aria-label="Select vehicle">
                    <SelectTrigger title="Vehicle" aria-label="Vehicle">
                      <SelectValue placeholder="Choose a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRUCK-001">Truck #1</SelectItem>
                      <SelectItem value="PAVER-001">Paver #1</SelectItem>
                      <SelectItem value="ROLLER-001">Roller #1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => selectedVehicle && addBulkMaintenanceMutation.mutate(selectedVehicle)}
                  disabled={!selectedVehicle || addBulkMaintenanceMutation.isPending}
                  className="w-full"
                >
                  {addBulkMaintenanceMutation.isPending ? "Adding..." : "Add Standard Maintenance Checklist"}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {standardMaintenanceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Every {item.intervalValue} {item.intervalType === 'mileage' ? 'miles' : 'months'}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(item.priority)} variant="secondary">
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
