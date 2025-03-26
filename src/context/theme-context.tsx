
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type Theme = "light" | "dark";
type PrimaryColor = "blue" | "purple" | "teal" | "green" | "amber";

const DEFAULT_COLOR = "purple"; // Changed default from blue to purple

const COLOR_MAP = {
  blue: {
    primary: "210 100% 50%",  // #0080FF
    ring: "221 83% 53%"       // #3B82F6
  },
  purple: {
    primary: "270 76% 55%",   // #8B5CF6
    ring: "280 87% 65%"       // #A855F7  
  },
  teal: {
    primary: "180 100% 39%",  // #06B6D4
    ring: "175 84% 32%"       // #0D9488
  },
  green: {
    primary: "142 72% 50%",   // #22C55E
    ring: "142 72% 45%"       // #16A34A
  },
  amber: {
    primary: "40 96% 50%",    // #F59E0B
    ring: "40 96% 45%"        // #D97706
  }
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("frontdesk_theme") as Theme | null;
    return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(() => {
    const savedColor = localStorage.getItem("frontdesk_primary_color") as PrimaryColor | null;
    return savedColor || DEFAULT_COLOR;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("frontdesk_theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = COLOR_MAP[primaryColor];
    
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);
    
    localStorage.setItem("frontdesk_primary_color", primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
    toast.success(`Cor principal alterada para ${color}`);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};
