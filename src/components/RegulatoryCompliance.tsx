import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  ExternalLink,
  Download,
  Book
} from "lucide-react";

interface Regulation {
  id: string;
  title: string;
  authority: 'Federal' | 'Virginia' | 'VDOT' | 'Industry';
  category: 'Safety' | 'Environmental' | 'Quality' | 'Training' | 'Equipment';
  description: string;
  requirements: string[];
  compliance_status: 'compliant' | 'pending' | 'non_compliant';
  last_review: string;
  next_review: string;
  documentation_url?: string;
}

interface BestPractice {
  id: string;
  title: string;
  category: string;
  description: string;
  implementation_steps: string[];
  benefits: string[];
  industry_standard: string;
}

export const RegulatoryCompliance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState<string>("");

  const [regulations] = useState<Regulation[]>([
    {
      id: '1',
      title: 'OSHA Construction Safety Standards (29 CFR 1926)',
      authority: 'Federal',
      category: 'Safety',
      description: 'Comprehensive safety standards for construction operations including personal protective equipment, hazard communication, and equipment safety.',
      requirements: [
        'Workers must wear appropriate PPE at all times',
        'Safety training required for all employees',
        'Regular safety inspections and documentation',
        'Hazard communication program implementation',
        'Emergency response procedures'
      ],
      compliance_status: 'compliant',
      last_review: '2024-01-15',
      next_review: '2024-07-15',
      documentation_url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926'
    },
    {
      id: '2',
      title: 'Virginia Environmental Protection Regulations',
      authority: 'Virginia',
      category: 'Environmental',
      description: 'State regulations governing stormwater management, air quality, and waste disposal for construction activities.',
      requirements: [
        'Stormwater pollution prevention plan (SWPPP)',
        'Air quality permits for asphalt operations',
        'Proper disposal of construction waste',
        'Spill prevention and response procedures',
        'Regular environmental monitoring'
      ],
      compliance_status: 'pending',
      last_review: '2024-01-10',
      next_review: '2024-04-10',
      documentation_url: 'https://www.deq.virginia.gov/'
    },
    {
      id: '3',
      title: 'VDOT Road and Bridge Specifications',
      authority: 'VDOT',
      category: 'Quality',
      description: 'Technical specifications for materials, construction methods, and quality control for Virginia Department of Transportation projects.',
      requirements: [
        'Material testing and certification',
        'Quality control documentation',
        'Inspector certification requirements',
        'Compliance with VDOT Standard Specifications',
        'Regular project reporting'
      ],
      compliance_status: 'compliant',
      last_review: '2024-01-20',
      next_review: '2024-06-20',
      documentation_url: 'https://www.virginiadot.org/business/bu-const-specs.asp'
    },
    {
      id: '4',
      title: 'Hot Mix Asphalt Quality Standards (AASHTO M323)',
      authority: 'Industry',
      category: 'Quality',
      description: 'Industry standards for hot mix asphalt production, testing, and placement procedures.',
      requirements: [
        'Material gradation compliance',
        'Temperature control during transport',
        'Density testing and verification',
        'Core sampling procedures',
        'Quality assurance documentation'
      ],
      compliance_status: 'compliant',
      last_review: '2024-01-05',
      next_review: '2024-07-05'
    },
    {
      id: '5',
      title: 'Commercial Driver License (CDL) Requirements',
      authority: 'Federal',
      category: 'Training',
      description: 'Federal requirements for commercial vehicle operation including licensing, medical certification, and hours of service.',
      requirements: [
        'Valid CDL for all commercial drivers',
        'Medical examiner certification',
        'Hours of service compliance',
        'Vehicle inspection requirements',
        'Driver training and qualification'
      ],
      compliance_status: 'compliant',
      last_review: '2024-01-12',
      next_review: '2024-07-12'
    }
  ]);

  const [bestPractices] = useState<BestPractice[]>([
    {
      id: '1',
      title: 'Superpave Mix Design and Quality Control',
      category: 'Quality Assurance',
      description: 'Implementation of Superpave methodology for asphalt mix design and quality control processes.',
      implementation_steps: [
        'Conduct aggregate consensus and source properties testing',
        'Perform asphalt binder testing and grading',
        'Design mix using gyratory compactor',
        'Verify volumetric properties',
        'Implement quality control testing program'
      ],
      benefits: [
        'Improved pavement performance and longevity',
        'Reduced maintenance costs',
        'Better resistance to rutting and cracking',
        'Enhanced durability in varying climates'
      ],
      industry_standard: 'AASHTO M323 / ASTM D6927'
    },
    {
      id: '2',
      title: 'Intelligent Compaction Technology',
      category: 'Construction Technology',
      description: 'Use of intelligent compaction systems for real-time monitoring and control of compaction operations.',
      implementation_steps: [
        'Equip rollers with IC technology',
        'Train operators on system use',
        'Establish target compaction criteria',
        'Monitor real-time compaction data',
        'Generate compaction maps and reports'
      ],
      benefits: [
        'Improved compaction uniformity',
        'Reduced over-compaction and segregation',
        'Real-time quality feedback',
        'Documentation for quality assurance'
      ],
      industry_standard: 'FHWA Intelligent Compaction Guidelines'
    },
    {
      id: '3',
      title: 'Warm Mix Asphalt Technologies',
      category: 'Environmental Stewardship',
      description: 'Implementation of warm mix asphalt technologies to reduce production temperatures and environmental impact.',
      implementation_steps: [
        'Select appropriate WMA technology',
        'Modify mix design procedures',
        'Adjust production temperatures',
        'Train personnel on WMA practices',
        'Monitor performance characteristics'
      ],
      benefits: [
        'Reduced fuel consumption and emissions',
        'Extended paving season capability',
        'Improved working conditions',
        'Potential for higher RAP content'
      ],
      industry_standard: 'NAPA WMA Guidelines / FHWA Technical Brief'
    }
  ]);

  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthority = !selectedAuthority || reg.authority === selectedAuthority;
    return matchesSearch && matchesAuthority;
  });

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'non_compliant': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'pending': return AlertTriangle;
      case 'non_compliant': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Regulatory Compliance & Best Practices</h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Compliance Report
        </Button>
      </div>

      <Tabs defaultValue="regulations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="regulations">Regulations & Standards</TabsTrigger>
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="training">Training Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations">
          <div className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search regulations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedAuthority}
                    onChange={(e) => setSelectedAuthority(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                    title="Authority filter select"
                  >
                    <option value="">All Authorities</option>
                    <option value="Federal">Federal</option>
                    <option value="Virginia">Virginia</option>
                    <option value="VDOT">VDOT</option>
                    <option value="Industry">Industry</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Regulations List */}
            <div className="grid gap-4">
              {filteredRegulations.map((regulation) => {
                const ComplianceIcon = getComplianceIcon(regulation.compliance_status);
                return (
                  <Card key={regulation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {regulation.title}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{regulation.authority}</Badge>
                            <Badge variant="outline">{regulation.category}</Badge>
                            <Badge className={`${getComplianceColor(regulation.compliance_status)} text-white`}>
                              <ComplianceIcon className="h-3 w-3 mr-1" />
                              {regulation.compliance_status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        {regulation.documentation_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={regulation.documentation_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{regulation.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Key Requirements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {regulation.requirements.map((req, index) => (
                              <li key={index} className="text-muted-foreground">{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span><strong>Last Review:</strong> {regulation.last_review}</span>
                          <span><strong>Next Review:</strong> {regulation.next_review}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="practices">
          <div className="grid gap-4">
            {bestPractices.map((practice) => (
              <Card key={practice.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    {practice.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">{practice.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{practice.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Implementation Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {practice.implementation_steps.map((step, index) => (
                          <li key={index} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {practice.benefits.map((benefit, index) => (
                          <li key={index} className="text-muted-foreground">{benefit}</li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        <span className="text-sm"><strong>Industry Standard:</strong> {practice.industry_standard}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Federal Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-blue-600 hover:underline">OSHA Construction Safety Training</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">FHWA Quality Assurance Programs</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">EPA Environmental Compliance</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">DOT Commercial Driver Training</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Virginia Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-blue-600 hover:underline">VDOT Contractor Certification</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Virginia DEQ Training Programs</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">VAPA Technical Seminars</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Local Government Training</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Industry Organizations</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-blue-600 hover:underline">NAPA Educational Programs</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">AASHTO Training Resources</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">AI Technical Publications</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">TRB Training Opportunities</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Certification Programs</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-blue-600 hover:underline">Nuclear Gauge Safety Training</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Superpave Mix Design</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Quality Control Technician</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Construction Inspector Certification</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
