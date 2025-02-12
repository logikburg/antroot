import "dotenv/config";
import { confirmTransaction, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));// create a new connection to the cluster's API

const user = getKeypairFromEnvironment("SECRET_KEY");

async function transferToMiningAccount(){
    //4iFaA43w9bJjMfS4Cenh7mfDn8uwDBtLaPem2V9gJdmH  
    //const fromKeypair = Keypair.generate();
    //const toKeypair = Keypair.generate();
    const fromKeypair = user.publicKey;
    const toKeypair = new PublicKey("CHT8KnK7KqkQWvQiiWdWtYyzfcBekzyFAf61GxJoyXfS");
    const gasFee = 0; // Is there a safe amount?
    //const lamports =  await connection.getBalance(fromKeypair) - gasFee; 
    const lamports =  0.1 * LAMPORTS_PER_SOL; 
    console.log(`FROM ${fromKeypair} TO ${toKeypair} AMOUNT ${lamports} BALANCE ${lamports + gasFee}`)
    const transaction = new Transaction().add(SystemProgram.transfer({
      fromPubkey: fromKeypair,
      toPubkey: toKeypair,
      lamports: lamports
    }));
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [user],
      {commitment: "confirmed"}
    )
    console.log('SIGNATURE: '+ signature);
    //SIGNATURE: 5tPnUgBdfouC4H7opJWzZGq5bxLfCoV5CQ4gMLEyuKWokF62dgcWgMtvQERdK1ZUVDTtfjnxD2KFGN6LWTcjfqym  }
  }

  // transferToMiningAccount();

  connection.getParsedTransaction("5tPnUgBdfouC4H7opJWzZGq5bxLfCoV5CQ4gMLEyuKWokF62dgcWgMtvQERdK1ZUVDTtfjnxD2KFGN6LWTcjfqym")
.then((transaction) => {
  if (transaction) {
    console.log('Transaction Logs:', transaction.meta?.postBalances[1]);
    console.log('Transaction Logs:', transaction.meta?.preBalances[1]);
  } else {
    console.log('Transaction not found');
  }
})
  

  