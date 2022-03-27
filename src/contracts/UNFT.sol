// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol"; // Counters
// import "@openzeppelin/contracts/access/Ownable.sol"; // Ownable
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // ERC721URIStorage
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; // ERC721Enumerable

contract UNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter; // 0 -> ...
    Counters.Counter private tokenId;

    /****************************** 생성자 ******************************/

    // ERC-721 토큰 생성
    constructor() ERC721("UpChainNFT", "UNFT") {}


    /****************************** Getter ******************************/

    event CreateToken(uint tokenId);


    /****************************** Getter ******************************/

    // 토큰 URI
    function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) { 
        return tokenURI(_tokenId);
    }

    /****************************** 토큰 발행 ******************************/

    // 토큰 발행(EOA)
    function createToken(string memory _tokenURI) public returns(uint256) {
        tokenId.increment(); // 새로운 토큰 ID 생성
        uint256 newTokenId = tokenId.current(); // 새로운 토큰 ID

        _safeMint(msg.sender, newTokenId); // 토큰 발행
        _setTokenURI(newTokenId, _tokenURI); // 토큰 URI 설정

        emit Approval(msg.sender, msg.sender, newTokenId); // Event -> 프론트

        return newTokenId;
    }

    // 토큰 발행(CA)
    function createToken(string memory _tokenURI, bytes calldata _data) public returns(uint256) {
        tokenId.increment(); // 새로운 토큰 ID 생성
        uint256 newTokenId = tokenId.current(); // 새로운 토큰 ID

        _safeMint(msg.sender, newTokenId, _data); // 토큰 발행
        _setTokenURI(newTokenId, _tokenURI); // 토큰 URI 설정

        emit Approval(msg.sender, msg.sender, newTokenId); // Event -> 프론트

        return newTokenId;
    }

    // override(ERC721, ERC721Enumerable)
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // override(ERC721, ERC721Enumerable)
    function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(_from, _to, _tokenId);
    }

    // override(ERC721, ERC721URIStorage)
    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        return super._burn(_tokenId);
    }

}