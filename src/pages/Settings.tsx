import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Building, 
  User, 
  Truck, 
  Users, 
  Map, 
  DollarSign, 
  Link, 
  Download, 
  Upload,
  Bell,
  Shield,
  Database
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState({
    company: {
      name: "AsphaltPro Construction",
      address: "123 Industrial Blvd, Construction City, CC 12345",
      phone: "(555) 123-4567",
      email: "info@asphaltpro.com",
      website: "www.asphaltpro.com",
      taxId: "12-3456789",
      license: "CC-ASPHALT-2024",
    },
    user: {
      name: "John Admin",
      email: "admin@asphaltpro.com",
      phone: "(555) 987-6543",
      role: "admin",
      notifications: true,
      darkMode: false,
      language: "en",
    },
    fleet: {
      autoTracking: true,
      maintenanceAlerts: true,
      fuelTracking: true,
      driverScoring: true,
      geofencing: true,
      idleTimeLimit: 15,
    },
    employee: {
      timeTracking: true,
      autoClockout: 8,
      overtimeAlerts: true,
      vacationApproval: "manager",
      performanceReviews: true,
      documentReminders: true,
    },
    mapping: {
      defaultZoom: 15,
      showTraffic: true,
      autoDetection: true,
      confidenceThreshold: 85,
      employeeTracking: true,
      routeOptimization: true,
    },
    financial: {
      currency: "USD",
      taxRate: 8.5,
      paymentTerms: "Net 30",
      autoInvoicing: false,
      approvalRequired: true,
      budgetAlerts: true,
    },
    integrations: {
      quickbooks: false,
      gps: true,
      weather: true,
      emailNotifications: true,
      smsAlerts: false,
      backupFrequency: "daily",
    }
  });

  const [anonymous, setAnonymous] = useState(true);
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success("Setting updated");
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'asphalt-nexus-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Settings exported successfully");
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast.success("Settings imported successfully");
        } catch (error) {
          toast.error("Invalid settings file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setMessage('');
    setContact('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          System Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your Fleet Asphalt Nexus system preferences and integrations
        </p>
      </div>

      <div className="flex justify-end mb-6 gap-2">
        <Button variant="outline" onClick={exportSettings}>
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
        <label>
          <Button variant="outline" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
        </label>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="company" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Fleet
          </TabsTrigger>
          <TabsTrigger value="employee" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Employee
          </TabsTrigger>
          <TabsTrigger value="mapping" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            Mapping
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={settings.company.name}
                    onChange={(e) => updateSetting('company', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tax ID</Label>
                  <Input
                    value={settings.company.taxId}
                    onChange={(e) => updateSetting('company', 'taxId', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={settings.company.phone}
                    onChange={(e) => updateSetting('company', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.company.email}
                    onChange={(e) => updateSetting('company', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={settings.company.website}
                    onChange={(e) => updateSetting('company', 'website', e.target.value)}
                  />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input
                    value={settings.company.license}
                    onChange={(e) => updateSetting('company', 'license', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={settings.company.address}
                  onChange={(e) => updateSetting('company', 'address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={settings.user.name}
                    onChange={(e) => updateSetting('user', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.user.email}
                    onChange={(e) => updateSetting('user', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={settings.user.phone}
                    onChange={(e) => updateSetting('user', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <select
                    value={settings.user.language}
                    onChange={(e) => updateSetting('user', 'language', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select language"
                    aria-label="Select language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.user.notifications}
                    onCheckedChange={(checked) => updateSetting('user', 'notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Dark Mode</Label>
                  <Switch
                    checked={settings.user.darkMode}
                    onCheckedChange={(checked) => updateSetting('user', 'darkMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Vehicle Tracking</Label>
                    <p className="text-sm text-muted-foreground">Enable real-time GPS tracking</p>
                  </div>
                  <Switch
                    checked={settings.fleet.autoTracking}
                    onCheckedChange={(checked) => updateSetting('fleet', 'autoTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Maintenance Alerts</Label>
                  <Switch
                    checked={settings.fleet.maintenanceAlerts}
                    onCheckedChange={(checked) => updateSetting('fleet', 'maintenanceAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Fuel Tracking</Label>
                  <Switch
                    checked={settings.fleet.fuelTracking}
                    onCheckedChange={(checked) => updateSetting('fleet', 'fuelTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Driver Scoring</Label>
                  <Switch
                    checked={settings.fleet.driverScoring}
                    onCheckedChange={(checked) => updateSetting('fleet', 'driverScoring', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Geofencing</Label>
                  <Switch
                    checked={settings.fleet.geofencing}
                    onCheckedChange={(checked) => updateSetting('fleet', 'geofencing', checked)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Idle Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={settings.fleet.idleTimeLimit}
                  onChange={(e) => updateSetting('fleet', 'idleTimeLimit', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Time Tracking</Label>
                  <Switch
                    checked={settings.employee.timeTracking}
                    onCheckedChange={(checked) => updateSetting('employee', 'timeTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Overtime Alerts</Label>
                  <Switch
                    checked={settings.employee.overtimeAlerts}
                    onCheckedChange={(checked) => updateSetting('employee', 'overtimeAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Performance Reviews</Label>
                  <Switch
                    checked={settings.employee.performanceReviews}
                    onCheckedChange={(checked) => updateSetting('employee', 'performanceReviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Document Reminders</Label>
                  <Switch
                    checked={settings.employee.documentReminders}
                    onCheckedChange={(checked) => updateSetting('employee', 'documentReminders', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Auto Clock-out (hours)</Label>
                  <Input
                    type="number"
                    value={settings.employee.autoClockout}
                    onChange={(e) => updateSetting('employee', 'autoClockout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Vacation Approval</Label>
                  <select
                    value={settings.employee.vacationApproval}
                    onChange={(e) => updateSetting('employee', 'vacationApproval', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select vacation approval method"
                    aria-label="Select vacation approval method"
                  >
                    <option value="manager">Manager Approval</option>
                    <option value="hr">HR Approval</option>
                    <option value="auto">Automatic</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Mapping & Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Show Traffic Data</Label>
                  <Switch
                    checked={settings.mapping.showTraffic}
                    onCheckedChange={(checked) => updateSetting('mapping', 'showTraffic', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto Asphalt Detection</Label>
                  <Switch
                    checked={settings.mapping.autoDetection}
                    onCheckedChange={(checked) => updateSetting('mapping', 'autoDetection', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Employee Tracking</Label>
                  <Switch
                    checked={settings.mapping.employeeTracking}
                    onCheckedChange={(checked) => updateSetting('mapping', 'employeeTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Route Optimization</Label>
                  <Switch
                    checked={settings.mapping.routeOptimization}
                    onCheckedChange={(checked) => updateSetting('mapping', 'routeOptimization', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Zoom Level</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.mapping.defaultZoom}
                    onChange={(e) => updateSetting('mapping', 'defaultZoom', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Detection Confidence (%)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={settings.mapping.confidenceThreshold}
                    onChange={(e) => updateSetting('mapping', 'confidenceThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Currency</Label>
                  <select
                    value={settings.financial.currency}
                    onChange={(e) => updateSetting('financial', 'currency', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select currency"
                    aria-label="Select currency"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <Label>Default Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.financial.taxRate}
                    onChange={(e) => updateSetting('financial', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <select
                    value={settings.financial.paymentTerms}
                    onChange={(e) => updateSetting('financial', 'paymentTerms', e.target.value)}
                    className="w-full p-2 border rounded"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Building, 
  User, 
  Truck, 
  Users, 
  Map, 
  DollarSign, 
  Link, 
  Download, 
  Upload,
  Bell,
  Shield,
  Database
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState({
    company: {
      name: "AsphaltPro Construction",
      address: "123 Industrial Blvd, Construction City, CC 12345",
      phone: "(555) 123-4567",
      email: "info@asphaltpro.com",
      website: "www.asphaltpro.com",
      taxId: "12-3456789",
      license: "CC-ASPHALT-2024",
    },
    user: {
      name: "John Admin",
      email: "admin@asphaltpro.com",
      phone: "(555) 987-6543",
      role: "admin",
      notifications: true,
      darkMode: false,
      language: "en",
    },
    fleet: {
      autoTracking: true,
      maintenanceAlerts: true,
      fuelTracking: true,
      driverScoring: true,
      geofencing: true,
      idleTimeLimit: 15,
    },
    employee: {
      timeTracking: true,
      autoClockout: 8,
      overtimeAlerts: true,
      vacationApproval: "manager",
      performanceReviews: true,
      documentReminders: true,
    },
    mapping: {
      defaultZoom: 15,
      showTraffic: true,
      autoDetection: true,
      confidenceThreshold: 85,
      employeeTracking: true,
      routeOptimization: true,
    },
    financial: {
      currency: "USD",
      taxRate: 8.5,
      paymentTerms: "Net 30",
      autoInvoicing: false,
      approvalRequired: true,
      budgetAlerts: true,
    },
    integrations: {
      quickbooks: false,
      gps: true,
      weather: true,
      emailNotifications: true,
      smsAlerts: false,
      backupFrequency: "daily",
    }
  });

  const [anonymous, setAnonymous] = useState(true);
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success("Setting updated");
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'asphalt-nexus-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Settings exported successfully");
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast.success("Settings imported successfully");
        } catch (error) {
          toast.error("Invalid settings file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setMessage('');
    setContact('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          System Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your Fleet Asphalt Nexus system preferences and integrations
        </p>
      </div>

      <div className="flex justify-end mb-6 gap-2">
        <Button variant="outline" onClick={exportSettings}>
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
        <label>
          <Button variant="outline" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
        </label>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="company" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Fleet
          </TabsTrigger>
          <TabsTrigger value="employee" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Employee
          </TabsTrigger>
          <TabsTrigger value="mapping" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            Mapping
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={settings.company.name}
                    onChange={(e) => updateSetting('company', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tax ID</Label>
                  <Input
                    value={settings.company.taxId}
                    onChange={(e) => updateSetting('company', 'taxId', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={settings.company.phone}
                    onChange={(e) => updateSetting('company', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.company.email}
                    onChange={(e) => updateSetting('company', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={settings.company.website}
                    onChange={(e) => updateSetting('company', 'website', e.target.value)}
                  />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input
                    value={settings.company.license}
                    onChange={(e) => updateSetting('company', 'license', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={settings.company.address}
                  onChange={(e) => updateSetting('company', 'address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={settings.user.name}
                    onChange={(e) => updateSetting('user', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={settings.user.email}
                    onChange={(e) => updateSetting('user', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={settings.user.phone}
                    onChange={(e) => updateSetting('user', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <select
                    value={settings.user.language}
                    onChange={(e) => updateSetting('user', 'language', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.user.notifications}
                    onCheckedChange={(checked) => updateSetting('user', 'notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Dark Mode</Label>
                  <Switch
                    checked={settings.user.darkMode}
                    onCheckedChange={(checked) => updateSetting('user', 'darkMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Vehicle Tracking</Label>
                    <p className="text-sm text-muted-foreground">Enable real-time GPS tracking</p>
                  </div>
                  <Switch
                    checked={settings.fleet.autoTracking}
                    onCheckedChange={(checked) => updateSetting('fleet', 'autoTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Maintenance Alerts</Label>
                  <Switch
                    checked={settings.fleet.maintenanceAlerts}
                    onCheckedChange={(checked) => updateSetting('fleet', 'maintenanceAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Fuel Tracking</Label>
                  <Switch
                    checked={settings.fleet.fuelTracking}
                    onCheckedChange={(checked) => updateSetting('fleet', 'fuelTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Driver Scoring</Label>
                  <Switch
                    checked={settings.fleet.driverScoring}
                    onCheckedChange={(checked) => updateSetting('fleet', 'driverScoring', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Geofencing</Label>
                  <Switch
                    checked={settings.fleet.geofencing}
                    onCheckedChange={(checked) => updateSetting('fleet', 'geofencing', checked)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Idle Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={settings.fleet.idleTimeLimit}
                  onChange={(e) => updateSetting('fleet', 'idleTimeLimit', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Time Tracking</Label>
                  <Switch
                    checked={settings.employee.timeTracking}
                    onCheckedChange={(checked) => updateSetting('employee', 'timeTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Overtime Alerts</Label>
                  <Switch
                    checked={settings.employee.overtimeAlerts}
                    onCheckedChange={(checked) => updateSetting('employee', 'overtimeAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Performance Reviews</Label>
                  <Switch
                    checked={settings.employee.performanceReviews}
                    onCheckedChange={(checked) => updateSetting('employee', 'performanceReviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Document Reminders</Label>
                  <Switch
                    checked={settings.employee.documentReminders}
                    onCheckedChange={(checked) => updateSetting('employee', 'documentReminders', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Auto Clock-out (hours)</Label>
                  <Input
                    type="number"
                    value={settings.employee.autoClockout}
                    onChange={(e) => updateSetting('employee', 'autoClockout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Vacation Approval</Label>
                  <select
                    value={settings.employee.vacationApproval}
                    onChange={(e) => updateSetting('employee', 'vacationApproval', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select vacation approval method"
                  >
                    <option value="manager">Manager Approval</option>
                    <option value="hr">HR Approval</option>
                    <option value="auto">Automatic</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Mapping & Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Show Traffic Data</Label>
                  <Switch
                    checked={settings.mapping.showTraffic}
                    onCheckedChange={(checked) => updateSetting('mapping', 'showTraffic', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto Asphalt Detection</Label>
                  <Switch
                    checked={settings.mapping.autoDetection}
                    onCheckedChange={(checked) => updateSetting('mapping', 'autoDetection', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Employee Tracking</Label>
                  <Switch
                    checked={settings.mapping.employeeTracking}
                    onCheckedChange={(checked) => updateSetting('mapping', 'employeeTracking', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Route Optimization</Label>
                  <Switch
                    checked={settings.mapping.routeOptimization}
                    onCheckedChange={(checked) => updateSetting('mapping', 'routeOptimization', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Zoom Level</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.mapping.defaultZoom}
                    onChange={(e) => updateSetting('mapping', 'defaultZoom', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Detection Confidence (%)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={settings.mapping.confidenceThreshold}
                    onChange={(e) => updateSetting('mapping', 'confidenceThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Currency</Label>
                  <select
                    value={settings.financial.currency}
                    onChange={(e) => updateSetting('financial', 'currency', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select currency"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <Label>Default Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.financial.taxRate}
                    onChange={(e) => updateSetting('financial', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <select
                    value={settings.financial.paymentTerms}
                    onChange={(e) => updateSetting('financial', 'paymentTerms', e.target.value)}
                    className="w-full p-2 border rounded"
                    title="Select payment terms"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Auto Invoicing</Label>
                  <Switch
                    checked={settings.financial.autoInvoicing}
                    onCheckedChange={(checked) => updateSetting('financial', 'autoInvoicing', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Approval Required for Large Expenses</Label>
                  <Switch
                    checked={settings.financial.approvalRequired}
                    onCheckedChange={(checked) => updateSetting('financial', 'approvalRequired', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Budget Alerts</Label>
                  <Switch
                    checked={settings.financial.budgetAlerts}
                    onCheckedChange={(checked) => updateSetting('financial', 'budgetAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <Label>QuickBooks Integration</Label>
                    <p className="text-sm text-muted-foreground">Sync financial data with QuickBooks</p>
                    <Badge variant={settings.integrations.quickbooks ? "default" : "secondary"}>
                      {settings.integrations.quickbooks ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.integrations.quickbooks}
                    onCheckedChange={(checked) => updateSetting('integrations', 'quickbooks', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <Label>GPS Tracking Service</Label>
                    <p className="text-sm text-muted-foreground">Real-time location tracking</p>
                    <Badge variant={settings.integrations.gps ? "default" : "secondary"}>
                      {settings.integrations.gps ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.integrations.gps}
                    onCheckedChange={(checked) => updateSetting('integrations', 'gps', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <Label>Weather Service</Label>
                    <p className="text-sm text-muted-foreground">Weather data for job planning</p>
                    <Badge variant={settings.integrations.weather ? "default" : "secondary"}>
                      {settings.integrations.weather ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.integrations.weather}
                    onCheckedChange={(checked) => updateSetting('integrations', 'weather', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.integrations.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('integrations', 'emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>SMS Alerts</Label>
                  <Switch
                    checked={settings.integrations.smsAlerts}
                    onCheckedChange={(checked) => updateSetting('integrations', 'smsAlerts', checked)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Backup Frequency</Label>
                <select
                  value={settings.integrations.backupFrequency}
                  onChange={(e) => updateSetting('integrations', 'backupFrequency', e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  title="Select backup frequency"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="anonymous" checked={anonymous} onCheckedChange={setAnonymous} />
                <Label htmlFor="anonymous">Submit Anonymously</Label>
              </div>
              <div>
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <select
                  id="feedbackType"
                  value={feedbackType}
                  onChange={e => setFeedbackType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  aria-label="Feedback type"
                  title="Feedback type"
                >
                  <option value="general">General</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe your feedback..."
                />
              </div>
              {!anonymous && (
                <div>
                  <Label htmlFor="contact">Contact Info (optional)</Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="Email or phone (optional)"
                  />
                </div>
              )}
              <Button type="submit" className="w-full">Submit Feedback</Button>
              {submitted && <div className="text-green-600 mt-2">Thank you for your feedback!</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
