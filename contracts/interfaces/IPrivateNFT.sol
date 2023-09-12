// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPrivateNFT{
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Transfer nft to address.
     */
    function transfer(address to, uint256 tokenId) external;
}