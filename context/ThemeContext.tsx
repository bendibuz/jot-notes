import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vars } from "nativewind";
import { COLOR_SCHEMES, ColorScheme, DEFAULT_SCHEME_ID } from "../themes";

const THEME_STORAGE_KEY = "@jot-notes/theme";

interface ThemeContextValue {
  scheme: ColorScheme;
  schemes: ColorScheme[];
  setSchemeId: (id: string) => void;
  themeVars: ReturnType<typeof vars>;
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [schemeId, setSchemeIdState] = useState(DEFAULT_SCHEME_ID);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then(id => {
      if (id && COLOR_SCHEMES.some(s => s.id === id)) setSchemeIdState(id);
    });
  }, []);

  const setSchemeId = (id: string) => {
    setSchemeIdState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id);
  };

  const scheme = COLOR_SCHEMES.find(s => s.id === schemeId) ?? COLOR_SCHEMES[0];

  const themeVars = vars({
    "--color-background": scheme.background,
    "--color-secondary": scheme.secondary,
    "--color-accent": scheme.accent,
    "--color-dark": scheme.dark,
  });

  return (
    <ThemeContext.Provider value={{ scheme, schemes: COLOR_SCHEMES, setSchemeId, themeVars }}>
      {children}
    </ThemeContext.Provider>
  );
};
