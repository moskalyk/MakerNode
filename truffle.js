 const INFURA_KEY = 'HEXAufFeaVzkqSn35q8t';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: "https://kovan.infura.io/"+INFURA_KEY,
      network_id: 42
    }
  }
};
