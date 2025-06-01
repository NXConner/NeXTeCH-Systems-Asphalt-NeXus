import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  AlertTriangle,
  Shield,
  FileCheck,
  Plus,
  Eye
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'permit' | 'certification' | 'insurance' | 'manual' | 'report';
  category: string;
  uploadDate: string;
  expiryDate?: string;
  size: string;
  status: 'active' | 'expiring' | 'expired' | 'pending';
  tags: string[];
  associatedJob?: string;
}

const DocumentManagement = () => {
  const [documents] = useState<Document[]>([
    {
      id: "doc-001",
      name: "Business License 2024",
      type: "permit",
      category: "Legal",
      uploadDate: "2024-01-15",
      expiryDate: "2024-12-31",
      size: "2.3 MB",
      status: "active",
      tags: ["business", "license", "2024"],
      associatedJob: undefined
    },
    {
      id: "doc-002",
      name: "OSHA Safety Certification",
      type: "certification",
      category: "Safety",
      uploadDate: "2024-01-10",
      expiryDate: "2024-03-15",
      size: "1.8 MB",
      status: "expiring",
      tags: ["safety", "osha", "certification"],
      associatedJob: undefined
    },
    {
      id: "doc-003",
      name: "City Mall Sealcoating Contract",
      type: "contract",
      category: "Contracts",
      uploadDate: "2024-01-25",
      expiryDate: undefined,
      size: "945 KB",
      status: "active",
      tags: ["contract", "sealcoating", "city-mall"],
      associatedJob: "job-001"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [uploadingFile, setUploadingFile] = useState(false);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'permit': return <Shield className="h-4 w-4" />;
      case 'certification': return <FileCheck className="h-4 w-4" />;
      case 'insurance': return <Shield className="h-4 w-4" />;
      case 'manual': return <FileText className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(true);
      // Simulate upload
      setTimeout(() => {
        console.log("File uploaded:", file.name);
        setUploadingFile(false);
      }, 2000);
    }
  };

  const stats = {
    total: documents.length,
    expiring: documents.filter(d => d.status === 'expiring').length,
    expired: documents.filter(d => d.status === 'expired').length,
    contracts: documents.filter(d => d.type === 'contract').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-muted-foreground mt-2">
          Centralized storage for contracts, permits, certifications, and compliance documents
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{stats.expiring}</div>
                <div className="text-sm text-muted-foreground">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.expired}</div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.contracts}</div>
                <div className="text-sm text-muted-foreground">Active Contracts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-documents" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all-documents">All Documents</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              title="Filter by document type"
              aria-label="Filter by document type"
            >
              <option value="all">All Types</option>
              <option value="contract">Contracts</option>
              <option value="permit">Permits</option>
              <option value="certification">Certifications</option>
              <option value="insurance">Insurance</option>
              <option value="manual">Manuals</option>
              <option value="report">Reports</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <TabsContent value="all-documents" className="space-y-4">
          {/* Upload Area */}
          <Card className="border-dashed border-2">
            <CardContent className="p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  title="Upload document file"
                  placeholder="Choose file(s) to upload"
                />
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? "Uploading..." : "Choose Files"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-100 rounded">
                        {getTypeIcon(document.type)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{document.name}</h3>
                          <Badge className={getStatusColor(document.status)} variant="secondary">
                            {document.status}
                          </Badge>
                          <Badge variant="outline">{document.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Category: {document.category}</div>
                          <div>Size: {document.size}</div>
                          <div>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</div>
                          {document.expiryDate && (
                            <div className={document.status === 'expiring' ? 'text-yellow-600' : ''}>
                              Expires: {new Date(document.expiryDate).toLocaleDateString()}
                            </div>
                          )}
                          {document.associatedJob && (
                            <div>Job: {document.associatedJob}</div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <div className="grid gap-4">
            {filteredDocuments.filter(d => d.status === 'expiring').map((document) => (
              <Card key={document.id} className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold">{document.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Expires on {document.expiryDate && new Date(document.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Renew</Button>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4">
            {filteredDocuments.filter(d => d.type === 'contract').map((document) => (
              <Card key={document.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{document.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.associatedJob && `Associated with: ${document.associatedJob}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Contract</Button>
                      <Button size="sm">Generate Invoice</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            {filteredDocuments.filter(d => ['permit', 'certification', 'insurance'].includes(d.type)).map((document) => (
              <Card key={document.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Shield className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">{document.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {document.type} | Status: {document.status}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(document.status)} variant="secondary">
                      {document.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
