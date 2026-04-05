const express = require('express');
const router = express.Router();

const web3 = require('../web3Config');
const blockchain = require('../blockchain/Blockchain');
const BlockModel = require('../models/BlockModel');
const Block = require('../blockchain/Block'); 

// ✅ GET accounts (moved outside)
router.get('/accounts', async (req, res) => {
  const accounts = await web3.eth.getAccounts();
  res.json(accounts);
});

router.post('/transfer', async (req, res) => {
  try {
    const { sender, receiver, vehicle, goods, quantity, transportCost } = req.body;

    const accounts = await web3.eth.getAccounts();

    if (!accounts.includes(sender)) {
      return res.status(400).json({ error: 'Invalid sender address' });
    }

    if (!accounts.includes(receiver)) {
      return res.status(400).json({ error: 'Invalid receiver address' });
    }

    // 🔹 Get balance before
    const balanceBefore = web3.utils.fromWei(
      await web3.eth.getBalance(sender),
      'ether'
    );

    // 🔹 Perform transaction
    const tx = await web3.eth.sendTransaction({
      from: sender,
      to: receiver,
      value:'0',
      gas: 21000,
      gasPrice: web3.utils.toWei('100000','gwei')
    });

    const gasUsed = Number(tx.gasUsed);

    const balanceAfter = web3.utils.fromWei(
      await web3.eth.getBalance(sender),
      'ether'
    );


    // 🔹 Block data
    const blockData = {
      sender,
      receiver,
      vehicle,
      goods,
      quantity,
      transportCost,
      gasUsed,
      paymentAmount:transportCost,
      balanceBefore: parseFloat(balanceBefore),
      balanceAfter: parseFloat(balanceAfter),
    };

    // 🔹 Add to blockchain (memory)
    const newBlock = blockchain.addBlock(blockData);

    // 🔹 Store in MongoDB
    await BlockModel.create({
      ...blockData,
      previousHash: newBlock.previousHash,
      currentHash: newBlock.currentHash,
      timestamp: newBlock.timestamp
    });

    // 🔥 LOAD FROM DB
    const blocksFromDB = await BlockModel.find().sort({ timestamp: 1 });



// 🔥 REBUILD BLOCKCHAIN (KEEP ORIGINAL HASHES)
blockchain.chain = blocksFromDB.map(block => {
  const newBlock = new Block(
    {
      sender: block.sender,
      receiver: block.receiver,
      vehicle: block.vehicle,
      goods: block.goods,
      quantity: block.quantity,
      transportCost: block.transportCost,
      gasUsed: block.gasUsed,
      balanceBefore: block.balanceBefore,
      balanceAfter: block.balanceAfter,
    },
    block.previousHash
  );

  // ✅ VERY IMPORTANT (ADD THESE 2 LINES)
  newBlock.currentHash = block.currentHash;
  newBlock.timestamp = block.timestamp;

  return newBlock;
});

    // 🔥 VALIDATION
    if (!blockchain.isChainValid()) {
      return res.status(400).json({
        error: "⚠️ Data Tampered!"
      });
    }

    // ✅ SUCCESS RESPONSE
    res.json({
      message: 'Transaction Successful',
      transactionDetails: blockData,
      blockInfo: {
        timestamp: newBlock.timestamp,
        previousHash: newBlock.previousHash,
        currentHash: newBlock.currentHash
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Transaction Failed',
      details: err.message
    });
  }
});

module.exports = router;