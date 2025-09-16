"use client";

import React, { useState } from "react";
import { Box, Container, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import SearchBar from "@/components/SearchBar";
import TeamSidebar from "@/components/TeamSidebar";
import TeamView from "@/components/TeamView";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar for desktop */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="teams"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          <TeamSidebar setOpen={setMobileOpen} />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          <TeamSidebar />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {/* Hamburger button for mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" }, mb: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <SearchBar />
        <TeamView />
      </Box>
    </Box>
  );
}
