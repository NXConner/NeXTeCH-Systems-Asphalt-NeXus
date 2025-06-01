import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EstimatesHeader from "@/components/estimates/EstimatesHeader";
import EstimatesStats from "@/components/estimates/EstimatesStats";
import EstimatesList from "@/components/estimates/EstimatesList";
import { EstimateActions } from "@/components/estimates/EstimateActions";
import { EstimateTemplates } from "@/components/estimates/EstimateTemplates";
import { EstimateAnalytics } from "@/components/estimates/EstimateAnalytics";
import { EstimateFollowUp } from "@/components/estimates/EstimateFollowUp";
import { AdvancedFilters } from "@/components/filters/AdvancedFilters";
import { ExportUtility } from "@/components/export/ExportUtility";
import { EstimateFormEnhanced } from "@/components/forms/EstimateFormEnhanced";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, FileText, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SealcoatingSpreadsheetApp } from '../components/estimates/SealcoatingSpreadsheetApp';
import { PopoutCalculator } from '../components/ui/PopoutCalculator';

const Estimates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    status: [],
    amountRange: { min: 0, max: 0 },
    projectType: [],
    searchTerm: ''
  });

  const [estimates, setEstimates] = useState([]);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleNewEstimate = () => {
    // This would open the estimate form
    toast.info("New estimate form opening...");
  };

  const handleStatusChange = (id: string, status: string) => {
    setEstimates(estimates.map(est => 
      est.id === id ? { ...est, status } : est
    ));
  };

  const handleConvertToJob = (id: string) => {
    const estimate = estimates.find(est => est.id === id);
    if (estimate) {
      // Create job object from estimate
      const jobData = {
        title: `${estimate.projectType} - ${estimate.clientName}`,
        clientName: estimate.clientName,
        projectType: estimate.projectType,
        location: estimate.location,
        estimatedCost: estimate.amount,
        priority: "Medium",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        assignedCrew: [],
        assignedVehicles: [],
        description: estimate.description
      };
      
      console.log('Converting estimate to job:', jobData);
      
      // Update estimate status to converted
      setEstimates(estimates.map(est => 
        est.id === id ? { ...est, status: "Converted" } : est
      ));
      
      toast.success(`Estimate ${id} converted to job successfully. View in Jobs page.`);
    }
  };

  const handleUseTemplate = (template: any) => {
    // In a real app, this would populate the estimate form
    console.log('Using template:', template);
    toast.success(`Template "${template.name}" applied to new estimate`);
  };

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = !searchTerm || 
      estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(estimate.status);
    const matchesProjectType = filters.projectType.length === 0 || filters.projectType.includes(estimate.projectType);
    
    const matchesAmount = (!filters.amountRange.min || estimate.amount >= filters.amountRange.min) &&
                         (!filters.amountRange.max || estimate.amount <= filters.amountRange.max);

    return matchesSearch && matchesStatus && matchesProjectType && matchesAmount;
  });

  const totalValue = estimates.reduce((sum, est) => sum + est.amount, 0);
  const pendingCount = estimates.filter(est => est.status === "Pending").length;
  const approvedCount = estimates.filter(est => est.status === "Approved").length;

  const stats = {
    total: estimates.length,
    pending: pendingCount,
    approved: approvedCount,
    totalValue: totalValue
  };

  const exportFields = [
    { key: 'id', label: 'Estimate ID' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'projectType', label: 'Project Type' },
    { key: 'location', label: 'Location' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <EstimatesHeader 
              onNewEstimate={handleNewEstimate}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  New Estimate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <EstimateFormEnhanced />
              </DialogContent>
            </Dialog>
          </div>

          <EstimatesStats stats={stats} />

          <Tabs defaultValue="estimates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="estimates">Estimates</TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="templates">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="followup">
                <Clock className="h-4 w-4 mr-2" />
                Follow-Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estimates" className="space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <AdvancedFilters
                  onFiltersChange={setFilters}
                  availableStatuses={["Pending", "Approved", "Draft", "Rejected", "Converted"]}
                  availableProjectTypes={["Parking Lot", "Road Repair", "Driveway", "Paving", "Maintenance"]}
                />
                
                <ExportUtility
                  data={filteredEstimates}
                  filename="estimates"
                  availableFields={exportFields}
                  type="estimates"
                />
              </div>

              <div className="space-y-4">
                {filteredEstimates.map((estimate) => (
                  <div key={estimate.id} className="bg-white p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold">{estimate.clientName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            estimate.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            estimate.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            estimate.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                            estimate.status === 'Converted' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {estimate.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{estimate.id} • {estimate.projectType}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Location:</span>
                            <p className="text-gray-600">{estimate.location}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <p className="text-gray-600">{estimate.date}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Expires:</span>
                            <p className="text-gray-600">{estimate.expiryDate}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{estimate.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${estimate.amount.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-500">Estimated value</p>
                        </div>
                        <EstimateActions
                          estimate={estimate}
                          onStatusChange={handleStatusChange}
                          onConvertToJob={handleConvertToJob}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <EstimateAnalytics />
            </TabsContent>

            <TabsContent value="templates">
              <EstimateTemplates onUseTemplate={handleUseTemplate} />
            </TabsContent>

            <TabsContent value="followup">
              <EstimateFollowUp />
            </TabsContent>
          </Tabs>
        </div>
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
          <button className="rounded-full bg-blue-600 text-white p-4 shadow-lg" onClick={() => setShowSpreadsheet(v => !v)} title="Sealcoating Spreadsheet">
            S
          </button>
          <button className="rounded-full bg-green-600 text-white p-4 shadow-lg" onClick={() => setShowCalculator(v => !v)} title="Calculator">
            C
          </button>
        </div>
        {showSpreadsheet && <SealcoatingSpreadsheetApp />}
        {showCalculator && <PopoutCalculator />}
      </div>
    </ErrorBoundary>
  );
};

export default Estimates;
