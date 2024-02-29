# Gravity contracts

GravatarRegistry deployed on Sepolia at address [0x08d08e320e2b25184173331FcCCa122E4129523f](https://sepolia.etherscan.io/address/0x08d08e320e2b25184173331FcCCa122E4129523f)

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
