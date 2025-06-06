import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerDetailViewProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetailView = ({ customer, onClose }: CustomerDetailViewProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-2xl relative">
        <Button size="icon" variant="ghost" className="absolute top-4 right-4" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {customer.name}
            <Badge>{customer.status}</Badge>
            <span className="text-xs text-gray-500">{customer.type}</span>
          </CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            {customer.company && <div>Company: {customer.company}</div>}
            <div>Email: {customer.email}</div>
            <div>Phone: {customer.phone}</div>
            <div>Address: {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zipCode}</div>
            <div>Contact: {customer.contactPerson}</div>
            <div>Credit Limit: ${customer.creditLimit.toLocaleString()}</div>
            <div>Payment Terms: {customer.paymentTerms}</div>
            <div>Last Contact: {new Date(customer.lastContact).toLocaleDateString()}</div>
            <div>Created: {new Date(customer.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(customer.updatedAt).toLocaleDateString()}</div>
            <div>Tags: {customer.tags.map(tag => <Badge key={tag} className="ml-1">{tag}</Badge>)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-semibold mb-2">Notes</div>
            <div className="text-gray-700 whitespace-pre-line">{customer.notes || '—'}</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Projects</div>
            {customer.projects.length === 0 ? (
              <div className="text-gray-500">No projects</div>
            ) : (
              <ul className="space-y-2">
                {customer.projects.map(project => (
                  <li key={project.id} className="border rounded p-2">
                    <div className="font-medium">{project.title} <Badge className="ml-2">{project.status}</Badge></div>
                    <div className="text-xs text-gray-500">Type: {project.type}</div>
                    <div className="text-xs text-gray-500">Estimated: ${project.estimatedValue.toLocaleString()}</div>
                    {project.actualValue !== undefined && <div className="text-xs text-gray-500">Actual: ${project.actualValue.toLocaleString()}</div>}
                    {project.startDate && <div className="text-xs text-gray-500">Start: {project.startDate}</div>}
                    {project.completionDate && <div className="text-xs text-gray-500">Completed: {project.completionDate}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailView; 