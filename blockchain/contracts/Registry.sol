// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// ✅ Step 1: Pausable library import karo
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract Registry is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 public STAKE_AMOUNT;
    address public productsContract;

    enum Role { NONE, MANUFACTURER, CUSTOMER }
    enum AccountType { INDIVIDUAL, ORGANIZATION }

    struct Manufacturer {
        string name;
        string companyName;
        uint256 stake;
        bytes32 mancidHash;
        bool verified;
    }

    struct Customer {
        string nickname;
        bytes32 profileCIDHash;
        AccountType accType;
    }

    mapping(address => Role) private roles;
    mapping(address => Manufacturer) private manufacturers;
    mapping(address => Customer) private customers;
    mapping(bytes32 => bool) private usedCompanyHash;
    mapping(bytes32 => bool) private usedUsernameHash;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event ManufacturerRegistered(address indexed wallet, bytes32 indexed companyHash, uint256 stake);
    event CustomerRegistered(address indexed wallet, bytes32 indexed usernameHash);
    event ProductsContractUpdated(address indexed oldAddress, address indexed newAddress);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __Pausable_init(); // ✅ Step 2: Pause logic initialize karo
        
        STAKE_AMOUNT = 0.01 ether;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /*//////////////////////////////////////////////////////////////
                            CIRCUIT BREAKER (ADMIN)
    //////////////////////////////////////////////////////////////*/
    
    // ✅ Emergency ke waqt functions rokne ke liye
    function pause() external onlyOwner {
        _pause();
    }

    // ✅ Sab kuch theek hone par wapas shuru karne ke liye
    function unpause() external onlyOwner {
        _unpause();
    }

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier notRegistered() {
        require(roles[msg.sender] == Role.NONE, "Already registered");
        _;
    }

    modifier onlyProducts() {
        require(msg.sender == productsContract, "Caller is not the products contract");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function setProductsContract(address _productsAddress) external onlyOwner {
        require(_productsAddress != address(0), "Invalid address");
        emit ProductsContractUpdated(productsContract, _productsAddress);
        productsContract = _productsAddress;
    }

    /*//////////////////////////////////////////////////////////////
                        REGISTRATION (PAUSABLE)
    //////////////////////////////////////////////////////////////*/
    
    // ✅ Step 3: "whenNotPaused" modifier add karo functions par
    function registerManufacturer(
        string calldata name,
        string calldata companyName,
        string calldata mancid
    ) external payable whenNotPaused notRegistered {
        require(msg.value >= STAKE_AMOUNT, "Insufficient stake");

        bytes32 companyHash = keccak256(abi.encodePacked(companyName));
        require(!usedCompanyHash[companyHash], "Company exists");

        roles[msg.sender] = Role.MANUFACTURER;
        usedCompanyHash[companyHash] = true;

        manufacturers[msg.sender] = Manufacturer({
            name: name,
            companyName: companyName,
            stake: msg.value,
            mancidHash: keccak256(bytes(mancid)),
            verified: true
        });

        emit ManufacturerRegistered(msg.sender, companyHash, msg.value);
    }

    function registerCustomer(
        string calldata nickname,
        AccountType accType,
        string calldata profileCID
    ) external whenNotPaused notRegistered {
        bytes32 usernameHash = keccak256(abi.encodePacked(nickname));
        require(!usedUsernameHash[usernameHash], "Username exists");

        roles[msg.sender] = Role.CUSTOMER;
        usedUsernameHash[usernameHash] = true;

        customers[msg.sender] = Customer({
            nickname: nickname,
            profileCIDHash: keccak256(bytes(profileCID)),
            accType: accType
        });

        emit CustomerRegistered(msg.sender, usernameHash);
    }

    /*//////////////////////////////////////////////////////////////
                                VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getRole(address user) external view returns (Role) {
        return roles[user];
    }

    function getManufacturer(address user)
        external
        view
        returns (string memory name, string memory companyName, uint256 stake, bool verified)
    {
        Manufacturer storage m = manufacturers[user];
        return (m.name, m.companyName, m.stake, m.verified);
    }

    function isManufacturer(address user) external view returns (bool) {
        return roles[user] == Role.MANUFACTURER;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE GAP
    //////////////////////////////////////////////////////////////*/
    // ✅ Gap adjustment (Pausable ne kuch slots liye hain)
    uint256[47] private __gap; 
}