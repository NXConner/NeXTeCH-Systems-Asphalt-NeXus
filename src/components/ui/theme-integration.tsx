import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Palette, 
  Sparkles, 
  Zap, 
  Eye, 
  Code, 
  Play,
  Download,
  Upload,
  Shuffle
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { themes } from "@/themes/themeConfig";
import { ThemeShowcase } from "./theme-showcase";
import { ThemeSelector } from "./theme-selector";
import { ThemeSwitcher } from "./theme-switcher";
import { ColorPaletteGenerator } from "./color-palette-generator";
import { GradientText } from "./gradient-text";
import { PremiumButton } from "./premium-button";
import { AdvancedCard } from "./advanced-card";
import { ParticleSystem } from "./particle-system";
import { InteractiveBackground } from "./interactive-background";
import { cn } from "@/lib/utils";
import ThemeColorPicker from "./ThemeColorPicker";

interface ThemeIntegrationProps {
  showLivePreview?: boolean;
  enableCustomization?: boolean;
  allowExport?: boolean;
  onSidebarBgChange?: (bgClass: string) => void;
  sidebarBgClass?: string;
}

export function ThemeIntegration({ 
  showLivePreview = true,
  enableCustomization = true,
  allowExport = true,
  onSidebarBgChange,
  sidebarBgClass
}: ThemeIntegrationProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("showcase");
  const [effects, setEffects] = React.useState({
    particles: true,
    background: true,
    animations: true,
    transitions: true,
    blur: true,
    glow: true,
  });
  const [performance, setPerformance] = React.useState({
    quality: [80],
    fps: [60],
    complexity: [70],
  });
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [sidebarBg, setSidebarBg] = React.useState(sidebarBgClass || 'bg-gradient-primary');

  const exportThemeConfig = () => {
    const config = {
      theme: theme,
      effects: effects,
      performance: performance,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importThemeConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        setEffects(config.effects || effects);
        setPerformance(config.performance || performance);
      } catch (error) {
        console.error('Failed to import theme config:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative min-h-screen">
      {effects.background && (
        <InteractiveBackground 
          variant="neural" 
          density="medium" 
          speed="normal" 
        />
      )}
      
      {effects.particles && (
        <ParticleSystem 
          variant="cosmic" 
          density="sparse" 
          speed="slow" 
          connections={false}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <GradientText 
            variant="holographic" 
            animation="shimmer" 
            size="2xl" 
            weight="bold"
            className="block mb-4"
          >
            Advanced Theme Integration Hub
          </GradientText>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete theme management system with live preview, customization tools, 
            and performance optimization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="showcase" className="gap-2">
              <Eye className="h-4 w-4" />
              Showcase
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="customize" className="gap-2">
              <Settings className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="effects" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Code className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="showcase" className="space-y-6">
            {showLivePreview && <ThemeShowcase />}
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedCard variant="glass" hover glow>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Selector
                  </CardTitle>
                  <CardDescription>
                    Choose from {Object.keys(themes).length} premium themes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <ThemeSelector />
                  </div>
                </CardContent>
              </AdvancedCard>

              <AdvancedCard variant="crystalline" hover glow>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Theme Switcher
                  </CardTitle>
                  <CardDescription>
                    Advanced theme switching with effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <ThemeSwitcher />
                  </div>
                </CardContent>
              </AdvancedCard>
            </div>

            <AdvancedCard variant="holographic" hover glow pattern="circuit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Color Palette Generator
                </CardTitle>
                <CardDescription>
                  Generate custom color palettes with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPaletteGenerator />
              </CardContent>
            </AdvancedCard>
          </TabsContent>

          <TabsContent value="customize" className="space-y-6">
            {enableCustomization && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdvancedCard variant="glass" hover>
                  <CardHeader>
                    <CardTitle>Visual Effects</CardTitle>
                    <CardDescription>
                      Toggle visual effects and animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(effects).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setEffects(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </AdvancedCard>

                <AdvancedCard variant="crystalline" hover>
                  <CardHeader>
                    <CardTitle>Performance Settings</CardTitle>
                    <CardDescription>
                      Optimize performance and quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(performance).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">
                          {key}: {value[0]}%
                        </Label>
                        <Slider
                          value={value}
                          onValueChange={(newValue) =>
                            setPerformance(prev => ({ ...prev, [key]: newValue }))
                          }
                          min={0}
                          max={100}
                          step={10}
                        />
                      </div>
                    ))}
                  </CardContent>
                </AdvancedCard>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <button
                className="px-4 py-2 bg-accent text-primary rounded shadow hover:bg-accent/80 transition-all duration-200 border border-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
                onClick={() => setShowColorPicker(true)}
                aria-label="Open Theme Color Picker"
              >
                🎨 Open Color Picker
              </button>
            </div>
            {showColorPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <ThemeColorPicker onClose={() => setShowColorPicker(false)} inputTitle="Pick theme color" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="effects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['glass', 'holographic', 'neon', 'crystalline', 'plasma', 'metallic'].map((variant) => (
                <AdvancedCard 
                  key={variant}
                  variant={variant as any}
                  hover
                  glow
                  animation="shimmer"
                  className="h-32 flex items-center justify-center"
                >
                  <Badge variant="secondary" className="text-sm capitalize">
                    {variant}
                  </Badge>
                </AdvancedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            {allowExport && (
              <AdvancedCard variant="gradient" hover glow>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Export & Import
                  </CardTitle>
                  <CardDescription>
                    Save and share your theme configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <PremiumButton 
                      variant="holographic" 
                      onClick={exportThemeConfig}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Config
                    </PremiumButton>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importThemeConfig}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Import theme configuration file"
                        aria-label="Import theme configuration file"
                      />
                      <PremiumButton variant="crystalline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Import Config
                      </PremiumButton>
                    </div>
                    
                    <PremiumButton 
                      variant="gradient" 
                      onClick={() => window.location.reload()}
                      className="gap-2"
                    >
                      <Shuffle className="h-4 w-4" />
                      Random Theme
                    </PremiumButton>
                  </div>
                </CardContent>
              </AdvancedCard>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <label className="block font-semibold mb-2">Sidebar Background Style</label>
          <div className="flex gap-2">
            <button className={`px-3 py-2 rounded ${sidebarBg === 'bg-gradient-primary' ? 'ring-2 ring-primary' : ''}`} onClick={() => { setSidebarBg('bg-gradient-primary'); onSidebarBgChange?.('bg-gradient-primary'); }}>Gradient</button>
            <button className={`px-3 py-2 rounded ${sidebarBg === 'pattern-dots' ? 'ring-2 ring-primary' : ''}`} onClick={() => { setSidebarBg('pattern-dots'); onSidebarBgChange?.('pattern-dots'); }}>Pattern</button>
            <button className={`px-3 py-2 rounded ${sidebarBg === 'bg-card' ? 'ring-2 ring-primary' : ''}`} onClick={() => { setSidebarBg('bg-card'); onSidebarBgChange?.('bg-card'); }}>Solid</button>
          </div>
          <div className={`mt-4 h-12 w-full rounded ${sidebarBg}`}></div>
        </div>
      </div>
    </div>
  );
}
