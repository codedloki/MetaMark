import React, { useState, useEffect, useCallback } from "react";
import WalletIcon from "@mui/icons-material/Wallet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import Registryabi from "../../abi/Registry.json";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
} from "@mui/material";
import Skeleton from '@mui/material/Skeleton'

// Utility: shorten wallet address
const shortAddress = (address) => {
  if (!address) return "No Address Connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ConnectedW = ({triggerPopup}) => {
  const [isMob, setIsMob] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayOption, setDisplayOption] = useState("Register");

  const navigate = useNavigate();

  // Fetch user role from contract
  const fetchRole = useCallback(async (signer) => {
    try {
      const contract = new Contract(
        import.meta.env.VITE_REGISTRY_CONTRACT,
        Registryabi,
        signer,
      );
      const userRole = Number(await contract.getRole());
      setRole(userRole);

      if (userRole === 1) {
        const manufacturer = await contract.getManufacturer();
        setDisplayName(manufacturer[1]);
        setDisplayOption("Manufacturer");
      } else if (userRole === 2) {
        const customer = await contract.getCustomer();
        setDisplayName(customer[0]);
        setDisplayOption("Customer");
      } else {
        setDisplayName("");
        setDisplayOption("Register");
      }

      setError("");
    } catch (err) {
      console.error("⚠️ fetchRole error:", err);
      setError("Could not fetch role. Are you on the correct network?");
      setRole(null);
    }
  }, []);

  // Setup wallet connection
  const setupConnection = useCallback(
    async (provider) => {
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        localStorage.setItem("address", address);
        await fetchRole(signer);
      } catch (err) {
        console.error("Setup connection failed:", err);
        setError("Failed to setup wallet connection.");
      }
    },
    [fetchRole],
  );

  // Connect wallet logic
  const connectWallet = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    if (!window.ethereum) {
      alert("Install MetaMask to connect your wallet.");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x539" }], // Ganache (1337)
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x539",
                chainName: "Ganache Localhost",
                rpcUrls: ["http://10.230.206.231:8545/"],
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
        } else {
          setError("Failed to switch network.");
        }
      }

      await provider.send("eth_requestAccounts", []);
      await setupConnection(provider);
    } catch (error) {
      console.error("🔌 Wallet connection error:", error);
      setError("Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if wallet already connected
  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const provider = new BrowserProvider(window.ethereum);
            await setupConnection(provider);
          }
        } catch (error) {
          console.error("Silent connection check failed:", error);
        }
      }
    };
    checkIfConnected();
  }, [setupConnection]);

  // Reload on account or network change
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = () => window.location.reload();
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleAccountsChanged);
    };
  }, []);

  // Wallet label logic
  let walletLabel = "";
  if (role === 0) walletLabel = "Not Registered";
  else if (role === 1) walletLabel = displayName || "Manufacturer";
  else if (role === 2) walletLabel = displayName || "Customer";
  else walletLabel = "Not Connected";

  // Shortened address
  const accountDetails = shortAddress(account);

  // Handle action button in Accordion
  const handlePrimaryAction = () => {
    if (role === 0) {
      navigate("/register");
    } else if (role === 1) {
      navigate("/mdashboard");
    } else if (role === 2) {
      navigate("/dashboard");
    } else {
      connectWallet();
    }
  };

  // Handle action button in Accordion
  const handlePrimaryAction1 = () => {
    // If user sees "Register" button
    if (role === 0 || displayOption === "Register") {
      console.log("logged Perfectly");
      if (typeof triggerPopup === "function") triggerPopup();
      return;
    } else if (role === 1) {
      navigate("/mdashboard");
    } else if (role === 2) {
      navigate("/dashboard");
    } else {
      connectWallet();
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    setIsConnected(false);
    setAccount("");
    setRole(null);
    setDisplayName("");
    localStorage.removeItem("address");
  };

  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        borderRadius: 2,
        p: 2,
        color: "white",
        width: "100%",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <List disablePadding>
        {/* Wallet Header */}
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#272727",
                "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                  color: "#6C63FF",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <WalletIcon />
            </ListItemIcon>
            <ListItemText
              primary={walletLabel}
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Accordion Section */}
        <Accordion
          sx={{
            bgcolor: "transparent",
            color: "white",
            boxShadow: "none",
            mt: 1,
            "&::before": { display: "none" },
          }}
          defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              px: 0,
              py: 1,
              "& .MuiAccordionSummary-content": { alignItems: "center" },
            }}
          >
            <ListItemText
              primary={accountDetails}
              primaryTypographyProps={{
                fontSize: 14,
                color: "#b0b0b0",
                fontFamily: "monospace",
              }}
              sx={{ ml: 2 }}
            />
          </AccordionSummary>

          <AccordionDetails
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#252525",
              borderRadius: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handlePrimaryAction1}
              sx={{
                bgcolor: "#6C63FF",
                color: "white",
                textTransform: "none",
                "&:hover": { bgcolor: "#5a52e0" },
              }}
            >
              {role === 0
                ? "Register"
                : role === 1
                  ? "Go to Manufacturer Dashboard"
                  : role === 2
                    ? "Go to Customer Dashboard"
                    : "Connect Wallet"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleDisconnect}
              sx={{
                color: "#6C63FF",
                borderColor: "#6C63FF",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#5a52e0",
                  bgcolor: "#1f1f1f",
                },
              }}
            >
              Disconnect Wallet
            </Button>
          </AccordionDetails>
        </Accordion>
      </List>
    </Box>
  );
};

export default ConnectedW;
