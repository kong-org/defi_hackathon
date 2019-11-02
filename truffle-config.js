module.exports = {
  compilers: {
    solc: {
      version: "0.5.2"
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 20
    }
  }
};