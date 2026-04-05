document.getElementById('transactionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🔹 Hardcoded mapping (YOU CONTROL THIS)
 
 
  const userMap = {
    ram: "0xF2Ad5497D65ea8A896FA375e014AC929332d462d",
    primepack: "0x9240983b817e45391b7701A999aCc323D1B0b793",
    john: "0xF2Ad5497D65ea8A896FA375e014AC929332d462d",
    rapidstore: "0x9240983b817e45391b7701A999aCc323D1B0b793"
  };

  // 🔹 Get input
  const senderInputRaw = document.getElementById('sender').value;
const receiverInputRaw = document.getElementById('receiver').value;

const senderName = senderInputRaw.toLowerCase();
const receiverName = receiverInputRaw.toLowerCase();

const senderAddress = userMap[senderName];
const receiverAddress = userMap[receiverName];
  // 🔹 Validation
  if (!senderAddress || !receiverAddress) {
    alert("❌ Invalid sender or receiver name");
    return;
  }

  // 🔹 Other inputs
  const vehicle = document.getElementById('vehicle').value;
  const goods = document.getElementById('goods').value;
  const quantity = document.getElementById('quantity').value;
  const transportCost = document.getElementById('transportCost').value;

  const data = {
    sender: senderAddress,
    receiver: receiverAddress,
    vehicle,
    goods,
    quantity,
    transportCost
  };

  try {
    const res = await fetch('http://localhost:5000/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.error) {
      document.getElementById('output').innerHTML = `
        <p style="color:red;">❌ ${result.error}</p>
      `;
      return;
    }

    // ✅ Clean UI
    document.getElementById('output').innerHTML = `
    <h2 style="color:green;">✅ Transaction Successful</h2>
    <p>${senderInputRaw} → ${receiverInputRaw}</p>
    <p>
  `;


  } catch (err) {
    document.getElementById('output').innerHTML = `
      <p style="color:red;">❌ Transaction Failed</p>
    `;
  }
});