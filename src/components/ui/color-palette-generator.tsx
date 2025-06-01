import * as React from "react";
import { Shuffle, Copy, Download, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import styles from './ColorPaletteGenerator.module.css';

interface ColorPaletteGeneratorProps {
  className?: string;
}

interface ColorStop {
  hue: number;
  saturation: number;
  lightness: number;
  name: string;
}

export function ColorPaletteGenerator({ className }: ColorPaletteGeneratorProps) {
  const { toast } = useToast();
  const [baseHue, setBaseHue] = React.useState(220);
  const [harmony, setHarmony] = React.useState<"monochromatic" | "analogous" | "complementary" | "triadic" | "tetradic">("analogous");
  const [palette, setPalette] = React.useState<ColorStop[]>([]);

  const generatePalette = React.useCallback(() => {
    const colors: ColorStop[] = [];
    
    switch (harmony) {
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          colors.push({
            hue: baseHue,
            saturation: 70 - i * 10,
            lightness: 20 + i * 15,
            name: `Mono ${i + 1}`,
          });
        }
        break;
        
      case "analogous":
        for (let i = 0; i < 5; i++) {
          colors.push({
            hue: (baseHue + i * 30) % 360,
            saturation: 70 + (i % 2) * 20,
            lightness: 40 + i * 10,
            name: `Analog ${i + 1}`,
          });
        }
        break;
        
      case "complementary":
        colors.push(
          { hue: baseHue, saturation: 80, lightness: 50, name: "Primary" },
          { hue: (baseHue + 180) % 360, saturation: 80, lightness: 50, name: "Complement" },
          { hue: baseHue, saturation: 60, lightness: 70, name: "Light Primary" },
          { hue: (baseHue + 180) % 360, saturation: 60, lightness: 70, name: "Light Complement" },
          { hue: baseHue, saturation: 90, lightness: 30, name: "Dark Primary" }
        );
        break;
        
      case "triadic":
        for (let i = 0; i < 3; i++) {
          colors.push({
            hue: (baseHue + i * 120) % 360,
            saturation: 75,
            lightness: 50,
            name: `Triad ${i + 1}`,
          });
        }
        colors.push(
          { hue: baseHue, saturation: 50, lightness: 80, name: "Light" },
          { hue: baseHue, saturation: 90, lightness: 20, name: "Dark" }
        );
        break;
        
      case "tetradic":
        for (let i = 0; i < 4; i++) {
          colors.push({
            hue: (baseHue + i * 90) % 360,
            saturation: 70,
            lightness: 50,
            name: `Tetrad ${i + 1}`,
          });
        }
        colors.push({
          hue: baseHue,
          saturation: 30,
          lightness: 90,
          name: "Neutral",
        });
        break;
    }
    
    setPalette(colors);
  }, [baseHue, harmony]);

  React.useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  const copyColor = (color: ColorStop) => {
    const hslString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
    navigator.clipboard.writeText(hslString);
    toast({
      title: "Color Copied!",
      description: `${hslString} copied to clipboard`,
    });
  };

  const exportPalette = () => {
    const css = palette.map((color, index) => 
      `--color-${index + 1}: ${color.hue} ${color.saturation}% ${color.lightness}%;`
    ).join('\n');
    
    const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const randomizeHue = () => {
    setBaseHue(Math.floor(Math.random() * 360));
  };

  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Advanced Color Palette Generator
        </CardTitle>
        <CardDescription>
          Create beautiful, harmonious color palettes for your themes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Base Hue: {baseHue}°</Label>
              <Slider
                value={[baseHue]}
                onValueChange={([value]) => setBaseHue(value)}
                max={360}
                step={1}
                className="w-full"
              />
              <div 
                className={styles.colorPreview}
                style={{ backgroundColor: `hsl(${baseHue}, 70%, 50%)` }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color Harmony</Label>
              <div className="grid grid-cols-2 gap-2">
                {["monochromatic", "analogous", "complementary", "triadic", "tetradic"].map((type) => (
                  <Button
                    key={type}
                    variant={harmony === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHarmony(type as any)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={randomizeHue} variant="outline" size="sm" className="flex-1">
                <Shuffle className="h-4 w-4 mr-2" />
                Random
              </Button>
              <Button onClick={exportPalette} variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated Palette</Label>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {palette.length} colors
              </Badge>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  onClick={() => copyColor(color)}
                >
                  <div
                    className="aspect-square rounded-lg border-2 border-border/20 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-lg"
                    style={{ 
                      backgroundColor: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`,
                      boxShadow: `0 4px 12px hsl(${color.hue} ${color.saturation}% ${color.lightness}% / 0.3)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="h-4 w-4 text-white drop-shadow-lg" />
                  </div>
                  <div className="mt-1 text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground mb-2">CSS Variables Preview:</div>
          <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
            {palette.map((color, index) => (
              <div key={index}>
                --color-{index + 1}: {color.hue} {color.saturation}% {color.lightness}%;
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
