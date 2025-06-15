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
  primaryVariant: string;
  secondaryVariant: string;
  accentVariant: string;
  surface: string;
  surfaceVariant: string;
  outline: string;
  outlineVariant: string;
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
  info: string;
  infoForeground: string;
  neutral: string;
  neutralVariant: string;
}

export interface ThemeConfig {
  name: string;
  category: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  blur: {
    sm: string;
    md: string;
    lg: string;
  };
  effects: {
    glass: string;
    holographic: string;
    crystalline: string;
  };
  animations: {
    hover: string;
    focus: string;
    active: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  cyberpunk: {
    name: "Cyberpunk",
    category: "Futuristic",
    colors: {
      light: {
        primary: "#ff00ff",
        primaryForeground: "#ffffff",
        secondary: "#00ffff",
        secondaryForeground: "#000000",
        accent: "#ff0000",
        accentForeground: "#ffffff",
        background: "#000000",
        foreground: "#ffffff",
        muted: "#333333",
        mutedForeground: "#999999",
        card: "#1a1a1a",
        cardForeground: "#ffffff",
        border: "#333333",
        input: "#333333",
        ring: "#ff00ff",
        destructive: "#ff0000",
        destructiveForeground: "#ffffff",
        success: "#00ff00",
        successForeground: "#000000",
        warning: "#ffff00",
        warningForeground: "#000000",
        primaryVariant: "#cc00cc",
        secondaryVariant: "#00cccc",
        accentVariant: "#cc0000",
        surface: "#1a1a1a",
        surfaceVariant: "#333333",
        outline: "#666666",
        outlineVariant: "#999999",
        primaryContainer: "#330033",
        onPrimaryContainer: "#ffffff",
        secondaryContainer: "#003333",
        onSecondaryContainer: "#ffffff",
        tertiaryContainer: "#330000",
        onTertiaryContainer: "#ffffff",
        errorContainer: "#330000",
        onErrorContainer: "#ffffff",
        surfaceTint: "#ff00ff",
        inverseSurface: "#ffffff",
        inverseOnSurface: "#000000",
        inversePrimary: "#000000",
        info: "#00ffff",
        infoForeground: "#000000",
        neutral: "#666666",
        neutralVariant: "#999999"
      },
      dark: {
        primary: "#ff00ff",
        primaryForeground: "#ffffff",
        secondary: "#00ffff",
        secondaryForeground: "#000000",
        accent: "#ff0000",
        accentForeground: "#ffffff",
        background: "#000000",
        foreground: "#ffffff",
        muted: "#333333",
        mutedForeground: "#999999",
        card: "#1a1a1a",
        cardForeground: "#ffffff",
        border: "#333333",
        input: "#333333",
        ring: "#ff00ff",
        destructive: "#ff0000",
        destructiveForeground: "#ffffff",
        success: "#00ff00",
        successForeground: "#000000",
        warning: "#ffff00",
        warningForeground: "#000000",
        primaryVariant: "#cc00cc",
        secondaryVariant: "#00cccc",
        accentVariant: "#cc0000",
        surface: "#1a1a1a",
        surfaceVariant: "#333333",
        outline: "#666666",
        outlineVariant: "#999999",
        primaryContainer: "#330033",
        onPrimaryContainer: "#ffffff",
        secondaryContainer: "#003333",
        onSecondaryContainer: "#ffffff",
        tertiaryContainer: "#330000",
        onTertiaryContainer: "#ffffff",
        errorContainer: "#330000",
        onErrorContainer: "#ffffff",
        surfaceTint: "#ff00ff",
        inverseSurface: "#ffffff",
        inverseOnSurface: "#000000",
        inversePrimary: "#000000",
        info: "#00ffff",
        infoForeground: "#000000",
        neutral: "#666666",
        neutralVariant: "#999999"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
      secondary: "bg-gradient-to-r from-cyan-500 to-blue-500",
      accent: "bg-gradient-to-r from-red-500 to-orange-500",
      background: "bg-gradient-to-b from-black to-gray-900"
    },
    shadows: {
      sm: "0 2px 4px rgba(255, 0, 255, 0.1)",
      md: "0 4px 8px rgba(255, 0, 255, 0.2)",
      lg: "0 8px 16px rgba(255, 0, 255, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-pink-500",
      active: "transition-all duration-100 active:scale-95"
    }
  },
  industrial: {
    name: "Industrial",
    category: "Professional",
    colors: {
      light: {
        primary: "#455a64",
        primaryForeground: "#ffffff",
        secondary: "#78909c",
        secondaryForeground: "#ffffff",
        accent: "#ff5722",
        accentForeground: "#ffffff",
        background: "#eceff1",
        foreground: "#263238",
        muted: "#b0bec5",
        mutedForeground: "#546e7a",
        card: "#ffffff",
        cardForeground: "#263238",
        border: "#cfd8dc",
        input: "#ffffff",
        ring: "#455a64",
        destructive: "#d32f2f",
        destructiveForeground: "#ffffff",
        success: "#2e7d32",
        successForeground: "#ffffff",
        warning: "#f57c00",
        warningForeground: "#ffffff",
        primaryVariant: "#37474f",
        secondaryVariant: "#607d8b",
        accentVariant: "#e64a19",
        surface: "#ffffff",
        surfaceVariant: "#f5f5f5",
        outline: "#90a4ae",
        outlineVariant: "#cfd8dc",
        primaryContainer: "#cfd8dc",
        onPrimaryContainer: "#263238",
        secondaryContainer: "#eceff1",
        onSecondaryContainer: "#263238",
        tertiaryContainer: "#fbe9e7",
        onTertiaryContainer: "#263238",
        errorContainer: "#ffebee",
        onErrorContainer: "#263238",
        surfaceTint: "#455a64",
        inverseSurface: "#263238",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#b0bec5",
        info: "#1976d2",
        infoForeground: "#ffffff",
        neutral: "#607d8b",
        neutralVariant: "#78909c"
      },
      dark: {
        primary: "#b0bec5",
        primaryForeground: "#263238",
        secondary: "#90a4ae",
        secondaryForeground: "#263238",
        accent: "#ff8a65",
        accentForeground: "#263238",
        background: "#263238",
        foreground: "#eceff1",
        muted: "#546e7a",
        mutedForeground: "#b0bec5",
        card: "#37474f",
        cardForeground: "#eceff1",
        border: "#455a64",
        input: "#37474f",
        ring: "#b0bec5",
        destructive: "#ef5350",
        destructiveForeground: "#263238",
        success: "#81c784",
        successForeground: "#263238",
        warning: "#ffb74d",
        warningForeground: "#263238",
        primaryVariant: "#cfd8dc",
        secondaryVariant: "#b0bec5",
        accentVariant: "#ffab91",
        surface: "#37474f",
        surfaceVariant: "#455a64",
        outline: "#78909c",
        outlineVariant: "#546e7a",
        primaryContainer: "#455a64",
        onPrimaryContainer: "#eceff1",
        secondaryContainer: "#546e7a",
        onSecondaryContainer: "#eceff1",
        tertiaryContainer: "#bf360c",
        onTertiaryContainer: "#ffccbc",
        errorContainer: "#c62828",
        onErrorContainer: "#ffcdd2",
        surfaceTint: "#b0bec5",
        inverseSurface: "#eceff1",
        inverseOnSurface: "#263238",
        inversePrimary: "#455a64",
        info: "#64b5f6",
        infoForeground: "#263238",
        neutral: "#90a4ae",
        neutralVariant: "#78909c"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-blue-grey-700 to-blue-grey-900",
      secondary: "bg-gradient-to-r from-blue-grey-500 to-blue-grey-700",
      accent: "bg-gradient-to-r from-deep-orange-500 to-deep-orange-700",
      background: "bg-gradient-to-b from-blue-grey-50 to-blue-grey-100"
    },
    shadows: {
      sm: "0 2px 4px rgba(38, 50, 56, 0.1)",
      md: "0 4px 8px rgba(38, 50, 56, 0.2)",
      lg: "0 8px 16px rgba(38, 50, 56, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-blue-grey-500 via-blue-grey-700 to-blue-grey-900 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-blue-grey-500",
      active: "transition-all duration-100 active:scale-95"
    }
  },
  construction: {
    name: "Construction",
    category: "Industry",
    colors: {
      light: {
        primary: "#fdd835",
        primaryForeground: "#212121",
        secondary: "#fbc02d",
        secondaryForeground: "#212121",
        accent: "#f57f17",
        accentForeground: "#ffffff",
        background: "#fafafa",
        foreground: "#212121",
        muted: "#bdbdbd",
        mutedForeground: "#757575",
        card: "#ffffff",
        cardForeground: "#212121",
        border: "#e0e0e0",
        input: "#ffffff",
        ring: "#fdd835",
        destructive: "#d32f2f",
        destructiveForeground: "#ffffff",
        success: "#388e3c",
        successForeground: "#ffffff",
        warning: "#f57c00",
        warningForeground: "#ffffff",
        primaryVariant: "#f9a825",
        secondaryVariant: "#f57f17",
        accentVariant: "#ff6f00",
        surface: "#ffffff",
        surfaceVariant: "#f5f5f5",
        outline: "#9e9e9e",
        outlineVariant: "#e0e0e0",
        primaryContainer: "#fff9c4",
        onPrimaryContainer: "#212121",
        secondaryContainer: "#fff59d",
        onSecondaryContainer: "#212121",
        tertiaryContainer: "#ffe0b2",
        onTertiaryContainer: "#212121",
        errorContainer: "#ffcdd2",
        onErrorContainer: "#212121",
        surfaceTint: "#fdd835",
        inverseSurface: "#212121",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#fff176",
        info: "#1976d2",
        infoForeground: "#ffffff",
        neutral: "#9e9e9e",
        neutralVariant: "#bdbdbd"
      },
      dark: {
        primary: "#fff176",
        primaryForeground: "#212121",
        secondary: "#fff59d",
        secondaryForeground: "#212121",
        accent: "#ffb300",
        accentForeground: "#212121",
        background: "#212121",
        foreground: "#fafafa",
        muted: "#757575",
        mutedForeground: "#bdbdbd",
        card: "#424242",
        cardForeground: "#fafafa",
        border: "#616161",
        input: "#424242",
        ring: "#fff176",
        destructive: "#ef5350",
        destructiveForeground: "#212121",
        success: "#81c784",
        successForeground: "#212121",
        warning: "#ffb74d",
        warningForeground: "#212121",
        primaryVariant: "#fff9c4",
        secondaryVariant: "#fff8e1",
        accentVariant: "#ffe082",
        surface: "#424242",
        surfaceVariant: "#616161",
        outline: "#9e9e9e",
        outlineVariant: "#757575",
        primaryContainer: "#f57f17",
        onPrimaryContainer: "#fff8e1",
        secondaryContainer: "#f9a825",
        onSecondaryContainer: "#fff8e1",
        tertiaryContainer: "#ff8f00",
        onTertiaryContainer: "#fff3e0",
        errorContainer: "#c62828",
        onErrorContainer: "#ffcdd2",
        surfaceTint: "#fff176",
        inverseSurface: "#fafafa",
        inverseOnSurface: "#212121",
        inversePrimary: "#f57f17",
        info: "#64b5f6",
        infoForeground: "#212121",
        neutral: "#bdbdbd",
        neutralVariant: "#9e9e9e"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-yellow-600 to-yellow-800",
      secondary: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      accent: "bg-gradient-to-r from-amber-500 to-amber-700",
      background: "bg-gradient-to-b from-gray-50 to-gray-100"
    },
    shadows: {
      sm: "0 2px 4px rgba(33, 33, 33, 0.1)",
      md: "0 4px 8px rgba(33, 33, 33, 0.2)",
      lg: "0 8px 16px rgba(33, 33, 33, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-yellow-500",
      active: "transition-all duration-100 active:scale-95"
    }
  },
  modern: {
    name: "Modern",
    category: "Professional",
    colors: {
      light: {
        primary: "#2196f3",
        primaryForeground: "#ffffff",
        secondary: "#03a9f4",
        secondaryForeground: "#ffffff",
        accent: "#009688",
        accentForeground: "#ffffff",
        background: "#ffffff",
        foreground: "#212121",
        muted: "#bdbdbd",
        mutedForeground: "#757575",
        card: "#ffffff",
        cardForeground: "#212121",
        border: "#e0e0e0",
        input: "#ffffff",
        ring: "#2196f3",
        destructive: "#f44336",
        destructiveForeground: "#ffffff",
        success: "#4caf50",
        successForeground: "#ffffff",
        warning: "#ff9800",
        warningForeground: "#ffffff",
        primaryVariant: "#1976d2",
        secondaryVariant: "#0288d1",
        accentVariant: "#00796b",
        surface: "#ffffff",
        surfaceVariant: "#f5f5f5",
        outline: "#9e9e9e",
        outlineVariant: "#e0e0e0",
        primaryContainer: "#bbdefb",
        onPrimaryContainer: "#212121",
        secondaryContainer: "#b3e5fc",
        onSecondaryContainer: "#212121",
        tertiaryContainer: "#b2dfdb",
        onTertiaryContainer: "#212121",
        errorContainer: "#ffcdd2",
        onErrorContainer: "#212121",
        surfaceTint: "#2196f3",
        inverseSurface: "#212121",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#90caf9",
        info: "#03a9f4",
        infoForeground: "#ffffff",
        neutral: "#9e9e9e",
        neutralVariant: "#bdbdbd"
      },
      dark: {
        primary: "#90caf9",
        primaryForeground: "#212121",
        secondary: "#81d4fa",
        secondaryForeground: "#212121",
        accent: "#80cbc4",
        accentForeground: "#212121",
        background: "#121212",
        foreground: "#ffffff",
        muted: "#757575",
        mutedForeground: "#bdbdbd",
        card: "#1e1e1e",
        cardForeground: "#ffffff",
        border: "#424242",
        input: "#1e1e1e",
        ring: "#90caf9",
        destructive: "#ef5350",
        destructiveForeground: "#212121",
        success: "#81c784",
        successForeground: "#212121",
        warning: "#ffb74d",
        warningForeground: "#212121",
        primaryVariant: "#bbdefb",
        secondaryVariant: "#b3e5fc",
        accentVariant: "#b2dfdb",
        surface: "#1e1e1e",
        surfaceVariant: "#424242",
        outline: "#9e9e9e",
        outlineVariant: "#757575",
        primaryContainer: "#1976d2",
        onPrimaryContainer: "#bbdefb",
        secondaryContainer: "#0288d1",
        onSecondaryContainer: "#b3e5fc",
        tertiaryContainer: "#00796b",
        onTertiaryContainer: "#b2dfdb",
        errorContainer: "#c62828",
        onErrorContainer: "#ffcdd2",
        surfaceTint: "#90caf9",
        inverseSurface: "#ffffff",
        inverseOnSurface: "#212121",
        inversePrimary: "#1976d2",
        info: "#29b6f6",
        infoForeground: "#212121",
        neutral: "#bdbdbd",
        neutralVariant: "#9e9e9e"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-blue-500 to-blue-700",
      secondary: "bg-gradient-to-r from-light-blue-500 to-light-blue-700",
      accent: "bg-gradient-to-r from-teal-500 to-teal-700",
      background: "bg-gradient-to-b from-white to-gray-50"
    },
    shadows: {
      sm: "0 2px 4px rgba(33, 33, 33, 0.1)",
      md: "0 4px 8px rgba(33, 33, 33, 0.2)",
      lg: "0 8px 16px rgba(33, 33, 33, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-blue-500 via-light-blue-500 to-teal-500 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-blue-500",
      active: "transition-all duration-100 active:scale-95"
    }
  },
  asphalt: {
    name: "Asphalt",
    category: "Industry",
    colors: {
      light: {
        primary: "#424242",
        primaryForeground: "#ffffff",
        secondary: "#616161",
        secondaryForeground: "#ffffff",
        accent: "#ff3d00",
        accentForeground: "#ffffff",
        background: "#f5f5f5",
        foreground: "#212121",
        muted: "#9e9e9e",
        mutedForeground: "#616161",
        card: "#ffffff",
        cardForeground: "#212121",
        border: "#e0e0e0",
        input: "#ffffff",
        ring: "#424242",
        destructive: "#d32f2f",
        destructiveForeground: "#ffffff",
        success: "#2e7d32",
        successForeground: "#ffffff",
        warning: "#f57c00",
        warningForeground: "#ffffff",
        primaryVariant: "#212121",
        secondaryVariant: "#424242",
        accentVariant: "#dd2c00",
        surface: "#ffffff",
        surfaceVariant: "#f5f5f5",
        outline: "#9e9e9e",
        outlineVariant: "#e0e0e0",
        primaryContainer: "#f5f5f5",
        onPrimaryContainer: "#212121",
        secondaryContainer: "#eeeeee",
        onSecondaryContainer: "#212121",
        tertiaryContainer: "#fbe9e7",
        onTertiaryContainer: "#212121",
        errorContainer: "#ffebee",
        onErrorContainer: "#212121",
        surfaceTint: "#424242",
        inverseSurface: "#212121",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#bdbdbd",
        info: "#1976d2",
        infoForeground: "#ffffff",
        neutral: "#9e9e9e",
        neutralVariant: "#bdbdbd"
      },
      dark: {
        primary: "#bdbdbd",
        primaryForeground: "#212121",
        secondary: "#9e9e9e",
        secondaryForeground: "#212121",
        accent: "#ff6e40",
        accentForeground: "#212121",
        background: "#212121",
        foreground: "#f5f5f5",
        muted: "#616161",
        mutedForeground: "#9e9e9e",
        card: "#424242",
        cardForeground: "#f5f5f5",
        border: "#616161",
        input: "#424242",
        ring: "#bdbdbd",
        destructive: "#ef5350",
        destructiveForeground: "#212121",
        success: "#81c784",
        successForeground: "#212121",
        warning: "#ffb74d",
        warningForeground: "#212121",
        primaryVariant: "#f5f5f5",
        secondaryVariant: "#eeeeee",
        accentVariant: "#ff9e80",
        surface: "#424242",
        surfaceVariant: "#616161",
        outline: "#9e9e9e",
        outlineVariant: "#616161",
        primaryContainer: "#616161",
        onPrimaryContainer: "#f5f5f5",
        secondaryContainer: "#757575",
        onSecondaryContainer: "#f5f5f5",
        tertiaryContainer: "#bf360c",
        onTertiaryContainer: "#ffccbc",
        errorContainer: "#c62828",
        onErrorContainer: "#ffcdd2",
        surfaceTint: "#bdbdbd",
        inverseSurface: "#f5f5f5",
        inverseOnSurface: "#212121",
        inversePrimary: "#424242",
        info: "#64b5f6",
        infoForeground: "#212121",
        neutral: "#bdbdbd",
        neutralVariant: "#9e9e9e"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-gray-700 to-gray-900",
      secondary: "bg-gradient-to-r from-gray-600 to-gray-800",
      accent: "bg-gradient-to-r from-deep-orange-600 to-deep-orange-800",
      background: "bg-gradient-to-b from-gray-100 to-gray-200"
    },
    shadows: {
      sm: "0 2px 4px rgba(33, 33, 33, 0.1)",
      md: "0 4px 8px rgba(33, 33, 33, 0.2)",
      lg: "0 8px 16px rgba(33, 33, 33, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-gray-500",
      active: "transition-all duration-100 active:scale-95"
    }
  },
  eco: {
    name: "Eco-Friendly",
    category: "Nature",
    colors: {
      light: {
        primary: "#4caf50",
        primaryForeground: "#ffffff",
        secondary: "#66bb6a",
        secondaryForeground: "#ffffff",
        accent: "#00c853",
        accentForeground: "#ffffff",
        background: "#f1f8e9",
        foreground: "#1b5e20",
        muted: "#a5d6a7",
        mutedForeground: "#2e7d32",
        card: "#ffffff",
        cardForeground: "#1b5e20",
        border: "#c8e6c9",
        input: "#ffffff",
        ring: "#4caf50",
        destructive: "#d32f2f",
        destructiveForeground: "#ffffff",
        success: "#2e7d32",
        successForeground: "#ffffff",
        warning: "#f57c00",
        warningForeground: "#ffffff",
        primaryVariant: "#43a047",
        secondaryVariant: "#558b2f",
        accentVariant: "#00b248",
        surface: "#ffffff",
        surfaceVariant: "#f1f8e9",
        outline: "#81c784",
        outlineVariant: "#c8e6c9",
        primaryContainer: "#c8e6c9",
        onPrimaryContainer: "#1b5e20",
        secondaryContainer: "#dcedc8",
        onSecondaryContainer: "#1b5e20",
        tertiaryContainer: "#b9f6ca",
        onTertiaryContainer: "#1b5e20",
        errorContainer: "#ffebee",
        onErrorContainer: "#1b5e20",
        surfaceTint: "#4caf50",
        inverseSurface: "#1b5e20",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#a5d6a7",
        info: "#1976d2",
        infoForeground: "#ffffff",
        neutral: "#81c784",
        neutralVariant: "#a5d6a7"
      },
      dark: {
        primary: "#a5d6a7",
        primaryForeground: "#1b5e20",
        secondary: "#c5e1a5",
        secondaryForeground: "#1b5e20",
        accent: "#69f0ae",
        accentForeground: "#1b5e20",
        background: "#1b5e20",
        foreground: "#f1f8e9",
        muted: "#2e7d32",
        mutedForeground: "#a5d6a7",
        card: "#2e7d32",
        cardForeground: "#f1f8e9",
        border: "#388e3c",
        input: "#2e7d32",
        ring: "#a5d6a7",
        destructive: "#ef5350",
        destructiveForeground: "#1b5e20",
        success: "#81c784",
        successForeground: "#1b5e20",
        warning: "#ffb74d",
        warningForeground: "#1b5e20",
        primaryVariant: "#c8e6c9",
        secondaryVariant: "#dcedc8",
        accentVariant: "#b9f6ca",
        surface: "#2e7d32",
        surfaceVariant: "#388e3c",
        outline: "#81c784",
        outlineVariant: "#2e7d32",
        primaryContainer: "#388e3c",
        onPrimaryContainer: "#c8e6c9",
        secondaryContainer: "#558b2f",
        onSecondaryContainer: "#dcedc8",
        tertiaryContainer: "#00c853",
        onTertiaryContainer: "#b9f6ca",
        errorContainer: "#c62828",
        onErrorContainer: "#ffcdd2",
        surfaceTint: "#a5d6a7",
        inverseSurface: "#f1f8e9",
        inverseOnSurface: "#1b5e20",
        inversePrimary: "#388e3c",
        info: "#64b5f6",
        infoForeground: "#1b5e20",
        neutral: "#a5d6a7",
        neutralVariant: "#81c784"
      }
    },
    gradients: {
      primary: "bg-gradient-to-r from-green-600 to-green-800",
      secondary: "bg-gradient-to-r from-light-green-500 to-light-green-700",
      accent: "bg-gradient-to-r from-green-a400 to-green-a700",
      background: "bg-gradient-to-b from-light-green-50 to-light-green-100"
    },
    shadows: {
      sm: "0 2px 4px rgba(27, 94, 32, 0.1)",
      md: "0 4px 8px rgba(27, 94, 32, 0.2)",
      lg: "0 8px 16px rgba(27, 94, 32, 0.3)"
    },
    blur: {
      sm: "backdrop-filter: blur(4px)",
      md: "backdrop-filter: blur(8px)",
      lg: "backdrop-filter: blur(16px)"
    },
    effects: {
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      holographic: "bg-gradient-to-r from-green-500 via-light-green-500 to-green-a400 opacity-75",
      crystalline: "backdrop-filter: blur(10px) brightness(1.2) contrast(1.2) saturate(1.4)"
    },
    animations: {
      hover: "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      focus: "transition-all duration-200 focus:ring-2 focus:ring-green-500",
      active: "transition-all duration-100 active:scale-95"
    }
  }
};

export const allThemes = Object.entries(themes).map(([key, theme]) => ({
  id: key,
  ...theme
}));
