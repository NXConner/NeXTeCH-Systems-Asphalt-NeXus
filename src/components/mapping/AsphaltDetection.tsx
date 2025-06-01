import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Edit, 
  Download, 
  MapPin, 
  Ruler,
  Square,
  Move
} from "lucide-react";
import CrackDetectionAR from './CrackDetectionAR';

interface AsphaltArea {
  id: string;
  coordinates: Array<{x: number, y: number}>;
  area: number;
  length: number;
  width: number;
  confidence?: number;
  manuallyEdited: boolean;
  pciScore?: number;
}

interface AsphaltDetectionProps {
  onAreaSelect: (area: AsphaltArea) => void;
  showEmployeeTracking?: boolean;
  highlight?: boolean;
}

export function AsphaltDetection({ onAreaSelect, showEmployeeTracking = false, highlight = false }: AsphaltDetectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [editMode, setEditMode] = useState<'select' | 'edit' | 'draw' | 'ar-crack'>('select');
  const [detectedAreas, setDetectedAreas] = useState<AsphaltArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<AsphaltArea | null>(null);
  const [confidence, setConfidence] = useState([85]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [complianceZones, setComplianceZones] = useState<{id: string, x: number, y: number, width: number, height: number, compliant: boolean, tooltip: string}[]>([]);

  const runAutoDetection = async () => {
    setIsDetecting(true);
    try {
      // Simulate AI detection with mock data
      setTimeout(() => {
        const mockAreas: AsphaltArea[] = [
          {
            id: '1',
            coordinates: [
              {x: 100, y: 100},
              {x: 300, y: 100},
              {x: 300, y: 200},
              {x: 100, y: 200}
            ],
            area: 4000,
            length: 200,
            width: 100,
            confidence: 0.94,
            manuallyEdited: false
          },
          {
            id: '2',
            coordinates: [
              {x: 150, y: 250},
              {x: 400, y: 250},
              {x: 400, y: 350},
              {x: 150, y: 350}
            ],
            area: 2500,
            length: 250,
            width: 100,
            confidence: 0.87,
            manuallyEdited: false
          }
        ];
        setDetectedAreas(mockAreas);
        setIsDetecting(false);
        drawAreas(mockAreas);
      }, 2000);
    } catch (error) {
      console.error('Detection failed:', error);
      setIsDetecting(false);
    }
  };

  const drawAreas = useCallback((areas: AsphaltArea[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mock satellite background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines for reference
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw detected areas
    areas.forEach((area, index) => {
      ctx.beginPath();
      if (area.coordinates.length > 0) {
        ctx.moveTo(area.coordinates[0].x, area.coordinates[0].y);
        area.coordinates.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
      }

      // Fill with semi-transparent color
      const alpha = area.confidence ? area.confidence * 0.3 : 0.3;
      ctx.fillStyle = highlight ? `rgba(255, 255, 0, 0.5)` : (area.manuallyEdited ? `rgba(255, 165, 0, ${alpha})` : `rgba(0, 123, 255, ${alpha})`);
      ctx.fill();

      // Stroke outline
      ctx.strokeStyle = highlight ? '#FFD600' : (area.manuallyEdited ? '#ff9500' : '#007bff');
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw control points if selected
      if (selectedArea?.id === area.id && editMode === 'edit') {
        area.coordinates.forEach(point => {
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // Draw area label
      const centerX = area.coordinates.reduce((sum, p) => sum + p.x, 0) / area.coordinates.length;
      const centerY = area.coordinates.reduce((sum, p) => sum + p.y, 0) / area.coordinates.length;
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(`${area.area} sq ft`, centerX - 30, centerY);
    });

    // Draw employee tracking if enabled
    if (showEmployeeTracking) {
      const mockEmployees = [
        {id: '1', name: 'John Doe', x: 250, y: 150, status: 'active'},
        {id: '2', name: 'Jane Smith', x: 350, y: 300, status: 'break'}
      ];

      mockEmployees.forEach(emp => {
        ctx.fillStyle = emp.status === 'active' ? '#22c55e' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(emp.x, emp.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(emp.name, emp.x - 20, emp.y - 12);
      });
    }
  }, [selectedArea, editMode, showEmployeeTracking, highlight]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (editMode === 'draw') {
      if (!isDrawing) {
        setIsDrawing(true);
        setCurrentPath([{x, y}]);
      } else {
        setCurrentPath(prev => [...prev, {x, y}]);
      }
    } else if (editMode === 'select') {
      // Find clicked area
      const clickedArea = detectedAreas.find(area => {
        return isPointInPolygon({x, y}, area.coordinates);
      });
      
      if (clickedArea) {
        setSelectedArea(clickedArea);
        onAreaSelect(clickedArea);
      }
    }
  };

  const finishDrawing = () => {
    if (currentPath.length >= 3) {
      const area = calculatePolygonArea(currentPath);
      const bounds = getPolygonBounds(currentPath);
      
      const newArea: AsphaltArea = {
        id: `manual-${Date.now()}`,
        coordinates: currentPath,
        area: Math.round(area),
        length: Math.round(bounds.width),
        width: Math.round(bounds.height),
        manuallyEdited: true
      };
      
      setDetectedAreas(prev => [...prev, newArea]);
      setSelectedArea(newArea);
      onAreaSelect(newArea);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
    setEditMode('select');
  };

  const exportToEstimate = () => {
    if (selectedArea) {
      // This would integrate with the estimates system
      console.log('Exporting to estimate:', selectedArea);
      // Navigate to estimates with pre-filled data
    }
  };

  const isPointInPolygon = (point: {x: number, y: number}, polygon: Array<{x: number, y: number}>) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
          (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  const calculatePolygonArea = (coordinates: Array<{x: number, y: number}>) => {
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i].x * coordinates[j].y;
      area -= coordinates[j].x * coordinates[i].y;
    }
    return Math.abs(area) / 2;
  };

  const getPolygonBounds = (coordinates: Array<{x: number, y: number}>) => {
    const xs = coordinates.map(p => p.x);
    const ys = coordinates.map(p => p.y);
    return {
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys)
    };
  };

  const handleCrackDetection = (result: string) => {
    // Implementation of handleCrackDetection
  };

  const handlePCIScore = (score: number) => {
    // Implementation of handlePCIScore
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Asphalt Detection & Measurement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={runAutoDetection}
              disabled={isDetecting}
              variant={isDetecting ? "outline" : "default"}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isDetecting ? "Detecting..." : "Auto-Detect"}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant={editMode === 'select' ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode('select')}
              >
                <Move className="h-4 w-4 mr-1" />
                Select
              </Button>
              <Button 
                variant={editMode === 'edit' ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode('edit')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant={editMode === 'draw' ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode('draw')}
              >
                <Square className="h-4 w-4 mr-1" />
                Draw
              </Button>
            </div>

            {editMode === 'draw' && isDrawing && (
              <Button onClick={finishDrawing} size="sm">
                Finish Drawing
              </Button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm">Show Employee Tracking</span>
              <Switch 
                checked={showEmployeeTracking} 
                onCheckedChange={() => {}} 
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Detection Confidence: {confidence[0]}%</label>
            <Slider
              value={confidence}
              onValueChange={setConfidence}
              max={100}
              min={50}
              step={5}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Canvas */}
      <Card>
        <CardContent className="p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border rounded-lg cursor-crosshair"
            onClick={handleCanvasClick}
          />
        </CardContent>
      </Card>

      {/* Detected Areas */}
      {detectedAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Detected Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detectedAreas.map((area) => (
                <div 
                  key={area.id} 
                  className={`flex items-center justify-between p-3 border rounded cursor-pointer ${
                    selectedArea?.id === area.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedArea(area);
                    onAreaSelect(area);
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Area {area.id}</span>
                      <Badge variant={area.manuallyEdited ? "outline" : "default"}>
                        {area.manuallyEdited ? "Manual" : "Auto"}
                      </Badge>
                      {area.confidence && (
                        <Badge variant="secondary">
                          {Math.round(area.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Area: {area.area.toLocaleString()} sq ft | Length: {area.length} ft | Width: {area.width} ft
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={exportToEstimate}>
                      Export to Estimate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AR Crack Detection */}
      {editMode === 'ar-crack' && (
        <CrackDetectionAR
          onDetect={handleCrackDetection}
          onScorePCI={handlePCIScore}
          region={selectedRegion}
        />
      )}

      {/* PCI Score calculation and overlay */}
      {detectedAreas.map(area => (
        <div
          key={area.id}
          className="absolute z-20"
          style={{
            left: area.coordinates[0].x,
            top: area.coordinates[0].y,
            width: area.width,
            height: area.length,
            background: `rgba(0,255,0,${area.pciScore ? area.pciScore / 100 : 0})`,
            border: '2px solid #00FF00',
            pointerEvents: 'none',
          }}
          title={`PCI: ${area.pciScore ? Math.round(area.pciScore) : 'N/A'}`}
        />
      ))}

      {/* Compliance overlays and tooltips */}
      {complianceZones.map(zone => (
        <div
          key={zone.id}
          className="absolute z-10"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            background: zone.compliant ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)',
            filter: zone.compliant ? 'blur(2px)' : 'hue-rotate(180deg)',
            borderRadius: '8px',
            pointerEvents: 'auto',
          }}
          title={zone.tooltip}
        />
      ))}
    </div>
  );
}
