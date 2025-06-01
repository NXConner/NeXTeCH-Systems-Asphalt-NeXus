import * as React from "react";
import { Settings, Palette, Zap, Sparkles, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from './ThemeConfigurator.module.css';

interface ThemeConfiguratorProps {
  className?: string;
}

export function ThemeConfigurator({ className }: ThemeConfiguratorProps) {
  const [config, setConfig] = React.useState({
    // Color adjustments
    hue: 220,
    saturation: 100,
    lightness: 50,
    
    // Effects
    glassIntensity: 50,
    glowIntensity: 30,
    shadowDepth: 40,
    borderRadius: 12,
    
    // Animations
    animationSpeed: 300,
    enableParticles: true,
    enableGradients: true,
    enableBlur: true,
    
    // Advanced
    contrastRatio: 100,
    colorTemperature: 50,
    noiseIntensity: 5,
  });

  const [previewMode, setPreviewMode] = React.useState<"live" | "comparison">("live");

  const applyConfig = React.useCallback(() => {
    const root = document.documentElement;
    
    // Apply custom CSS variables
    root.style.setProperty('--custom-hue', config.hue.toString());
    root.style.setProperty('--custom-saturation', `${config.saturation}%`);
    root.style.setProperty('--custom-lightness', `${config.lightness}%`);
    root.style.setProperty('--glass-intensity', `${config.glassIntensity}%`);
    root.style.setProperty('--glow-intensity', `${config.glowIntensity}px`);
    root.style.setProperty('--shadow-depth', `${config.shadowDepth}px`);
    root.style.setProperty('--border-radius', `${config.borderRadius}px`);
    root.style.setProperty('--animation-speed', `${config.animationSpeed}ms`);
    root.style.setProperty('--contrast-ratio', `${config.contrastRatio}%`);
    root.style.setProperty('--color-temperature', `${config.colorTemperature}`);
    root.style.setProperty('--noise-intensity', `${config.noiseIntensity}%`);

    // Generate dynamic colors
    const primaryColor = `hsl(${config.hue}, ${config.saturation}%, ${config.lightness}%)`;
    const accentColor = `hsl(${(config.hue + 60) % 360}, ${config.saturation}%, ${config.lightness + 10}%)`;
    const secondaryColor = `hsl(${(config.hue + 120) % 360}, ${config.saturation - 20}%, ${config.lightness + 20}%)`;

    root.style.setProperty('--dynamic-primary', primaryColor);
    root.style.setProperty('--dynamic-accent', accentColor);
    root.style.setProperty('--dynamic-secondary', secondaryColor);

    // Store configuration
    localStorage.setItem('theme-configurator-config', JSON.stringify(config));
  }, [config]);

  const resetConfig = () => {
    const defaultConfig = {
      hue: 220,
      saturation: 100,
      lightness: 50,
      glassIntensity: 50,
      glowIntensity: 30,
      shadowDepth: 40,
      borderRadius: 12,
      animationSpeed: 300,
      enableParticles: true,
      enableGradients: true,
      enableBlur: true,
      contrastRatio: 100,
      colorTemperature: 50,
      noiseIntensity: 5,
    };
    setConfig(defaultConfig);
  };

  React.useEffect(() => {
    const savedConfig = localStorage.getItem('theme-configurator-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.warn('Failed to parse saved theme config');
      }
    }
  }, []);

  React.useEffect(() => {
    if (previewMode === "live") {
      applyConfig();
    }
  }, [config, previewMode, applyConfig]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className={cn("relative group", className)}>
          <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Advanced Theme Configurator
          </SheetTitle>
          <SheetDescription>
            Customize every aspect of your theme with real-time preview
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="preview-mode">Preview Mode</Label>
              <Badge variant={previewMode === "live" ? "default" : "secondary"}>
                {previewMode}
              </Badge>
            </div>
            <Select value={previewMode} onValueChange={(value: "live" | "comparison") => setPreviewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="comparison">Compare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="colors" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="animation">Motion</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Palette
                  </CardTitle>
                  <CardDescription>Adjust the primary color characteristics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hue: {config.hue}°</Label>
                    <Slider
                      value={[config.hue]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, hue: value }))}
                      max={360}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Saturation: {config.saturation}%</Label>
                    <Slider
                      value={[config.saturation]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, saturation: value }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Lightness: {config.lightness}%</Label>
                    <Slider
                      value={[config.lightness]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, lightness: value }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className={styles.colorPreview} style={{ backgroundColor: `hsl(${config.hue}, ${config.saturation}%, ${config.lightness}%)` }} />
                    <div className={styles.colorPreview} style={{ backgroundColor: `hsl(${(config.hue + 60) % 360}, ${config.saturation}%, ${config.lightness + 10}%)` }} />
                    <div className={styles.colorPreview} style={{ backgroundColor: `hsl(${(config.hue + 120) % 360}, ${config.saturation - 20}%, ${config.lightness + 20}%)` }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Visual Effects
                  </CardTitle>
                  <CardDescription>Control glass morphism, glows, and shadows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Glass Intensity: {config.glassIntensity}%</Label>
                    <Slider
                      value={[config.glassIntensity]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, glassIntensity: value }))}
                      max={100}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Glow Intensity: {config.glowIntensity}px</Label>
                    <Slider
                      value={[config.glowIntensity]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, glowIntensity: value }))}
                      max={100}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Shadow Depth: {config.shadowDepth}px</Label>
                    <Slider
                      value={[config.shadowDepth]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, shadowDepth: value }))}
                      max={100}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Radius: {config.borderRadius}px</Label>
                    <Slider
                      value={[config.borderRadius]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, borderRadius: value }))}
                      max={50}
                      step={1}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-gradients">Gradients</Label>
                      <Switch
                        id="enable-gradients"
                        checked={config.enableGradients}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableGradients: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-blur">Blur Effects</Label>
                      <Switch
                        id="enable-blur"
                        checked={config.enableBlur}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableBlur: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Animation & Motion</CardTitle>
                  <CardDescription>Control timing and motion effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Animation Speed: {config.animationSpeed}ms</Label>
                    <Slider
                      value={[config.animationSpeed]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, animationSpeed: value }))}
                      min={100}
                      max={1000}
                      step={50}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-particles">Particle Effects</Label>
                    <Switch
                      id="enable-particles"
                      checked={config.enableParticles}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableParticles: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Advanced Settings</CardTitle>
                  <CardDescription>Fine-tune contrast, temperature, and noise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contrast Ratio: {config.contrastRatio}%</Label>
                    <Slider
                      value={[config.contrastRatio]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, contrastRatio: value }))}
                      min={50}
                      max={150}
                      step={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Color Temperature: {config.colorTemperature}</Label>
                    <Slider
                      value={[config.colorTemperature]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, colorTemperature: value }))}
                      max={100}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Noise Intensity: {config.noiseIntensity}%</Label>
                    <Slider
                      value={[config.noiseIntensity]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, noiseIntensity: value }))}
                      max={20}
                      step={1}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={applyConfig} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
            <Button variant="outline" onClick={resetConfig}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
