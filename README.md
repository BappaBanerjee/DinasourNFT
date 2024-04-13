# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js

yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```

Build a Dinosaur NFT Smart Contract:
Create a smart contract for a Dinosaur NFT that can "eat" other ERC20 tokens (representing eggs) and upgrade into a new, more powerful Dinosaur NFT.

Requirements:

1. Minting Dinosaur NFTs: Implement a function to mint new Dinosaur NFTs. Each minted NFT should have a unique ID, a name (e.g., "T-Rex," "Velociraptor"), and a base power level (e.g., 100).

2. Feeding Mechanism: Create a function that allows users to "feed" their Dinosaur NFTs with ERC20 tokens (representing eggs). When a user sends a certain amount of ERC20 tokens to the contract, the contract should increase the power level of their Dinosaur NFT accordingly.

3. Upgrading Dinosaurs: Implement a function that allows users to upgrade their Dinosaur NFTs to a higher level if the power level reaches a certain threshold. When a Dinosaur NFT is upgraded, a new NFT with a different name and higher base power level should be minted, and the old NFT should be burned.

Rollup Integration (Optional): Research and provide a brief explanation of how this Dinosaur NFT smart contract could be deployed and executed on a Layer 2 rollup solution (e.g., Arbitrum, Optimism, or zkSync) to improve scalability and reduce transaction costs.
