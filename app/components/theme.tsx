import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * A small replacement for `next-themes`, used by the experiment pages. It
 * toggles a class on <html> (light / dark, or "system" to follow the OS) and
 * remembers the choice in localStorage.
 */

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: "system", setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

const readStoredTheme = (): Theme => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {}
  return "system";
};

export function ThemeProvider({
  children,
  classNames,
}: {
  children: ReactNode;
  classNames: Record<"light" | "dark", string>;
}) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.classList.remove(classNames.light, classNames.dark);
      root.classList.add(classNames[resolved]);
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      root.classList.remove(classNames.light, classNames.dark);
    };
  }, [theme, classNames.light, classNames.dark]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
