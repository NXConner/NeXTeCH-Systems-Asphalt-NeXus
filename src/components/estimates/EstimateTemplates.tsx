import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface EstimateTemplate {
  id: string;
  name: string;
  projectType: string;
  basePrice: number;
  materials: string[];
  laborHours: number;
  description: string;
}

export const EstimateTemplates = ({ onUseTemplate }: { onUseTemplate: (template: EstimateTemplate) => void }) => {
  const [templates] = useState<EstimateTemplate[]>([
    {
      id: 'tmpl-001',
      name: 'Standard Driveway Paving',
      projectType: 'Driveway',
      basePrice: 8500,
      materials: ['Asphalt', 'Base Material', 'Sealant'],
      laborHours: 16,
      description: 'Standard residential driveway paving with base preparation'
    },
    {
      id: 'tmpl-002',
      name: 'Parking Lot Construction',
      projectType: 'Parking Lot',
      basePrice: 25000,
      materials: ['Asphalt', 'Base Material', 'Line Striping', 'Drainage'],
      laborHours: 40,
      description: 'Commercial parking lot construction with drainage and striping'
    },
    {
      id: 'tmpl-003',
      name: 'Road Repair & Resurfacing',
      projectType: 'Road Repair',
      basePrice: 45000,
      materials: ['Asphalt', 'Patching Material', 'Tack Coat'],
      laborHours: 60,
      description: 'Road repair with pothole patching and surface overlay'
    },
    {
      id: 'tmpl-004',
      name: 'Sealcoating Service',
      projectType: 'Maintenance',
      basePrice: 2500,
      materials: ['Sealcoat', 'Crack Filler', 'Sand'],
      laborHours: 8,
      description: 'Protective sealcoating application with crack filling'
    }
  ]);

  const handleUseTemplate = (template: EstimateTemplate) => {
    onUseTemplate(template);
    toast.success(`Template "${template.name}" applied`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Estimate Templates</h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <Badge variant="secondary">{template.projectType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Base Price:</span>
                  <p className="text-green-600 font-semibold">${template.basePrice.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Labor Hours:</span>
                  <p>{template.laborHours} hrs</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">Materials:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.materials.map((material, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full mt-3"
                onClick={() => handleUseTemplate(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
