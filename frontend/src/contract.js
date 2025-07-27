import {
  uintCV,
  makeContractCall,
  fetchCallReadOnlyFunction,
  cvToValue,
} from '@stacks/transactions';

import { STACKS_TESTNET } from '@stacks/network';
import { userSession } from './wallet';

// ✅ Correct contract info
const contractAddress = 'ST3YN01HCRBYGHYXGFZHKD1GB1ZECFJ6N50Z57HFG';
const contractName = 'auction';
const network = STACKS_TESTNET; // ✅ Using testnet constant from @stacks/network

// ✅ Function to start the auction
async function startAuction(minBid) {
  return await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'start-auction',
    functionArgs: [uintCV(minBid)],
    network,
    senderKey: userSession.loadUserData().appPrivateKey,
    appDetails: { name: 'Simple Auction DApp', icon: '' },
  });
}

// ✅ Function to place a bid
async function placeBid(bidAmount) {
  return await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'place-bid',
    functionArgs: [uintCV(bidAmount)],
    network,
    senderKey: userSession.loadUserData().appPrivateKey,
    appDetails: { name: 'Simple Auction DApp', icon: '' },
  });
}

// ✅ Function to end the auction
async function endAuction() {
  return await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'end-auction',
    functionArgs: [],
    network,
    senderKey: userSession.loadUserData().appPrivateKey,
    appDetails: { name: 'Simple Auction DApp', icon: '' },
  });
}

// ✅ Read-only: get the highest bid
async function getHighestBid() {
  const resp = await fetchCallReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-highest-bid',
    functionArgs: [],
    senderAddress: contractAddress,
    network,
  });
  return cvToValue(resp);
}

// ✅ Read-only: get the highest bidder
async function getHighestBidder() {
  const resp = await fetchCallReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-highest-bidder',
    functionArgs: [],
    senderAddress: contractAddress,
    network,
  });
  return cvToValue(resp);
}

// ✅ Export everything
export {
  startAuction,
  placeBid,
  endAuction,
  getHighestBid,
  getHighestBidder,
};
