import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // ✅ FIXED import
import ConnectedW from "./ConnectedW";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const DesktopSidebar = ({ triggerPopup }) => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [signer, setSigner] = useState(null);
  const navigate = useNavigate();

  // Connect MetaMask Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = await provider.getSigner();

      setAccount(accounts[0]);
      setSigner(signer);
      localStorage.setItem("account", accounts[0]);

      const net = await window.ethereum.request({ method: "net_version" });
      setNetwork(net);
      setConnected(true);

      console.log("✅ Wallet connected:", accounts[0]);
    } catch (error) {
      console.error("⚠️ Error connecting wallet:", error);
      alert("Error connecting wallet! Make sure MetaMask is installed.");
    }
  };

  // Auto check connection
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(await provider.getSigner());
            localStorage.setItem("account", accounts[0]);
            setConnected(true);
          }

          const net = await window.ethereum.request({ method: "net_version" });
          setNetwork(net);
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum);
          setAccount(accounts[0]);
          setSigner(await provider.getSigner());
          setConnected(true);
          localStorage.setItem("account", accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  // Disconnect Wallet
  const disconnectWallet = () => {
    setConnected(false);
    setAccount("");
    setSigner(null);
    localStorage.removeItem("account");
  };

  // Main menu items
  const mainMenu = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "About Us", icon: <InfoIcon />, path: "/about" },
    { text: "Get Started", icon: <RocketLaunchIcon />, path: "/getstarted" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - 300px)`,
          ml: `300px`,
          background: "none",
          boxShadow: "none",
        }}
      />

      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            bgcolor: "#1C1C1E",
            color: "#EDEDED",
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography component="div" sx={{ height: 4 }} />
        <h3 className="p-4 text-3xl font-bold">
          META<span className="text-[#6C63FF]">MARK</span>
        </h3>
        <Divider />

        {/* Main Menu */}
        <List>
          {mainMenu.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => navigate(path)}
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

        <Divider />

        {/* Wallet Section */}
        {connected ? (
          <ConnectedW
            disconnectWallet={disconnectWallet}
            signer={signer}
            account={account}
            triggerPopup={triggerPopup}
          />
        ) : (
          <List>
            <ListItem disablePadding>
              <ConnectButton />
            </ListItem>
          </List>
        )}
      </Drawer>
    </Box>
  );
};

export default DesktopSidebar;
