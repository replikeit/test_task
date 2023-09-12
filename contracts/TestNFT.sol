// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/Pausable.sol";
import "./interfaces/IPrivateNFT.sol";


contract TestNFT is IPrivateNFT, Pausable{

    //white list for free mint
    mapping (address => bool) public whiteList;

    // Token name
    string private _name;
    // Token symbo
    string private _symbol;
    //price for mint one nft
    uint256 private _price;
    //simple id generator
    uint256 private _id_gen = 0;
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    /**
     * @dev Initializes the contract by setting a `name`, a `symbol` and `price` to the token collection.
     */
    constructor (string memory name_, string memory symbol_, uint256 price_){
        _name = name_;
        _symbol = symbol_;
        _price = price_;
    }
    
    /**
     * @dev Returns name of NFT.
     */
    function name() public view returns (string memory){
        return _name;
    }

    /**
     * @dev Returns last id of created NFT.
     * If returns equals 0, that means that NFTs didn't create before
     */
    function getLast() public view returns (uint256){
        return _id_gen;
    }


    /**
     * @dev Returns symbol of NFT.
     */
    function symbol() public view returns (string memory){
        return _symbol;
    }
    /**
     * @dev Returns price per buy one NFT.
     */
    function price()public view returns (uint256){
        return _price;
    } 

    /**
     * @dev Returns owner for `tokenId`.
     */
    function ownerOf(uint256 tokenId) public view returns (address){
        return _ownerOf(tokenId);
    }

    /**
     * @dev returns count of NFT tokens for `owner` address.
     */
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "TestNFT: address zero is not a valid owner");
        return _balances[owner];
    }
    
    /**
     * @dev Selling NFT-tokens for `msg.senger`.
     * 
     * @param tokensCount - count of tokens that `msg.sender` should buy
     * 
     * Requirements:
     * - if `msg.sender` not owner or not in white list then this address should pay ether price per every token.
     */
    function buyTokens(uint256 tokensCount) external payable checkPause returns (uint256){
        if (!whiteList[msg.sender] && owner() != msg.sender){
            require(msg.value >= tokensCount * price(), "TestNFT: insufficient ether");
        }
        for (uint256 i = 0; i < tokensCount; ++i ){
            _mint(msg.sender, ++_id_gen);
        }
        return _id_gen;
    }

    /**
     * @dev Add `address_` to whitelist.
     * 
     * Requirements:
     * `msg.sender` must be owner
     */
    function addWhiteAddress(address address_) external onlyOwner{
        whiteList[address_] = true;
    }

    /**
     * @dev Remove `address_` from whitelist.
     * 
     * Requirements:
     * `msg.sender` must be owner
     */
    function removeWhiteAddress(address address_) external onlyOwner{
        whiteList[address_] = false;
    }

    /**
     * @dev owner send NFT from own collection to `to` address.
     * 
     * Requirements:
     * `msg.sender` must be owner
     */
    function transfer(address to, uint256 tokenId) external onlyOwner{
        _transfer(msg.sender, to, tokenId);
    }
    
    /**
     * @dev owner withdraw ether balance of smart-contract to him self.
     * 
     * Requirements:
     * `msg.sender` must be owner
     */
    function withdraw() external payable onlyOwner{
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "TestNft: failed to withdraw");
    }

    /**
     * @dev Returns owner for `tokenId`.
     */
    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }
    
    /**
     * @dev check existing of `tokenId`.
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    
    /**
     * @dev transfer NFT-token with `tokenId` from `from` address to `to` addres.
     * 
     * Requirements:
     * `to` must be not zero
     * owner of nft with `tokenId` must be `from` before transfer 
     * 
     */
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "TestNFT: transfer from incorrect owner");
        require(to != address(0), "TestNFT: transfer to the zero address");

        unchecked {
            _balances[from] -= 1;
            _balances[to] += 1;
        }
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    
    /**
     * @dev mint NFT-token with `tokenId` to `to` address.
     * 
     * Requirements:
     * `to` must be not zero
     * NFT-token with `tokenId` must be not exiest
     * 
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "TestNFT: mint to the zero address");
        require(!_exists(tokenId), "TestNFT: token already minted");

        unchecked {
            _balances[to] += 1;
        }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }
}
