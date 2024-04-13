const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dinosaur NFT testing", () => {
  let EGGToken;
  let EGGTokenAddr;
  let Dinosaur;
  let DinosaurAddr;
  beforeEach(async function () {
    [deployer, account1, account2] = await ethers.getSigners();

    await deployments.fixture("all");

    Dinosaur = await ethers.getContract("Dinosaur", deployer);
    DinosaurAddr = await Dinosaur.getAddress();

    EGGToken = await ethers.getContract("EGGToken", deployer);
    EGGTokenAddr = await EGGToken.getAddress();
  });

  describe("initialization", () => {
    it("shoudl initialize the owner", async function () {
      expect(await Dinosaur.owner()).to.be.equal(deployer);
    });

    it("should initialize the egg token address", async function () {
      expect(await Dinosaur.EGG()).to.be.equal(EGGTokenAddr);
    });
  });

  describe("myDino", () => {
    it("should mint my dino", async function () {
      await Dinosaur.connect(account1).myDino({
        value: ethers.parseEther("0.5"),
      });
      const dino = await Dinosaur.dinos(1);
      expect(dino.power).to.be.equal(100);
      expect(dino.thresold).to.be.equal(300);
    });

    it("shoudl revert if the value send is less than 0.5", async function () {
      const amount = ethers.parseEther("0.4");
      await expect(
        Dinosaur.connect(account1).myDino({
          value: amount,
        })
      )
        .to.be.revertedWithCustomError(Dinosaur, "InsufficientFunds")
        .withArgs(amount);
    });
  });

  describe("feed my dino", () => {
    beforeEach(async function () {
      await Dinosaur.connect(account1).myDino({
        value: ethers.parseEther("0.5"),
      });
    });
    it("should the dino and increase the base level", async function () {
      const amount = ethers.parseEther("100");
      await EGGToken.mint(account1, amount);
      await EGGToken.connect(account1).approve(Dinosaur, amount);

      await Dinosaur.connect(account1).feed(1, amount);
      let dino = await Dinosaur.dinos(1);
      expect(dino.power).to.be.equal(200);
      expect(dino.thresold).to.be.equal(300);

      await EGGToken.mint(account1, amount);
      await EGGToken.connect(account1).approve(Dinosaur, amount);

      await Dinosaur.connect(account1).feed(1, amount);
      dino = await Dinosaur.dinos(1);
      expect(dino.power).to.be.equal(300);
      expect(dino.thresold).to.be.equal(300);
    });

    it("should revert if there is insifficient allowance", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        Dinosaur.connect(account1).feed(1, amount)
      ).to.be.revertedWithCustomError(Dinosaur, "InsufficientAllowance");
    });
  });

  describe("upgrade my dino", () => {
    beforeEach(async function () {
      await Dinosaur.connect(account1).myDino({
        value: ethers.parseEther("0.5"),
      });
    });

    it("should upgrade my dino", async function () {
      const amount = ethers.parseEther("300");
      await EGGToken.mint(account1, amount);
      await EGGToken.connect(account1).approve(Dinosaur, amount);

      await Dinosaur.connect(account1).feed(1, amount);
      let dino = await Dinosaur.dinos(1);
      expect(dino.power).to.be.equal(400);
      expect(dino.thresold).to.be.equal(300);

      const diff = dino.power - dino.thresold;

      await Dinosaur.connect(account1).upgrade(1);

      //the old NFT should be deleted
      let oldDino = await Dinosaur.dinos(1);
      expect(oldDino.name).to.be.empty;
      expect(oldDino.power).to.be.equal(0);
      expect(oldDino.thresold).to.be.equal(0);
      await expect(Dinosaur.ownerOf(1)).to.be.revertedWithCustomError(
        Dinosaur,
        "ERC721NonexistentToken"
      );

      let newDino = await Dinosaur.dinos(2);
      console.log(newDino);
      expect(newDino.name).to.be.not.empty;
      expect(newDino.power).to.be.equal(dino.thresold + diff);
      expect(newDino.thresold).to.be.equal(dino.thresold * BigInt(3));
    });

    it("should not upgrade if power is less than thresold", async function () {
      const amount = ethers.parseEther("100");
      await EGGToken.mint(account1, amount);
      await EGGToken.connect(account1).approve(Dinosaur, amount);

      await Dinosaur.connect(account1).feed(1, amount);

      await expect(
        Dinosaur.connect(account1).upgrade(1)
      ).to.be.revertedWithCustomError(Dinosaur, "NotUpgradeable");
    });

    it.only("should revert if called from non owner", async function () {
      const amount = ethers.parseEther("300");
      await EGGToken.mint(account1, amount);
      await EGGToken.connect(account1).approve(Dinosaur, amount);

      await Dinosaur.connect(account1).feed(1, amount);

      await expect(
        Dinosaur.connect(account2).upgrade(1)
      ).to.be.revertedWithCustomError(Dinosaur, "NotOwner");
    });
  });
});
