// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IRegistry {
    function isManufacturer(address _user) external view returns (bool);
}

contract Products {
    using MerkleProof for bytes32[];
    
    // Structs
    struct Product {
        string name;
        address manufacturer;
        bool isActive;
        string description;
        string sideEffect;
    }

    struct Batch {
        bytes32 productId;
        uint256 batchId;
        uint256 mfgDate;
        uint256 expiryDate;
        string ipfsHash; // IPFS CID for description, side effects, serials list
        bytes32 merkleRoot; // Merkle root for serial IDs verification
        bool exists;
    }

    // Mappings
    mapping(bytes32 => Product) public products;
    mapping(bytes32 => mapping(uint256 => Batch)) public batches; // productId -> batchId -> Batch
    mapping(bytes32 => uint256[]) public productBatchIds; // productId -> array of batchIds
    mapping(bytes32 => bool) public serialIdUsed; // Tracks used serial IDs globally

    IRegistry public registry;

    // Events
    event ProductRegistered(bytes32 indexed productId, string name, address manufacturer);
    event BatchAdded(
        bytes32 indexed productId, 
        uint256 indexed batchId, 
        string ipfsHash, 
        bytes32 merkleRoot
    );
    event SerialVerified(
        bytes32 indexed productId,
        uint256 indexed batchId,
        bytes32 serialHash,
        address verifier
    );

    constructor(address _registryAddress) {
        registry = IRegistry(_registryAddress);
    }

    modifier onlyManufacturer() {
        require(registry.isManufacturer(msg.sender), "Not a registered manufacturer");
        _;
    }

    modifier productExists(bytes32 _productId) {
        require(products[_productId].manufacturer != address(0), "Product does not exist");
        _;
    }

    modifier batchExists(bytes32 _productId, uint256 _batchId) {
        require(batches[_productId][_batchId].exists, "Batch does not exist");
        _;
    }

    function registerProduct(
        string memory _name,
        string memory _description,
        string memory _sideEffect,
        uint256 _nonce
    ) public onlyManufacturer returns (bytes32) {
        bytes32 productId = keccak256(
            abi.encodePacked(msg.sender, _name, _description, _sideEffect, _nonce, block.timestamp)
        );

        require(products[productId].manufacturer == address(0), "Product already exists");

        products[productId] = Product({
            name: _name,
            manufacturer: msg.sender,
            isActive: true,
            description: _description,
            sideEffect: _sideEffect
        });

        emit ProductRegistered(productId, _name, msg.sender);
        return productId;
    }

    function addBatch(
        bytes32 _productId,
        uint256 _batchId,
        uint256 _mfgDate,
        uint256 _expiryDate,
        string memory _ipfsHash,
        bytes32 _merkleRoot
    ) public onlyManufacturer productExists(_productId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        require(products[_productId].isActive, "Product inactive");
        require(!batches[_productId][_batchId].exists, "Batch ID already exists");

        batches[_productId][_batchId] = Batch({
            productId: _productId,
            batchId: _batchId,
            mfgDate: _mfgDate,
            expiryDate: _expiryDate,
            ipfsHash: _ipfsHash,
            merkleRoot: _merkleRoot,
            exists: true
        });

        productBatchIds[_productId].push(_batchId);

        emit BatchAdded(_productId, _batchId, _ipfsHash, _merkleRoot);
    }

    function verifySerial(
        bytes32 _productId,
        uint256 _batchId,
        string memory _serialId,
        bytes32[] memory _merkleProof
    ) public productExists(_productId) batchExists(_productId, _batchId) {
        Batch storage batch = batches[_productId][_batchId];
        
        // Check if batch is expired
        require(block.timestamp <= batch.expiryDate, "Batch has expired");

        // Create leaf hash with salt for extra security
        bytes32 leaf = keccak256(
            abi.encodePacked(_serialId, "PHARMA_SECURE_SALT")
        );

        // 1. Check if serial ID was already used globally
        require(!serialIdUsed[leaf], "Serial ID already used");

        // 2. Verify Merkle Proof
        bool isValidProof = _merkleProof.verify(
            batch.merkleRoot,
            leaf
        );
        require(isValidProof, "Invalid Merkle proof");

        // 3. Mark serial ID as used
        serialIdUsed[leaf] = true;

        emit SerialVerified(_productId, _batchId, leaf, msg.sender);
    }

    function getProduct(bytes32 _productId) public view returns (Product memory) {
        return products[_productId];
    }

    function getBatch(bytes32 _productId, uint256 _batchId) public view returns (Batch memory) {
        require(batches[_productId][_batchId].exists, "Batch does not exist");
        return batches[_productId][_batchId];
    }

    function getProductBatchIds(bytes32 _productId) public view returns (uint256[] memory) {
        return productBatchIds[_productId];
    }

    function isSerialUsed(string memory _serialId) public view returns (bool) {
        bytes32 leaf = keccak256(
            abi.encodePacked(_serialId, "PHARMA_SECURE_SALT")
        );
        return serialIdUsed[leaf];
    }

    function toggleProductStatus(bytes32 _productId) public onlyManufacturer productExists(_productId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        products[_productId].isActive = !products[_productId].isActive;
    }

    // Emergency function to update IPFS hash (only manufacturer)
    function updateBatchIPFSHash(
        bytes32 _productId,
        uint256 _batchId,
        string memory _newIPFSHash
    ) public onlyManufacturer batchExists(_productId, _batchId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        batches[_productId][_batchId].ipfsHash = _newIPFSHash;
    }
}