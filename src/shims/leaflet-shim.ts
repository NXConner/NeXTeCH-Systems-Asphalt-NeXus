export * from 'leaflet/dist/leaflet-src.js';
import L from 'leaflet/dist/leaflet-src.js';

// Re-export Leaflet as default
export default L;
// Provide named export for DomUtil (used by plugins expecting named DomUtil)
export const DomUtil = (L as any).DomUtil; 