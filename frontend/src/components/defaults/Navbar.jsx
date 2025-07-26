import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BrowserProvider, Contract } from 'ethers';
import Registryabi from '../../abi/Registry.json';
import DropdownMenu from './DropdownMenu';

import { useNavigate } from 'react-router-dom';

function Navbar({ triggerPopup }) {
  const [isMob, setIsMob] = useState(false);
  const [connected, setIsconnected] = useState(false);
  const [account, setaccount] = useState('');
  const [prov, setprov] = useState();
  const [sign, setsign] = useState();
  const [displayName, setdisplayname] = useState('');
  const [r, setr] = useState(null);
  const [error,seterror] = useState()

  const navigate = useNavigate()

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        console.log("🦊 MetaMask is installed");

        const provider = new BrowserProvider(window.ethereum);
        setprov(provider);
        const signer = await provider.getSigner();
        setsign(signer);
        await provider.send("eth_requestAccounts", []);

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x539" }],
          });
          console.log("✅ Switched to Ganache chain");
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x539",
                    chainName: "Ganache Localhost",
                    rpcUrls: ["http://127.0.0.1:8545"],
                    nativeCurrency: {
                      name: "Ether",
                      symbol: "ETH",
                      decimals: 18,
                    },
                  },
                ],
              });
              console.log("✅ Ganache chain added and selected");
            } catch (addError) {
              console.error("🛑 Failed to add Ganache chain:", addError);
            }
          } else {
            console.error("🛑 Failed to switch chain:", switchError);
          }
        }

        const address = await signer.getAddress();
        setIsconnected(true);
        setaccount(address);
        await fetchRole(signer); // Awaited
      } else {
        alert("Install MetaMask to connect your wallet.");
      }
    } catch (error) {
      console.error("🔌 Wallet connection error:", error);
    }
  };

  const fetchRole = async (signer) => {
    try {
      const contract = new Contract("0x33913593B9ff141CC27a28A532d98CA49F00F99B", Registryabi, signer);
      const role = Number(await contract.getRole())
      setr(role);
      console.log("🎭 User Role:", role);

      if (role === 1) {
        const manufacturer = await contract.getManufacturer();
        setdisplayname(manufacturer[1]);
        // navigate('/dashboard')
      }
      else if (role === 2) {
        const customer = await contract.getCustomer();
        setdisplayname(customer[0]);
        // navigate('/dashboard')
      }
    } catch (error) {
      console.error("⚠️ fetchRole error:", error);
      setr(4)
    }
  };

  // ✅ Silent check if wallet already connected
  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setIsconnected(true);
            setaccount(accounts[0]);
            setsign(signer);
            setprov(provider);
            await fetchRole(signer);
          }
        } catch (error) {
          console.error("Silent connection check failed:", error);
        }
      }
    };

    checkIfConnected();
  }, []);

  // ✅ Watch account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("🔌 Wallet disconnected");
        setaccount('');
        setIsconnected(false);
        setr(null);
      } else {
        console.log("🔄 Wallet account switched:", accounts[0]);
        setaccount(accounts[0]);
        setIsconnected(true);
        if (sign) fetchRole(sign);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [sign]);

  const toggleMenu = () => {
    setIsMob(!isMob);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          MetaMark
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1'
                : 'text-white hover:text-blue-400'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1'
                : 'text-white hover:text-blue-400'
            }
          >
            About
          </NavLink>

          {/* Role-based Buttons */}
          {connected ? (
            r === 0 ? (
              <button
                className="bg-transparent text-white font-medium px-5 py-2 rounded-xl"
                onClick={triggerPopup}
              >
                Not Registered
              </button>
            ) : r === 1 ? (
              <button
                className="bg-transparent text-white font-medium px-5 py-2 rounded-xl"
                onClick={()=>{navigate('/mdashboard')}}
              >
                {displayName}
              </button>
            ) : r === 2 ? (
              <button
                className="bg-transparent text-white font-medium px-5 py-2 rounded-xl"
                onClick={()=>{navigate('/dashboard')}}
              >
                {displayName}
              </button>
            ) : 
            (
              <button
                className="bg-transparent text-white font-medium px-5 py-2 rounded-xl"
                onClick={connectWallet}
              >
                Connect
              </button>
            )
                      ) : (
            <button
              className="bg-transparent text-white font-medium px-5 py-2 rounded-xl"
              onClick={connectWallet}
            >
              Connect
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isMob ? '✖' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMob && (
        <div className="md:hidden bg-[#0F172A] px-6 py-4 flex flex-col gap-4">
          <NavLink
            to="/"
            end
            onClick={() => setIsMob(false)}
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 font-bold'
                : 'text-white hover:text-blue-400'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMob(false)}
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 font-bold'
                : 'text-white hover:text-blue-400'
            }
          >
            About
          </NavLink>

          {!connected && (
            <button
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl text-white"
              onClick={() => {
                triggerPopup();
                setIsMob(false);
              }}
            >
              Not Registered
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
