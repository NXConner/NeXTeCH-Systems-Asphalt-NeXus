import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Calculator, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SealcoatingSpreadsheetApp } from './SealcoatingSpreadsheetApp';
import { PopoutCalculator } from '@/components/ui/PopoutCalculator';

export const MobileEstimateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    projectType: '',
    location: '',
    area: '',
    description: '',
    photos: [] as File[],
    urgency: 'normal'
  });
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
    toast.success(`${files.length} photo(s) added`);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData({ 
          ...formData, 
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
        });
        toast.success('Location captured');
      });
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const handleSubmit = () => {
    toast.success('Estimate created and saved to drafts');
    // Reset form
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      projectType: '',
      location: '',
      area: '',
      description: '',
      photos: [],
      urgency: 'normal'
    });
    setStep(1);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((stepNum) => (
          <div
            key={stepNum}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNum}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Phone Number *</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="client@example.com"
              />
            </div>
            <Button 
              onClick={nextStep} 
              className="w-full"
              disabled={!formData.clientName || !formData.clientPhone}
            >
              Next: Project Details
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Project Type *</Label>
              <Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driveway">Driveway</SelectItem>
                  <SelectItem value="parking-lot">Parking Lot</SelectItem>
                  <SelectItem value="road-repair">Road Repair</SelectItem>
                  <SelectItem value="sealcoating">Sealcoating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Project address"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={getCurrentLocation}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="area">Area (sq ft) *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                className="flex-1"
                disabled={!formData.projectType || !formData.location || !formData.area}
              >
                Next: Photos & Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos & Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Project Photos</Label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  id="photo-input"
                />
                <label htmlFor="photo-input">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photos ({formData.photos.length})
                    </span>
                  </Button>
                </label>
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.photos.map((photo, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        Photo {index + 1}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project scope, materials needed, special requirements..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Button variant="outline" onClick={prevStep} className="w-full">
                Back
              </Button>
              <Button onClick={handleSubmit} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Estimate
              </Button>
              <Button variant="outline" onClick={handleSubmit} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Save & Send to Client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={() => setShowSpreadsheet(v => !v)}>
          Open Sealcoating Spreadsheet
        </Button>
        <Button variant="outline" onClick={() => setShowCalculator(v => !v)}>
          Open Calculator
        </Button>
      </div>
      {showSpreadsheet && <SealcoatingSpreadsheetApp />}
      {showCalculator && <PopoutCalculator />}
    </div>
  );
};
