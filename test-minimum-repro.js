const Web3 = require('web3');
const web3 = new Web3('http://localhost:22001');

console.log('Retrieving account and balance..');

async function sendTransactionUsingSign() {
  const account = web3.eth.accounts.privateKeyToAccount(
    // node 1 private key
    'Ox955d3e4f0feb66950cf045ed15c7c5c8a478ab6d4f5f27e31178b19b11a47c03'
  );
  console.log('balance of sending wallet is ' + (await web3.eth.getBalance(account.address)));
  const signedTx = await account.signTransaction({
    from: account.address,
    to: '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8', // node 2
    value: 1,
    gas: 1,
    gasPrice: 0
  });

  const transactionDetails = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  const receipt = await web3.eth.getTransactionReceipt(transactionDetails.transactionHash);
  console.log('Result of transaction:', receipt);
}

async function sendTransactionUsingUnlock() {
  const [address] = await web3.eth.getAccounts();
  console.log('balance of sending wallet is ' + (await web3.eth.getBalance(address)));
  
  web3.eth.personal.unlockAccount(address, '');

  const receipt = web3.eth.sendTransaction({
    from: address,
    to: '0xedbbe1fa6bc80f55c9ac7e351b777874142baaf8', // node 2
    value: 1,
    gas: 1,
    gasPrice: 0
  })
  console.log('Result of transaction:', receipt);
}

sendTransactionUsingSign()
  .then(() => console.log('done using sign'))
  .catch(console.error)
  .then(() => sendTransactionUsingUnlock())
  .then(() => console.log('done using unlock'))
  .catch(console.error);
