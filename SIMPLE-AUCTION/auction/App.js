import React, { useState, useEffect } from 'react';
import { connectWallet, userSession, getUserAddress } from './wallet';
import {
  startAuction,
  placeBid,
  endAuction,
  getHighestBid,
  getHighestBidder,
} from './contract';

function App() {
  const [minBid, setMinBid] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const address = getUserAddress();
      if (address) setWalletAddress(address);
      refreshAuction();
    }
  }, []);

  const refreshAuction = async () => {
    try {
      const bid = await getHighestBid();
      const bidder = await getHighestBidder();
      setHighestBid(Number(bid.value || bid));
      setHighestBidder(bidder.value || bidder);
    } catch (e) {
      console.error('Error refreshing auction:', e);
    }
  };

  const onStart = async () => {
    try {
      await startAuction(Number(minBid));
      alert('Auction started!');
      setMinBid('');
      refreshAuction();
    } catch (e) {
      alert('Error starting auction.');
    }
  };

  const onBid = async () => {
    try {
      await placeBid(Number(bidAmount));
      alert('Bid placed!');
      setBidAmount('');
      refreshAuction();
    } catch (e) {
      alert('Error placing bid.');
    }
  };

  const onEnd = async () => {
    try {
      await endAuction();
      alert('Auction ended!');
      refreshAuction();
    } catch (e) {
      alert('Error ending auction.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Simple Auction DApp</h1>

      {!userSession.isUserSignedIn() ? (
        <button style={styles.button} onClick={connectWallet}>
          Connect Leather Wallet
        </button>
      ) : (
        <p style={styles.walletText}>Wallet: {walletAddress}</p>
      )}

      <div style={styles.section}>
        <h2 style={styles.subheading}>Start Auction</h2>
        <input
          style={styles.input}
          type="number"
          value={minBid}
          onChange={(e) => setMinBid(e.target.value)}
          placeholder="Minimum Bid (uSTX)"
        />
        <button style={styles.button} onClick={onStart}>
          Start Auction
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subheading}>Place a Bid</h2>
        <input
          style={styles.input}
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Your Bid (uSTX)"
        />
        <button style={styles.button} onClick={onBid}>
          Place Bid
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subheading}>End Auction</h2>
        <button style={styles.button} onClick={onEnd}>
          End Auction
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subheading}>Auction Status</h2>
        <p><strong>Highest Bid:</strong> {highestBid} uSTX</p>
        <p><strong>Highest Bidder:</strong> {highestBidder}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: 500,
    margin: '0 auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  subheading: {
    color: '#444',
  },
  section: {
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    width: '70%',
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#3f51b5',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  walletText: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
};

export default App;
