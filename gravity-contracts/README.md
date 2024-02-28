# Gravity contracts

GravatarRegistry deployed on Sepolia at address [0x8fB7Fb99f279a135981Fe509A1a6c25A4F337F52](https://sepolia.etherscan.io/address/0x8fB7Fb99f279a135981Fe509A1a6c25A4F337F52)

To deploy again, run:

```shell
export RPC_URL=<sepolia gateway>
export MNEMONIC=<your mnemonic>
npx hardhat run scripts/deploy.ts --network sepolia
```

To verify on Etherscan, run:

```shell
export ETHERSCAN_API_KEY=<your etherscan key>
npx hardhat verify --network sepolia <deployed GravatarRegistry address>
```
