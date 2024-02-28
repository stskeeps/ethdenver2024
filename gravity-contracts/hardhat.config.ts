import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
    solidity: "0.4.25",
    networks: {
        sepolia: {
            url: process.env.RPC_URL,
            chainId: 11155111,
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: true,
    },
};

export default config;
