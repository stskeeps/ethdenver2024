import { ethers } from "hardhat";

async function main() {
  // instantiate gravatar registry contract
  const gravity = await ethers.getContractAt(
    "GravatarRegistry",
    "0x08d08e320e2b25184173331FcCCa122E4129523f"
  );

  // fetch random people from the randomuser.me API
  const url = "https://randomuser.me/api/?results=10";
  const fetched = await fetch(url);
  const users = await fetched.json();
  const gravatars = [];
  for (const user of users.results) {
    gravatars.push({
      displayName: `${user.name.first} ${user.name.last}`,
      imageUrl: user.picture.large,
    });
  }

  // create gravatars with some delay to avoid putting everything in the same block
  for (const gravatar of gravatars) {
    // generate owner from displayName
    const owner = ethers
      .keccak256(ethers.toUtf8Bytes(gravatar.displayName))
      .slice(0, 42);

    // create gravatar
    await gravity.createGravatar(
      owner,
      gravatar.displayName,
      gravatar.imageUrl
    );
    console.log(
      `Added Gravatar for ${owner} ${gravatar.displayName} ${gravatar.imageUrl}`
    );
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
