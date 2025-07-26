// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registry {
    uint256 public stakeAmount = 10 ether;
    
    enum Role {
        None,
        Manufacturer,
        Customer 
    }

    struct Manufact {
        string name;
        string companyName;
        address wallet;
        uint256 stake;
        bool isVerified;
    }

    struct Customer {
        string nickname;
        address wallet;
    }

    mapping(address => Role) private userRoleMap;
    mapping(address => Manufact) private manufacturers;
    mapping(address => Customer) private customers;
    mapping(string => bool) private usedCompanyNames; 
    mapping(string => bool) private usedusername; 

    modifier onlyManufacturer() {
        require(userRoleMap[msg.sender] == Role.Manufacturer, "Manufacturer access only");
        _;
    }

    modifier onlyCustomer() {
        require(userRoleMap[msg.sender] == Role.Customer, "Customer access only");
        _;
    }

    function registerManufacturer(
        string memory _name, 
        string memory _companyName
    ) public payable {
        require(userRoleMap[msg.sender] == Role.None, "Already registered");
        require(msg.value >= stakeAmount, "Insufficient stake amount");
        
        // Convert to lowercase for case-insensitive comparison
        string memory lowerCompanyName = _toLower(_companyName);
        require(!usedCompanyNames[lowerCompanyName], "Company name already registered");
        
        userRoleMap[msg.sender] = Role.Manufacturer;
        manufacturers[msg.sender] = Manufact({
            name: _name,
            companyName: _companyName,
            wallet: msg.sender,
            stake: msg.value,
            isVerified:true
        });
        
        // Mark company name as used
        usedCompanyNames[lowerCompanyName] = true;
    }

    function registerCustomer(string memory _nickname) public {
        require(userRoleMap[msg.sender] == Role.None, "Already registered");
        string memory lowerCompanyName = _toLower(_nickname);
        require(!usedusername[lowerCompanyName], "nickname already registered");
        userRoleMap[msg.sender] = Role.Customer;
        customers[msg.sender] = Customer({
            nickname: _nickname,
            wallet: msg.sender
        });
    }

    // Helper function to convert string to lowercase for case-insensitive comparison
    function _toLower(string memory _str) internal pure returns (string memory) {
        bytes memory bStr = bytes(_str);
        bytes memory bLower = new bytes(bStr.length);
        
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase ASCII characters (A-Z)
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    function getRole() public view returns (Role) {
        return userRoleMap[msg.sender];
    }

    function getManufacturer() public view returns (
        string memory name, 
        string memory companyName, 
        address wallet, 
        uint256 stake
    ) {
        Manufact memory m = manufacturers[msg.sender];
        return (m.name, m.companyName, m.wallet, m.stake);
    }

      function getManufacturer1(address _wallet) public view returns (
        string memory name, 
        string memory companyName, 
        uint256 stake
    ) {
        Manufact memory m = manufacturers[_wallet];
        return (m.name, m.companyName, m.stake);
    }


    function getCustomer() public view returns (
        string memory nickname, 
        address wallet
    ) {
        Customer memory c = customers[msg.sender];
        return (c.nickname, c.wallet);
    }

      function getCustomer1(address _wallet) public view returns (
        string memory nickname, 
        address wallet
    ) {
        Customer memory c = customers[_wallet];
        return (c.nickname, c.wallet);
    }
}
