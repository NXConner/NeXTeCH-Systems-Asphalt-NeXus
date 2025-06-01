
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Customer } from "@/types/customer";

const CRM = () => {
  const [customers] = useState<Customer[]>([
    {
      id: "CUST-001",
      type: "business",
      name: "ABC Construction Co.",
      email: "contact@abcconstruction.com",
      phone: "(555) 123-4567",
      address: {
        street: "123 Business Park Dr",
        city: "Richmond",
        state: "VA",
        zipCode: "23230"
      },
      company: "ABC Construction Co.",
      contactPerson: "John Smith",
      creditLimit: 50000,
      paymentTerms: "net-30",
      status: "active",
      notes: "Long-term client, excellent payment history",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-27T10:30:00Z",
      projects: [
        {
          id: "PROJ-001",
          title: "Office Complex Parking",
          type: "paving",
          status: "completed",
          estimatedValue: 35000,
          actualValue: 34500,
          startDate: "2024-01-10",
          completionDate: "2024-01-20"
        }
      ],
      totalValue: 34500,
      lastContact: "2024-01-25T00:00:00Z",
      tags: ["construction", "commercial", "regular"]
    },
    {
      id: "CUST-002",
      type: "individual",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 987-6543",
      address: {
        street: "456 Oak Avenue",
        city: "Norfolk",
        state: "VA",
        zipCode: "23510"
      },
      creditLimit: 10000,
      paymentTerms: "net-15",
      status: "prospect",
      notes: "Interested in driveway paving",
      createdAt: "2024-01-20T00:00:00Z",
      updatedAt: "2024-01-26T14:20:00Z",
      projects: [],
      totalValue: 0,
      lastContact: "2024-01-26T14:20:00Z",
      tags: ["residential", "prospect"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
            <p className="text-gray-600 mt-2">Manage your customer relationships and interactions</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customer Cards */}
        <div className="grid gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {customer.name}
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    {customer.company && (
                      <p className="text-sm text-gray-600 mt-1">{customer.company}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${customer.totalValue.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500">Total Value</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{customer.address.city}, {customer.address.state}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">
                      Last Contact: {new Date(customer.lastContact).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-gray-500">Projects: {customer.projects.length}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRM;
