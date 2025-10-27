// src/components/dynamic/authentication/MobileSidebar.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ConnectedW from "./ConnectedW";
import { useNavigate } from "react-router-dom"; // <- import

const drawerWidth = 280;

export default function MobileSidebar({
  triggerPopup,
  isSidebarOpen,
  handleSidebarToggle,
}) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const navigate = useNavigate(); // <- initialize

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      localStorage.setItem("account", accounts[0]);
      const net = await window.ethereum.request({ method: "net_version" });
      setNetwork(net);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAccount("");
    localStorage.removeItem("account");
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnected(true);
          }
          const net = await window.ethereum.request({ method: "net_version" });
          setNetwork(net);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkConnection();
  }, []);

  // Menu items with their respective routes
  const mainMenu = [
    { text: "Home", icon: <HomeIcon />, route: "/" },
    { text: "About Us", icon: <InfoIcon />, route: "/about" },
    { text: "Get Started", icon: <RocketLaunchIcon />, route: "/getstarted" },
  ];

  const handleMenuClick = (route) => {
    navigate(route); // <- redirect
    handleSidebarToggle(); // close the sidebar after navigation
  };

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#1C1C1E", color: "#EDEDED" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          METAMARK
        </Typography>
        <IconButton onClick={handleSidebarToggle} sx={{ color: "#EDEDED" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ bgcolor: "#333" }} />

      <List>
        {mainMenu.map(({ text, icon, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(route)} // <- redirection added
              sx={{
                "&:hover": {
                  backgroundColor: "#272727",
                  "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: "#6C63FF",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: "#333" }} />

      <Box sx={{ p: 2 }}>
        {connected ? (
          <ConnectedW
            disconnectWallet={disconnectWallet}
            triggerPopup={triggerPopup}
          />
        ) : (
          <ConnectButton showBalance={false} chainStatus="icon" />
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={isSidebarOpen}
      onClose={handleSidebarToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#1C1C1E",
          color: "#EDEDED",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
