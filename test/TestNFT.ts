import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers} from "hardhat";

describe("TestNFT", function () {
  async function deployTestNFTFixture() {
    const name = "TestTokenNFT";
    const symbol = "TST";
    const price = ethers.parseEther("0.01");

    const [owner, otherAccount] = await ethers.getSigners();

    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy(name, symbol, price);

    return {testNFT, price, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be correct price", async function () {
      const {testNFT, price} = await loadFixture(deployTestNFTFixture);

      expect(await testNFT.price()).to.equal(price);
    });

    it("Should set the right owner", async function () {
      const { testNFT, owner } = await loadFixture(deployTestNFTFixture);

      expect(await testNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Accessable", function () {
    it("Pause access only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).pause()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Unpause access only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).unpause()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Transfer ownership access", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).transferOwnership(otherAccount)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Add whitelist address only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).addWhiteAddress(otherAccount)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Remove whitelist address only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).removeWhiteAddress(otherAccount)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Transfer NFT to address only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).transfer( otherAccount, 1)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("Withdraw ETH from contract to owner only for owner", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).withdraw()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
        
    });
  });

  describe("Owner Methods", function () {
    it("Pause mint", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.pause();
      expect(await testNFT.isPause()).to.equal(true);
      await expect(testNFT.connect(otherAccount).buyTokens(1, {value: ethers.parseEther("0.01")})).to.be.revertedWith(
        "Pausable: method on pause"
      );
    });

    it("Unpause mint", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.pause();
      await testNFT.unpause();
      expect(await testNFT.isPause()).to.equal(false);
      await testNFT.connect(otherAccount).buyTokens(1, {value: ethers.parseEther("0.01")})
      expect(await testNFT.getLast()).to.equal(1);
    });

    it("Transfer ownership", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.transferOwnership(otherAccount.address);
      expect(await testNFT.owner()).to.equal(otherAccount.address);
    });

    it("Add whitelist address", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.addWhiteAddress(otherAccount);
      expect(await testNFT.whiteList(otherAccount)).to.equal(true);
    });

    it("Remove whitelist address", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.addWhiteAddress(otherAccount);
      await testNFT.removeWhiteAddress(otherAccount);
      expect(await testNFT.whiteList(otherAccount)).to.equal(false);
    });

    it("Remove whitelist address", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.addWhiteAddress(otherAccount);
      await testNFT.removeWhiteAddress(otherAccount);
      expect(await testNFT.whiteList(otherAccount)).to.equal(false);
    });

    it("Withdraw ether from smart-contract to owner", async function () {
      const {testNFT, owner, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.connect(otherAccount).buyTokens(1, {value: ethers.parseEther("0.01")})
      await testNFT.withdraw();
      await expect(ethers.provider.getBalance(owner.address)).to.not.be.reverted;
    });
    
    it("Transfer NFT-token to other account", async function () {
      const {testNFT, owner, otherAccount} = await loadFixture(deployTestNFTFixture);
      await testNFT.buyTokens(1, {from: owner});
      await testNFT.transfer(otherAccount, 1);
      expect(await testNFT.ownerOf(1)).to.equal(otherAccount.address);
    });
  });

  describe("Minting", function () {
    it("Minting NFT with low eth amount", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.connect(otherAccount).buyTokens(1)).to.be.revertedWith(
        "TestNFT: insufficient ether"
      );
    });
    
    it("Minting NFT from owner with zero eth value", async function () {
      const {testNFT} = await loadFixture(deployTestNFTFixture);
      await expect(testNFT.buyTokens(1)).to.not.be.reverted;
    });

    it("Minting NFT from whitelist person with zero eth value", async function () {
      const {testNFT, otherAccount} = await loadFixture(deployTestNFTFixture);
      testNFT.addWhiteAddress(otherAccount.address);
      await expect(testNFT.connect(otherAccount).buyTokens(1)).to.not.be.reverted;
    });
  });
});
