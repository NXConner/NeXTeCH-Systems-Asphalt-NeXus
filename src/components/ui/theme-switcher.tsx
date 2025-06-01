
import * as React from "react";
import { Check, Palette, Monitor, Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";
import { themes } from "@/themes/themeConfig";
import { cn } from "@/lib/utils";
import { AnimationPresets } from "./animation-presets";
import { TiltEffect, RippleEffect } from "./micro-interactions";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState("asphalt");
  const [isOpen, setIsOpen] = React.useState(false);

  const applyTheme = (themeName: string) => {
    const themeConfig = themes[themeName];
    if (!themeConfig) return;

    setSelectedTheme(themeName);
    
    // Create smooth transition effect
    document.documentElement.style.setProperty('transition', 'all 0.3s ease-in-out');
    
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const colors = isDark ? themeConfig.colors.dark : themeConfig.colors.light;

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Apply enhanced effects
    Object.entries(themeConfig.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Store selection
    localStorage.setItem("selected-theme", themeName);
    
    // Remove transition after animation
    setTimeout(() => {
      document.documentElement.style.removeProperty('transition');
    }, 300);
  };

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("selected-theme") || "asphalt";
    applyTheme(storedTheme);
  }, [theme]);

  const getThemePreview = (themeKey: string, config: any) => {
    const colors = theme === "dark" ? config.colors.dark : config.colors.light;
    return (
      <div className="flex gap-1">
        {[colors.primary, colors.accent, colors.secondary].map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full border border-border/30 shadow-sm transition-all duration-300 hover:scale-125"
            style={{ 
              background: `hsl(${color})`,
              boxShadow: `0 0 8px hsl(${color} / 0.3)`
            }}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative group overflow-hidden"
      >
        <Palette className="h-4 w-4 transition-transform group-hover:rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    );
  }

  return (
    <AnimationPresets preset="zoom-fade" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Advanced Theme Gallery
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose from {Object.keys(themes).length} premium themes with advanced effects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="gap-2"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                ✕
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {Object.entries(themes).map(([key, config]) => (
              <TiltEffect key={key} intensity="subtle">
                <RippleEffect>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 group relative overflow-hidden",
                      "border-2 hover:shadow-xl hover:shadow-primary/20",
                      selectedTheme === key && "ring-2 ring-primary shadow-lg shadow-primary/30 scale-105"
                    )}
                    onClick={() => applyTheme(key)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {config.category}
                        </Badge>
                        {selectedTheme === key && (
                          <div className="relative">
                            <Check className="h-4 w-4 text-primary animate-in zoom-in-50" />
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                        {config.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        {getThemePreview(key, config)}
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse delay-75" />
                          <div className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse delay-150" />
                        </div>
                      </div>
                    </CardContent>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </RippleEffect>
              </TiltEffect>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimationPresets>
  );
}
