// src/components/dynamic/authentication/MobileNav.jsx
import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function MobileNav({ onMenuClick }) {
  return (
    <AppBar position="static" sx={{ bgcolor: "#1C1C1E" }}>
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" component="div">
          MetaMark
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
