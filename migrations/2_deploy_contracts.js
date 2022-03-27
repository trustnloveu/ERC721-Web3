/* eslint-disable no-undef */
const UNFT = artifacts.require("UNFT");

module.exports = function (deployer) {
  deployer.deploy(UNFT);
};
