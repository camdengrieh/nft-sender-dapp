import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("MetawinMillionaireMarketing");

  //Get the first account from the list of accounts
  const accounts = await ethers.getSigners();
  const instance = ContractFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  //batch send the NFTs to 10000 addresses stored in a csv file
  const addresses = [];
  for (let i = 0; i < 10000; i++) {
    addresses.push(accounts[i].address);
  }
  //const tx = await instance.batchSend(addresses);
  console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
