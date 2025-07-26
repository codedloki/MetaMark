const Metamark = artifacts.require('Metamark')

module.exports = function (deployer) {
    deployer.deploy(Metamark)
}