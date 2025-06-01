import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileText, Image, Camera } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  type: 'license' | 'w2' | 'manual' | 'contract';
  name: string;
  url: string;
  uploadDate: string;
  signed?: boolean;
}

interface DocumentUploadProps {
  employeeId: string;
  documents: Document[];
  onDocumentUpload: (document: Omit<Document, 'id' | 'uploadDate'>) => void;
}

export function DocumentUpload({ employeeId, documents, onDocumentUpload }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, type: Document['type']) => {
    setUploading(true);
    try {
      // Simulate file upload
      const mockUrl = URL.createObjectURL(file);
      const document: Omit<Document, 'id' | 'uploadDate'> = {
        type,
        name: file.name,
        url: mockUrl,
        signed: type === 'contract' || type === 'manual'
      };
      
      onDocumentUpload(document);
      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = (document: Document) => {
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
    toast.success(`Downloaded ${document.name}`);
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'license':
        return <Image className="h-4 w-4" />;
      case 'w2':
        return <FileText className="h-4 w-4" />;
      case 'manual':
        return <FileText className="h-4 w-4" />;
      case 'contract':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const documentsByType = {
    license: documents.filter(d => d.type === 'license'),
    w2: documents.filter(d => d.type === 'w2'),
    manual: documents.filter(d => d.type === 'manual'),
    contract: documents.filter(d => d.type === 'contract')
  };

  return (
    <div className="space-y-6">
      {/* Driver's License Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Driver's License
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="license-upload">Upload License Photo</Label>
              <Input
                id="license-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'license');
                }}
                disabled={uploading}
              />
            </div>
            <Button variant="outline" className="mt-6">
              <Camera className="h-4 w-4 mr-2" />
              Scan License
            </Button>
          </div>
          
          {documentsByType.license.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Licenses</Label>
              {documentsByType.license.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <span className="text-sm">{doc.name}</span>
                    <Badge variant="outline">License</Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Manual & Contract Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Company Manual & Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manual-upload">Company Manual/Handbook</Label>
              <Input
                id="manual-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'manual');
                }}
                disabled={uploading}
              />
            </div>
            <div>
              <Label htmlFor="contract-upload">Signed Employee Contract</Label>
              <Input
                id="contract-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'contract');
                }}
                disabled={uploading}
              />
            </div>
          </div>
          
          {(documentsByType.manual.length > 0 || documentsByType.contract.length > 0) && (
            <div className="space-y-2">
              <Label>Uploaded Documents</Label>
              {[...documentsByType.manual, ...documentsByType.contract].map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <span className="text-sm">{doc.name}</span>
                    <Badge variant={doc.signed ? "default" : "secondary"}>
                      {doc.type === 'manual' ? 'Manual' : 'Contract'}
                    </Badge>
                    {doc.signed && <Badge variant="outline" className="text-green-600">Signed</Badge>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* W-2 Forms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            W-2 Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="w2-upload">Upload W-2 Form</Label>
              <Input
                id="w2-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'w2');
                }}
                disabled={uploading}
              />
            </div>
            <Button variant="outline" className="mt-6">
              <Download className="h-4 w-4 mr-2" />
              Generate W-2
            </Button>
          </div>
          
          {documentsByType.w2.length > 0 && (
            <div className="space-y-2">
              <Label>W-2 Forms</Label>
              {documentsByType.w2.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <span className="text-sm">{doc.name}</span>
                    <Badge variant="outline">W-2</Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
