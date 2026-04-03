const computeHash = require('../utils/hashUtil');

class Block {
  constructor(data, previousHash = '') {
    this.sender = data.sender;
    this.receiver = data.receiver;
    this.vehicle = data.vehicle;
    this.goods = data.goods;
    this.quantity = data.quantity;
    this.transportCost = data.transportCost;
    this.gasUsed = data.gasUsed;
    this.balanceBefore = data.balanceBefore;
    this.balanceAfter = data.balanceAfter;
    this.timestamp = new Date().toISOString();
    this.previousHash = previousHash;
    this.currentHash = this.calculateHash();
  }

  calculateHash() {
    const rawData =
      this.sender +
      this.receiver +
      this.vehicle +
      this.goods +
      this.quantity +
      this.transportCost +
      this.gasUsed +
      this.balanceBefore +
      this.balanceAfter +
      this.timestamp +
      this.previousHash;
    return computeHash(rawData);
  }
}

module.exports = Block;
