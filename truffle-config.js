module.exports = {
  networks: {
    development: {
      host: "211.54.150.66",
      port: 18545,
      network_id: "1337", // Match any network id
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/truffle_abis/",
  compilers: {
    solc: {
      version: ">= 0.7.0 < 0.9.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
