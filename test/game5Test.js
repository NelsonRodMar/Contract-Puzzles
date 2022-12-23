const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const {boolean} = require("hardhat/internal/core/params/argumentTypes");

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const threshold = BigInt(0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf);
    let signer, found = false;

    while(found === false) {
      signer = await ethers.Wallet.createRandom();
      signer = await signer.connect(ethers.provider);
      if (BigInt(`${await signer.getAddress()}`) < threshold) { found = true; }
    }

    await ethers.provider.getSigner(0).sendTransaction({to: signer.address, value: ethers.utils.parseEther("1")});

    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    // good luck
    await game.connect(signer).win();
    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
