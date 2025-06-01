
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EstimatesHeader from "./EstimatesHeader";
import EstimatesStats from "./EstimatesStats";
import EstimatesList from "./EstimatesList";
import { EstimateForm } from "./EstimateForm";
import { Estimate } from "@/types/estimate";

export const EstimatesContainer = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: "est-001",
      title: "Main Street Resurfacing",
      client: {
        name: "City Municipality",
        email: "projects@city.gov",
        phone: "(555) 123-4567",
        address: "100 City Hall Plaza"
      },
      project: {
        type: "paving",
        description: "Complete resurfacing of Main Street",
        location: "Main Street, Downtown",
        area: 2500
      },
      materials: [],
      labor: [],
      equipment: [],
      calculations: {
        materialsCost: 15000,
        laborCost: 8000,
        equipmentCost: 5000,
        overhead: 4200,
        profit: 5600,
        totalCost: 37800
      },
      status: "pending",
      validUntil: "2024-02-28T00:00:00Z",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-27T10:30:00Z"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveEstimate = (estimate: Estimate) => {
    const existingIndex = estimates.findIndex(e => e.id === estimate.id);
    if (existingIndex >= 0) {
      const updated = [...estimates];
      updated[existingIndex] = estimate;
      setEstimates(updated);
    } else {
      setEstimates([...estimates, estimate]);
    }
    setShowForm(false);
  };

  const filteredEstimates = estimates.filter(estimate =>
    estimate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: estimates.length,
    pending: estimates.filter(e => e.status === 'pending').length,
    approved: estimates.filter(e => e.status === 'approved').length,
    totalValue: estimates.reduce((sum, e) => sum + e.calculations.totalCost, 0)
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EstimateForm 
          onSave={handleSaveEstimate}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EstimatesHeader 
        onNewEstimate={() => setShowForm(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <EstimatesStats stats={stats} />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Estimates</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EstimatesList estimates={filteredEstimates} />
        </TabsContent>

        <TabsContent value="pending">
          <EstimatesList estimates={filteredEstimates.filter(e => e.status === 'pending')} />
        </TabsContent>

        <TabsContent value="approved">
          <EstimatesList estimates={filteredEstimates.filter(e => e.status === 'approved')} />
        </TabsContent>

        <TabsContent value="draft">
          <EstimatesList estimates={filteredEstimates.filter(e => e.status === 'draft')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
