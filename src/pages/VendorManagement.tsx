import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Plus, Search, Filter, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { toast } from "sonner";

// Mock vendor data - replace with Supabase integration
const mockVendors = [
  {
    id: '1',
    vendor_number: 'VEN0001',
    company_name: 'SealMaster Virginia',
    contact_person: 'John Smith',
    email: 'john@sealmaster-va.com',
    phone: '(804) 555-0123',
    address: {
      street: '123 Industrial Blvd',
      city: 'Richmond',
      state: 'VA',
      zip: '23230'
    },
    payment_terms: 'Net 30',
    tax_id: '54-1234567',
    website: 'www.sealmaster-va.com',
    status: 'active',
    notes: 'Primary sealer supplier',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  }
];

export default function VendorManagement() {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: 'VA',
      zip: ''
    },
    payment_terms: 'Net 30',
    tax_id: '',
    website: '',
    notes: '',
    status: 'active'
  });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For now, just add to local state - replace with Supabase integration
      const newVendor = {
        id: String(vendors.length + 1),
        vendor_number: `VEN${String(vendors.length + 1).padStart(4, '0')}`,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setVendors([...vendors, newVendor]);
      setShowAddForm(false);
      setFormData({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: 'VA', zip: '' },
        payment_terms: 'Net 30',
        tax_id: '',
        website: '',
        notes: '',
        status: 'active'
      });
      
      toast.success('Vendor added successfully!');
    } catch (error) {
      toast.error('Failed to add vendor');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Vendor Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage suppliers, contractors, and service providers with integrated cost tracking
        </p>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>

            {/* Vendor List */}
            <div className="grid gap-4">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{vendor.company_name}</h3>
                          <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                            {vendor.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{vendor.vendor_number}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Contact:</span>
                              <span>{vendor.contact_person}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <Phone className="h-4 w-4" />
                              <span>{vendor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <Mail className="h-4 w-4" />
                              <span>{vendor.email}</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Address:</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {vendor.address.street}<br />
                              {vendor.address.city}, {vendor.address.state} {vendor.address.zip}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm">
                              <span className="font-medium">Payment Terms:</span> {vendor.payment_terms}
                            </div>
                            {vendor.website && (
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <Globe className="h-4 w-4" />
                                <a href={vendor.website} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-600 hover:underline">
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Vendor Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Vendor</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input
                          id="company_name"
                          value={formData.company_name}
                          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                          id="contact_person"
                          value={formData.contact_person}
                          onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        placeholder="Street Address"
                        value={formData.address.street}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="City"
                          value={formData.address.city}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                        />
                        <Input
                          placeholder="State"
                          value={formData.address.state}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                        />
                        <Input
                          placeholder="ZIP"
                          value={formData.address.zip}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="payment_terms">Payment Terms</Label>
                        <Select value={formData.payment_terms} onValueChange={(value) => setFormData({...formData, payment_terms: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Net 15">Net 15</SelectItem>
                            <SelectItem value="Net 30">Net 30</SelectItem>
                            <SelectItem value="Net 60">Net 60</SelectItem>
                            <SelectItem value="COD">Cash on Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tax_id">Tax ID</Label>
                        <Input
                          id="tax_id"
                          value={formData.tax_id}
                          onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Add Vendor</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vendor contact management functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vendor performance metrics and cost analysis will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
