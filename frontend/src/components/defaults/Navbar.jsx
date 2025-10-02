import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BrowserProvider, Contract } from 'ethers';
import Registryabi from '../../abi/Registry.json';

function Navbar({ triggerPopup }) {
  const [isMob, setIsMob] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchRole = useCallback(async (signer) => {
    try {
      const contract = new Contract(
        import.meta.env.VITE_REGISTRY_CONTRACT,
        Registryabi,
        signer
      );
      const userRole = Number(await contract.getRole());
      setRole(userRole);

      if (userRole === 1) {
        const manufacturer = await contract.getManufacturer();
        setDisplayName(manufacturer[1]);
      } else if (userRole === 2) {
        const customer = await contract.getCustomer();
        setDisplayName(customer[0]);
      } else {
        setDisplayName('');
      }
      setError('');
    } catch (err) {
      console.error('⚠️ fetchRole error:', err);
      setError('Could not fetch role. Are you on the correct network?');
      setRole(null);
    }
  }, []);

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

  const connectWallet = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    if (!window.ethereum) {
      alert('Install MetaMask to connect your wallet.');
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // Ganache chainId (1337 decimal)
        });
        console.log('✅ Switched to Ganache network');
      } catch (switchError) {
        console.log('⚠️ Switch network failed:', switchError);
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x539',
                  chainName: 'Ganache Localhost',
                  rpcUrls: ['http://10.230.206.231:8545/'],
                  nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                },
              ],
            });
            console.log('✅ Ganache network added');
          } catch (addError) {
            console.error('🛑 Failed to add Ganache network:', addError);
            setError('Failed to add Ganache network.');
          }
        } else {
          console.error('🛑 Failed to switch network:', switchError);
          setError('Failed to switch network.');
        }
      }

      await provider.send('eth_requestAccounts', []);
      await setupConnection(provider);
    } catch (error) {
      console.error('🔌 Wallet connection error:', error);
      setError('Failed to connect wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new BrowserProvider(window.ethereum);
            await setupConnection(provider);
          }
        } catch (error) {
          console.error('Silent connection check failed:', error);
        }
      }
    };
    checkIfConnected();
  }, [setupConnection]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleAccountsChanged);
    };
  }, []);

  const toggleMenu = () => setIsMob(!isMob);

  const renderActionButton = (isMobile = false) => {
    const baseClass = isMobile
      ? 'bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl text-white disabled:opacity-50'
      : 'bg-gradient-to-r from-[#7A85C1] via-[#3B38A0] to-[#1A2A80] hover:from-[#1A2A80] hover:via-[#3B38A0] hover:to-[#7A85C1] text-white font-medium px-5 py-2 rounded-xl disabled:opacity-50';

    if (isLoading) return <button className={baseClass} disabled>Loading...</button>;

    if (!isConnected) return <button className={baseClass} onClick={connectWallet}>Connect</button>;

    let buttonText = 'Connect';
    let buttonAction = connectWallet;

    if (role === 0) {
      buttonText = 'Not Registered';
      buttonAction = () => { triggerPopup(); if (isMobile) setIsMob(false); };
    } else if (role === 1) {
      buttonText = displayName || 'Manufacturer';
      buttonAction = () => { navigate('/mdashboard'); if (isMobile) setIsMob(false); };
    } else if (role === 2) {
      buttonText = displayName || 'Customer';
      buttonAction = () => { navigate('/dashboard'); if (isMobile) setIsMob(false); };
    } else if (error) {
      buttonText = 'Error - Reconnect';
      buttonAction = connectWallet;
    }

    return <button className={baseClass} onClick={buttonAction}>{buttonText}</button>;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">MetaMark</Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1' : 'text-white hover:text-blue-400'}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-400 border-b-2 border-blue-500 font-bold pb-1' : 'text-white hover:text-blue-400'}>About</NavLink>
          {renderActionButton(false)}
        </div>
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>{isMob ? '✖' : '☰'}</button>
      </div>
      {isMob && (
        <div className="md:hidden bg-[#0F172A] px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setIsMob(false)} className={({ isActive }) => isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'}>Home</NavLink>
          <NavLink to="/about" onClick={() => setIsMob(false)} className={({ isActive }) => isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'}>About</NavLink>
          {renderActionButton(true)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
