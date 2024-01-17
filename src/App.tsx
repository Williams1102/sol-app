import { useState, useEffect, useCallback } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { showVersion0Message } from './Sol';
import { Connection, PublicKey, VersionedTransaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coin98: any;
  }
}

function App() {
  const [transaction, setTxs] = useState<VersionedTransaction>();

  const onSendTx = useCallback(async () => {
    if (window?.coin98 && transaction) {
      const sign = await window?.coin98.sol.request({
        method: 'sol_sign',
        params: [transaction],
      });
      console.log('🚀 ~ transaction ~ sign:', sign);
      transaction.addSignature(new PublicKey(sign.publicKey), bs58.decode(sign.signature))
      const connection = new Connection(clusterApiUrl('testnet'));
      const txid = await connection.sendTransaction(transaction);
      console.log('🚀 ~ onSendTx ~ txid:', txid);
    }
  }, [transaction]);

  useEffect(() => {
    const onload = async () => {
      const transaction = await showVersion0Message(
        '7ggu4Nd5VaqfvKw3krtCw6L4zgkbgicmMn9q6pW1PK1T',
        '7ggu4Nd5VaqfvKw3krtCw6L4zgkbgicmMn9q6pW1PK1T'
      ).catch((e) => {
        console.log('🚀 ~ showVersion0Message ~ e:', e);
        return null;
      });
      console.log('🚀 ~ transaction ~ transaction:', transaction);
      if (transaction) setTxs(transaction);
    };
    onload();
  }, []);

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={onSendTx}>Send Tx</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
