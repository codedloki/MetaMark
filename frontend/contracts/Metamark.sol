// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Metamark {

    struct Manufacturer{
        string owner;
        string company;
        address manufacturer_wallet;
        bool isRegistered;
    }

    struct Customer{
        string nickname;
        address customer_wallet;
        bool isRegistered;
    }


    event ManufacturerRegistered(address indexed wallet,string name , string company);
    event CustomerRegistered(address indexed wallet,string nickname );

    mapping(address=>Manufacturer) public manufacturers;
    mapping(address=>Customer) public customers;

    constructor() {

    }

    function registerManufacturer(string memory _owner ,string memory _company ) public   {
        require(!manufacturers[msg.sender].isRegistered,"Already Registered");
        manufacturers[msg.sender] = Manufacturer({
            owner :_owner,
            company:_company,
            manufacturer_wallet:msg.sender,
            isRegistered : true});

    }


    function registerCustomer(string memory _nickname ) public   {
        customers[msg.sender] = Customer({
            nickname:_nickname,
            customer_wallet:msg.sender,
            isRegistered : true});

    }


    function getManufacturer(address _wallet)  public view returns(string memory owner ,string memory companyname){
        Manufacturer memory m = manufacturers[_wallet];
        return (m.owner,m.company);
    }
}