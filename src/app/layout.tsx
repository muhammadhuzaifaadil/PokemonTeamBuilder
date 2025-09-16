"use client";

import { useState, useEffect } from "react";
import { TeamsProvider } from "@/context/TeamsContext";
import { CssBaseline, ThemeProvider, createTheme, Box, IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Optional: persist mode in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("themeMode");
    if (stored === "light" || stored === "dark") setMode(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: "#3b4cca" }, // Pokémon blue
      secondary: { main: "#ffde00" }, // Pokémon yellow
      background: {
        default: mode === "light" ? "#f0f4f8" : "#1e1e2f",
        paper: mode === "light" ? "#ffffff" : "#2c2c3e",
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "background-color 0.3s ease",
          },
        },
      },
    },
  });

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TeamsProvider>
            <Box
              sx={{
                minHeight: "100vh",
                backgroundColor: theme.palette.background.default,
                transition: "background-color 0.5s ease",
                p: 2,
              }}
            >
              {/* Dark/Light Mode Toggle */}
              <Box sx={{ position: "fixed", top: 8, right: 16, zIndex: 1000 }}>
                <IconButton
                  onClick={() => setMode(mode === "light" ? "dark" : "light")}
                  color="inherit"
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Box>

              {children}
            </Box>
          </TeamsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
