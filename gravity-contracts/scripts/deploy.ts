import { ethers } from "hardhat";

async function main() {
    const gravity = await ethers.deployContract("GravatarRegistry");

    await gravity.waitForDeployment();

    console.log(`GravatarRegistry deployed to ${gravity.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
