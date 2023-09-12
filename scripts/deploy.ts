import { ethers } from "hardhat";

async function main() {
  const name = "TestTokenNFT";
  const symbol = "TST";
  const price = ethers.parseEther("0.01");

  const testNft = await ethers.deployContract("TestNFT", [name, symbol, price]);

  await testNft.waitForDeployment();

  console.log(
    `Deployed NFT token with name: ${name}, symbol: ${symbol} and price: ${price}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
