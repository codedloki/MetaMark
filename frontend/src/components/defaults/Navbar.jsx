/*
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
  const [error, seterror] = useState()

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
        localStorage.setItem('address', address)
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
      const contract = new Contract("0x051492A204DB2C6C72950217ECF240233E09A6e8", Registryabi, signer);
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
      */
{/* Logo */ }
/*
        <Link to="/" className="text-xl font-bold text-white">
          MetaMark
        </Link>
*/
{/* Desktop Menu */ }
/* 
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
*/
{/* Role-based Buttons */ }
/* 
          {connected ? (
            r === 0 ? (
              <button
                className="bg-gradient-to-r from-[#2A1458] via-[#9B177E] to-[#E8988A]  hover:from-[#E8988A]  hover:via-[#9B177E] hover:to-[#2A1458]  hover:border-2 hover:border-[#9B177E]    text-white font-medium px-5 py-2 rounded-xl"
                onClick={triggerPopup} fff
              >
                Not Registered
              </button>
            ) : r === 1 ? (
              <button
                className=" bg-gradient-to-r from-[#7A85C1] via-[#3B38A0] to-[#1A2A80] text-white font-medium px-5 py-2 rounded-xl"
                onClick={() => { navigate('/mdashboard') }}
              >
                {displayName}
              </button>
            ) : r === 2 ? (
              <button
                className="bg-gradient-to-r  from-[#00f260]  text-white font-medium px-5 py-2 rounded-xl"
                onClick={() => { navigate('/dashboard') }}
              >
                {displayName}
              </button>
            ) :
              (
                <button
                  className="bg-gradient-to-r from-[#7A85C1] via-[#3B38A0] to-[#1A2A80] hover:from-[#1A2A80]  hover:via-[#3B38A0] hover:to-[#7A85C1] text-white font-medium px-5 py-2 rounded-xl"
                  onClick={connectWallet}
                >
                  Connect
                </button>
              )
          ) : (
            <button
              className="bg-gradient-to-r from-[#7A85C1] via-[#3B38A0] to-[#1A2A80] hover:from-[#1A2A80]  hover:via-[#3B38A0] hover:to-[#7A85C1] text-white font-medium px-5 py-2 rounded-xl"
              onClick={connectWallet}
            >
              Connect
            </button>
          )}
        </div>
*/
{/* Mobile Toggle */ }
/* 
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isMob ? '✖' : '☰'}
        </button>
      </div>
*/
{/* Mobile Menu */ }
/* 
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
          ):(
          <button
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl text-white"
            onClick={() => {
              triggerPopup();
              setIsMob(false);
            }}
          >Connect
          </button>
            )}
        </div>
      )}
    </nav>
  );

}

export default Navbar;
*/


import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BrowserProvider, Contract } from 'ethers';
import Registryabi from '../../abi/Registry.json';

function Navbar({ triggerPopup }) {
  // State Management
  const [isMob, setIsMob] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState(null);

  // FIX: Added isLoading and error states to control UI flow and prevent spamming.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // A single, robust function to fetch the user's role.
  // Using useCallback to prevent re-creation on every render.
  const fetchRole = useCallback(async (signer) => {
    console.log("Attempting to fetch role...");
    try {
      const contract = new Contract(
        import.meta.env.VITE_REGISTRY_CONTRACT,
        Registryabi,
        signer
      );
      const userRole = Number(await contract.getRole());
      setRole(userRole);

      // Fetch display name based on role
      if (userRole === 1) {
        const manufacturer = await contract.getManufacturer();
        setDisplayName(manufacturer[1]);
      } else if (userRole === 2) {
        const customer = await contract.getCustomer();
        setDisplayName(customer[0]);
      } else {
        setDisplayName(''); // No role or role 0
      }
      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error('⚠️ fetchRole error:', err);
      setError('Could not fetch role. Are you on the right network?');
      setRole(null); // Reset role on error
    }
  }, []); // Empty dependency array as it doesn't depend on component state

  // A single function to handle all connection setup logic.
  const setupConnection = useCallback(async (provider) => {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setIsConnected(true);
      localStorage.setItem('address', address);

      await fetchRole(signer);
    } catch (err) {
      console.error("Setup connection failed:", err);
      setError("Failed to setup wallet connection.");
    }
  }, [fetchRole]);

  // Main connect function for the "Connect" button.
  const connectWallet = async () => {
    // FIX: Prevent multiple connection attempts while one is in progress.
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    if (!window.ethereum) {
      alert('Install MetaMask to connect your wallet.');
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }]
        })
      } catch (error) {
        console.log(error)
        if (error.code == 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
      }
      // This will pop up MetaMask for the user
      await provider.send('eth_requestAccounts', []);

      // The 'accountsChanged' listener will handle the rest,
      // but we can also set it up directly here for a faster UI update.
      await setupConnection(provider);

    } catch (error) {
      console.error('🔌 Wallet connection error:', error);
      setError("Failed to connect wallet.");
    } finally {
      // FIX: Ensure loading state is always reset.
      setIsLoading(false);
    }
  };

  // Effect for silent connection check on page load.
  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log("Found a connected account:", accounts[0]);
            const provider = new BrowserProvider(window.ethereum);
            await setupConnection(provider);
          }
        } catch (error) {
          console.error('Silent connection check failed:', error);
        }
      }
      setIsLoading(false);
    };
    checkIfConnected();
  }, [setupConnection]);

  // Effect to watch for account or network changes.
  useEffect(() => {
    if (!window.ethereum) return;

    // FIX: Recommended way to handle account changes is to reload the page.
    // This is the simplest and most robust way to reset all state.
    const handleAccountsChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleAccountsChanged); // Also reload on network change

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleAccountsChanged);
    };
  }, []);

  const toggleMenu = () => setIsMob(!isMob);

  // Render the connect/action button with loading and error states.
  const renderActionButton = (isMobile = false) => {
    const baseClass = isMobile
      ? 'bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl text-white disabled:opacity-50'
      : 'bg-gradient-to-r from-[#7A85C1] via-[#3B38A0] to-[#1A2A80] hover:from-[#1A2A80] hover:via-[#3B38A0] hover:to-[#7A85C1] text-white font-medium px-5 py-2 rounded-xl disabled:opacity-50';

    if (isLoading) {
      return (
        <button className={baseClass} disabled>
          Loading...
        </button>
      );
    }

    if (!isConnected) {
      return (
        <button className={baseClass} onClick={connectWallet}>
          Connect
        </button>
      );
    }

    let buttonText = 'Connect';
    let buttonAction = connectWallet;

    if (role === 0) {
      buttonText = 'Not Registered';
      buttonAction = () => {
        triggerPopup();
        if (isMobile) setIsMob(false);
      };
    } else if (role === 1) {
      buttonText = displayName || 'Manufacturer';
      buttonAction = () => {
        navigate('/mdashboard');
        if (isMobile) setIsMob(false);
      };
    } else if (role === 2) {
      buttonText = displayName || 'Customer';
      buttonAction = () => {
        navigate('/dashboard');
        if (isMobile) setIsMob(false);
      };
    } else if (error) {
      // If there's an error, show a reconnect button
      buttonText = 'Error - Reconnect';
      buttonAction = connectWallet;
    }

    return (
      <button className={baseClass} onClick={buttonAction}>
        {buttonText}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
      {/* ... your JSX for logo, links, etc. remains the same ... */}
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">
          MetaMark
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1' : 'text-white hover:text-blue-400'}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1' : 'text-white hover:text-blue-400'}>
            About
          </NavLink>
          {renderActionButton(false)}
        </div>
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
          {isMob ? '✖' : '☰'}
        </button>
      </div>
      {isMob && (
        <div className="md:hidden bg-[#0F172A] px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setIsMob(false)} className={({ isActive }) => isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMob(false)} className={({ isActive }) => isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'}>
            About
          </NavLink>
          {renderActionButton(true)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
