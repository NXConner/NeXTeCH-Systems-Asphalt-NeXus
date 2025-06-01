
import { useState } from "react";
import CustomersList from "@/components/customers/CustomersList";
import CustomerForm from "@/components/customers/CustomerForm";
import { Customer } from "@/types/customer";
import { toast } from "sonner";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-001",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: {
        street: "123 Main St",
        city: "Richmond",
        state: "VA",
        zipCode: "23230"
      },
      company: "Smith Construction",
      notes: "Regular customer, prefers email communication",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-27T10:30:00Z",
      status: "active",
      projects: [
        {
          id: "PROJ-001",
          title: "Parking Lot Resurfacing",
          type: "paving",
          status: "completed",
          estimatedValue: 25000,
          actualValue: 24500,
          startDate: "2024-01-20",
          completionDate: "2024-01-25"
        }
      ],
      totalValue: 24500,
      lastContact: "2024-01-25T00:00:00Z",
      type: "business",
      contactPerson: "John Smith",
      creditLimit: 50000,
      paymentTerms: "net-30",
      tags: ["regular", "construction"]
    },
    {
      id: "CUST-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 987-6543",
      address: {
        street: "456 Oak Avenue",
        city: "Norfolk",
        state: "VA",
        zipCode: "23510"
      },
      notes: "Interested in sealcoating services",
      createdAt: "2024-01-20T00:00:00Z",
      updatedAt: "2024-01-26T14:20:00Z",
      status: "prospect",
      projects: [],
      totalValue: 0,
      lastContact: "2024-01-26T14:20:00Z",
      type: "individual",
      creditLimit: 10000,
      paymentTerms: "net-15",
      tags: ["prospect", "residential"]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...customerData }
          : customer
      ));
      toast.success("Customer updated successfully");
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        company: customerData.company,
        notes: customerData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: customerData.status || 'prospect',
        projects: [],
        totalValue: 0,
        lastContact: new Date().toISOString(),
        type: customerData.type || 'individual',
        contactPerson: customerData.contactPerson,
        creditLimit: customerData.creditLimit || 5000,
        paymentTerms: customerData.paymentTerms || 'net-15',
        tags: customerData.tags || []
      };
      setCustomers(prev => [...prev, newCustomer]);
      toast.success("Customer created successfully");
    }
    
    setShowForm(false);
    setEditingCustomer(undefined);
  };

  const handleNewCustomer = () => {
    setEditingCustomer(undefined);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    // TODO: Implement customer detail view
    toast.info(`Viewing ${customer.name} - Detail view coming soon`);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomersList
        customers={customers}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onNewCustomer={handleNewCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
