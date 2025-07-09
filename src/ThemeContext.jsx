import { createContext, useEffect, useState, useContext } from "react";

const ThemeContext = createContext();
const applyThemeToDocument = (selectedTheme) => {
  if (selectedTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
};

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      applyThemeToDocument(savedTheme);
    } else {
      const currentHour = new Date().getHours();
      const autoTheme =
        (currentHour >= 0 && currentHour < 6) ||
        (currentHour >= 21 && currentHour < 24)
          ? "dark"
          : "light";
      setTheme(autoTheme);
      applyThemeToDocument(autoTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
