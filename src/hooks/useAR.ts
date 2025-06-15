import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import * as THREE from 'three';

interface ARState {
  isActive: boolean;
  isMeasuring: boolean;
  measurement: number | null;
  is3DView: boolean;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
}

interface UseAROptions {
  onStateChange?: (state: ARState) => void;
}

export const useAR = ({
  onStateChange
}: UseAROptions = {}) => {
  const map = useMap();
  const [state, setState] = useState<ARState>({
    isActive: false,
    isMeasuring: false,
    measurement: null,
    is3DView: false,
    scene: null,
    camera: null,
    renderer: null
  });

  useEffect(() => {
    if (!map) return;

    // Initialize Three.js scene
    const initScene = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      setState(prev => {
        const newState = { ...prev, scene, camera, renderer };
        onStateChange?.(newState);
        return newState;
      });

      return () => {
        document.body.removeChild(renderer.domElement);
      };
    };

    const cleanup = initScene();

    return () => {
      cleanup();
    };
  }, [map, onStateChange]);

  const startAR = useCallback(() => {
    if (state.isActive) return;

    // Request device orientation and motion permissions
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            initializeAR();
          }
        })
        .catch(console.error);
    } else {
      initializeAR();
    }
  }, [state.isActive]);

  const initializeAR = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isActive: true };
      onStateChange?.(newState);

      // Initialize AR features
      if (prev.scene && prev.camera && prev.renderer) {
        // Add AR markers
        const markerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        prev.scene.add(marker);

        // Start AR tracking
        const animate = () => {
          if (newState.isActive) {
            requestAnimationFrame(animate);
            prev.renderer.render(prev.scene, prev.camera);
          }
        };
        animate();
      }

      return newState;
    });
  }, [onStateChange]);

  const stopAR = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isActive: false };
      onStateChange?.(newState);

      // Clean up AR features
      if (prev.scene) {
        prev.scene.clear();
      }

      return newState;
    });
  }, [onStateChange]);

  const startMeasurement = useCallback(() => {
    if (!map || state.isMeasuring) return;

    setState(prev => {
      const newState = { ...prev, isMeasuring: true, measurement: null };
      onStateChange?.(newState);
      return newState;
    });

    const startPoint = map.getCenter();
    let endPoint: L.LatLng | null = null;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!endPoint) {
        endPoint = e.latlng;
        const distance = startPoint.distanceTo(endPoint);
        setState(prev => {
          const newState = { ...prev, isMeasuring: false, measurement: distance };
          onStateChange?.(newState);
          return newState;
        });
      }
    };

    map.once('click', handleClick);
  }, [map, state.isMeasuring, onStateChange]);

  const start3DView = useCallback(() => {
    if (state.is3DView) return;

    setState(prev => {
      const newState = { ...prev, is3DView: true };
      onStateChange?.(newState);

      // Initialize 3D view
      if (prev.scene && prev.camera && prev.renderer) {
        // Add 3D terrain
        const terrainGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        const terrainMaterial = new THREE.MeshPhongMaterial({
          color: 0x808080,
          wireframe: true
        });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        prev.scene.add(terrain);

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1);
        prev.scene.add(light);

        // Start 3D rendering
        const animate = () => {
          if (newState.is3DView) {
            requestAnimationFrame(animate);
            prev.renderer.render(prev.scene, prev.camera);
          }
        };
        animate();
      }

      return newState;
    });
  }, [state.is3DView, onStateChange]);

  const stop3DView = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, is3DView: false };
      onStateChange?.(newState);

      // Clean up 3D view
      if (prev.scene) {
        prev.scene.clear();
      }

      return newState;
    });
  }, [onStateChange]);

  return {
    ...state,
    startAR,
    stopAR,
    startMeasurement,
    start3DView,
    stop3DView
  };
}; 