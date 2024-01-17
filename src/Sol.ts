import { Connection, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction, clusterApiUrl } from "@solana/web3.js";

export const showVersion0Message = async (toAddress: string, payerAddress: string) => {
  const payer = new PublicKey(payerAddress); 
  const toAccount = new PublicKey(toAddress);
// connect to the cluster and get the minimum rent for rent exempt status
const connection = new Connection(clusterApiUrl("testnet"));
const minRent = await connection.getMinimumBalanceForRentExemption(0);
const blockhash = await connection
  .getLatestBlockhash()
  .then((res) => res.blockhash);

  // create an array with your desires `instructions`
const instructions = [
  SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: toAccount,
    lamports: minRent,
  }),
];

const messageV0 = new TransactionMessage({
  payerKey: payer,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();


// send our v0 transaction to the cluster

return new VersionedTransaction(messageV0)

}