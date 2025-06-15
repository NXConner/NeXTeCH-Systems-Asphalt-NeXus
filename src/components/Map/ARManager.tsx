import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { ArrowsExpand, Cube, Ruler, Navigation } from 'lucide-react';
import * as L from 'leaflet';
import * as THREE from 'three';

interface ARManagerProps {
  onARStatusChange?: (isActive: boolean) => void;
}

export const ARManager: React.FC<ARManagerProps> = ({
  onARStatusChange
}) => {
  const map = useMap();
  const [isARActive, setIsARActive] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurement, setMeasurement] = useState<number | null>(null);
  const [is3DView, setIs3DView] = useState(false);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Initialize Three.js scene
    const initScene = () => {
      const newScene = new THREE.Scene();
      const newCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const newRenderer = new THREE.WebGLRenderer({ antialias: true });
      newRenderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(newRenderer.domElement);

      setScene(newScene);
      setCamera(newCamera);
      setRenderer(newRenderer);

      return () => {
        document.body.removeChild(newRenderer.domElement);
      };
    };

    const cleanup = initScene();

    return () => {
      cleanup();
    };
  }, [map]);

  const handleARMode = () => {
    if (!isARActive) {
      // Request device orientation and motion permissions
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              startAR();
            }
          })
          .catch(console.error);
      } else {
        startAR();
      }
    } else {
      stopAR();
    }
  };

  const startAR = () => {
    setIsARActive(true);
    onARStatusChange?.(true);

    // Initialize AR features
    if (scene && camera && renderer) {
      // Add AR markers
      const markerGeometry = new THREE.BoxGeometry(1, 1, 1);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      scene.add(marker);

      // Start AR tracking
      const animate = () => {
        if (isARActive) {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
      };
      animate();
    }
  };

  const stopAR = () => {
    setIsARActive(false);
    onARStatusChange?.(false);

    // Clean up AR features
    if (scene) {
      scene.clear();
    }
  };

  const handleMeasurement = () => {
    if (!isMeasuring) {
      setIsMeasuring(true);
      setMeasurement(null);

      // Start measurement mode
      const startPoint = map.getCenter();
      let endPoint: L.LatLng | null = null;

      const handleClick = (e: L.LeafletMouseEvent) => {
        if (!endPoint) {
          endPoint = e.latlng;
          const distance = startPoint.distanceTo(endPoint);
          setMeasurement(distance);
          setIsMeasuring(false);
        }
      };

      map.once('click', handleClick);
    }
  };

  const handle3DView = () => {
    if (!is3DView) {
      setIs3DView(true);

      // Initialize 3D view
      if (scene && camera && renderer) {
        // Add 3D terrain
        const terrainGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        const terrainMaterial = new THREE.MeshPhongMaterial({
          color: 0x808080,
          wireframe: true
        });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        scene.add(terrain);

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1);
        scene.add(light);

        // Start 3D rendering
        const animate = () => {
          if (is3DView) {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }
        };
        animate();
      }
    } else {
      setIs3DView(false);

      // Clean up 3D view
      if (scene) {
        scene.clear();
      }
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleARMode}
          className="bg-background/80 backdrop-blur-sm"
          title={isARActive ? 'Exit AR Mode' : 'Enter AR Mode'}
        >
          <ArrowsExpand className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleMeasurement}
          className="bg-background/80 backdrop-blur-sm"
          title="Measure Distance"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handle3DView}
          className="bg-background/80 backdrop-blur-sm"
          title={is3DView ? 'Exit 3D View' : 'Enter 3D View'}
        >
          <Cube className="h-4 w-4" />
        </Button>
      </div>

      {measurement !== null && (
        <div className="mt-2 w-48 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="text-sm">
            Distance: {Math.round(measurement)} meters
          </div>
        </div>
      )}

      {isARActive && (
        <div className="mt-2 w-48 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="text-sm">
            AR Mode Active
          </div>
          <div className="text-xs text-muted-foreground">
            Point your camera at the ground
          </div>
        </div>
      )}

      {is3DView && (
        <div className="mt-2 w-48 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="text-sm">
            3D View Active
          </div>
          <div className="text-xs text-muted-foreground">
            Use mouse to rotate view
          </div>
        </div>
      )}
    </div>
  );
}; 