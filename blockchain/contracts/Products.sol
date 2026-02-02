// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IRegistry {
    function isManufacturer(address _user) external view returns (bool);
}

contract Products is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    using MerkleProof for bytes32[];

    struct Product {
        string details;
        address manufacturer;
        bool isActive;
    }

    struct Batch {
        bytes32 productId;
        uint256 batchId;
        string ipfsHash;
        bytes32 merkleRoot;
        bool exists;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    mapping(bytes32 => Product) public products;
    mapping(bytes32 => mapping(uint256 => Batch)) public batches;
    mapping(bytes32 => uint256[]) private productBatchIds;
    mapping(bytes32 => bool) public serialIdUsed;
    mapping(address => bytes32[]) private manufacturerProducts;
    mapping(bytes32 => bool) private ipfsHashUsed;

    IRegistry public registry;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event ProductRegistered(bytes32 indexed productId, string details, address manufacturer);
    event BatchAdded(bytes32 indexed productId, uint256 indexed batchId, string ipfsHash, bytes32 merkleRoot);
    event SerialVerified(bytes32 indexed productId, uint256 indexed batchId, bytes32 leafHash, address verifier);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _registryAddress) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __Pausable_init();
        registry = IRegistry(_registryAddress);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /*//////////////////////////////////////////////////////////////
                            ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyManufacturer() {
        require(registry.isManufacturer(msg.sender), "Not a registered manufacturer");
        _;
    }

    modifier productExists(bytes32 _productId) {
        require(products[_productId].manufacturer != address(0), "Product does not exist");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                MAIN LOGIC
    //////////////////////////////////////////////////////////////*/

    function registerProduct(string calldata _details, uint256 _nonce) external whenNotPaused onlyManufacturer returns (bytes32) {
        bytes32 detailsHash = keccak256(bytes(_details));
        require(!ipfsHashUsed[detailsHash], "IPFS already used");

        bytes32 productId = keccak256(abi.encodePacked(msg.sender, _details, _nonce, block.timestamp));
        require(products[productId].manufacturer == address(0), "Product exists");

        products[productId] = Product({ details: _details, manufacturer: msg.sender, isActive: true });
        ipfsHashUsed[detailsHash] = true;
        manufacturerProducts[msg.sender].push(productId);

        emit ProductRegistered(productId, _details, msg.sender);
        return productId;
    }

    function addBatch(bytes32 _productId, uint256 _batchId, string calldata _ipfsHash, bytes32 _merkleRoot) external whenNotPaused onlyManufacturer productExists(_productId) {
        require(products[_productId].manufacturer == msg.sender, "Not owner");
        require(products[_productId].isActive, "Product inactive");
        require(!batches[_productId][_batchId].exists, "Batch exists");

        batches[_productId][_batchId] = Batch({
            productId: _productId,
            batchId: _batchId,
            ipfsHash: _ipfsHash,
            merkleRoot: _merkleRoot,
            exists: true
        });

        productBatchIds[_productId].push(_batchId);
        emit BatchAdded(_productId, _batchId, _ipfsHash, _merkleRoot);
    }

    function verifySerial(bytes32 _productId, uint256 _batchId, bytes32 _leaf, bytes32[] calldata _merkleProof) external whenNotPaused productExists(_productId) {
        require(batches[_productId][_batchId].exists, "Batch does not exist");
        require(products[_productId].isActive, "Product inactive");

        bytes32 leafHash = keccak256(abi.encodePacked(_leaf));
        require(!serialIdUsed[leafHash], "Already verified");

        require(MerkleProof.verify(_merkleProof, batches[_productId][_batchId].merkleRoot, _leaf), "Invalid Merkle proof");

        serialIdUsed[leafHash] = true;
        emit SerialVerified(_productId, _batchId, leafHash, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // 1. Get Product Details
    function getProduct(bytes32 _productId) external view returns (string memory details, address manufacturer, bool isActive) {
        Product storage p = products[_productId];
        require(p.manufacturer != address(0), "Product does not exist");
        return (p.details, p.manufacturer, p.isActive);
    }

    // 2. Get Batch Details
    function getBatch(bytes32 _productId, uint256 _batchId) external view returns (Batch memory) {
        require(batches[_productId][_batchId].exists, "Batch not found");
        return batches[_productId][_batchId];
    }

    // 3. Get All Product IDs of a Manufacturer
    function getProductsByManufacturer(address _manufacturer) external view returns (bytes32[] memory) { 
        return manufacturerProducts[_manufacturer]; 
    }

    // 4. Get All Batch IDs of a Product
    function getProductBatchIds(bytes32 _productId) external view returns (uint256[] memory) { 
        return productBatchIds[_productId]; 
    }

    uint256[47] private __gap;
}