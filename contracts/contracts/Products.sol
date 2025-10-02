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
        string details; // IPFS hash (must be unique)
        address manufacturer;
        bool isActive;
    }

    struct Batch {
        bytes32 productId;
        uint256 batchId;
        string ipfsHash;     // IPFS CID for description, expiry, side effects, serials
        bytes32 merkleRoot;  // Merkle root for serial IDs verification
        bool exists;
    }

    // Storage
    mapping(bytes32 => Product) public products;
    mapping(bytes32 => mapping(uint256 => Batch)) public batches;
    mapping(bytes32 => uint256[]) public productBatchIds;
    mapping(bytes32 => bool) public serialIdUsed;
    mapping(address => bytes32[]) private manufacturerProducts;
    mapping(bytes32 => bool) private ipfsHashUsed;

    IRegistry public registry;

    // Events
    event ProductRegistered(bytes32 indexed productId, string details, address manufacturer);
    event BatchAdded(bytes32 indexed productId, uint256 indexed batchId, string ipfsHash, bytes32 merkleRoot);
    event BatchIPFSUpdated(bytes32 indexed productId, uint256 indexed batchId, string newIpfsHash);
    event BatchMerkleRootUpdated(bytes32 indexed productId, uint256 indexed batchId, bytes32 newMerkleRoot);
    event SerialVerified(bytes32 indexed productId, uint256 indexed batchId, bytes32 serialHash, address verifier);

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

    // --- Product Management ---
    function registerProduct(
        string memory _details,
        uint256 _nonce
    ) public onlyManufacturer returns (bytes32) {
        bytes32 detailsHash = keccak256(bytes(_details));
        require(!ipfsHashUsed[detailsHash], "IPFS hash already registered");

        bytes32 productId = keccak256(
            abi.encodePacked(msg.sender, _details, _nonce, block.timestamp)
        );

        require(products[productId].manufacturer == address(0), "Product already exists");

        products[productId] = Product({
            details: _details,
            manufacturer: msg.sender,
            isActive: true
        });

        ipfsHashUsed[detailsHash] = true;
        manufacturerProducts[msg.sender].push(productId);

        emit ProductRegistered(productId, _details, msg.sender);
        return productId;
    }

    function getProductsByManufacturer() public view returns (bytes32[] memory) {
        return manufacturerProducts[msg.sender];
    }

    function getProductsByManufacturerAddress(address _manufacturer) public view returns (bytes32[] memory) {
        return manufacturerProducts[_manufacturer];
    }

    // --- Batch Management ---
    function addBatch(
        bytes32 _productId,
        uint256 _batchId,
        string memory _ipfsHash,
        bytes32 _merkleRoot
    ) public onlyManufacturer productExists(_productId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        require(products[_productId].isActive, "Product inactive");
        require(!batches[_productId][_batchId].exists, "Batch ID already exists");
        require(_merkleRoot != bytes32(0), "Merkle root must be non-zero");

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

    // --- Serial Verification ---
    function verifySerial(
        bytes32 _productId,
        uint256 _batchId,
        string memory _serialId,
        bytes32[] memory _merkleProof
    ) public productExists(_productId) batchExists(_productId, _batchId) {
        Batch storage batch = batches[_productId][_batchId];

        bytes32 leaf = keccak256(
            abi.encodePacked(_serialId, "PHARMA_SECURE_SALT")
        );

        require(!serialIdUsed[leaf], "Serial ID already used");

        bool isValidProof = MerkleProof.verify(_merkleProof, batch.merkleRoot, leaf);
        require(isValidProof, "Invalid Merkle proof");

        serialIdUsed[leaf] = true;
        emit SerialVerified(_productId, _batchId, leaf, msg.sender);
    }

    // --- Getters ---
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

    function getManufacturerByProduct(bytes32 _productId) public view returns (address) {
    return products[_productId].manufacturer;
}


    // --- Management Functions ---
    function toggleProductStatus(bytes32 _productId) public onlyManufacturer productExists(_productId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        products[_productId].isActive = !products[_productId].isActive;
    }

    function updateBatchIPFSHash(
        bytes32 _productId,
        uint256 _batchId,
        string memory _newIPFSHash
    ) public onlyManufacturer batchExists(_productId, _batchId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        batches[_productId][_batchId].ipfsHash = _newIPFSHash;
        emit BatchIPFSUpdated(_productId, _batchId, _newIPFSHash);
    }

    function updateBatchMerkleRoot(
        bytes32 _productId,
        uint256 _batchId,
        bytes32 _newMerkleRoot
    ) public onlyManufacturer batchExists(_productId, _batchId) {
        require(products[_productId].manufacturer == msg.sender, "Not product manufacturer");
        require(_newMerkleRoot != bytes32(0), "Merkle root must be non-zero");
        batches[_productId][_batchId].merkleRoot = _newMerkleRoot;
        emit BatchMerkleRootUpdated(_productId, _batchId, _newMerkleRoot);
    }
}
