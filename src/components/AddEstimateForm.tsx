
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddEstimateForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    projectType: "",
    location: "",
    squareFootage: "",
    description: "",
    estimatedCost: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding estimate:", formData);
    toast({
      title: "Estimate Created",
      description: `Estimate for ${formData.clientName} has been created.`,
    });
    setOpen(false);
    setFormData({
      clientName: "",
      projectType: "",
      location: "",
      squareFootage: "",
      description: "",
      estimatedCost: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Estimate</DialogTitle>
          <DialogDescription>
            Enter the project details to create a new estimate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g., ABC Construction"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Driveway Paving">Driveway Paving</SelectItem>
                <SelectItem value="Parking Lot">Parking Lot</SelectItem>
                <SelectItem value="Road Construction">Road Construction</SelectItem>
                <SelectItem value="Repair Work">Repair Work</SelectItem>
                <SelectItem value="Seal Coating">Seal Coating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Project Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., 123 Main Street"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="squareFootage">Square Footage</Label>
            <Input
              id="squareFootage"
              type="number"
              value={formData.squareFootage}
              onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
              placeholder="e.g., 5000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project details..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              placeholder="e.g., 25000"
              required
            />
          </div>
          <Button type="submit" className="w-full">Create Estimate</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEstimateForm;
