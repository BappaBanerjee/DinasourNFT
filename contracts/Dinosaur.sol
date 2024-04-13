// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error InsufficientAllowance();
error NotOwner();
error InsufficientFunds(uint256);
error NotUpgradeable();

contract Dinosaur is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;
    struct Dino{
        string name;
        uint256 power;
        uint256 thresold;
    }

    mapping(uint256=>Dino) public dinos;
    IERC20 immutable EGG;

    constructor(address _initialOwner, IERC20 _EGG)
        ERC721("Dinosaur", "DINO")
        Ownable(_initialOwner)
    {
        EGG = _EGG;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) internal returns(uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function myDino() public payable{
        if(msg.value < 0.5 ether) revert InsufficientFunds(msg.value);
        uint256 tokenId = safeMint(msg.sender);
        string memory name = generateDinoName(tokenId);
        dinos[tokenId] = Dino(
            name,
            100,
            300
        );
    }

    function feed(uint256 _tokenId, uint256 _amount) public {
        if(EGG.allowance(msg.sender, address(this)) < _amount) revert InsufficientAllowance();
        EGG.transferFrom(msg.sender, address(this), _amount);
        dinos[_tokenId].power += _amount / 10 ** 18;
    }

    function upgrade(uint256 _tokenId) public  {
        if(ownerOf(_tokenId) != msg.sender) revert NotOwner();
        Dino memory dino = dinos[_tokenId];
        if(dino.power < dino.thresold) revert NotUpgradeable();
        uint256 diff = dino.power - dino.thresold;
        _burn(_tokenId);
        uint256 tokenId = safeMint(msg.sender);
        string memory name = generateDinoName(tokenId);
        dinos[tokenId] = Dino(
            name,
            dino.thresold + diff,
            dino.thresold * 3
        );
        delete dinos[_tokenId];
    }

    function generateDinoName(uint256 tokenId) internal view returns (string memory) {
        // Seed the pseudo-random number generator with the tokenId
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, tokenId)));
        
        // List of possible prefixes and suffixes for dinosaur names
        string[8] memory prefixes = ["Tyranno", "Tricera", "Stego", "Bronto", "Veloci", "Dilo", "Ankylo", "Ptero"];
        string[8] memory suffixes = ["saurus", "raptor", "dactyl", "ceratops", "saur", "don", "lophus", "pod"];
        
        // Use modulo to select a random prefix and suffix
        uint256 prefixIndex = randomNumber % prefixes.length;
        uint256 suffixIndex = (randomNumber / 2) % suffixes.length; // Dividing by 2 to change the range
        
        // Concatenate the selected prefix and suffix
        string memory name = string(abi.encodePacked(prefixes[prefixIndex], suffixes[suffixIndex]));
        
        return name;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
