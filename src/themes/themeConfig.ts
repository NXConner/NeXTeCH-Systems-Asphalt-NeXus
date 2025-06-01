export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  // Enhanced color variants
  primaryVariant: string;
  secondaryVariant: string;
  accentVariant: string;
  surface: string;
  surfaceVariant: string;
  outline: string;
  outlineVariant: string;
  // Advanced color system
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  errorContainer: string;
  onErrorContainer: string;
  surfaceTint: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  // Semantic colors
  info: string;
  infoForeground: string;
  neutral: string;
  neutralVariant: string;
}

export interface ThemeConfig {
  name: string;
  category: "Professional" | "Modern" | "Vibrant" | "Nature" | "Premium" | "Creative" | "Futuristic" | "Elegant";
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    rainbow: string;
    sunset: string;
    aurora: string;
    cosmic: string;
    ocean: string;
    forest: string;
    fire: string;
    ice: string;
    neon: string;
    metallic: string;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    colored: string;
    glow: string;
    glowLg: string;
    glowXl: string;
    inner: string;
    insetGlow: string;
    neumorphic: string;
    elevation: string;
  };
  blur: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  effects: {
    glassMorphism: string;
    neuMorphism: string;
    holographic: string;
    crystalline: string;
    metallic: string;
    neon: string;
    plasma: string;
    aurora: string;
    prism: string;
    liquid: string;
  };
  patterns: {
    dots: string;
    grid: string;
    diagonal: string;
    hexagon: string;
    circuit: string;
    wave: string;
    noise: string;
    fabric: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      smooth: string;
      bounce: string;
      elastic: string;
    };
  };
}

export const themes: Record<string, ThemeConfig> = {
  asphalt: {
    name: "Asphalt Professional",
    category: "Professional",
    colors: {
      light: {
        primary: "210 100% 6%",
        primaryForeground: "0 0% 98%",
        secondary: "210 40% 96.1%",
        secondaryForeground: "222.2 47.4% 11.2%",
        accent: "210 40% 94%",
        accentForeground: "222.2 47.4% 11.2%",
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        card: "0 0% 100%",
        cardForeground: "222.2 84% 4.9%",
        muted: "210 40% 96.1%",
        mutedForeground: "215.4 16.3% 46.9%",
        border: "214.3 31.8% 91.4%",
        input: "214.3 31.8% 91.4%",
        ring: "210 100% 6%",
        destructive: "0 84.2% 60.2%",
        destructiveForeground: "210 40% 98%",
        success: "142 76% 36%",
        successForeground: "355.7 100% 97.3%",
        warning: "38 92% 50%",
        warningForeground: "48 96% 89%",
        primaryVariant: "210 100% 12%",
        secondaryVariant: "210 40% 92%",
        accentVariant: "210 40% 88%",
        surface: "210 40% 98%",
        surfaceVariant: "210 40% 95%",
        outline: "214.3 31.8% 85%",
        outlineVariant: "214.3 31.8% 88%",
        primaryContainer: "210 100% 20%",
        onPrimaryContainer: "210 40% 98%",
        secondaryContainer: "210 40% 88%",
        onSecondaryContainer: "210 100% 6%",
        tertiaryContainer: "260 40% 88%",
        onTertiaryContainer: "260 100% 6%",
        errorContainer: "0 84% 88%",
        onErrorContainer: "0 84% 20%",
        surfaceTint: "210 100% 6%",
        inverseSurface: "222.2 84% 4.9%",
        inverseOnSurface: "210 40% 98%",
        inversePrimary: "210 40% 98%",
        info: "200 100% 50%",
        infoForeground: "0 0% 98%",
        neutral: "210 16% 50%",
        neutralVariant: "210 16% 65%",
      },
      dark: {
        primary: "210 40% 98%",
        primaryForeground: "222.2 47.4% 11.2%",
        secondary: "217.2 32.6% 17.5%",
        secondaryForeground: "210 40% 98%",
        accent: "217.2 32.6% 17.5%",
        accentForeground: "210 40% 98%",
        background: "222.2 84% 4.9%",
        foreground: "210 40% 98%",
        card: "222.2 84% 4.9%",
        cardForeground: "210 40% 98%",
        muted: "217.2 32.6% 17.5%",
        mutedForeground: "215 20.2% 65.1%",
        border: "217.2 32.6% 17.5%",
        input: "217.2 32.6% 17.5%",
        ring: "212.7 26.8% 83.9%",
        destructive: "0 62.8% 30.6%",
        destructiveForeground: "210 40% 98%",
        success: "142 76% 36%",
        successForeground: "355.7 100% 97.3%",
        warning: "38 92% 50%",
        warningForeground: "48 96% 89%",
        primaryVariant: "210 40% 88%",
        secondaryVariant: "217.2 32.6% 22%",
        accentVariant: "217.2 32.6% 25%",
        surface: "222.2 84% 7%",
        surfaceVariant: "217.2 32.6% 12%",
        outline: "217.2 32.6% 25%",
        outlineVariant: "217.2 32.6% 20%",
        primaryContainer: "210 100% 15%",
        onPrimaryContainer: "210 40% 98%",
        secondaryContainer: "217.2 32.6% 25%",
        onSecondaryContainer: "210 40% 98%",
        tertiaryContainer: "260 32.6% 25%",
        onTertiaryContainer: "260 40% 98%",
        errorContainer: "0 62.8% 25%",
        onErrorContainer: "0 84% 95%",
        surfaceTint: "210 40% 98%",
        inverseSurface: "210 40% 98%",
        inverseOnSurface: "222.2 84% 4.9%",
        inversePrimary: "210 100% 6%",
        info: "200 100% 65%",
        infoForeground: "222.2 84% 4.9%",
        neutral: "210 16% 65%",
        neutralVariant: "210 16% 50%",
      },
    },
    gradients: {
      primary: "linear-gradient(135deg, hsl(210 100% 6%) 0%, hsl(220 91% 15%) 50%, hsl(210 100% 8%) 100%)",
      secondary: "linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(220 13% 91%) 50%, hsl(210 40% 94%) 100%)",
      accent: "linear-gradient(135deg, hsl(210 40% 94%) 0%, hsl(214 31% 91%) 50%, hsl(210 40% 92%) 100%)",
      background: "linear-gradient(160deg, hsl(0 0% 100%) 0%, hsl(210 40% 99%) 100%)",
      surface: "linear-gradient(45deg, hsl(210 40% 98%) 0%, hsl(210 40% 96%) 100%)",
      rainbow: "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8)",
      sunset: "linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #ff9ff3 50%, #54a0ff 75%, #5f27cd 100%)",
      aurora: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 25%, #00d2ff 50%, #3a7bd5 75%, #00d2ff 100%)",
      cosmic: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      ocean: "linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0082c8 50%, #667db6 75%, #0082c8 100%)",
      forest: "linear-gradient(135deg, #134e5e 0%, #71b280 25%, #134e5e 50%, #71b280 75%, #134e5e 100%)",
      fire: "linear-gradient(135deg, #f12711 0%, #f5af19 25%, #f12711 50%, #f5af19 75%, #f12711 100%)",
      ice: "linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #a8edea 50%, #fed6e3 75%, #a8edea 100%)",
      neon: "linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #ff0080 75%, #ff8c00 100%)",
      metallic: "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 25%, #bdc3c7 50%, #2c3e50 75%, #bdc3c7 100%)",
    },
    shadows: {
      xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "3xl": "0 35px 60px -12px rgb(0 0 0 / 0.35)",
      colored: "0 8px 25px -8px hsl(210 100% 6% / 0.3)",
      glow: "0 0 20px hsl(210 100% 6% / 0.15), 0 0 40px hsl(210 100% 6% / 0.1)",
      glowLg: "0 0 30px hsl(210 100% 6% / 0.2), 0 0 60px hsl(210 100% 6% / 0.15)",
      glowXl: "0 0 40px hsl(210 100% 6% / 0.25), 0 0 80px hsl(210 100% 6% / 0.2)",
      inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      insetGlow: "inset 0 0 20px hsl(210 100% 6% / 0.1)",
      neumorphic: "8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff",
      elevation: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    },
    blur: {
      xs: "blur(2px)",
      sm: "blur(4px)",
      md: "blur(8px)",
      lg: "blur(16px)",
      xl: "blur(24px)",
      "2xl": "blur(40px)",
      "3xl": "blur(64px)",
    },
    effects: {
      glassMorphism: "backdrop-blur-md bg-white/10 border border-white/20",
      neuMorphism: "bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.15)]",
      holographic: "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.1) contrast(1.1) saturate(1.3)",
      metallic: "background: linear-gradient(145deg, #e6e6e6, #ffffff); box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
      neon: "box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor",
      plasma: "background: radial-gradient(circle at 50% 50%, rgba(255,0,150,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,255,150,0.5) 0%, transparent 50%)",
      aurora: "background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(0,255,255,0.1) 50%, transparent 70%)",
      prism: "background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080) background-size-400 animate-gradient",
      liquid: "background: radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 40%, #f093fb 0%, transparent 50%)",
    },
    patterns: {
      dots: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
      grid: "linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)",
      diagonal: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
      hexagon: "radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 21%, rgba(0,0,0,0.05) 25%, transparent 26%)",
      circuit: "linear-gradient(90deg, rgba(0,255,0,0.1) 50%, transparent 50%), linear-gradient(rgba(0,255,0,0.1) 50%, transparent 50%)",
      wave: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,100,255,0.1) 10px, rgba(0,100,255,0.1) 20px)",
      noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      fabric: "repeating-linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 2px, transparent 2px, transparent 6px)",
    },
    animations: {
      duration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      easing: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  quantum: {
    name: "Quantum Nexus",
    category: "Futuristic",
    colors: {
      light: {
        primary: "280 100% 60%",
        primaryForeground: "0 0% 100%",
        secondary: "200 100% 85%",
        secondaryForeground: "280 100% 10%",
        accent: "320 100% 70%",
        accentForeground: "0 0% 100%",
        background: "220 30% 98%",
        foreground: "280 50% 5%",
        card: "220 30% 100%",
        cardForeground: "280 50% 5%",
        muted: "200 30% 95%",
        mutedForeground: "280 20% 40%",
        border: "200 30% 88%",
        input: "200 30% 88%",
        ring: "280 100% 60%",
        destructive: "0 84.2% 60.2%",
        destructiveForeground: "0 0% 98%",
        success: "142 76% 36%",
        successForeground: "0 0% 98%",
        warning: "38 92% 50%",
        warningForeground: "0 0% 98%",
        primaryVariant: "280 100% 70%",
        secondaryVariant: "200 100% 90%",
        accentVariant: "320 100% 80%",
        surface: "220 30% 99%",
        surfaceVariant: "200 30% 96%",
        outline: "200 30% 82%",
        outlineVariant: "200 30% 85%",
        primaryContainer: "280 100% 85%",
        onPrimaryContainer: "280 100% 15%",
        secondaryContainer: "200 100% 92%",
        onSecondaryContainer: "200 100% 15%",
        tertiaryContainer: "320 100% 90%",
        onTertiaryContainer: "320 100% 15%",
        errorContainer: "0 84% 92%",
        onErrorContainer: "0 84% 15%",
        surfaceTint: "280 100% 60%",
        inverseSurface: "280 50% 5%",
        inverseOnSurface: "220 30% 98%",
        inversePrimary: "280 100% 80%",
        info: "240 100% 65%",
        infoForeground: "0 0% 98%",
        neutral: "240 20% 50%",
        neutralVariant: "240 20% 65%",
      },
      dark: {
        primary: "280 100% 70%",
        primaryForeground: "280 50% 5%",
        secondary: "200 50% 25%",
        secondaryForeground: "200 100% 95%",
        accent: "320 100% 75%",
        accentForeground: "320 50% 5%",
        background: "280 50% 3%",
        foreground: "280 30% 95%",
        card: "280 50% 4%",
        cardForeground: "280 30% 95%",
        muted: "280 30% 15%",
        mutedForeground: "280 20% 70%",
        border: "280 30% 18%",
        input: "280 30% 18%",
        ring: "280 100% 70%",
        destructive: "0 62.8% 45%",
        destructiveForeground: "0 0% 98%",
        success: "142 76% 45%",
        successForeground: "0 0% 98%",
        warning: "38 92% 60%",
        warningForeground: "0 0% 98%",
        primaryVariant: "280 100% 80%",
        secondaryVariant: "200 50% 30%",
        accentVariant: "320 100% 85%",
        surface: "280 50% 6%",
        surfaceVariant: "280 30% 12%",
        outline: "280 30% 25%",
        outlineVariant: "280 30% 20%",
        primaryContainer: "280 100% 20%",
        onPrimaryContainer: "280 100% 90%",
        secondaryContainer: "200 50% 20%",
        onSecondaryContainer: "200 100% 90%",
        tertiaryContainer: "320 100% 20%",
        onTertiaryContainer: "320 100% 90%",
        errorContainer: "0 62.8% 20%",
        onErrorContainer: "0 84% 90%",
        surfaceTint: "280 100% 70%",
        inverseSurface: "280 30% 95%",
        inverseOnSurface: "280 50% 3%",
        inversePrimary: "280 100% 20%",
        info: "240 100% 75%",
        infoForeground: "280 50% 3%",
        neutral: "240 20% 70%",
        neutralVariant: "240 20% 50%",
      },
    },
    gradients: {
      primary: "linear-gradient(135deg, hsl(280 100% 60%) 0%, hsl(320 100% 70%) 50%, hsl(240 100% 80%) 100%)",
      secondary: "linear-gradient(135deg, hsl(200 100% 85%) 0%, hsl(220 100% 90%) 50%, hsl(180 100% 85%) 100%)",
      accent: "linear-gradient(135deg, hsl(320 100% 70%) 0%, hsl(280 100% 80%) 50%, hsl(340 100% 75%) 100%)",
      background: "linear-gradient(160deg, hsl(280 50% 3%) 0%, hsl(240 50% 5%) 100%)",
      surface: "linear-gradient(45deg, hsl(280 50% 6%) 0%, hsl(280 30% 15%) 100%)",
      rainbow: "linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff, #00ffff, #ffff00)",
      sunset: "linear-gradient(135deg, #ff00ff 0%, #ff0080 25%, #ff8000 50%, #ffff00 75%, #00ff80 100%)",
      aurora: "linear-gradient(135deg, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ffff 75%, #00ff80 100%)",
      cosmic: "linear-gradient(135deg, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ffff 75%, #80ff00 100%)",
      ocean: "linear-gradient(135deg, #00ffff 0%, #0080ff 25%, #8000ff 50%, #ff00ff 75%, #ff0080 100%)",
      forest: "linear-gradient(135deg, #00ff80 0%, #80ff00 25%, #ffff00 50%, #ff8000 75%, #ff0080 100%)",
      fire: "linear-gradient(135deg, #ff0080 0%, #ff00ff 25%, #8000ff 50%, #0080ff 75%, #00ffff 100%)",
      ice: "linear-gradient(135deg, #00ffff 0%, #80ff00 25%, #ffff00 50%, #ff8000 75%, #ff0080 100%)",
      neon: "linear-gradient(135deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff00ff 75%, #00ffff 100%)",
      metallic: "linear-gradient(135deg, #c0c0c0 0%, #808080 25%, #c0c0c0 50%, #808080 75%, #c0c0c0 100%)",
    },
    shadows: {
      xs: "0 1px 2px 0 rgb(255 0 255 / 0.1)",
      sm: "0 1px 3px 0 rgb(255 0 255 / 0.15), 0 1px 2px -1px rgb(255 0 255 / 0.15)",
      md: "0 4px 6px -1px rgb(255 0 255 / 0.15), 0 2px 4px -2px rgb(255 0 255 / 0.15)",
      lg: "0 10px 15px -3px rgb(255 0 255 / 0.15), 0 4px 6px -4px rgb(255 0 255 / 0.15)",
      xl: "0 20px 25px -5px rgb(255 0 255 / 0.15), 0 8px 10px -6px rgb(255 0 255 / 0.15)",
      "2xl": "0 25px 50px -12px rgb(255 0 255 / 0.3)",
      "3xl": "0 35px 60px -12px rgb(255 0 255 / 0.4)",
      colored: "0 8px 25px -8px hsl(300 100% 50% / 0.5)",
      glow: "0 0 20px hsl(300 100% 50% / 0.4), 0 0 40px hsl(180 100% 50% / 0.3)",
      glowLg: "0 0 30px hsl(300 100% 50% / 0.5), 0 0 60px hsl(180 100% 50% / 0.4)",
      glowXl: "0 0 40px hsl(300 100% 50% / 0.6), 0 0 80px hsl(180 100% 50% / 0.5)",
      inner: "inset 0 2px 4px 0 rgb(255 0 255 / 0.15)",
      insetGlow: "inset 0 0 20px hsl(300 100% 50% / 0.3)",
      neumorphic: "15px 15px 30px rgba(255, 0, 255, 0.1), -15px -15px 30px rgba(255, 255, 255, 0.7)",
      elevation: "0 1px 3px rgba(255,0,255,0.15), 0 1px 2px rgba(0,255,255,0.25)",
    },
    blur: {
      xs: "blur(2px)",
      sm: "blur(4px)",
      md: "blur(8px)",
      lg: "blur(16px)",
      xl: "blur(24px)",
      "2xl": "blur(40px)",
      "3xl": "blur(64px)",
    },
    effects: {
      glassMorphism: "backdrop-blur-xl bg-fuchsia-500/5 border border-fuchsia-400/20",
      neuMorphism: "bg-gradient-to-br from-fuchsia-900 to-cyan-900 shadow-[inset_-6px_-6px_12px_rgba(255,0,255,0.2),inset_6px_6px_12px_rgba(0,255,255,0.2)]",
      holographic: "background: linear-gradient(60deg, #ff00ff, #00ffff, #ffff00, #ff00ff) background-size-400 animate-gradient",
      crystalline: "backdrop-filter: blur(20px) brightness(1.3) contrast(1.3) saturate(2) hue-rotate(90deg)",
      metallic: "background: linear-gradient(145deg, #ff00ff, #00ffff); box-shadow: 30px 30px 60px #cc00cc, -30px -30px 60px #ff33ff",
      neon: "box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 120px #ff00ff",
      plasma: "background: radial-gradient(circle at 40% 60%, rgba(255,0,255,0.8) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(0,255,255,0.8) 0%, transparent 50%)",
      aurora: "background: linear-gradient(60deg, transparent 10%, rgba(255,0,255,0.3) 30%, transparent 50%), linear-gradient(-60deg, transparent 10%, rgba(0,255,255,0.3) 30%, transparent 50%)",
      prism: "background: linear-gradient(45deg, #ff00ff, #ff0080, #ff8000, #ffff00, #80ff00, #00ff80, #00ffff, #0080ff)",
      liquid: "background: radial-gradient(circle at 25% 75%, #ff00ff 0%, transparent 60%), radial-gradient(circle at 75% 25%, #00ffff 0%, transparent 60%), radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 40%)",
    },
    patterns: {
      dots: "radial-gradient(circle, rgba(255,0,255,0.3) 1px, transparent 1px)",
      grid: "linear-gradient(255,0,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.15) 1px, transparent 1px)",
      diagonal: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,0,255,0.15) 6px, rgba(255,0,255,0.15) 12px)",
      hexagon: "radial-gradient(circle at 50% 50%, transparent 15%, rgba(255,0,255,0.2) 16%, rgba(255,0,255,0.2) 20%, transparent 21%)",
      circuit: "linear-gradient(90deg, rgba(255,0,255,0.3) 50%, transparent 50%), linear-gradient(rgba(0,255,255,0.3) 50%, transparent 50%)",
      wave: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,0,0.2) 6px, rgba(255,255,0,0.2) 12px)",
      noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cyberpunkNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cyberpunkNoise)' opacity='0.12'/%3E%3C/svg%3E\")",
      fabric: "repeating-linear-gradient(30deg, rgba(255,0,255,0.05), rgba(255,0,255,0.05) 2px, transparent 2px, transparent 8px)",
    },
    animations: {
      duration: {
        fast: "100ms",
        normal: "200ms",
        slow: "350ms",
      },
      easing: {
        smooth: "cubic-bezier(0.23, 1, 0.32, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  cyberpunk: {
    name: "Cyberpunk Neon",
    category: "Creative",
    colors: {
      light: {
        primary: "300 100% 50%",
        primaryForeground: "0 0% 100%",
        secondary: "180 100% 50%",
        secondaryForeground: "300 100% 10%",
        accent: "60 100% 50%",
        accentForeground: "0 0% 0%",
        background: "240 10% 95%",
        foreground: "300 50% 5%",
        card: "240 10% 98%",
        cardForeground: "300 50% 5%",
        muted: "240 10% 90%",
        mutedForeground: "300 20% 40%",
        border: "240 10% 85%",
        input: "240 10% 85%",
        ring: "300 100% 50%",
        destructive: "0 84.2% 60.2%",
        destructiveForeground: "0 0% 98%",
        success: "142 76% 36%",
        successForeground: "0 0% 98%",
        warning: "38 92% 50%",
        warningForeground: "0 0% 98%",
        primaryVariant: "300 100% 60%",
        secondaryVariant: "180 100% 60%",
        accentVariant: "60 100% 60%",
        surface: "240 10% 97%",
        surfaceVariant: "240 10% 92%",
        outline: "240 10% 80%",
        outlineVariant: "240 10% 83%",
        primaryContainer: "300 100% 80%",
        onPrimaryContainer: "300 100% 10%",
        secondaryContainer: "180 100% 80%",
        onSecondaryContainer: "180 100% 10%",
        tertiaryContainer: "60 100% 80%",
        onTertiaryContainer: "60 100% 10%",
        errorContainer: "0 84% 90%",
        onErrorContainer: "0 84% 10%",
        surfaceTint: "300 100% 50%",
        inverseSurface: "300 50% 5%",
        inverseOnSurface: "240 10% 95%",
        inversePrimary: "300 100% 70%",
        info: "210 100% 60%",
        infoForeground: "0 0% 98%",
        neutral: "240 10% 50%",
        neutralVariant: "240 10% 65%",
      },
      dark: {
        primary: "300 100% 60%",
        primaryForeground: "300 50% 5%",
        secondary: "180 100% 60%",
        secondaryForeground: "180 50% 5%",
        accent: "60 100% 60%",
        accentForeground: "60 50% 5%",
        background: "300 50% 2%",
        foreground: "300 30% 90%",
        card: "300 50% 3%",
        cardForeground: "300 30% 90%",
        muted: "300 30% 10%",
        mutedForeground: "300 20% 65%",
        border: "300 30% 15%",
        input: "300 30% 15%",
        ring: "300 100% 60%",
        destructive: "0 62.8% 50%",
        destructiveForeground: "0 0% 98%",
        success: "142 76% 50%",
        successForeground: "0 0% 98%",
        warning: "38 92% 65%",
        warningForeground: "0 0% 98%",
        primaryVariant: "300 100% 70%",
        secondaryVariant: "180 100% 70%",
        accentVariant: "60 100% 70%",
        surface: "300 50% 4%",
        surfaceVariant: "300 30% 8%",
        outline: "300 30% 20%",
        outlineVariant: "300 30% 18%",
        primaryContainer: "300 100% 15%",
        onPrimaryContainer: "300 100% 85%",
        secondaryContainer: "180 100% 15%",
        onSecondaryContainer: "180 100% 85%",
        tertiaryContainer: "60 100% 15%",
        onTertiaryContainer: "60 100% 85%",
        errorContainer: "0 62.8% 15%",
        onErrorContainer: "0 84% 85%",
        surfaceTint: "300 100% 60%",
        inverseSurface: "300 30% 90%",
        inverseOnSurface: "300 50% 2%",
        inversePrimary: "300 100% 20%",
        info: "210 100% 70%",
        infoForeground: "300 50% 2%",
        neutral: "240 10% 65%",
        neutralVariant: "240 10% 50%",
      },
    },
    gradients: {
      primary: "linear-gradient(135deg, hsl(300 100% 50%) 0%, hsl(180 100% 50%) 50%, hsl(60 100% 50%) 100%)",
      secondary: "linear-gradient(135deg, hsl(180 100% 50%) 0%, hsl(300 100% 50%) 50%, hsl(0 100% 50%) 100%)",
      accent: "linear-gradient(135deg, hsl(60 100% 50%) 0%, hsl(120 100% 50%) 50%, hsl(240 100% 50%) 100%)",
      background: "linear-gradient(160deg, hsl(300 50% 2%) 0%, hsl(180 50% 3%) 100%)",
      surface: "linear-gradient(45deg, hsl(300 50% 4%) 0%, hsl(300 30% 10%) 100%)",
      rainbow: "linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff, #00ffff, #ffff00)",
      sunset: "linear-gradient(135deg, #ff00ff 0%, #ff0080 25%, #ff8000 50%, #ffff00 75%, #00ff80 100%)",
      aurora: "linear-gradient(135deg, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ffff 75%, #00ff80 100%)",
      cosmic: "linear-gradient(135deg, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ffff 75%, #80ff00 100%)",
      ocean: "linear-gradient(135deg, #00ffff 0%, #0080ff 25%, #8000ff 50%, #ff00ff 75%, #ff0080 100%)",
      forest: "linear-gradient(135deg, #00ff80 0%, #80ff00 25%, #ffff00 50%, #ff8000 75%, #ff0080 100%)",
      fire: "linear-gradient(135deg, #ff0080 0%, #ff00ff 25%, #8000ff 50%, #0080ff 75%, #00ffff 100%)",
      ice: "linear-gradient(135deg, #00ffff 0%, #80ff00 25%, #ffff00 50%, #ff8000 75%, #ff0080 100%)",
      neon: "linear-gradient(135deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff00ff 75%, #00ffff 100%)",
      metallic: "linear-gradient(135deg, #c0c0c0 0%, #808080 25%, #c0c0c0 50%, #808080 75%, #c0c0c0 100%)",
    },
    shadows: {
      xs: "0 1px 2px 0 rgb(255 0 255 / 0.1)",
      sm: "0 1px 3px 0 rgb(255 0 255 / 0.15), 0 1px 2px -1px rgb(255 0 255 / 0.15)",
      md: "0 4px 6px -1px rgb(255 0 255 / 0.15), 0 2px 4px -2px rgb(255 0 255 / 0.15)",
      lg: "0 10px 15px -3px rgb(255 0 255 / 0.15), 0 4px 6px -4px rgb(255 0 255 / 0.15)",
      xl: "0 20px 25px -5px rgb(255 0 255 / 0.15), 0 8px 10px -6px rgb(255 0 255 / 0.15)",
      "2xl": "0 25px 50px -12px rgb(255 0 255 / 0.3)",
      "3xl": "0 35px 60px -12px rgb(255 0 255 / 0.4)",
      colored: "0 8px 25px -8px hsl(300 100% 50% / 0.5)",
      glow: "0 0 20px hsl(300 100% 50% / 0.4), 0 0 40px hsl(180 100% 50% / 0.3)",
      glowLg: "0 0 30px hsl(300 100% 50% / 0.5), 0 0 60px hsl(180 100% 50% / 0.4)",
      glowXl: "0 0 40px hsl(300 100% 50% / 0.6), 0 0 80px hsl(180 100% 50% / 0.5)",
      inner: "inset 0 2px 4px 0 rgb(255 0 255 / 0.15)",
      insetGlow: "inset 0 0 20px hsl(300 100% 50% / 0.3)",
      neumorphic: "15px 15px 30px rgba(255, 0, 255, 0.1), -15px -15px 30px rgba(255, 255, 255, 0.7)",
      elevation: "0 1px 3px rgba(255,0,255,0.15), 0 1px 2px rgba(0,255,255,0.25)",
    },
    blur: {
      xs: "blur(2px)",
      sm: "blur(4px)",
      md: "blur(8px)",
      lg: "blur(16px)",
      xl: "blur(24px)",
      "2xl": "blur(40px)",
      "3xl": "blur(64px)",
    },
    effects: {
      glassMorphism: "backdrop-blur-xl bg-fuchsia-500/5 border border-fuchsia-400/20",
      neuMorphism: "bg-gradient-to-br from-fuchsia-900 to-cyan-900 shadow-[inset_-6px_-6px_12px_rgba(255,0,255,0.2),inset_6px_6px_12px_rgba(0,255,255,0.2)]",
      holographic: "background: linear-gradient(60deg, #ff00ff, #00ffff, #ffff00, #ff00ff) background-size-400 animate-gradient",
      crystalline: "backdrop-filter: blur(20px) brightness(1.3) contrast(1.3) saturate(2) hue-rotate(90deg)",
      metallic: "background: linear-gradient(145deg, #ff00ff, #00ffff); box-shadow: 30px 30px 60px #cc00cc, -30px -30px 60px #ff33ff",
      neon: "box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 120px #ff00ff",
      plasma: "background: radial-gradient(circle at 40% 60%, rgba(255,0,255,0.8) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(0,255,255,0.8) 0%, transparent 50%)",
      aurora: "background: linear-gradient(60deg, transparent 10%, rgba(255,0,255,0.3) 30%, transparent 50%), linear-gradient(-60deg, transparent 10%, rgba(0,255,255,0.3) 30%, transparent 50%)",
      prism: "background: linear-gradient(45deg, #ff00ff, #ff0080, #ff8000, #ffff00, #80ff00, #00ff80, #00ffff, #0080ff)",
      liquid: "background: radial-gradient(circle at 25% 75%, #ff00ff 0%, transparent 60%), radial-gradient(circle at 75% 25%, #00ffff 0%, transparent 60%), radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 40%)",
    },
    patterns: {
      dots: "radial-gradient(circle, rgba(255,0,255,0.3) 1px, transparent 1px)",
      grid: "linear-gradient(255,0,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.15) 1px, transparent 1px)",
      diagonal: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,0,255,0.15) 6px, rgba(255,0,255,0.15) 12px)",
      hexagon: "radial-gradient(circle at 50% 50%, transparent 15%, rgba(255,0,255,0.2) 16%, rgba(255,0,255,0.2) 20%, transparent 21%)",
      circuit: "linear-gradient(90deg, rgba(255,0,255,0.3) 50%, transparent 50%), linear-gradient(rgba(0,255,255,0.3) 50%, transparent 50%)",
      wave: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,0,0.2) 6px, rgba(255,255,0,0.2) 12px)",
      noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cyberpunkNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cyberpunkNoise)' opacity='0.12'/%3E%3C/svg%3E\")",
      fabric: "repeating-linear-gradient(30deg, rgba(255,0,255,0.05), rgba(255,0,255,0.05) 2px, transparent 2px, transparent 8px)",
    },
    animations: {
      duration: {
        fast: "100ms",
        normal: "200ms",
        slow: "350ms",
      },
      easing: {
        smooth: "cubic-bezier(0.23, 1, 0.32, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
};
