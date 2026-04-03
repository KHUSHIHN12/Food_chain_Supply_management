document.getElementById('transactionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🔹 Hardcoded mapping (YOU CONTROL THIS)
 
 
  const userMap = {
    ram: "0xd55B08077744883629b861adF50d580d82B0F5E2",
    primepack: "0x0558b5d4Ad8FD61F44530c91999Bc3df24DCd318",
    john: "0xd55B08077744883629b861adF50d580d82B0F5E2",
    rapidstore: "0x0558b5d4Ad8FD61F44530c91999Bc3df24DCd318"
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
  `;

  } catch (err) {
    document.getElementById('output').innerHTML = `
      <p style="color:red;">❌ Transaction Failed</p>
    `;
  }
});